import { parseAbi } from 'viem'

import { ZERO_ADDRESS } from '~/core/constants'
import type { ExchangeDirection } from '~/core/exchange/exchange-direction'
import type { FlashPairId } from '~/core/exchange/flash-pair'
import type { FlashUsd1SwapConfig } from '~/core/exchange/flash-usd1-swap'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { ERC20_METHODS, USD1_SWAP_METHODS } from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'
import type { ChainReadClient } from '~/web3/chain-read-client'

const usd1ExchangeReadAbi = parseAbi([USD1_SWAP_METHODS.quoteUsd1Out, USD1_SWAP_METHODS.getConfig])
const erc20ReadAbi = parseAbi([ERC20_METHODS.balanceOf, ERC20_METHODS.allowance])

/**
 * 读取闪电兑换全局配置
 *
 * 调用 Usd1Swap.getConfig，返回输入币地址、汇率、暂停、上下限与储备，
 * 供报价、余额 / 授权与写前预检使用；usdtToken 为零地址时仍返回，由 evaluate 阻断。
 *
 * @param client 链上读取客户端，默认公共 RPC
 * @returns 闪电兑换配置（含 usdtToken）
 * @see docs/onchain-manual/contracts/usd1swap.md
 */
export async function readUsd1SwapConfig(
  client: ChainReadClient = bscReadClient,
): Promise<FlashUsd1SwapConfig> {
  const result = await client.readContract({
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
 * @param client 链上读取客户端，默认公共 RPC
 * @returns 预期 USD1 数量；usdtAmount 为 0 时返回 0
 * @see docs/onchain-manual/contracts/usd1swap.md
 */
async function readFlashExchangeQuote(
  usdtAmount: bigint,
  client: ChainReadClient = bscReadClient,
): Promise<bigint> {
  if (usdtAmount === 0n) return 0n
  return client.readContract({
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
 * @param client 链上读取客户端，默认公共 RPC
 * @returns 预期输出数量；gAGX 路径原样返回输入
 */
export async function readFlashPairQuote(
  pairId: FlashPairId,
  amountIn: bigint,
  client: ChainReadClient = bscReadClient,
): Promise<bigint> {
  if (pairId === 'gagx') return amountIn
  return readFlashExchangeQuote(amountIn, client)
}

/**
 * 读取输入币↔USD1 路径的卖出 / 买入余额与授权
 *
 * sell / approved 使用 getConfig().usdtToken，不能用环境变量写死地址；
 * usdtToken 为零地址时抛错，避免读错币或授错权。
 *
 * @param owner 钱包地址
 * @param client 链上读取客户端，默认公共 RPC
 * @returns sell 输入币余额、buy USD1 余额、approved 对 Usd1Swap 的授权
 */
async function readFlashUsdtBalances(owner: string, client: ChainReadClient = bscReadClient) {
  const ownerAddress = owner as `0x${string}`
  const config = await readUsd1SwapConfig(client)
  if (!config.usdtToken || config.usdtToken.toLowerCase() === ZERO_ADDRESS) {
    throw new Error('ErrorZeroAddress')
  }
  const usdtToken = config.usdtToken

  const [sell, buy, approved] = await Promise.all([
    client.readContract({
      address: usdtToken,
      abi: erc20ReadAbi,
      functionName: 'balanceOf',
      args: [ownerAddress],
    }),
    client.readContract({
      address: BSC_CONTRACTS.usd1,
      abi: erc20ReadAbi,
      functionName: 'balanceOf',
      args: [ownerAddress],
    }),
    client.readContract({
      address: usdtToken,
      abi: erc20ReadAbi,
      functionName: 'allowance',
      args: [ownerAddress, BSC_CONTRACTS.usd1Swap],
    }),
  ])
  return { sell, buy, approved }
}

/**
 * 读取 gAGX↔AGX 路径的余额与授权
 *
 * forward = 赎回（卖出 gAGX 得 AGX，无需授权）；
 * reverse = 换包（卖出 AGX 得 gAGX，需 AGX 对 gAGX 的授权）。
 *
 * @param owner 钱包地址
 * @param direction 交易方向，决定卖出 / 买入代币与是否读授权
 * @param client 链上读取客户端，默认公共 RPC
 */
async function readFlashGagxBalances(
  owner: string,
  direction: ExchangeDirection,
  client: ChainReadClient = bscReadClient,
) {
  const ownerAddress = owner as `0x${string}`
  const sellToken = direction === 'forward' ? BSC_CONTRACTS.gagx : BSC_CONTRACTS.agx
  const buyToken = direction === 'forward' ? BSC_CONTRACTS.agx : BSC_CONTRACTS.gagx

  const [sell, buy] = await Promise.all([
    client.readContract({
      address: sellToken,
      abi: erc20ReadAbi,
      functionName: 'balanceOf',
      args: [ownerAddress],
    }),
    client.readContract({
      address: buyToken,
      abi: erc20ReadAbi,
      functionName: 'balanceOf',
      args: [ownerAddress],
    }),
  ])

  if (direction === 'forward') {
    return { sell, buy, approved: 0n }
  }

  const approved = await client.readContract({
    address: BSC_CONTRACTS.agx,
    abi: erc20ReadAbi,
    functionName: 'allowance',
    args: [ownerAddress, BSC_CONTRACTS.gagx],
  })
  return { sell, buy, approved }
}

/**
 * 读取闪电兑换路径的余额与授权
 *
 * 按交易对分派到 USDT↔USD1 或 gAGX↔AGX 的具体读取。
 *
 * @param pairId 交易对标识：'gagx' 或 'usdt'
 * @param direction 交易方向（gAGX 路径需要）
 * @param owner 钱包地址
 * @param client 链上读取客户端，默认公共 RPC
 * @returns 卖出 / 买入余额与授权额度
 */
export async function readFlashPairBalances(
  pairId: FlashPairId,
  direction: ExchangeDirection,
  owner: string,
  client: ChainReadClient = bscReadClient,
) {
  return pairId === 'gagx'
    ? readFlashGagxBalances(owner, direction, client)
    : readFlashUsdtBalances(owner, client)
}
