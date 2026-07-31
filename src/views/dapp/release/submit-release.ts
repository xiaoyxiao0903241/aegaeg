import type { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { WALLET_GATE_ERROR } from '~/web3/resolve-contract-error-message'
import { invalidateAfterReleaseClaim } from '~/shared/api/query/invalidate'
import { releaseClaimBlockReason } from '~/core/release/release-gates'
import { readReleaseBufferSnapshot, readReleaseQueueSnapshot } from '~/web3/release/release-read'
import { writeClaimAllVestedRewards, writeClaimManyReleases } from '~/web3/release/release-write'
import { runUnknownGuardedWrite } from '~/web3/wallet/run-unknown-guarded-write'
import { WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'
import type { ChainReadClient } from '~/web3/chain-read-client'
import type { Address } from '~/shared/config/contracts'

type ActiveAccount = ReturnType<typeof useActiveAccount>
type ActiveWallet = ReturnType<typeof useActiveWallet>

export const RELEASE_GATE_ERROR = {
  zeroAmount: 'RELEASE_ZERO_AMOUNT',
  lockedUnknown: 'RELEASE_LOCKED_UNKNOWN',
  planUnresolved: 'RELEASE_PLAN_UNRESOLVED',
  unavailable: 'RELEASE_UNAVAILABLE',
} as const

function gateError(
  reason: 'zeroAmount' | 'lockedUnknown' | null,
): (typeof RELEASE_GATE_ERROR)[keyof typeof RELEASE_GATE_ERROR] | null {
  if (!reason) return null
  return RELEASE_GATE_ERROR[reason]
}

function mapGuardedError(error: unknown): string {
  if (typeof error === 'string') return error
  if (error instanceof Error && error.message) return error.message
  return RELEASE_GATE_ERROR.unavailable
}

export async function submitReleaseQueueClaim(args: {
  account: ActiveAccount
  wallet: ActiveWallet
  readClient: ChainReadClient
  planIndex: number
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const { account, wallet, readClient, planIndex } = args
  if (!account?.address || !wallet) {
    return { ok: false, error: WALLET_GATE_ERROR.NOT_CONNECTED }
  }
  if (planIndex < 0) {
    return { ok: false, error: RELEASE_GATE_ERROR.planUnresolved }
  }

  const address = account.address as Address
  const guarded = await runUnknownGuardedWrite({
    path: WRITE_PATH.RELEASE_CLAIM,
    lockedError: RELEASE_GATE_ERROR.lockedUnknown,
    run: async () => {
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
    },
  })

  if (!guarded.ok) {
    return { ok: false, error: mapGuardedError(guarded.error) }
  }
  invalidateAfterReleaseClaim()
  return { ok: true }
}

export async function submitReleaseBufferClaim(args: {
  account: ActiveAccount
  wallet: ActiveWallet
  readClient: ChainReadClient
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const { account, wallet, readClient } = args
  if (!account?.address || !wallet) {
    return { ok: false, error: WALLET_GATE_ERROR.NOT_CONNECTED }
  }

  const address = account.address as Address
  const guarded = await runUnknownGuardedWrite({
    path: WRITE_PATH.RELEASE_CLAIM,
    lockedError: RELEASE_GATE_ERROR.lockedUnknown,
    run: async () => {
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
    },
  })

  if (!guarded.ok) {
    return { ok: false, error: mapGuardedError(guarded.error) }
  }
  invalidateAfterReleaseClaim()
  return { ok: true }
}
