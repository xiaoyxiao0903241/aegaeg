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
  LP_BONDING_CALCULATOR_METHODS,
  PANCAKE_PAIR_V2_METHODS,
  PANCAKE_ROUTER_V2_METHODS,
} from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'
import { quoteV2AmountsOut } from '~/web3/exchange/quote-v2-amounts-out'
import { type Aggregate3Call, decodeAggregate3Result, readAggregate3 } from '~/web3/multicall3-read'
import type { BondMarketMeta } from '~/web3/staking/staking-read'

const depositoryAbi = parseAbi([
  BOND_DEPOSITORY_MARKET_METHODS.liquidityPool,
  BOND_DEPOSITORY_MARKET_METHODS.discountRateBP,
  BOND_DEPOSITORY_MARKET_METHODS.terms,
  BOND_DEPOSITORY_MARKET_METHODS.maxPayout,
])
const pairAbi = parseAbi([
  PANCAKE_PAIR_V2_METHODS.token0,
  PANCAKE_PAIR_V2_METHODS.getReserves,
  PANCAKE_PAIR_V2_METHODS.totalSupply,
])
const routerAbi = parseAbi([PANCAKE_ROUTER_V2_METHODS.getAmountsOut])
const calculatorAbi = parseAbi([LP_BONDING_CALCULATOR_METHODS.valuation])

export type BondZapAgxPreview = {
  netPayout: bigint
  grossPayout: bigint
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
  market?: BondMarketMeta
}): Promise<BondZapAgxPreview> {
  if (args.depositUsd1 === 0n) return { netPayout: 0n, grossPayout: 0n }

  const market = args.market ?? (await readMarketMeta(args.depository))

  if (args.kind === 'burn') {
    const agxOut = await quoteV2AmountsOut({
      router: BSC_CONTRACTS.pancakeRouter,
      amountIn: args.depositUsd1,
      path: [BSC_CONTRACTS.usd1, BSC_CONTRACTS.agx],
    })
    const grossPayout = computeBurnBondGrossPayout(agxOut, market.discountRateBP)
    return { grossPayout, netPayout: computeNetBondPayout(grossPayout, market.feeBps) }
  }

  const liquidityPool = (await bscReadClient.readContract({
    address: args.depository,
    abi: depositoryAbi,
    functionName: 'liquidityPool',
  })) as Address

  const halfUsd = args.depositUsd1 / 2n
  if (halfUsd === 0n) return { netPayout: 0n, grossPayout: 0n }

  const lpBatch = await readAggregate3([
    {
      target: BSC_CONTRACTS.pancakeRouter,
      callData: encodeFunctionData({
        abi: routerAbi,
        functionName: 'getAmountsOut',
        args: [halfUsd, [BSC_CONTRACTS.usd1, BSC_CONTRACTS.agx]],
      }),
    },
    {
      target: liquidityPool,
      callData: encodeFunctionData({ abi: pairAbi, functionName: 'token0' }),
    },
    {
      target: liquidityPool,
      callData: encodeFunctionData({ abi: pairAbi, functionName: 'getReserves' }),
    },
    {
      target: liquidityPool,
      callData: encodeFunctionData({ abi: pairAbi, functionName: 'totalSupply' }),
    },
  ])
  const amountsOut = decodeAggregate3Result<readonly bigint[]>(
    lpBatch,
    0,
    routerAbi,
    'getAmountsOut',
    'BOND_PREVIEW_MULTICALL_FAILED:agxOut',
  )
  const agxOut = amountsOut[amountsOut.length - 1] ?? 0n
  const token0 = decodeAggregate3Result<Address>(
    lpBatch,
    1,
    pairAbi,
    'token0',
    'BOND_PREVIEW_MULTICALL_FAILED:token0',
  )
  const reserves = decodeAggregate3Result<readonly [bigint, bigint, number]>(
    lpBatch,
    2,
    pairAbi,
    'getReserves',
    'BOND_PREVIEW_MULTICALL_FAILED:reserves',
  )
  const totalSupply = decodeAggregate3Result<bigint>(
    lpBatch,
    3,
    pairAbi,
    'totalSupply',
    'BOND_PREVIEW_MULTICALL_FAILED:totalSupply',
  )

  const agxLower = BSC_CONTRACTS.agx.toLowerCase()
  const token0IsAgx = token0.toLowerCase() === agxLower
  const reserveU = token0IsAgx ? reserves[1] : reserves[0]
  const reserveAGX = token0IsAgx ? reserves[0] : reserves[1]

  const lpAmount = quoteZapLpAmount({
    usd1Amount: args.depositUsd1,
    agxOut,
    reserveU,
    reserveAGX,
    totalSupply,
  })
  if (lpAmount === 0n) return { netPayout: 0n, grossPayout: 0n }

  const value = (await bscReadClient.readContract({
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

async function readMarketMeta(depository: Address): Promise<BondMarketMeta> {
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
  const batch = await readAggregate3(calls)

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
