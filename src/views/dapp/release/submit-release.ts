import { releaseClaimBlockReason } from '~/core/release/release-block-reasons'
import { invalidateAfterReleaseClaim } from '~/shared/api/query/invalidate'
import { RELEASE_BLOCKED } from '~/web3/errors/write-block-errors'
import { readReleaseBufferSnapshot, readReleaseQueueSnapshot } from '~/web3/release/release-read'
import { writeClaimAllVestedRewards, writeClaimManyReleases } from '~/web3/release/release-write'
import type { WriteSession } from '~/web3/wallet/require-write-session'

function gateError(
  reason: 'zeroAmount' | 'lockedUnknown' | null,
): (typeof RELEASE_BLOCKED)[keyof typeof RELEASE_BLOCKED] | null {
  if (!reason) return null
  return RELEASE_BLOCKED[reason]
}

/**
 * 领取释放队列：只做领域层写操作
 *
 * 写前先读快照做门闸检查，再读一次确认；不通过则抛错中断。
 *
 * @param args.session 已就绪的写会话
 * @param args.planIndex 要领取的天数档位
 * @see docs/onchain-manual/contracts/principalreleasevault.md
 */
export async function submitReleaseQueueClaim(args: {
  session: WriteSession
  planIndex: number
}): Promise<void> {
  const { session, planIndex } = args
  const { wallet, address, readClient } = session
  if (planIndex < 0) {
    throw RELEASE_BLOCKED.planUnresolved
  }

  const pre = await readReleaseQueueSnapshot(address, readClient)
  const preRow = pre.plans.find((row) => row.planIndex === planIndex)
  const preErr = gateError(
    releaseClaimBlockReason({
      claimable: preRow?.claimable ?? 0n,
      unknownLocked: false,
    }),
  )
  if (preErr) throw preErr

  const live = await readReleaseQueueSnapshot(address, readClient)
  const liveRow = live.plans.find((row) => row.planIndex === planIndex)
  const liveErr = gateError(
    releaseClaimBlockReason({
      claimable: liveRow?.claimable ?? 0n,
      unknownLocked: false,
    }),
  )
  if (liveErr) throw liveErr

  await writeClaimAllVestedRewards({ wallet, planIndex })
  invalidateAfterReleaseClaim()
}

/**
 * 领取缓冲池：只做领域层写操作
 *
 * 写前对快照做两轮门闸检查，不通过即抛错中断。
 *
 * @param args.session 已就绪的写会话
 * @see docs/onchain-manual/contracts/principalreleasevault.md
 */
export async function submitReleaseBufferClaim(args: { session: WriteSession }): Promise<void> {
  const { session } = args
  const { wallet, address, readClient } = session

  const pre = await readReleaseBufferSnapshot(address, readClient)
  const preErr = gateError(
    releaseClaimBlockReason({
      claimable: pre.totalClaimable,
      unknownLocked: false,
    }),
  )
  if (preErr) throw preErr

  const live = await readReleaseBufferSnapshot(address, readClient)
  const liveErr = gateError(
    releaseClaimBlockReason({
      claimable: live.totalClaimable,
      unknownLocked: false,
    }),
  )
  if (liveErr) throw liveErr
  if (live.count <= 0) throw RELEASE_BLOCKED.zeroAmount

  await writeClaimManyReleases({ wallet, start: 0, limit: live.count })
  invalidateAfterReleaseClaim()
}
