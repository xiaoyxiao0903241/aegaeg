import type { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { WALLET_GATE_ERROR } from '~/web3/resolve-contract-error-message'
import { STAKING_GATE_ERROR } from '~/web3/errors/staking-write-gate-errors'
import { invalidateAfterStaking } from '~/shared/api/query/invalidate'
import { evaluateStakeLiveGate } from '~/core/staking/staking-gates'
import type { StakePeriod } from '~/core/staking/staking-period'
import { resolveStakePoolAddress } from '~/web3/staking/resolve-staking-addresses'
import {
  approveAgxForStakeIfNeeded,
  claimLiquidWarmup,
  liquidStakeAgx,
  lockedStakeAgx,
} from '~/web3/staking/staking-write'
import { readStakeOpenPreflight } from '~/web3/staking/staking-read'
import { readMigrationStatus } from '~/web3/migration/migration-read'
import { approveThenLiveWrite } from '~/web3/wallet/approve-then-live-write'
import type { ChainReadClient } from '~/web3/chain-read-client'

export { STAKING_GATE_ERROR } from '~/web3/errors/staking-write-gate-errors'

type ActiveAccount = ReturnType<typeof useActiveAccount>
type ActiveWallet = ReturnType<typeof useActiveWallet>

/** Domain write only — soft gates throw sentinels. Envelope lives in `useChainMutation`. */
export async function submitStakeOpen(args: {
  period: StakePeriod
  amount: bigint
  account: ActiveAccount
  wallet: ActiveWallet
  readClient: ChainReadClient
}): Promise<void> {
  const { period, amount, account, wallet, readClient } = args
  if (!account || !wallet) {
    throw WALLET_GATE_ERROR.NOT_CONNECTED
  }

  const pool = resolveStakePoolAddress(period)
  const isLiquid = period === 'liquid'

  await approveThenLiveWrite({
    readSnapshot: async () => {
      const preflight = await readStakeOpenPreflight({
        pool,
        isLiquid,
        user: account.address,
        client: readClient,
      })
      const migration = await readMigrationStatus(account.address, readClient)
      return { preflight, isOldAccount: migration.isOldAccount }
    },
    evaluate: ({ preflight, isOldAccount }) =>
      evaluateStakeLiveGate({
        amount,
        isBound: preflight.isBound,
        balance: preflight.balance,
        allowance: preflight.allowance,
        remainingQuota: preflight.remainingQuota,
        poolOpen: preflight.poolOpen,
        isOldAccount,
      }),
    mapGateError: (reason: NonNullable<ReturnType<typeof evaluateStakeLiveGate>>) =>
      STAKING_GATE_ERROR[reason],
    approve: async () => {
      await approveAgxForStakeIfNeeded({ wallet, pool, amount })
    },
    write: async () => {
      if (isLiquid) {
        await liquidStakeAgx({ wallet, amount })
      } else {
        await lockedStakeAgx({ wallet, pool, amount })
      }
    },
  })
  invalidateAfterStaking()
}

/** Domain write only — envelope lives in `useChainMutation`. */
export async function submitLiquidWarmupClaim(args: {
  account: ActiveAccount
  wallet: ActiveWallet
}): Promise<void> {
  const { account, wallet } = args
  if (!account || !wallet) {
    throw WALLET_GATE_ERROR.NOT_CONNECTED
  }
  await claimLiquidWarmup({ wallet })
  invalidateAfterStaking()
}
