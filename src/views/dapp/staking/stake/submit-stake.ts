import type { StakePeriod } from '~/core/staking/staking-period'
import { evaluateStakeLive } from '~/core/staking/staking-block-reasons'
import { invalidateAfterStaking } from '~/shared/api/query/invalidate'
import { STAKING_BLOCKED } from '~/web3/errors/staking-write-block-errors'
import { stakePoolAddress } from '~/web3/staking/staking-addresses'
import {
  approveAgxForStakeIfNeeded,
  claimLiquidWarmup,
  liquidStakeAgx,
  lockedStakeAgx,
} from '~/web3/staking/staking-write'
import { readStakeOpenPreflight } from '~/web3/staking/staking-read'
import { readMigrationStatus } from '~/web3/migration/migration-read'
import { approveThenLiveWrite } from '~/web3/wallet/approve-then-live-write'
import type { WriteSession } from '~/web3/wallet/require-write-session'

export { STAKING_BLOCKED } from '~/web3/errors/staking-write-block-errors'

/** Domain write only — soft gates throw sentinels. Envelope lives in `useChainMutation`. */
export async function submitStakeOpen(args: {
  session: WriteSession
  period: StakePeriod
  amount: bigint
}): Promise<void> {
  const { session, period, amount } = args
  const { wallet, address, readClient } = session

  const pool = stakePoolAddress(period)
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
      evaluateStakeLive({
        amount,
        isBound: preflight.isBound,
        balance: preflight.balance,
        allowance: preflight.allowance,
        remainingQuota: preflight.remainingQuota,
        poolOpen: preflight.poolOpen,
        isOldAccount,
      }),
    mapBlockError: (reason: NonNullable<ReturnType<typeof evaluateStakeLive>>) =>
      STAKING_BLOCKED[reason],
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
export async function submitLiquidWarmupClaim(args: { session: WriteSession }): Promise<void> {
  const { wallet } = args.session
  await claimLiquidWarmup({ wallet })
  invalidateAfterStaking()
}
