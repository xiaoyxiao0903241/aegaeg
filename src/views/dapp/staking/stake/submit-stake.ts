import { evaluateStakeLive } from '~/core/staking/staking-block-reasons'
import type { StakePeriod } from '~/core/staking/staking-period'
import { invalidateAfterStaking } from '~/shared/api/query/invalidate'
import { STAKING_BLOCKED } from '~/web3/errors/write-block-errors'
import { readMigrationStatus } from '~/web3/migration/migration-read'
import { stakePoolAddress } from '~/web3/staking/staking-addresses'
import { readStakeOpenPreflight } from '~/web3/staking/staking-read'
import {
  approveAgxForStakeIfNeeded,
  liquidStakeAgx,
  lockedStakeAgx,
} from '~/web3/staking/staking-write'
import { approveThenLiveWrite } from '~/web3/wallet/approve-then-live-write'
import type { WriteSession } from '~/web3/wallet/require-write-session'

export { STAKING_BLOCKED } from '~/web3/errors/write-block-errors'

/**
 * 提交质押（活期 / 定期共用）
 *
 * 先读链上预检（余额 / 授权 / 剩余额度 / 池开关 / 迁移状态）并判定阻塞原因，
 * 授权不足时内联 approve 后继续写；写入完成后失效质押相关缓存。
 *
 * @param session 已就绪的写会话
 * @param period 质押周期（liquid / 180 / 360 / 540）
 * @param amount 质押数量（AGX 最小单位）
 * @see docs/onchain-manual/contracts/liquidstaking.md
 * @see docs/onchain-manual/contracts/stakingpool.md
 */
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
    softPreBlocks: ['insufficientAllowance'] as const,
    approve: async () => approveAgxForStakeIfNeeded({ wallet, pool, amount }),
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
