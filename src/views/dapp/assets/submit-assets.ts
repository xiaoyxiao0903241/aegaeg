import type { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { WALLET_GATE_ERROR } from '~/web3/resolve-contract-error-message'
import { invalidateAfterAssetsClaim } from '~/shared/api/query/invalidate'
import {
  evaluateRedeemGate,
  evaluateXmineClaimGate,
  evaluateXmineUnstakeGate,
} from '~/core/assets/assets-gates'
import { dualGateMixedClaim } from '~/core/assets/dual-gate-mixed-claim'
import {
  matchPlanIndexByDurationDays,
  restakeBpsFromPct,
  type ReleaseDurationDays,
  type RestakeDurationDays,
} from '~/core/assets/claim-plans'
import {
  readBondRedeemableAmount,
  readClaimPlans,
  readContributionSnapshot,
  readMixedRewardAvailable,
  readStakeRedeemableAmount,
  readXminePosition,
  type AssetsBondRow,
  type AssetsStakeRow,
} from '~/web3/assets/assets-read'
import {
  writeBondClaimMixed,
  writeBondRedeem,
  writeLiquidClaimMixed,
  writeLiquidClaimPrincipal,
  writeLockedClaimMixed,
  writeLockedClaimPrincipal,
  writeXmineClaimReward,
  writeXmineStartUnstake,
} from '~/web3/assets/assets-write'
import { isUnknownSubmitOutcome } from '~/web3/wallet/wallet-submit-unknown-error'
import { runUnknownGuardedWrite } from '~/web3/wallet/run-unknown-guarded-write'
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

export const ASSETS_GATE_ERROR = {
  zeroAmount: 'ASSETS_ZERO_AMOUNT',
  insufficientReward: 'ASSETS_INSUFFICIENT_REWARD',
  insufficientContribution: 'ASSETS_INSUFFICIENT_CONTRIBUTION',
  releasePlanUnresolved: 'ASSETS_RELEASE_PLAN_UNRESOLVED',
  restakePlanUnresolved: 'ASSETS_RESTAKE_PLAN_UNRESOLVED',
  nothingToRedeem: 'ASSETS_NOTHING_TO_REDEEM',
  warmupActive: 'ASSETS_WARMUP_ACTIVE',
  unavailable: 'ASSETS_UNAVAILABLE',
} as const

function gateError(
  reason: keyof typeof ASSETS_GATE_ERROR | null,
): (typeof ASSETS_GATE_ERROR)[keyof typeof ASSETS_GATE_ERROR] | null {
  if (!reason) return null
  return ASSETS_GATE_ERROR[reason]
}

export type MixedClaimTarget =
  | { source: 'liquid'; amount: bigint }
  | {
      source: 'locked'
      pool: Address
      stakeIndex: number
      amount: bigint
      extra?: boolean
    }
  | {
      source: 'bond'
      depository: Address
      bondIndex: number
      amount: bigint
    }

async function readMixedClaimSnapshot(
  target: MixedClaimTarget,
  user: Address,
  amount: bigint,
  releaseDays: ReleaseDurationDays,
  restakeDays: RestakeDurationDays,
  readClient: ChainReadClient,
) {
  const plans = await readClaimPlans(readClient)
  const releasePlanIndex = matchPlanIndexByDurationDays(plans.releasePlans, releaseDays)
  const restakePlanIndex = matchPlanIndexByDurationDays(plans.restakePlans, restakeDays)
  const [rewardAvailable, contrib] = await Promise.all([
    readMixedRewardAvailable(target, user, readClient),
    readContributionSnapshot(user, amount, readClient),
  ])
  return {
    rewardAvailable,
    contribution: contrib.contribution,
    requiredContribution: contrib.requiredContribution,
    releasePlanIndex,
    restakePlanIndex,
  }
}

export async function submitMixedClaim(args: {
  target: MixedClaimTarget
  releaseDays: ReleaseDurationDays
  restakeDays: RestakeDurationDays
  restakePct: number
  account: ActiveAccount
  wallet: ActiveWallet
  readClient: ChainReadClient
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { target, releaseDays, restakeDays, restakePct, account, wallet, readClient } = args
  if (!account || !wallet) {
    return { ok: false, error: WALLET_GATE_ERROR.NOT_CONNECTED }
  }

  const amount = target.amount
  const restakeBps = restakeBpsFromPct(restakePct)
  const user = account.address as Address

  const guarded = await runUnknownGuardedWrite({
    path: WRITE_PATH.ASSETS_CLAIM,
    lockedError: ASSETS_GATE_ERROR.unavailable,
    run: async () => {
      const intent = await readMixedClaimSnapshot(
        target,
        user,
        amount,
        releaseDays,
        restakeDays,
        readClient,
      )
      const live = await readMixedClaimSnapshot(
        target,
        user,
        amount,
        releaseDays,
        restakeDays,
        readClient,
      )
      const dual = dualGateMixedClaim({ amount, intent, live })
      if (!dual.ok) {
        const mapped = gateError(dual.fail.reason)
        throw mapped ?? ASSETS_GATE_ERROR.unavailable
      }

      const { releasePlanIndex, restakePlanIndex } = dual.ready
      if (target.source === 'liquid') {
        await writeLiquidClaimMixed({
          wallet,
          releasePlanIndex,
          amount,
          restakePlanIndex,
          restakeBps,
        })
      } else if (target.source === 'locked') {
        await writeLockedClaimMixed({
          wallet,
          pool: target.pool,
          stakeIndex: target.stakeIndex,
          amount,
          releasePlanIndex,
          restakePlanIndex,
          restakeBps,
          extra: target.extra,
        })
      } else {
        await writeBondClaimMixed({
          wallet,
          depository: target.depository,
          recipient: account.address as Address,
          amount,
          releasePlanIndex,
          bondIndex: target.bondIndex,
          restakePlanIndex,
          restakeBps,
        })
      }
    },
  })

  if (!guarded.ok) {
    return { ok: false, error: guarded.error }
  }
  invalidateAfterAssetsClaim()
  return { ok: true }
}

export async function submitStakeRedeem(args: {
  row: AssetsStakeRow
  account: ActiveAccount
  wallet: ActiveWallet
  readClient: ChainReadClient
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { row, account, wallet, readClient } = args
  if (!account || !wallet) {
    return { ok: false, error: WALLET_GATE_ERROR.NOT_CONNECTED }
  }
  if (isUnknownReceiptLocked(WRITE_PATH.ASSETS_CLAIM)) {
    return { ok: false, error: ASSETS_GATE_ERROR.unavailable }
  }

  const user = account.address as Address
  try {
    const liveAmount = await readStakeRedeemableAmount(row, user, readClient)
    const gate = evaluateRedeemGate({ amount: liveAmount })
    if (gate) return { ok: false, error: ASSETS_GATE_ERROR[gate] }

    if (row.kind === 'liquid') {
      await writeLiquidClaimPrincipal({ wallet, amount: liveAmount })
    } else {
      if (row.stakeIndex == null) return { ok: false, error: ASSETS_GATE_ERROR.nothingToRedeem }
      await writeLockedClaimPrincipal({
        wallet,
        pool: row.pool,
        stakeIndex: row.stakeIndex,
      })
    }
    clearUnknownReceiptLock(WRITE_PATH.ASSETS_CLAIM)
    invalidateAfterAssetsClaim()
    return { ok: true }
  } catch (caught) {
    if (isUnknownSubmitOutcome(caught)) {
      lockUnknownReceipt(WRITE_PATH.ASSETS_CLAIM)
    }
    return { ok: false, error: caught }
  }
}

export async function submitBondRedeem(args: {
  row: AssetsBondRow
  account: ActiveAccount
  wallet: ActiveWallet
  readClient: ChainReadClient
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { row, account, wallet, readClient } = args
  if (!account || !wallet) {
    return { ok: false, error: WALLET_GATE_ERROR.NOT_CONNECTED }
  }
  if (isUnknownReceiptLocked(WRITE_PATH.ASSETS_CLAIM)) {
    return { ok: false, error: ASSETS_GATE_ERROR.unavailable }
  }

  const user = account.address as Address
  try {
    const liveAmount = await readBondRedeemableAmount(row, user, readClient)
    const gate = evaluateRedeemGate({ amount: liveAmount })
    if (gate) return { ok: false, error: ASSETS_GATE_ERROR[gate] }

    await writeBondRedeem({
      wallet,
      depository: row.depository,
      recipient: user,
      bondIndex: row.bondIndex,
    })
    clearUnknownReceiptLock(WRITE_PATH.ASSETS_CLAIM)
    invalidateAfterAssetsClaim()
    return { ok: true }
  } catch (caught) {
    if (isUnknownSubmitOutcome(caught)) {
      lockUnknownReceipt(WRITE_PATH.ASSETS_CLAIM)
    }
    return { ok: false, error: caught }
  }
}

export async function submitXmineClaim(args: {
  account: ActiveAccount
  wallet: ActiveWallet
  readClient: ChainReadClient
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { account, wallet, readClient } = args
  if (!account || !wallet) {
    return { ok: false, error: WALLET_GATE_ERROR.NOT_CONNECTED }
  }
  if (isUnknownReceiptLocked(WRITE_PATH.ASSETS_CLAIM)) {
    return { ok: false, error: ASSETS_GATE_ERROR.unavailable }
  }

  try {
    const pre = await readXminePosition(account.address as Address, readClient)
    const preGate = evaluateXmineClaimGate({
      pending: pre.pending,
      warmupGons: pre.warmupGons,
    })
    if (preGate) return { ok: false, error: ASSETS_GATE_ERROR[preGate] }

    const live = await readXminePosition(account.address as Address, readClient)
    const liveGate = evaluateXmineClaimGate({
      pending: live.pending,
      warmupGons: live.warmupGons,
    })
    if (liveGate) return { ok: false, error: ASSETS_GATE_ERROR[liveGate] }

    await writeXmineClaimReward({ wallet })
    clearUnknownReceiptLock(WRITE_PATH.ASSETS_CLAIM)
    invalidateAfterAssetsClaim()
    return { ok: true }
  } catch (caught) {
    if (isUnknownSubmitOutcome(caught)) {
      lockUnknownReceipt(WRITE_PATH.ASSETS_CLAIM)
    }
    return { ok: false, error: caught }
  }
}

export async function submitXmineUnstake(args: {
  account: ActiveAccount
  wallet: ActiveWallet
  readClient: ChainReadClient
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { account, wallet, readClient } = args
  if (!account || !wallet) {
    return { ok: false, error: WALLET_GATE_ERROR.NOT_CONNECTED }
  }
  if (isUnknownReceiptLocked(WRITE_PATH.ASSETS_CLAIM)) {
    return { ok: false, error: ASSETS_GATE_ERROR.unavailable }
  }

  try {
    const pre = await readXminePosition(account.address as Address, readClient)
    const preGate = evaluateXmineUnstakeGate({
      activeGons: pre.gons,
      warmupGons: pre.warmupGons,
    })
    if (preGate) return { ok: false, error: ASSETS_GATE_ERROR[preGate] }

    const live = await readXminePosition(account.address as Address, readClient)
    const liveGate = evaluateXmineUnstakeGate({
      activeGons: live.gons,
      warmupGons: live.warmupGons,
    })
    if (liveGate) return { ok: false, error: ASSETS_GATE_ERROR[liveGate] }

    await writeXmineStartUnstake({ wallet })
    clearUnknownReceiptLock(WRITE_PATH.ASSETS_CLAIM)
    invalidateAfterAssetsClaim()
    return { ok: true }
  } catch (caught) {
    if (isUnknownSubmitOutcome(caught)) {
      lockUnknownReceipt(WRITE_PATH.ASSETS_CLAIM)
    }
    return { ok: false, error: caught }
  }
}
