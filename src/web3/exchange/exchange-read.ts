import { decodeFunctionResult, encodeFunctionData, parseAbi } from 'viem'

import {
  agxSellTaxBps,
  applyAgxSellTaxToAmountIn,
  effectiveAgxSellTaxBps,
  isAgxSellPath,
} from '~/core/exchange/agx-sell-tax'
import { calcV2PriceImpactBps } from '~/core/exchange/calc-price-impact-bps'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { AGX_SELL_TAX_METHODS, ERC20_METHODS } from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'
import type { ChainReadClient } from '~/web3/chain-read-client'
import { quoteV2AmountsOut } from '~/web3/exchange/quote-v2-amounts-out'
import {
  type ExchangePoolImmutableMetadata,
  type ExchangePoolSpotPrice,
  pairReservesForTokenIn,
  readExchangePoolImmutableMetadata,
  readExchangePoolSpotPrice,
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
  /** V2 路由器没有 gas 估算；为 0 时 UI 显示「—」。 */
  gasEstimate: bigint
  priceImpactBps: number
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
  client: ChainReadClient = bscReadClient,
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
    readAggregate3(client, taxCalls),
    client.getBlockNumber(),
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
export async function readErc20Balance(
  address: `0x${string}`,
  owner: string,
  client: ChainReadClient = bscReadClient,
): Promise<bigint> {
  return client.readContract({
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
  client: ChainReadClient = bscReadClient,
): Promise<bigint> {
  return client.readContract({
    address: token,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [owner as `0x${string}`, spender],
  })
}

/**
 * 获取市价兑换报价
 *
 * 通过 Pancake Router `getAmountsOut` 计算预期输出；AGX 卖币路径先扣卖税，
 * 再按净额报价。价格影响仅在直连 USD1/AGX 池时计算，其余路径返回 0（UI 显示 —）。
 * V2 路由器没有 gas 估算，gasEstimate 恒为 0。
 *
 * @param amountIn 输入代币数量
 * @param tokenIn 输入代币地址
 * @param tokenOut 输出代币地址
 * @param path 兑换路径；省略时为直连 `[tokenIn, tokenOut]`
 * @param client 链上读取客户端，默认公共 RPC
 * @param poolContext 复用 React Query 中短暂过期的池读取，避免重复拉取
 * @returns 预期输出 / 输入输出地址 / gas 估算 / 价格影响基点
 * @see docs/onchain-manual/contracts/usd1swap.md
 * @see docs/onchain-manual/contracts/agx.md
 */
export async function fetchExchangeQuote({
  amountIn,
  tokenIn,
  tokenOut,
  path: pathArg,
  client = bscReadClient,
  poolContext,
}: {
  amountIn: bigint
  tokenIn: `0x${string}`
  tokenOut: `0x${string}`
  /** 省略时使用直连 `[tokenIn, tokenOut]` 一跳。 */
  path?: readonly `0x${string}`[]
  client?: ChainReadClient
  /** 复用 React Query 中短暂过期的池读取，避免重复拉取。 */
  poolContext?: ExchangePoolReadContext
}): Promise<ExchangeQuoteResult> {
  const path = pathArg ?? ([tokenIn, tokenOut] as const)
  const sellingAgx = isAgxSellPath(tokenIn, BSC_CONTRACTS.agx)

  const [pool, spot, sellTaxBps] = await Promise.all([
    poolContext
      ? Promise.resolve(poolContext.pool)
      : readExchangePoolImmutableMetadata(EXCHANGE_CONFIG.pool, client),
    poolContext
      ? Promise.resolve(poolContext.spot)
      : readExchangePoolSpotPrice(EXCHANGE_CONFIG.pool, client),
    sellingAgx ? readAgxSellTaxBps(client, BSC_CONTRACTS.agx, amountIn) : Promise.resolve(0),
  ])

  // 交易对收到的是扣税后的 AGX，Router.getAmountsOut 必须用净额报价
  const amountInForQuote = sellingAgx ? applyAgxSellTaxToAmountIn(amountIn, sellTaxBps) : amountIn

  const quotedOut = await quoteV2AmountsOut({
    router: EXCHANGE_CONFIG.router,
    amountIn: amountInForQuote,
    path,
    client,
  })

  // 价格影响只在已知的 USD1/AGX 池直连一跳计算；否则如实返回 0（UI 显示 —）
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
    : 0

  return {
    quotedOut,
    tokenIn,
    tokenOut,
    gasEstimate: 0n,
    priceImpactBps,
  }
}

export {
  readExchangePoolImmutableMetadata,
  readExchangePoolSpotPrice,
} from '~/web3/exchange/read-exchange-pool'
