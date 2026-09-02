import { decodeFunctionResult, encodeFunctionData, parseAbi } from 'viem'

import { fingerprintIdList } from '~/core/claimable-unread'
import { migrationStakeRoot } from '~/core/migration/migration-user'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { ERC20_METHODS, TURBINE_METHODS } from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'
import { readMigratedFrom } from '~/web3/migration/migration-read'
import { decodeAggregate3Result, readAggregate3 } from '~/web3/multicall3-read'

const turbineReadAbi = parseAbi([
  TURBINE_METHODS.turbineBalances,
  TURBINE_METHODS.silencesSize,
  TURBINE_METHODS.silences,
  TURBINE_METHODS.isVested,
  TURBINE_METHODS.currentCooldownDuration,
  TURBINE_METHODS.quoteUsdInForAgxOut,
  TURBINE_METHODS.splitterManager,
])
const erc20ReadAbi = parseAbi([ERC20_METHODS.balanceOf, ERC20_METHODS.allowance])

export type TurbineSilenceRow = {
  index: number
  silenceBalance: bigint
  startTime: bigint
  vested: boolean
  unlockAt: bigint
}

/**
 * 读取用户 Turbine 可出售配额
 *
 * `registerSellQuota` 沿迁移链记到根账户；先 `migratedFrom` + `migrationStakeRoot`
 * 解析 root，再读 `turbineBalances(root)`。静默期 / claim 仍按调用方钱包键控。
 *
 * @param user 当前钱包地址
 * @returns 可出售 AGX 配额（wei）
 * @see docs/onchain-manual/contracts/turbine.md
 */
export async function readTurbineQuota(user: string): Promise<bigint> {
  const migratedFrom = await readMigratedFrom(user)
  const root = migrationStakeRoot(user, migratedFrom) as `0x${string}`
  return bscReadClient.readContract({
    address: BSC_CONTRACTS.turbine,
    abi: turbineReadAbi,
    functionName: 'turbineBalances',
    args: [root],
  })
}

/** 读取当前冷却时长（秒），用于计算每条买入的可领时间。 */
export async function readTurbineCooldownDuration(): Promise<bigint> {
  return bscReadClient.readContract({
    address: BSC_CONTRACTS.turbine,
    abi: turbineReadAbi,
    functionName: 'currentCooldownDuration',
  })
}

/**
 * 估算 AGX 买入所需的 USD1 数量
 *
 * 调用 `quoteUsdInForAgxOut`；数量为 0 时直接返回 0，不发起链上读取。
 *
 * @param agxAmount 拟买入的 AGX 数量
 * @returns 所需 USD1 数量；agxAmount 为 0 时返回 0
 * @see docs/onchain-manual/contracts/turbine.md
 */
export async function readTurbineUsdQuote(agxAmount: bigint): Promise<bigint> {
  if (agxAmount === 0n) return 0n
  return bscReadClient.readContract({
    address: BSC_CONTRACTS.turbine,
    abi: turbineReadAbi,
    functionName: 'quoteUsdInForAgxOut',
    args: [agxAmount],
  })
}

/**
 * 读取用户全部冷却买入记录
 *
 * 先取 `silencesSize`，再通过 multicall 批量读每条买入的余额、开始时间
 * 与是否可领；可领条数 = isVested 为 true 的条数。任一子调用失败即抛错。
 *
 * @param user 钱包地址
 * @returns 买入明细行、冷却时长与可领条数；无记录时返回空数组
 * @see 手册 §16.3 展示字段
 * @see docs/onchain-manual/contracts/turbine.md
 */
export async function readTurbineSilences(
  user: string,
): Promise<{ rows: TurbineSilenceRow[]; cooldownDuration: bigint; claimableCount: number }> {
  const userAddress = user as `0x${string}`
  const turbine = BSC_CONTRACTS.turbine
  const head = await readAggregate3([
    {
      target: turbine,
      callData: encodeFunctionData({
        abi: turbineReadAbi,
        functionName: 'silencesSize',
        args: [userAddress],
      }),
    },
    {
      target: turbine,
      callData: encodeFunctionData({
        abi: turbineReadAbi,
        functionName: 'currentCooldownDuration',
      }),
    },
  ])
  const size = decodeAggregate3Result<bigint>(
    head,
    0,
    turbineReadAbi,
    'silencesSize',
    'TURBINE_SILENCES_MULTICALL_FAILED:size',
  )
  const cooldownDuration = decodeAggregate3Result<bigint>(
    head,
    1,
    turbineReadAbi,
    'currentCooldownDuration',
    'TURBINE_SILENCES_MULTICALL_FAILED:cooldown',
  )

  const count = Number(size)
  if (!Number.isFinite(count) || count <= 0) {
    return { rows: [], cooldownDuration, claimableCount: 0 }
  }

  const calls = Array.from({ length: count }, (_, index) => {
    const idx = BigInt(index)
    return [
      {
        target: turbine,
        callData: encodeFunctionData({
          abi: turbineReadAbi,
          functionName: 'silences',
          args: [userAddress, idx],
        }),
      },
      {
        target: turbine,
        callData: encodeFunctionData({
          abi: turbineReadAbi,
          functionName: 'isVested',
          args: [userAddress, idx],
        }),
      },
    ] as const
  }).flat()

  const results = await readAggregate3(calls)
  const rows: TurbineSilenceRow[] = []
  let claimableCount = 0

  for (let index = 0; index < count; index += 1) {
    const silenceResult = results[index * 2]
    const vestedResult = results[index * 2 + 1]
    if (!silenceResult?.success || !vestedResult?.success) {
      throw new Error(`TURBINE_SILENCES_MULTICALL_FAILED:${index}`)
    }
    const silence = decodeFunctionResult({
      abi: turbineReadAbi,
      functionName: 'silences',
      data: silenceResult.returnData,
    })
    const vested = decodeFunctionResult({
      abi: turbineReadAbi,
      functionName: 'isVested',
      data: vestedResult.returnData,
    })
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

/**
 * 读取用户 USD1 余额与授权
 *
 * 返回 USD1 可卖余额与对 Turbine 的授权额度，供输入上限与 approve 判断使用。
 *
 * @param owner 钱包地址
 * @returns USD1 余额与授权额度
 */
export async function readTurbineUsd1Balances(owner: string) {
  const ownerAddress = owner as `0x${string}`
  const results = await readAggregate3([
    {
      target: BSC_CONTRACTS.usd1,
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
        functionName: 'allowance',
        args: [ownerAddress, BSC_CONTRACTS.turbine],
      }),
    },
  ])
  return {
    usd1: decodeAggregate3Result<bigint>(
      results,
      0,
      erc20ReadAbi,
      'balanceOf',
      'TURBINE_USD1_MULTICALL_FAILED:balance',
    ),
    approved: decodeAggregate3Result<bigint>(
      results,
      1,
      erc20ReadAbi,
      'allowance',
      'TURBINE_USD1_MULTICALL_FAILED:allowance',
    ),
  }
}

/**
 * 单条冷却买入是否已可领取
 *
 * 调用 `isVested`，是 Turbine claim 写前的前置条件检查。
 *
 * @param user 钱包地址
 * @param index 买入记录下标
 * @returns 冷却结束后可领返回 true
 * @see 手册 §16.4 用户写方法
 * @see docs/onchain-manual/contracts/turbine.md
 */
export async function readTurbineIsVested(user: string, index: number): Promise<boolean> {
  return bscReadClient.readContract({
    address: BSC_CONTRACTS.turbine,
    abi: turbineReadAbi,
    functionName: 'isVested',
    args: [user as `0x${string}`, BigInt(index)],
  })
}

/**
 * 读取 Turbine 是否已接入分流器 Manager。
 *
 * 非零：claimCooledGagx 经 Manager 进分流器；零：旧行为直 mint gAGX 到钱包。
 *
 * @see 手册 §16.4–16.5 / turbine.md
 */
export async function readTurbineSplitterManager(): Promise<`0x${string}`> {
  return bscReadClient.readContract({
    address: BSC_CONTRACTS.turbine,
    abi: turbineReadAbi,
    functionName: 'splitterManager',
  })
}

/**
 * 涡轮可领指纹：已到期冷却仓的 index 排序拼接。
 *
 * 只读 `silencesSize` + 逐条 `isVested`，不拉 silences 正文。
 * 须扫完全表才能区分「新到期仓」与「仍是同一批」。
 *
 * @param user 钱包地址
 * @returns 无到期仓为空串
 * @see docs/onchain-manual/contracts/turbine.md
 */
export async function readTurbineClaimableFingerprint(user: string): Promise<string> {
  const userAddress = user as `0x${string}`
  const size = await bscReadClient.readContract({
    address: BSC_CONTRACTS.turbine,
    abi: turbineReadAbi,
    functionName: 'silencesSize',
    args: [userAddress],
  })
  const count = Number(size)
  if (!Number.isFinite(count) || count <= 0) return ''
  const vestedResults = await readAggregate3(
    Array.from({ length: count }, (_, index) => ({
      target: BSC_CONTRACTS.turbine,
      callData: encodeFunctionData({
        abi: turbineReadAbi,
        functionName: 'isVested',
        args: [userAddress, BigInt(index)],
      }),
    })),
  )
  const vested: string[] = []
  for (let index = 0; index < count; index += 1) {
    const isVested = decodeAggregate3Result<boolean>(
      vestedResults,
      index,
      turbineReadAbi,
      'isVested',
      `TURBINE_FINGERPRINT_MULTICALL_FAILED:${index}`,
    )
    if (isVested) vested.push(String(index))
  }
  return fingerprintIdList(vested)
}
