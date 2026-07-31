import type { StakePeriod } from '~/core/staking/staking-period'
import { evaluateStakeLiveGate } from '~/core/staking/staking-gates'
import { invalidateAfterStaking } from '~/shared/api/query/invalidate'
import { STAKING_GATE_ERROR } from '~/web3/errors/staking-write-gate-errors'
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
import { requireWriteSession } from '~/web3/wallet/require-write-session'

export { STAKING_GATE_ERROR } from '~/web3/errors/staking-write-gate-errors'

/** Domain write only — soft gates throw sentinels. Envelope lives in `useChainMutation`. */
export async function submitStakeOpen(args: {
  period: StakePeriod
  amount: bigint
}): Promise<void> {
  const { period, amount } = args
  const { wallet, address, readClient } = requireWriteSession()

  const pool = resolveStakePoolAddress(period)
  const isLiquid = period === 'liquid'

  await approveThenLiveWrite({
    readSnapshot: async () => {
      const preflight = await readStakeOpenPreflight({
        pool,
        isLiquid,
        user: address,
        client: readClient,
      })
      const migration = await readMigrationStatus(address, readClient)
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
export async function submitLiquidWarmupClaim(): Promise<void> {
  const { wallet } = requireWriteSession()
  await claimLiquidWarmup({ wallet })
  invalidateAfterStaking()
}
