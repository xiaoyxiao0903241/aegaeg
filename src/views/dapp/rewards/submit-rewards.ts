import type { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { WALLET_GATE_ERROR } from '~/web3/resolve-contract-error-message'
import { invalidateAfterTeamClaim } from '~/shared/api/query/invalidate'
import { evaluateRewardsMixedClaimGate } from '~/core/rewards/rewards-gates'
import {
  matchPlanIndexByDurationDays,
  restakeBpsFromPct,
  type ReleaseDurationDays,
  type RestakeDurationDays,
} from '~/core/assets/claim-plans'
import { readClaimPlans, readContributionSnapshot } from '~/web3/assets/assets-read'
import { readDaoPoolRewardAvailable, readLuckyClaimSnapshot } from '~/web3/rewards/rewards-read'
import { writeDaoMixedClaim, writeLuckyMixedClaim } from '~/web3/rewards/rewards-write'
import { requestDaoClaim } from '~/shared/api/endpoints'
import { requestWithSession } from '~/shared/api/query/session-request'
import { parseTeamRewardClaim } from '~/shared/api/parse-team-reward-claim'
import { CLAIM_SIGNATURE_EXPIRED } from '~/web3/resolve-contract-error-message'
import { submitWithUnknownReceiptLock } from '~/web3/wallet/submit-with-unknown-receipt-lock'
import { WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'
import type { ChainReadClient } from '~/web3/chain-read-client'
import type { Address } from '~/shared/config/contracts'

type ActiveAccount = ReturnType<typeof useActiveAccount>
type ActiveWallet = ReturnType<typeof useActiveWallet>

export const REWARDS_GATE_ERROR = {
  zeroAmount: 'REWARDS_ZERO_AMOUNT',
  insufficientReward: 'REWARDS_INSUFFICIENT_REWARD',
  insufficientContribution: 'REWARDS_INSUFFICIENT_CONTRIBUTION',
  releasePlanUnresolved: 'REWARDS_RELEASE_PLAN_UNRESOLVED',
  restakePlanUnresolved: 'REWARDS_RESTAKE_PLAN_UNRESOLVED',
  luckyPaused: 'REWARDS_LUCKY_PAUSED',
  luckyNotClaimable: 'REWARDS_LUCKY_NOT_CLAIMABLE',
  unavailable: 'REWARDS_UNAVAILABLE',
  signatureExpired: CLAIM_SIGNATURE_EXPIRED,
} as const

function gateError(
  reason: keyof typeof REWARDS_GATE_ERROR | null,
): (typeof REWARDS_GATE_ERROR)[keyof typeof REWARDS_GATE_ERROR] | null {
  if (!reason) return null
  if (reason === 'signatureExpired') return REWARDS_GATE_ERROR.signatureExpired
  return REWARDS_GATE_ERROR[reason]
}

function mapMixedReason(
  reason: ReturnType<typeof evaluateRewardsMixedClaimGate>,
): keyof typeof REWARDS_GATE_ERROR | null {
  if (reason === 'notClaimable') return 'luckyNotClaimable'
  return reason
}

export async function submitLuckyMixedClaim(args: {
  releaseDays: ReleaseDurationDays
  restakeDays: RestakeDurationDays
  restakePct: number
  account: ActiveAccount
  wallet: ActiveWallet
  readClient: ChainReadClient
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { releaseDays, restakeDays, restakePct, account, wallet, readClient } = args
  if (!account || !wallet) {
    return { ok: false, error: WALLET_GATE_ERROR.NOT_CONNECTED }
  }

  const user = account.address as Address
  const restakeBps = restakeBpsFromPct(restakePct)

  const guarded = await submitWithUnknownReceiptLock({
    path: WRITE_PATH.REWARD_CLAIM,
    whenLocked: REWARDS_GATE_ERROR.unavailable,
    run: async () => {
      const snapshot = await readLuckyClaimSnapshot(readClient, user)
      // Intent from first read; live gate must compare against a second chain read (never self-certify).
      const amount = snapshot.rewardAmount
      const plans = await readClaimPlans(readClient)
      const releasePlanIndex = matchPlanIndexByDurationDays(plans.releasePlans, releaseDays)
      const restakePlanIndex = matchPlanIndexByDurationDays(plans.restakePlans, restakeDays)
      const contrib = await readContributionSnapshot(user, amount, readClient)

      const preGate = evaluateRewardsMixedClaimGate({
        amount,
        rewardAvailable: snapshot.rewardAmount,
        contribution: contrib.contribution,
        requiredContribution: contrib.requiredContribution,
        releasePlanIndex,
        restakePlanIndex,
        luckyPaused: snapshot.paused,
        luckyClaimable: snapshot.claimable,
      })
      const preErr = gateError(mapMixedReason(preGate))
      if (preErr) throw preErr

      const live = await readLuckyClaimSnapshot(readClient, user)
      const livePlans = await readClaimPlans(readClient)
      const liveRelease = matchPlanIndexByDurationDays(livePlans.releasePlans, releaseDays)
      const liveRestake = matchPlanIndexByDurationDays(livePlans.restakePlans, restakeDays)
      const liveContrib = await readContributionSnapshot(user, amount, readClient)
      const liveGate = evaluateRewardsMixedClaimGate({
        amount,
        rewardAvailable: live.rewardAmount,
        contribution: liveContrib.contribution,
        requiredContribution: liveContrib.requiredContribution,
        releasePlanIndex: liveRelease,
        restakePlanIndex: liveRestake,
        luckyPaused: live.paused,
        luckyClaimable: live.claimable,
      })
      const liveErr = gateError(mapMixedReason(liveGate))
      if (liveErr) throw liveErr
      if (liveRelease == null || liveRestake == null) {
        throw REWARDS_GATE_ERROR.releasePlanUnresolved
      }

      await writeLuckyMixedClaim({
        wallet,
        roundId: live.roundId,
        releasePlanIndex: liveRelease,
        restakePlanIndex: liveRestake,
        restakeBps,
      })
    },
  })

  if (!guarded.ok) {
    return { ok: false, error: guarded.error }
  }
  invalidateAfterTeamClaim()
  return { ok: true }
}

export async function submitDaoMixedClaim(args: {
  token: string
  onUnauthorized: () => void
  releaseDays: ReleaseDurationDays
  restakeDays: RestakeDurationDays
  restakePct: number
  account: ActiveAccount
  wallet: ActiveWallet
  readClient: ChainReadClient
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const {
    token,
    onUnauthorized,
    releaseDays,
    restakeDays,
    restakePct,
    account,
    wallet,
    readClient,
  } = args
  if (!account || !wallet || !token) {
    return { ok: false, error: WALLET_GATE_ERROR.NOT_CONNECTED }
  }

  const user = account.address as Address
  const restakeBps = restakeBpsFromPct(restakePct)

  const guarded = await submitWithUnknownReceiptLock({
    path: WRITE_PATH.REWARD_CLAIM,
    whenLocked: REWARDS_GATE_ERROR.unavailable,
    run: async () => {
      const payload = await requestWithSession(requestDaoClaim, token, onUnauthorized)
      const normalized = parseTeamRewardClaim(payload)
      if (normalized.expireTime <= BigInt(Math.floor(Date.now() / 1000))) {
        throw REWARDS_GATE_ERROR.signatureExpired
      }
      const amount = normalized.amountWei

      const plans = await readClaimPlans(readClient)
      const releasePlanIndex = matchPlanIndexByDurationDays(plans.releasePlans, releaseDays)
      const restakePlanIndex = matchPlanIndexByDurationDays(plans.restakePlans, restakeDays)
      const [rewardAvailable, contrib] = await Promise.all([
        readDaoPoolRewardAvailable(readClient),
        readContributionSnapshot(user, amount, readClient),
      ])
      const preGate = evaluateRewardsMixedClaimGate({
        amount,
        rewardAvailable,
        contribution: contrib.contribution,
        requiredContribution: contrib.requiredContribution,
        releasePlanIndex,
        restakePlanIndex,
      })
      const preErr = gateError(mapMixedReason(preGate))
      if (preErr) throw preErr

      // Live: re-read DaoPool AGX solvency + contribution + plans (never signature-self-certify).
      const livePlans = await readClaimPlans(readClient)
      const liveRelease = matchPlanIndexByDurationDays(livePlans.releasePlans, releaseDays)
      const liveRestake = matchPlanIndexByDurationDays(livePlans.restakePlans, restakeDays)
      const [liveReward, liveContrib] = await Promise.all([
        readDaoPoolRewardAvailable(readClient),
        readContributionSnapshot(user, amount, readClient),
      ])
      const liveGate = evaluateRewardsMixedClaimGate({
        amount,
        rewardAvailable: liveReward,
        contribution: liveContrib.contribution,
        requiredContribution: liveContrib.requiredContribution,
        releasePlanIndex: liveRelease,
        restakePlanIndex: liveRestake,
      })
      const liveErr = gateError(mapMixedReason(liveGate))
      if (liveErr) throw liveErr
      if (liveRelease == null || liveRestake == null) {
        throw REWARDS_GATE_ERROR.releasePlanUnresolved
      }

      await writeDaoMixedClaim({
        wallet,
        signType: normalized.signType,
        amount,
        expireTime: normalized.expireTime,
        salt: normalized.salt,
        signature: normalized.signature,
        releasePlanIndex: liveRelease,
        restakePlanIndex: liveRestake,
        restakeBps,
      })
    },
  })

  if (!guarded.ok) {
    return { ok: false, error: guarded.error }
  }
  invalidateAfterTeamClaim()
  return { ok: true }
}
