import type { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { WALLET_GATE_ERROR } from '~/web3/resolve-contract-error-message'
import { invalidateAfterReleaseClaim } from '~/shared/api/query/invalidate'
import {
  evaluateReleaseBufferClaimGate,
  evaluateReleaseQueueClaimGate,
} from '~/core/release/release-gates'
import { readReleaseBufferSnapshot, readReleaseQueueSnapshot } from '~/web3/release/release-read'
import { writeClaimAllVestedRewards, writeClaimManyReleases } from '~/web3/release/release-write'
import { isUnknownSubmitOutcome } from '~/web3/wallet/wallet-submit-unknown-error'
import {
  WRITE_PATH,
  clearUnknownReceiptLock,
  isUnknownReceiptLocked,
  lockUnknownReceipt,
} from '~/web3/wallet/unknown-receipt-lock'
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
  if (isUnknownReceiptLocked(WRITE_PATH.RELEASE_CLAIM)) {
    return { ok: false, error: RELEASE_GATE_ERROR.lockedUnknown }
  }

  const address = account.address as Address
  const pre = await readReleaseQueueSnapshot(address, readClient)
  const preRow = pre.plans.find((row) => row.planIndex === planIndex)
  const preGate = evaluateReleaseQueueClaimGate({
    claimable: preRow?.claimable ?? 0n,
    unknownLocked: false,
  })
  const preErr = gateError(preGate)
  if (preErr) return { ok: false, error: preErr }

  try {
    const live = await readReleaseQueueSnapshot(address, readClient)
    const liveRow = live.plans.find((row) => row.planIndex === planIndex)
    const liveGate = evaluateReleaseQueueClaimGate({
      claimable: liveRow?.claimable ?? 0n,
      unknownLocked: isUnknownReceiptLocked(WRITE_PATH.RELEASE_CLAIM),
    })
    const liveErr = gateError(liveGate)
    if (liveErr) return { ok: false, error: liveErr }

    await writeClaimAllVestedRewards({ wallet, planIndex })
    clearUnknownReceiptLock(WRITE_PATH.RELEASE_CLAIM)
    invalidateAfterReleaseClaim()
    return { ok: true }
  } catch (error) {
    if (isUnknownSubmitOutcome(error)) {
      lockUnknownReceipt(WRITE_PATH.RELEASE_CLAIM)
    }
    return {
      ok: false,
      error: error instanceof Error ? error.message : RELEASE_GATE_ERROR.unavailable,
    }
  }
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
  if (isUnknownReceiptLocked(WRITE_PATH.RELEASE_CLAIM)) {
    return { ok: false, error: RELEASE_GATE_ERROR.lockedUnknown }
  }

  const address = account.address as Address
  const pre = await readReleaseBufferSnapshot(address, readClient)
  const preGate = evaluateReleaseBufferClaimGate({
    claimable: pre.totalClaimable,
    unknownLocked: false,
  })
  const preErr = gateError(preGate)
  if (preErr) return { ok: false, error: preErr }

  try {
    const live = await readReleaseBufferSnapshot(address, readClient)
    const liveGate = evaluateReleaseBufferClaimGate({
      claimable: live.totalClaimable,
      unknownLocked: isUnknownReceiptLocked(WRITE_PATH.RELEASE_CLAIM),
    })
    const liveErr = gateError(liveGate)
    if (liveErr) return { ok: false, error: liveErr }
    if (live.count <= 0) return { ok: false, error: RELEASE_GATE_ERROR.zeroAmount }

    await writeClaimManyReleases({ wallet, start: 0, limit: live.count })
    clearUnknownReceiptLock(WRITE_PATH.RELEASE_CLAIM)
    invalidateAfterReleaseClaim()
    return { ok: true }
  } catch (error) {
    if (isUnknownSubmitOutcome(error)) {
      lockUnknownReceipt(WRITE_PATH.RELEASE_CLAIM)
    }
    return {
      ok: false,
      error: error instanceof Error ? error.message : RELEASE_GATE_ERROR.unavailable,
    }
  }
}
