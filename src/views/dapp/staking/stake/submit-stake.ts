import type { StakePeriod } from '~/core/staking/staking-period'
import { evaluateStakeLive } from '~/core/staking/staking-block-reasons'
import { invalidateAfterStaking } from '~/shared/api/query/invalidate'
import { STAKING_BLOCKED } from '~/web3/errors/write-block-errors'
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

export { STAKING_BLOCKED } from '~/web3/errors/write-block-errors'

/** 域写；软门闸抛哨兵。信封在 `useChainMutation`。 */
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

/** 活期 warmup 激活：live `isWarmupExpired` 通过后再写。 */
export async function submitLiquidWarmupClaim(args: { session: WriteSession }): Promise<void> {
  const { wallet, address, readClient } = args.session
  const pool = stakePoolAddress('liquid')
  const preflight = await readStakeOpenPreflight({
    pool,
    isLiquid: true,
    user: address,
    client: readClient,
  })
  if (!preflight.isWarmupExpired) throw STAKING_BLOCKED.unavailable
  await claimLiquidWarmup({ wallet })
  invalidateAfterStaking()
}
