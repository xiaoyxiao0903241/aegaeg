import { releaseClaimBlockReason } from '~/core/release/release-gates'
import { invalidateAfterReleaseClaim } from '~/shared/api/query/invalidate'
import { RELEASE_GATE_ERROR } from '~/web3/errors/release-write-gate-errors'
import { readReleaseBufferSnapshot, readReleaseQueueSnapshot } from '~/web3/release/release-read'
import { writeClaimAllVestedRewards, writeClaimManyReleases } from '~/web3/release/release-write'
import type { WriteSession } from '~/web3/wallet/require-write-session'

function gateError(
  reason: 'zeroAmount' | 'lockedUnknown' | null,
): (typeof RELEASE_GATE_ERROR)[keyof typeof RELEASE_GATE_ERROR] | null {
  if (!reason) return null
  return RELEASE_GATE_ERROR[reason]
}

/** Domain write only — soft gates throw sentinels. Envelope lives in `useChainMutation`. */
export async function submitReleaseQueueClaim(args: {
  session: WriteSession
  planIndex: number
}): Promise<void> {
  const { session, planIndex } = args
  const { wallet, address, readClient } = session
  if (planIndex < 0) {
    throw RELEASE_GATE_ERROR.planUnresolved
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

/** Domain write only — soft gates throw sentinels. Envelope lives in `useChainMutation`. */
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
  if (live.count <= 0) throw RELEASE_GATE_ERROR.zeroAmount

  await writeClaimManyReleases({ wallet, start: 0, limit: live.count })
  invalidateAfterReleaseClaim()
}
