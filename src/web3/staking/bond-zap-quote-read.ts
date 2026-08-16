import { encodeFunctionData, parseAbi } from 'viem'

import {
  computeBondPoolAgxPrice,
  computeBurnBondGrossPayout,
  computeGrossBondPayout,
  computeNetBondPayout,
  quoteZapLpAmount,
} from '~/core/staking/bond-payout'
import type { BondKind } from '~/core/staking/staking-period'
import { type Address, BSC_CONTRACTS } from '~/shared/config/contracts'
import {
  BOND_DEPOSITORY_MARKET_METHODS,
  BOND_HELPER_METHODS,
  LP_BONDING_CALCULATOR_METHODS,
  PANCAKE_PAIR_V2_METHODS,
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
  BOND_DEPOSITORY_MARKET_METHODS.liquidityPool,
  BOND_DEPOSITORY_MARKET_METHODS.discountRateBP,
  BOND_DEPOSITORY_MARKET_METHODS.terms,
  BOND_DEPOSITORY_MARKET_METHODS.maxPayout,
])
const helperAbi = parseAbi([BOND_HELPER_METHODS.slippage])
const pairSupplyAbi = parseAbi([PANCAKE_PAIR_V2_METHODS.totalSupply])
const calculatorAbi = parseAbi([LP_BONDING_CALCULATOR_METHODS.valuation])

export type BondZapAgxPreview = {
  netPayout: bigint
  grossPayout: bigint
}

/**
 * 读取 BondHelper.slippage（Bond 页展示）。
 *
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
 * 估算单笔 USD1 zap 可得到的净 / 毛 AGX（手册 §10.6 方法二）。
 *
 * - LP：半额换 AGX → 组 LP → `bondingCalculator.valuation` → 池子 `agxPrice` → 折扣
 * - Burn：全额换 AGX → `agxOut * 10000 / discountRateBP`
 *
 * @see docs/onchain-manual/01-frontend-integration-guide.md §10.6
 * @see docs/onchain-manual/contracts/bonddepository.md
 * @see docs/onchain-manual/contracts/burnbonddepository.md
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

  const market = args.market ?? (await readMarketMeta(args.depository, client))

  if (args.kind === 'burn') {
    const agxOut = await quoteV2AmountsOut({
      router: BSC_CONTRACTS.pancakeRouter,
      amountIn: args.depositUsd1,
      path: [BSC_CONTRACTS.usd1, BSC_CONTRACTS.agx],
      client,
    })
    const grossPayout = computeBurnBondGrossPayout(agxOut, market.discountRateBP)
    return { grossPayout, netPayout: computeNetBondPayout(grossPayout, market.feeBps) }
  }

  const liquidityPool = (await client.readContract({
    address: args.depository,
    abi: depositoryAbi,
    functionName: 'liquidityPool',
  })) as Address

  const halfUsd = args.depositUsd1 / 2n
  if (halfUsd === 0n) return { netPayout: 0n, grossPayout: 0n }

  const [agxOut, meta, spot, totalSupply] = await Promise.all([
    quoteV2AmountsOut({
      router: BSC_CONTRACTS.pancakeRouter,
      amountIn: halfUsd,
      path: [BSC_CONTRACTS.usd1, BSC_CONTRACTS.agx],
      client,
    }),
    readExchangePoolImmutableMetadata(liquidityPool, client),
    readExchangePoolSpotPrice(liquidityPool, client),
    client.readContract({
      address: liquidityPool,
      abi: pairSupplyAbi,
      functionName: 'totalSupply',
    }) as Promise<bigint>,
  ])

  const agxLower = BSC_CONTRACTS.agx.toLowerCase()
  const token0IsAgx = meta.token0.toLowerCase() === agxLower
  const reserveU = token0IsAgx ? spot.reserve1 : spot.reserve0
  const reserveAGX = token0IsAgx ? spot.reserve0 : spot.reserve1

  const lpAmount = quoteZapLpAmount({
    usd1Amount: args.depositUsd1,
    agxOut,
    reserveU,
    reserveAGX,
    totalSupply,
  })
  if (lpAmount === 0n) return { netPayout: 0n, grossPayout: 0n }

  const value = (await client.readContract({
    address: BSC_CONTRACTS.bondingCalculator,
    abi: calculatorAbi,
    functionName: 'valuation',
    args: [liquidityPool, lpAmount],
  })) as bigint

  const grossPayout = computeGrossBondPayout({
    value,
    agxPrice: computeBondPoolAgxPrice(reserveU, reserveAGX),
    discountRateBP: market.discountRateBP,
  })
  return { grossPayout, netPayout: computeNetBondPayout(grossPayout, market.feeBps) }
}

async function readMarketMeta(
  depository: Address,
  client: ChainReadClient,
): Promise<BondMarketMeta> {
  const calls: Aggregate3Call[] = []
  const push = (functionName: string) => {
    const index = calls.length
    calls.push({
      target: depository,
      callData: encodeFunctionData({
        abi: depositoryAbi,
        functionName: functionName as never,
      }),
    })
    return index
  }
  const discountIdx = push('discountRateBP')
  const termsIdx = push('terms')
  const maxPayoutIdx = push('maxPayout')
  const batch = await readAggregate3(client, calls)

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
}
