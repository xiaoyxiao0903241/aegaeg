import { parseAbi } from 'viem'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { ACCOUNT_MIGRATION_METHODS } from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'
import type { ChainReadClient } from '~/web3/chain-read-client'
import type { MigrationStatus } from '~/core/migration/resolve-migration-user-gate'

const migrationReadAbi = parseAbi([
  ACCOUNT_MIGRATION_METHODS.migrationEnabled,
  ACCOUNT_MIGRATION_METHODS.isOldAccount,
])

async function readMigrationEnabled(client: ChainReadClient = bscReadClient): Promise<boolean> {
  return client.readContract({
    address: BSC_CONTRACTS.accountMigrationManager,
    abi: migrationReadAbi,
    functionName: 'migrationEnabled',
  })
}

async function readIsOldAccount(
  address: string,
  client: ChainReadClient = bscReadClient,
): Promise<boolean> {
  return client.readContract({
    address: BSC_CONTRACTS.accountMigrationManager,
    abi: migrationReadAbi,
    functionName: 'isOldAccount',
    args: [address as `0x${string}`],
  })
}

export async function readMigrationStatus(
  address: string | undefined,
  client: ChainReadClient = bscReadClient,
): Promise<MigrationStatus> {
  const migrationEnabled = await readMigrationEnabled(client)
  if (!address) {
    return { migrationEnabled, isOldAccount: false }
  }
  const isOldAccount = await readIsOldAccount(address, client)
  return { migrationEnabled, isOldAccount }
}
