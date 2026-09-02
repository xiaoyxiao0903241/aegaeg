import type { Address } from 'viem'

import { pickBufferFirstClaim } from '~/core/release/pick-release-claim-page'
import { releaseClaimBlockReason } from '~/core/release/release-block-reasons'
import { invalidateAfterReleaseClaim } from '~/shared/api/query/invalidate'
import { RELEASE_BLOCKED } from '~/web3/errors/write-block-errors'
import { readMigrationStatus } from '~/web3/migration/migration-read'
import { readReleaseBufferSnapshot, readReleaseQueueSnapshot } from '~/web3/release/release-read'
import {
  writeClaimManyReleases,
  writeClaimVestedRewardsInRange,
} from '~/web3/release/release-write'
import type { WriteSession } from '~/web3/wallet/require-write-session'

function gateError(
  reason: 'zeroAmount' | null,
): (typeof RELEASE_BLOCKED)[keyof typeof RELEASE_BLOCKED] | null {
  if (!reason) return null
  return RELEASE_BLOCKED[reason]
}

async function assertReleaseWritesAllowed(address: string) {
  const migration = await readMigrationStatus(address)
  if (migration.isOldAccount) throw RELEASE_BLOCKED.accountMigrated
}

/**
 * 领取释放队列：只做领域层写操作
 *
 * 写前两轮门闸后，只领当前 50 条窗；成功后由调用方刷新，再点领下一窗。
 *
 * @param args.session 已就绪的写会话
 * @param args.planIndex 要领取的天数档位
 * @see RewardQueue.claimVestedRewardsInRange
 */
export async function submitReleaseQueueClaim(args: {
  session: WriteSession
  planIndex: number
}): Promise<void> {
  const { session, planIndex } = args
  const { wallet, address } = session
  if (planIndex < 0) {
    throw RELEASE_BLOCKED.planUnresolved
  }

  const pre = await readReleaseQueueSnapshot(address)
  const preRow = pre.plans.find((row) => row.planIndex === planIndex)
  const preErr = gateError(
    releaseClaimBlockReason({
      claimable: preRow?.claimable ?? 0n,
    }),
  )
  if (preErr) throw preErr

  const live = await readReleaseQueueSnapshot(address)
  const liveRow = live.plans.find((row) => row.planIndex === planIndex)
  const liveErr = gateError(
    releaseClaimBlockReason({
      claimable: liveRow?.claimable ?? 0n,
    }),
  )
  if (liveErr) throw liveErr

  await assertReleaseWritesAllowed(address)

  const start = liveRow?.claimStart ?? 0
  const limit = liveRow?.claimLimit ?? 0
  if (limit <= 0) throw RELEASE_BLOCKED.zeroAmount

  await writeClaimVestedRewardsInRange({ wallet, planIndex, start, limit })
  invalidateAfterReleaseClaim()
}

export type ReleaseBufferClaimToken = 'agx' | 'gagx'

/**
 * 领取缓冲池：对该币 CTA 门闸后，只领当前 50 条窗。
 *
 * 窗内可含 AGX/gAGX；成功后刷新再点领下一窗。
 *
 * @see 手册 §13.4 claimMany
 */
export async function submitReleaseBufferClaim(args: {
  session: WriteSession
  token: ReleaseBufferClaimToken
}): Promise<void> {
  const { session, token } = args
  const { wallet, address } = session

  const pre = await readReleaseBufferSnapshot(address)
  const preClaimable = token === 'agx' ? pre.agx.pageClaimable : pre.gagx.pageClaimable
  const preErr = gateError(
    releaseClaimBlockReason({
      claimable: preClaimable,
    }),
  )
  if (preErr) throw preErr

  const live = await readReleaseBufferSnapshot(address)
  const liveClaimable = token === 'agx' ? live.agx.pageClaimable : live.gagx.pageClaimable
  const liveErr = gateError(
    releaseClaimBlockReason({
      claimable: liveClaimable,
    }),
  )
  if (liveErr) throw liveErr
  if (liveClaimable <= 0n) throw RELEASE_BLOCKED.zeroAmount

  await assertReleaseWritesAllowed(address)

  const target = pickBufferFirstClaim({
    chain: live.chain,
  })
  if (!target) throw RELEASE_BLOCKED.zeroAmount

  await writeClaimManyReleases({
    wallet,
    splitter: target.splitter as Address,
    start: target.start,
    limit: target.limit,
  })
  invalidateAfterReleaseClaim()
}
