import { decodeFunctionResult, encodeFunctionData, parseAbi } from 'viem'

import { migrationStakeRoot } from '~/core/migration/migration-user'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { ERC20_METHODS, TURBINE_METHODS } from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'
import type { ChainReadClient } from '~/web3/chain-read-client'
import { readMigratedFrom } from '~/web3/migration/migration-read'
import { readAggregate3 } from '~/web3/multicall3-read'

const turbineReadAbi = parseAbi([
  TURBINE_METHODS.turbineBalances,
  TURBINE_METHODS.silencesSize,
  TURBINE_METHODS.silences,
  TURBINE_METHODS.isVested,
  TURBINE_METHODS.currentCooldownDuration,
  TURBINE_METHODS.quoteUsdInForAgxOut,
  TURBINE_METHODS.swapSlippageBP,
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
 * @param client 链上读取客户端，默认公共 RPC
 * @returns 可出售 AGX 配额（wei）
 * @see docs/onchain-manual/contracts/turbine.md
 */
export async function readTurbineQuota(
  user: string,
  client: ChainReadClient = bscReadClient,
): Promise<bigint> {
  const migratedFrom = await readMigratedFrom(user, client)
  const root = migrationStakeRoot(user, migratedFrom) as `0x${string}`
  return client.readContract({
    address: BSC_CONTRACTS.turbine,
    abi: turbineReadAbi,
    functionName: 'turbineBalances',
    args: [root],
  })
}

/** 读取当前冷却时长（秒），用于计算每条买入的可领时间。 */
export async function readTurbineCooldownDuration(
  client: ChainReadClient = bscReadClient,
): Promise<bigint> {
  return client.readContract({
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
 * @param client 链上读取客户端，默认公共 RPC
 * @returns 所需 USD1 数量；agxAmount 为 0 时返回 0
 * @see docs/onchain-manual/contracts/turbine.md
 */
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

/**
 * 读取 Turbine 交易滑点基点
 *
 * `swapSlippageBP` 默认 300（3%），仅 owner 可改，前端只读展示。
 *
 * @param client 链上读取客户端，默认公共 RPC
 * @returns 滑点基点
 * @see docs/onchain-manual/contracts/turbine.md
 */
export async function readTurbineSwapSlippageBP(
  client: ChainReadClient = bscReadClient,
): Promise<bigint> {
  return client.readContract({
    address: BSC_CONTRACTS.turbine,
    abi: turbineReadAbi,
    functionName: 'swapSlippageBP',
  })
}

/**
 * 读取用户全部冷却买入记录
 *
 * 先取 `silencesSize`，再通过 multicall 批量读每条买入的余额、开始时间
 * 与是否可领；可领条数 = isVested 为 true 的条数。任一子调用失败即抛错。
 *
 * @param user 钱包地址
 * @param client 链上读取客户端，默认公共 RPC
 * @returns 买入明细行、冷却时长与可领条数；无记录时返回空数组
 * @see 手册 §16.3 展示字段
 * @see docs/onchain-manual/contracts/turbine.md
 */
export async function readTurbineSilences(
  user: string,
  client: ChainReadClient = bscReadClient,
): Promise<{ rows: TurbineSilenceRow[]; cooldownDuration: bigint; claimableCount: number }> {
  const userAddress = user as `0x${string}`
  const turbine = BSC_CONTRACTS.turbine
  const [size, cooldownDuration] = await Promise.all([
    client.readContract({
      address: turbine,
      abi: turbineReadAbi,
      functionName: 'silencesSize',
      args: [userAddress],
    }),
    readTurbineCooldownDuration(client),
  ])

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

  const results = await readAggregate3(client, calls)
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
 * @param client 链上读取客户端，默认公共 RPC
 * @returns USD1 余额与授权额度
 */
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

/**
 * 单条冷却买入是否已可领取
 *
 * 调用 `isVested`，是 Turbine claim 写前的前置条件检查。
 *
 * @param user 钱包地址
 * @param index 买入记录下标
 * @param client 链上读取客户端，默认公共 RPC
 * @returns 冷却结束后可领返回 true
 * @see 手册 §16.4 用户写方法
 * @see docs/onchain-manual/contracts/turbine.md
 */
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

/**
 * 读取 Turbine 是否已接入分流器 Manager。
 *
 * 非零：claimCooledGagx 经 Manager 进分流器；零：旧行为直 mint gAGX 到钱包。
 *
 * @see 手册 §16.4–16.5 / turbine.md
 */
export async function readTurbineSplitterManager(
  client: ChainReadClient = bscReadClient,
): Promise<`0x${string}`> {
  return client.readContract({
    address: BSC_CONTRACTS.turbine,
    abi: turbineReadAbi,
    functionName: 'splitterManager',
  })
}

/**
 * 判断是否有冷却买入可领取（兑换入口红点）
 *
 * 只探测 `silencesSize` + 逐条 `isVested`，找到第一条可领即返回，
 * 不拉全表 silences，减少 RPC 调用。
 *
 * @param user 钱包地址
 * @param client 链上读取客户端，默认公共 RPC
 * @returns 存在可领记录返回 true
 * @see docs/onchain-manual/contracts/turbine.md
 */
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
