import { encodeFunctionData, parseAbi } from 'viem'

import {
  applyPercentSlippage,
  computeGrossBondPayout,
  computeNetBondPayout,
  quoteV2LpMintAmount,
} from '~/core/staking/bond-payout'
import type { BondKind } from '~/core/staking/staking-period'
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
import { type Aggregate3Call, decodeAggregate3Result, readAggregate3 } from '~/web3/multicall3-read'
import type { BondMarketMeta } from '~/web3/staking/staking-read'

const depositoryAbi = parseAbi([
  BOND_DEPOSITORY_MARKET_METHODS.treasury,
  BOND_DEPOSITORY_MARKET_METHODS.principle,
  BOND_DEPOSITORY_MARKET_METHODS.liquidityPool,
  BOND_DEPOSITORY_MARKET_METHODS.restakeConfig,
  BOND_DEPOSITORY_MARKET_METHODS.discountRateBP,
  BOND_DEPOSITORY_MARKET_METHODS.terms,
  BOND_DEPOSITORY_MARKET_METHODS.maxPayout,
])
const treasuryAbi = parseAbi([TREASURY_METHODS.valueOf])
const restakeAbi = parseAbi([RESTAKE_CONFIG_METHODS.agxPrice])
const helperAbi = parseAbi([BOND_HELPER_METHODS.slippage])
const pairSupplyAbi = parseAbi([PANCAKE_PAIR_V2_METHODS.totalSupply])

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
 * @param args.market 已读市场元数据时传入，避免与 submit 快照重复 eth_call
 * @returns 净 / 毛 AGX 预期数量；depositUsd1 为 0 时两者皆 0
 * @see 手册 §10 债券 Bond / BurnBond
 * @see docs/onchain-manual/contracts/bondhelper.md
 */
export async function readBondZapAgxPreview(args: {
  kind: BondKind
  depository: Address
  depositUsd1: bigint
  client?: ChainReadClient
  market?: BondMarketMeta
}): Promise<BondZapAgxPreview> {
  const client = args.client ?? bscReadClient
  if (args.depositUsd1 === 0n) return { netPayout: 0n, grossPayout: 0n }

  const calls: Aggregate3Call[] = []
  const push = (target: Address, functionName: string, abi = depositoryAbi) => {
    const index = calls.length
    calls.push({
      target,
      callData: encodeFunctionData({
        abi,
        functionName: functionName as never,
      }),
    })
    return index
  }

  let discountIdx = -1
  let termsIdx = -1
  let maxPayoutIdx = -1
  if (!args.market) {
    discountIdx = push(args.depository, 'discountRateBP')
    termsIdx = push(args.depository, 'terms')
    maxPayoutIdx = push(args.depository, 'maxPayout')
  }
  const treasuryIdx = push(args.depository, 'treasury')
  const principleIdx = push(args.depository, 'principle')
  const slippageIdx = calls.length
  calls.push({
    target: BSC_CONTRACTS.bondHelper,
    callData: encodeFunctionData({
      abi: helperAbi,
      functionName: 'slippage',
    }),
  })
  const restakeIdx = push(args.depository, 'restakeConfig')
  const liquidityIdx = args.kind === 'lp' ? push(args.depository, 'liquidityPool') : -1

  const batch = await readAggregate3(client, calls)

  const market: BondMarketMeta =
    args.market ??
    (() => {
      const discountRateBP = decodeAggregate3Result<bigint>(
        batch,
        discountIdx,
        depositoryAbi,
        'discountRateBP',
        'BOND_PREVIEW_MULTICALL_FAILED:discount',
      )
      const terms = decodeAggregate3Result<readonly [bigint, bigint, bigint, bigint, bigint]>(
        batch,
        termsIdx,
        depositoryAbi,
        'terms',
        'BOND_PREVIEW_MULTICALL_FAILED:terms',
      )
      const maxPayoutAmount = decodeAggregate3Result<bigint>(
        batch,
        maxPayoutIdx,
        depositoryAbi,
        'maxPayout',
        'BOND_PREVIEW_MULTICALL_FAILED:maxPayout',
      )
      const [, , feeBps, maxDebt, totalDeposit] = terms
      return { discountRateBP, feeBps, maxDebt, totalDeposit, maxPayoutAmount }
    })()

  const treasury = decodeAggregate3Result<Address>(
    batch,
    treasuryIdx,
    depositoryAbi,
    'treasury',
    'BOND_PREVIEW_MULTICALL_FAILED:treasury',
  )
  const principle = decodeAggregate3Result<Address>(
    batch,
    principleIdx,
    depositoryAbi,
    'principle',
    'BOND_PREVIEW_MULTICALL_FAILED:principle',
  )
  const slippagePercent = decodeAggregate3Result<bigint>(
    batch,
    slippageIdx,
    helperAbi,
    'slippage',
    'BOND_PREVIEW_MULTICALL_FAILED:slippage',
  )
  const restakeConfig = decodeAggregate3Result<Address>(
    batch,
    restakeIdx,
    depositoryAbi,
    'restakeConfig',
    'BOND_PREVIEW_MULTICALL_FAILED:restake',
  )
  const liquidityPool =
    liquidityIdx >= 0
      ? decodeAggregate3Result<Address>(
          batch,
          liquidityIdx,
          depositoryAbi,
          'liquidityPool',
          'BOND_PREVIEW_MULTICALL_FAILED:liquidityPool',
        )
      : null

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
    liquidityPool,
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
  kind: BondKind
  depository: Address
  depositUsd1: bigint
  principle: Address
  slippagePercent: bigint
  client: ChainReadClient
  liquidityPool: Address | null
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

  const liquidityPool =
    args.liquidityPool ??
    ((await args.client.readContract({
      address: args.depository,
      abi: depositoryAbi,
      functionName: 'liquidityPool',
    })) as Address)

  const [quotedAgx, meta, spot, totalSupply] = await Promise.all([
    quoteV2AmountsOut({
      router: BSC_CONTRACTS.pancakeRouter,
      amountIn: halfUsd,
      path,
      client: args.client,
    }),
    readExchangePoolImmutableMetadata(liquidityPool, args.client),
    readExchangePoolSpotPrice(liquidityPool, args.client),
    args.client.readContract({
      address: liquidityPool,
      abi: pairSupplyAbi,
      functionName: 'totalSupply',
    }),
  ])
  const agxHalf = applyPercentSlippage(quotedAgx, args.slippagePercent)

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
