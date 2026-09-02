import { encodeFunctionData, parseAbi } from 'viem'

import { ZERO_ADDRESS } from '~/core/constants'
import type { ExchangeDirection } from '~/core/exchange/exchange-direction'
import type { FlashPairId } from '~/core/exchange/flash-pair'
import type { FlashUsd1SwapConfig } from '~/core/exchange/flash-usd1-swap'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { ERC20_METHODS, USD1_SWAP_METHODS } from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'
import { decodeAggregate3Result, readAggregate3 } from '~/web3/multicall3-read'

const usd1ExchangeReadAbi = parseAbi([USD1_SWAP_METHODS.quoteUsd1Out, USD1_SWAP_METHODS.getConfig])
const erc20ReadAbi = parseAbi([ERC20_METHODS.balanceOf, ERC20_METHODS.allowance])

/**
 * 读取闪电兑换全局配置
 *
 * 调用 Usd1Swap.getConfig，返回输入币地址、汇率、暂停、上下限与储备，
 * 供报价、余额 / 授权与写前预检使用；usdtToken 为零地址时仍返回，由 evaluate 阻断。
 *
 * @returns 闪电兑换配置（含 usdtToken）
 * @see docs/onchain-manual/contracts/usd1swap.md
 */
export async function readUsd1SwapConfig(): Promise<FlashUsd1SwapConfig> {
  const result = await bscReadClient.readContract({
    address: BSC_CONTRACTS.usd1Swap,
    abi: usd1ExchangeReadAbi,
    functionName: 'getConfig',
  })
  const [usdtToken, , , currentRateBps, usdtDec, usd1Dec, isPaused, minIn, maxIn, reserve] = result
  return {
    usdtToken,
    rateBps: currentRateBps,
    usdtDec: Number(usdtDec),
    usd1Dec: Number(usd1Dec),
    isPaused,
    minIn,
    maxIn,
    reserve,
  }
}

/**
 * 估算 USDT 可兑换的 USD1 数量
 *
 * 调用 `quoteUsd1Out`；数量为 0 时直接返回 0，不发起链上读取。
 *
 * @param usdtAmount 拟兑换的 USDT 数量
 * @returns 预期 USD1 数量；usdtAmount 为 0 时返回 0
 * @see docs/onchain-manual/contracts/usd1swap.md
 */
async function readFlashExchangeQuote(usdtAmount: bigint): Promise<bigint> {
  if (usdtAmount === 0n) return 0n
  return bscReadClient.readContract({
    address: BSC_CONTRACTS.usd1Swap,
    abi: usd1ExchangeReadAbi,
    functionName: 'quoteUsd1Out',
    args: [usdtAmount],
  })
}

/**
 * 读取闪电兑换报价
 *
 * gAGX↔AGX 换包 / 赎回按原始单位 1:1，链上没有报价合约；
 * 其余交易对走 Usd1Swap 报价。
 *
 * @param pairId 交易对标识：'gagx' 或 'usdt'
 * @param amountIn 输入代币数量
 * @returns 预期输出数量；gAGX 路径原样返回输入
 */
export async function readFlashPairQuote(pairId: FlashPairId, amountIn: bigint): Promise<bigint> {
  if (pairId === 'gagx') return amountIn
  return readFlashExchangeQuote(amountIn)
}

/**
 * 读取输入币↔USD1 路径的卖出 / 买入余额与授权
 *
 * sell / approved 使用 getConfig().usdtToken，不能用环境变量写死地址；
 * usdtToken 为零地址时抛错，避免读错币或授错权。
 *
 * @param owner 钱包地址
 * @returns sell 输入币余额、buy USD1 余额、approved 对 Usd1Swap 的授权
 */
async function readFlashUsdtBalances(owner: string) {
  const ownerAddress = owner as `0x${string}`
  const config = await readUsd1SwapConfig()
  if (!config.usdtToken || config.usdtToken.toLowerCase() === ZERO_ADDRESS) {
    throw new Error('ErrorZeroAddress')
  }
  const usdtToken = config.usdtToken
  const results = await readAggregate3([
    {
      target: usdtToken,
      callData: encodeFunctionData({
        abi: erc20ReadAbi,
        functionName: 'balanceOf',
        args: [ownerAddress],
      }),
    },
    {
      target: BSC_CONTRACTS.usd1,
      callData: encodeFunctionData({
        abi: erc20ReadAbi,
        functionName: 'balanceOf',
        args: [ownerAddress],
      }),
    },
    {
      target: usdtToken,
      callData: encodeFunctionData({
        abi: erc20ReadAbi,
        functionName: 'allowance',
        args: [ownerAddress, BSC_CONTRACTS.usd1Swap],
      }),
    },
  ])
  return {
    sell: decodeAggregate3Result<bigint>(
      results,
      0,
      erc20ReadAbi,
      'balanceOf',
      'FLASH_USDT_BALANCES_MULTICALL_FAILED:sell',
    ),
    buy: decodeAggregate3Result<bigint>(
      results,
      1,
      erc20ReadAbi,
      'balanceOf',
      'FLASH_USDT_BALANCES_MULTICALL_FAILED:buy',
    ),
    approved: decodeAggregate3Result<bigint>(
      results,
      2,
      erc20ReadAbi,
      'allowance',
      'FLASH_USDT_BALANCES_MULTICALL_FAILED:approved',
    ),
  }
}

/**
 * 读取 gAGX↔AGX 路径的余额与授权
 *
 * forward = 赎回（卖出 gAGX 得 AGX，无需授权）；
 * reverse = 换包（卖出 AGX 得 gAGX，需 AGX 对 gAGX 的授权）。
 *
 * @param owner 钱包地址
 * @param direction 交易方向，决定卖出 / 买入代币与是否读授权
 */
async function readFlashGagxBalances(owner: string, direction: ExchangeDirection) {
  const ownerAddress = owner as `0x${string}`
  const sellToken = direction === 'forward' ? BSC_CONTRACTS.gagx : BSC_CONTRACTS.agx
  const buyToken = direction === 'forward' ? BSC_CONTRACTS.agx : BSC_CONTRACTS.gagx

  const calls = [
    {
      target: sellToken,
      callData: encodeFunctionData({
        abi: erc20ReadAbi,
        functionName: 'balanceOf',
        args: [ownerAddress],
      }),
    },
    {
      target: buyToken,
      callData: encodeFunctionData({
        abi: erc20ReadAbi,
        functionName: 'balanceOf',
        args: [ownerAddress],
      }),
    },
  ]
  if (direction !== 'forward') {
    calls.push({
      target: BSC_CONTRACTS.agx,
      callData: encodeFunctionData({
        abi: erc20ReadAbi,
        functionName: 'allowance',
        args: [ownerAddress, BSC_CONTRACTS.gagx],
      }),
    })
  }

  const results = await readAggregate3(calls)
  const sell = decodeAggregate3Result<bigint>(
    results,
    0,
    erc20ReadAbi,
    'balanceOf',
    'FLASH_GAGX_BALANCES_MULTICALL_FAILED:sell',
  )
  const buy = decodeAggregate3Result<bigint>(
    results,
    1,
    erc20ReadAbi,
    'balanceOf',
    'FLASH_GAGX_BALANCES_MULTICALL_FAILED:buy',
  )
  if (direction === 'forward') {
    return { sell, buy, approved: 0n }
  }
  return {
    sell,
    buy,
    approved: decodeAggregate3Result<bigint>(
      results,
      2,
      erc20ReadAbi,
      'allowance',
      'FLASH_GAGX_BALANCES_MULTICALL_FAILED:approved',
    ),
  }
}

/**
 * 读取闪电兑换路径的余额与授权
 *
 * 按交易对分派到 USDT↔USD1 或 gAGX↔AGX 的具体读取。
 *
 * @param pairId 交易对标识：'gagx' 或 'usdt'
 * @param direction 交易方向（gAGX 路径需要）
 * @param owner 钱包地址
 * @returns 卖出 / 买入余额与授权额度
 */
export async function readFlashPairBalances(
  pairId: FlashPairId,
  direction: ExchangeDirection,
  owner: string,
) {
  return pairId === 'gagx' ? readFlashGagxBalances(owner, direction) : readFlashUsdtBalances(owner)
}
