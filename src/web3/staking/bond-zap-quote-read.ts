import { parseAbi } from 'viem'

import {
  applyPercentSlippage,
  computeGrossBondPayout,
  computeNetBondPayout,
  quoteV2LpMintAmount,
} from '~/core/staking/bond-payout'
import { type Address, BSC_CONTRACTS } from '~/shared/config/contracts'
import {
  BOND_DEPOSITORY_MARKET_METHODS,
  BOND_HELPER_METHODS,
  PANCAKE_PAIR_V2_METHODS,
  RESTAKE_CONFIG_METHODS,
  TREASURY_METHODS,
} from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'
import type { ChainReadClient } from '~/web3/chain-read-client'
import { quoteV2AmountsOut } from '~/web3/exchange/quote-v2-amounts-out'
import {
  readExchangePoolImmutableMetadata,
  readExchangePoolSpotPrice,
} from '~/web3/exchange/read-exchange-pool'
import { readBondMarketMeta } from '~/web3/staking/staking-read'

const depositoryAbi = parseAbi([
  BOND_DEPOSITORY_MARKET_METHODS.treasury,
  BOND_DEPOSITORY_MARKET_METHODS.principle,
  BOND_DEPOSITORY_MARKET_METHODS.liquidityPool,
  BOND_DEPOSITORY_MARKET_METHODS.restakeConfig,
])
const treasuryAbi = parseAbi([TREASURY_METHODS.valueOf])
const restakeAbi = parseAbi([RESTAKE_CONFIG_METHODS.agxPrice])
const helperAbi = parseAbi([BOND_HELPER_METHODS.slippage])
const pairSupplyAbi = parseAbi([PANCAKE_PAIR_V2_METHODS.totalSupply])

export type BondZapKind = 'lp' | 'burn'

export type BondZapAgxPreview = {
  netPayout: bigint
  grossPayout: bigint
}

/**
 * 读取 BondHelper.slippage
 *
 * 返回 0–99 的整数百分比，作为 zap 换币时的保守滑点上限，
 * 前端用它把 `quoteV2AmountsOut` 与 LP 铸出量打折扣，避免成交价劣于预期。
 *
 * @param client 链上读取客户端，默认公共 RPC
 * @returns 滑点百分比（0–99）
 * @see docs/onchain-manual/contracts/bondhelper.md
 */
export async function readBondHelperSlippage(
  client: ChainReadClient = bscReadClient,
): Promise<bigint> {
  return client.readContract({
    address: BSC_CONTRACTS.bondHelper,
    abi: helperAbi,
    functionName: 'slippage',
  })
}

/**
 * 估算单笔 USD1 zap 可得到的净 / 毛 AGX 数量
 *
 * burn 路径全量换 AGX，lp 路径半额换 AGX 并铸 LP，再按债券市场折扣与手续费
 * 折算出 AGX 预期回报，供下单前展示。链上读取失败直接抛出，由调用方映射为「—」。
 *
 * @param args.kind 债券类型：'lp' 走 LP 债券、'burn' 走销毁债券
 * @param args.depository 债券市场合约地址
 * @param args.depositUsd1 投入的 USD1 数量（wei，18 位小数）
 * @param args.client 链上读取客户端，默认公共 RPC
 * @returns 净 / 毛 AGX 预期数量；depositUsd1 为 0 时两者皆 0
 * @see 手册 §10 债券 Bond / BurnBond
 * @see docs/onchain-manual/contracts/bondhelper.md
 */
export async function readBondZapAgxPreview(args: {
  kind: BondZapKind
  depository: Address
  depositUsd1: bigint
  client?: ChainReadClient
}): Promise<BondZapAgxPreview> {
  const client = args.client ?? bscReadClient
  if (args.depositUsd1 === 0n) return { netPayout: 0n, grossPayout: 0n }

  const [market, treasury, principle, slippagePercent, restakeConfig] = await Promise.all([
    readBondMarketMeta(args.depository, client),
    client.readContract({
      address: args.depository,
      abi: depositoryAbi,
      functionName: 'treasury',
    }) as Promise<Address>,
    client.readContract({
      address: args.depository,
      abi: depositoryAbi,
      functionName: 'principle',
    }) as Promise<Address>,
    readBondHelperSlippage(client),
    client.readContract({
      address: args.depository,
      abi: depositoryAbi,
      functionName: 'restakeConfig',
    }) as Promise<Address>,
  ])

  const agxPrice = (await client.readContract({
    address: restakeConfig,
    abi: restakeAbi,
    functionName: 'agxPrice',
  })) as bigint

  const depositPrinciple = await zapPrincipleAmount({
    kind: args.kind,
    depository: args.depository,
    depositUsd1: args.depositUsd1,
    principle,
    slippagePercent,
    client,
  })

  const value = (await client.readContract({
    address: treasury,
    abi: treasuryAbi,
    functionName: 'valueOf',
    args: [principle, depositPrinciple],
  })) as bigint

  const grossPayout = computeGrossBondPayout({
    value,
    agxPrice,
    discountRateBP: market.discountRateBP,
  })
  const netPayout = computeNetBondPayout(grossPayout, market.feeBps)

  return { netPayout, grossPayout }
}

/**
 * 计算 zap 实际进入债券市场的 principle 数量
 *
 * burn 路径：USD1 全量换 AGX，再按 helper 滑点打折；
 * lp 路径：半额 USD1 换 AGX，另一半与 AGX 一起铸 LP，LP 铸出量同样打折。
 * 滑点同时作用于换币与 LP 铸出，避免高估可质押额度。
 *
 * @param args.kind 债券类型，决定单币兑换还是 LP 铸造
 * @param args.depositUsd1 投入的 USD1 数量
 * @param args.slippagePercent helper 滑点百分比
 * @returns 打折后的 principle 数量（wei）
 */
async function zapPrincipleAmount(args: {
  kind: BondZapKind
  depository: Address
  depositUsd1: bigint
  principle: Address
  slippagePercent: bigint
  client: ChainReadClient
}): Promise<bigint> {
  const path = [BSC_CONTRACTS.usd1, BSC_CONTRACTS.agx] as const

  if (args.kind === 'burn') {
    const quoted = await quoteV2AmountsOut({
      router: BSC_CONTRACTS.pancakeRouter,
      amountIn: args.depositUsd1,
      path,
      client: args.client,
    })
    return applyPercentSlippage(quoted, args.slippagePercent)
  }

  const halfUsd = args.depositUsd1 / 2n
  if (halfUsd === 0n) return 0n

  const [quotedAgx, liquidityPool] = await Promise.all([
    quoteV2AmountsOut({
      router: BSC_CONTRACTS.pancakeRouter,
      amountIn: halfUsd,
      path,
      client: args.client,
    }),
    clientReadLiquidityPool(args.depository, args.client),
  ])
  const agxHalf = applyPercentSlippage(quotedAgx, args.slippagePercent)

  const [meta, spot, totalSupply] = await Promise.all([
    readExchangePoolImmutableMetadata(liquidityPool, args.client),
    readExchangePoolSpotPrice(liquidityPool, args.client),
    args.client.readContract({
      address: liquidityPool,
      abi: pairSupplyAbi,
      functionName: 'totalSupply',
    }),
  ])

  const usd1Lower = BSC_CONTRACTS.usd1.toLowerCase()
  const amount0 = meta.token0.toLowerCase() === usd1Lower ? halfUsd : agxHalf
  const amount1 = meta.token0.toLowerCase() === usd1Lower ? agxHalf : halfUsd

  const lpMinted = quoteV2LpMintAmount({
    amountA: amount0,
    amountB: amount1,
    reserveA: spot.reserve0,
    reserveB: spot.reserve1,
    totalSupply: totalSupply as bigint,
  })
  // 保守处理：LP 铸出量同样按 helper 滑点打折
  return applyPercentSlippage(lpMinted, args.slippagePercent)
}

async function clientReadLiquidityPool(
  depository: Address,
  client: ChainReadClient,
): Promise<Address> {
  return client.readContract({
    address: depository,
    abi: depositoryAbi,
    functionName: 'liquidityPool',
  }) as Promise<Address>
}
