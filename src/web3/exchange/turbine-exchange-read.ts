import { parseAbi } from 'viem'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { ERC20_METHODS, TURBINE_METHODS } from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'
import type { ChainReadClient } from '~/web3/chain-read-client'

const turbineReadAbi = parseAbi([
  TURBINE_METHODS.turbineBalances,
  TURBINE_METHODS.silencesSize,
  TURBINE_METHODS.silences,
  TURBINE_METHODS.isVested,
  TURBINE_METHODS.currentCooldownDuration,
  TURBINE_METHODS.quoteUsdInForAgxOut,
])
const erc20ReadAbi = parseAbi([ERC20_METHODS.balanceOf, ERC20_METHODS.allowance])

export type TurbineSilenceRow = {
  index: number
  silenceBalance: bigint
  startTime: bigint
  vested: boolean
  unlockAt: bigint
}

export async function readTurbineQuota(
  user: string,
  client: ChainReadClient = bscReadClient,
): Promise<bigint> {
  return client.readContract({
    address: BSC_CONTRACTS.turbine,
    abi: turbineReadAbi,
    functionName: 'turbineBalances',
    args: [user as `0x${string}`],
  })
}

export async function readTurbineCooldownDuration(
  client: ChainReadClient = bscReadClient,
): Promise<bigint> {
  return client.readContract({
    address: BSC_CONTRACTS.turbine,
    abi: turbineReadAbi,
    functionName: 'currentCooldownDuration',
  })
}

export async function readTurbineUsdQuote(
  agxAmount: bigint,
  client: ChainReadClient = bscReadClient,
): Promise<bigint> {
  if (agxAmount === 0n) return 0n
  return client.readContract({
    address: BSC_CONTRACTS.turbine,
    abi: turbineReadAbi,
    functionName: 'quoteUsdInForAgxOut',
    args: [agxAmount],
  })
}

export async function readTurbineSilences(
  user: string,
  client: ChainReadClient = bscReadClient,
): Promise<{ rows: TurbineSilenceRow[]; cooldownDuration: bigint; claimableCount: number }> {
  const userAddress = user as `0x${string}`
  const [size, cooldownDuration] = await Promise.all([
    client.readContract({
      address: BSC_CONTRACTS.turbine,
      abi: turbineReadAbi,
      functionName: 'silencesSize',
      args: [userAddress],
    }),
    readTurbineCooldownDuration(client),
  ])

  const count = Number(size)
  const rows: TurbineSilenceRow[] = []
  let claimableCount = 0

  for (let index = 0; index < count; index += 1) {
    const [silence, vested] = await Promise.all([
      client.readContract({
        address: BSC_CONTRACTS.turbine,
        abi: turbineReadAbi,
        functionName: 'silences',
        args: [userAddress, BigInt(index)],
      }),
      client.readContract({
        address: BSC_CONTRACTS.turbine,
        abi: turbineReadAbi,
        functionName: 'isVested',
        args: [userAddress, BigInt(index)],
      }),
    ])
    const [silenceBalance, startTime] = silence
    if (vested) claimableCount += 1
    rows.push({
      index,
      silenceBalance,
      startTime,
      vested,
      unlockAt: startTime + cooldownDuration,
    })
  }

  return { rows, cooldownDuration, claimableCount }
}

export async function readTurbineUsd1Balances(
  owner: string,
  client: ChainReadClient = bscReadClient,
) {
  const ownerAddress = owner as `0x${string}`
  const [usd1, approved] = await Promise.all([
    client.readContract({
      address: BSC_CONTRACTS.usd1,
      abi: erc20ReadAbi,
      functionName: 'balanceOf',
      args: [ownerAddress],
    }),
    client.readContract({
      address: BSC_CONTRACTS.usd1,
      abi: erc20ReadAbi,
      functionName: 'allowance',
      args: [ownerAddress, BSC_CONTRACTS.turbine],
    }),
  ])
  return { usd1, approved }
}

/** 单条冷却是否可领（手册 §16.4 claim 前置）。 */
export async function readTurbineIsVested(
  user: string,
  index: number,
  client: ChainReadClient = bscReadClient,
): Promise<boolean> {
  return client.readContract({
    address: BSC_CONTRACTS.turbine,
    abi: turbineReadAbi,
    functionName: 'isVested',
    args: [user as `0x${string}`, BigInt(index)],
  })
}

/** 兑换轨红点：只 probe `silencesSize` + `isVested`，首个可领即停（不拉全表 silences）。 */
export async function readTurbineHasClaimable(
  user: string,
  client: ChainReadClient = bscReadClient,
): Promise<boolean> {
  const userAddress = user as `0x${string}`
  const size = await client.readContract({
    address: BSC_CONTRACTS.turbine,
    abi: turbineReadAbi,
    functionName: 'silencesSize',
    args: [userAddress],
  })
  const count = Number(size)
  if (!Number.isFinite(count) || count <= 0) return false
  for (let index = 0; index < count; index += 1) {
    const vested = await client.readContract({
      address: BSC_CONTRACTS.turbine,
      abi: turbineReadAbi,
      functionName: 'isVested',
      args: [userAddress, BigInt(index)],
    })
    if (vested) return true
  }
  return false
}
