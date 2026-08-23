import { decodeFunctionResult, encodeFunctionData, parseAbi } from 'viem'

import {
  agxSellTaxBps,
  applyAgxSellTaxToAmountIn,
  effectiveAgxSellTaxBps,
  isAgxSellPath,
} from '~/core/exchange/agx-sell-tax'
import { calcV2PriceImpactBps } from '~/core/exchange/calc-price-impact-bps'
import { calcAmountOutMin } from '~/core/exchange/exchange-math'
import { applyXSellTaxToAmountIn, isXSellPath } from '~/core/exchange/x-sell-tax'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { AGX_SELL_TAX_METHODS, ERC20_METHODS } from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'
import { estimateMarketSwapGasWei } from '~/web3/exchange/estimate-market-swap-gas'
import { quoteV2AmountsOut } from '~/web3/exchange/quote-v2-amounts-out'
import {
  type ExchangePoolImmutableMetadata,
  type ExchangePoolSpotPrice,
  pairReservesForTokenIn,
  readExchangePoolReadContext,
} from '~/web3/exchange/read-exchange-pool'
import { readAggregate3 } from '~/web3/multicall3-read'

export type ExchangePoolReadContext = {
  pool: ExchangePoolImmutableMetadata
  spot: ExchangePoolSpotPrice
}

export interface ExchangeQuoteResult {
  quotedOut: bigint
  tokenIn: `0x${string}`
  tokenOut: `0x${string}`
  /** 仅 USD1/AGX 直连池可算；未知时 null，UI 显示「—」。 */
  priceImpactBps: number | null
  /**
   * 本笔兑换预估网络费用（BNB wei）。
   * 未请求或 RPC/滑点等真失败时为 null（报价本身仍可用）。
   * 未授权时用路径典型 gas，不把用户态 simulate revert 当成失败。
   */
  gasCostWei: bigint | null
}

const erc20Abi = parseAbi([ERC20_METHODS.balanceOf, ERC20_METHODS.allowance])

const agxSellTaxAbi = parseAbi([
  AGX_SELL_TAX_METHODS.sellRatio,
  AGX_SELL_TAX_METHODS.extraSellBP,
  AGX_SELL_TAX_METHODS.crashFuseActive,
  AGX_SELL_TAX_METHODS.blockSellQuotaBlock,
  AGX_SELL_TAX_METHODS.blockSellLimit,
  AGX_SELL_TAX_METHODS.grossSoldInBlock,
])

/**
 * 读取 AGX 卖税基点（含单区块额度越限 / 陈旧额度 → 防御税）。
 *
 * @param amountIn 本笔毛卖出量；>0 时走 effective（卖出路径必传）
 * @see docs/onchain-manual/contracts/agx.md
 */
export async function readAgxSellTaxBps(
  agx: `0x${string}` = BSC_CONTRACTS.agx,
  amountIn: bigint = 0n,
): Promise<number> {
  const taxCalls = (
    [
      'sellRatio',
      'extraSellBP',
      'crashFuseActive',
      'blockSellQuotaBlock',
      'blockSellLimit',
      'grossSoldInBlock',
    ] as const
  ).map((functionName) => ({
    target: agx,
    callData: encodeFunctionData({
      abi: agxSellTaxAbi,
      functionName,
    }),
  }))

  const [taxResults, currentBlock] = await Promise.all([
    readAggregate3(taxCalls),
    bscReadClient.getBlockNumber(),
  ])

  const decodeTax = <T>(
    index: number,
    functionName:
      | 'sellRatio'
      | 'extraSellBP'
      | 'crashFuseActive'
      | 'blockSellQuotaBlock'
      | 'blockSellLimit'
      | 'grossSoldInBlock',
  ): T => {
    const slot = taxResults[index]
    if (!slot?.success) throw new Error(`AGX_SELL_TAX_MULTICALL_FAILED:${functionName}`)
    return decodeFunctionResult({
      abi: agxSellTaxAbi,
      functionName,
      data: slot.returnData,
    }) as T
  }

  const sellRatio = decodeTax<bigint>(0, 'sellRatio')
  const extraSellBP = decodeTax<bigint>(1, 'extraSellBP')
  const crashFuseActive = decodeTax<boolean>(2, 'crashFuseActive')
  const blockSellQuotaBlock = decodeTax<bigint>(3, 'blockSellQuotaBlock')
  const blockSellLimit = decodeTax<bigint>(4, 'blockSellLimit')
  const grossSoldInBlock = decodeTax<bigint>(5, 'grossSoldInBlock')

  if (amountIn > 0n) {
    return effectiveAgxSellTaxBps({
      crashFuseActive,
      sellRatio,
      extraSellBP,
      amountIn,
      blockSellLimit,
      grossSoldInBlock,
      blockSellQuotaBlock,
      currentBlock,
    })
  }

  return agxSellTaxBps({ crashFuseActive, sellRatio, extraSellBP })
}
/** 读取任意 ERC20 代币余额（原始单位，未按 decimals 换算）。 */
export async function readErc20Balance(address: `0x${string}`, owner: string): Promise<bigint> {
  return bscReadClient.readContract({
    address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [owner as `0x${string}`],
  })
}

/** 读取 ERC20 授权额度（owner 对 spender 的剩余额度）。 */
export async function readErc20Allowance(
  token: `0x${string}`,
  owner: string,
  spender: `0x${string}`,
): Promise<bigint> {
  return bscReadClient.readContract({
    address: token,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [owner as `0x${string}`, spender],
  })
}

/**
 * 获取市价兑换报价
 *
 * 通过 Pancake Router `getAmountsOut` 计算预期输出；AGX / X 卖币路径先扣卖税，
 * 再按净额报价。价格影响仅在直连 USD1/AGX 池时计算，其余路径返回 null（UI 显示 —）。
 *
 * `getAmountsOut` 是 view，不含网络费用。传入账户与滑点时，在**同一笔报价**里
 * 用本笔 `quotedOut` 算出 `amountOutMin`，再估这笔兑换的网络费用。
 * 未授权不走会 revert 的用户态 simulate；RPC / 滑点等真失败只把 `gasCostWei` 置 null。
 *
 * @param amountIn 输入代币数量
 * @param tokenIn 输入代币地址
 * @param tokenOut 输出代币地址
 * @param path 兑换路径；省略时为直连 `[tokenIn, tokenOut]`
 * @param poolContext 复用 React Query 中短暂过期的池读取，避免重复拉取
 * @param account 有则估本笔兑换网络费用（from / 收款人）
 * @param slippageBps 与提交相同的滑点；与 account 一起才估 gas
 * @param allowance 当前 Router 授权；低于 amountIn 时跳过用户态 simulate
 * @returns 预期输出 / 价格影响 / 网络费用（可能为 null）
 * @see docs/onchain-manual/contracts/agx.md
 * @see docs/onchain-manual/contracts/xtoken.md
 */
export async function fetchExchangeQuote({
  amountIn,
  tokenIn,
  tokenOut,
  path: pathArg,
  poolContext,
  account,
  slippageBps,
  allowance,
}: {
  amountIn: bigint
  tokenIn: `0x${string}`
  tokenOut: `0x${string}`
  /** 省略时使用直连 `[tokenIn, tokenOut]` 一跳。 */
  path?: readonly `0x${string}`[]
  /** 复用 React Query 中短暂过期的池读取，避免重复拉取。 */
  poolContext?: ExchangePoolReadContext
  /** 有则在本笔报价后估兑换 gas；行情报价不要传。 */
  account?: `0x${string}`
  /** 与提交相同的滑点 BPS；缺省不估 gas。 */
  slippageBps?: number
  /** 当前 Router 授权；低于 amountIn 时跳过会 revert 的用户态 simulate。 */
  allowance?: bigint
}): Promise<ExchangeQuoteResult> {
  const path = pathArg ?? ([tokenIn, tokenOut] as const)
  const sellingAgx = isAgxSellPath(tokenIn, BSC_CONTRACTS.agx)
  const sellingX = isXSellPath(tokenIn, BSC_CONTRACTS.xToken)

  const [ctx, sellTaxBps] = await Promise.all([
    poolContext ? Promise.resolve(poolContext) : readExchangePoolReadContext(EXCHANGE_CONFIG.pool),
    sellingAgx ? readAgxSellTaxBps(BSC_CONTRACTS.agx, amountIn) : Promise.resolve(0),
  ])
  const { pool, spot } = ctx

  // 交易对收到的是扣税后的数量，Router.getAmountsOut 必须用净额报价
  const amountInForQuote = sellingAgx
    ? applyAgxSellTaxToAmountIn(amountIn, sellTaxBps)
    : sellingX
      ? applyXSellTaxToAmountIn(amountIn)
      : amountIn

  const quotedOut = await quoteV2AmountsOut({
    router: EXCHANGE_CONFIG.router,
    amountIn: amountInForQuote,
    path,
  })

  // 价格影响只在已知的 USD1/AGX 池直连一跳计算；否则 null（UI 显示 —）
  const isDirectUsd1AgxPoolHop =
    path.length === 2 &&
    path[0] === tokenIn &&
    path[1] === tokenOut &&
    ((tokenIn === pool.token0 && tokenOut === pool.token1) ||
      (tokenIn === pool.token1 && tokenOut === pool.token0))

  const reserves = isDirectUsd1AgxPoolHop
    ? pairReservesForTokenIn({
        tokenIn,
        token0: pool.token0,
        token1: pool.token1,
        reserve0: spot.reserve0,
        reserve1: spot.reserve1,
      })
    : null

  const priceImpactBps = reserves
    ? calcV2PriceImpactBps({
        amountIn: amountInForQuote,
        amountOut: quotedOut,
        reserveIn: reserves.reserveIn,
        reserveOut: reserves.reserveOut,
      })
    : null

  // 必须用本笔 quotedOut 的滑点下限；另开查询会拿到占位 0 或过期下限，simulate 时成时败
  const gasCostWei =
    account != null && slippageBps != null && quotedOut > 0n
      ? await estimateMarketSwapGasWei({
          account,
          amountIn,
          path,
          amountOutMin: calcAmountOutMin(quotedOut, slippageBps),
          allowance,
        })
      : null

  return {
    quotedOut,
    tokenIn,
    tokenOut,
    priceImpactBps,
    gasCostWei,
  }
}

export {
  readExchangePoolImmutableMetadata,
  readExchangePoolSpotPrice,
} from '~/web3/exchange/read-exchange-pool'
