import { encodeFunctionData, parseAbi } from 'viem'

import type { MigrationStatus } from '~/core/migration/migration-user'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { ACCOUNT_MIGRATION_METHODS } from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'
import { decodeAggregate3Result, readAggregate3 } from '~/web3/multicall3-read'

const migrationReadAbi = parseAbi([
  ACCOUNT_MIGRATION_METHODS.migrationEnabled,
  ACCOUNT_MIGRATION_METHODS.isOldAccount,
  ACCOUNT_MIGRATION_METHODS.migratedFrom,
])

/**
 * 读取迁移首地址（root），供 public mapping 键控查询使用。
 *
 * 返回零地址表示该地址未迁移，此时调用方按当前地址处理。
 *
 * @param address 待查询地址
 * @returns 迁移 root 地址
 * @see 手册 §17 账户迁移
 */
export async function readMigratedFrom(address: string): Promise<`0x${string}`> {
  return bscReadClient.readContract({
    address: BSC_CONTRACTS.accountMigrationManager,
    abi: migrationReadAbi,
    functionName: 'migratedFrom',
    args: [address as `0x${string}`],
  })
}

/**
 * 读取地址的迁移状态（开关 + 是否旧账户）。
 *
 * 未传入地址时只返回迁移开关，isOldAccount 固定 false。
 *
 * @param address 钱包地址，可为 undefined
 * @returns 迁移状态快照
 * @see 手册 §17 账户迁移
 */
export async function readMigrationStatus(address: string | undefined): Promise<MigrationStatus> {
  const manager = BSC_CONTRACTS.accountMigrationManager
  if (!address) {
    const migrationEnabled = await bscReadClient.readContract({
      address: manager,
      abi: migrationReadAbi,
      functionName: 'migrationEnabled',
    })
    return { migrationEnabled, isOldAccount: false }
  }
  const user = address as `0x${string}`
  const results = await readAggregate3([
    {
      target: manager,
      callData: encodeFunctionData({ abi: migrationReadAbi, functionName: 'migrationEnabled' }),
    },
    {
      target: manager,
      callData: encodeFunctionData({
        abi: migrationReadAbi,
        functionName: 'isOldAccount',
        args: [user],
      }),
    },
  ])
  return {
    migrationEnabled: decodeAggregate3Result<boolean>(
      results,
      0,
      migrationReadAbi,
      'migrationEnabled',
      'MIGRATION_STATUS_MULTICALL_FAILED:enabled',
    ),
    isOldAccount: decodeAggregate3Result<boolean>(
      results,
      1,
      migrationReadAbi,
      'isOldAccount',
      'MIGRATION_STATUS_MULTICALL_FAILED:isOldAccount',
    ),
  }
}
