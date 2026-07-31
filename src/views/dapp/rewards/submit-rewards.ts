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
import { DAO_REWARD_SIGN_TYPE, type DaoRewardType } from '~/shared/api/types'
import { REWARDS_GATE_ERROR } from '~/web3/errors/rewards-write-gate-errors'
import { WALLET_GATE_ERROR } from '~/web3/resolve-contract-error-message'
import { invalidateAfterTeamClaim } from '~/shared/api/query/invalidate'
import type { WriteSession } from '~/web3/wallet/require-write-session'

export { REWARDS_GATE_ERROR } from '~/web3/errors/rewards-write-gate-errors'

function gateError(
  reason: keyof typeof REWARDS_GATE_ERROR | null,
): (typeof REWARDS_GATE_ERROR)[keyof typeof REWARDS_GATE_ERROR] | null {
  if (!reason) return null
  return REWARDS_GATE_ERROR[reason]
}

function mapMixedReason(
  reason: ReturnType<typeof evaluateRewardsMixedClaimGate>,
): keyof typeof REWARDS_GATE_ERROR | null {
  if (reason === 'notClaimable') return 'luckyNotClaimable'
  return reason
}

/** Domain write only — soft gates throw sentinels. Envelope lives in `useChainMutation`. */
export async function submitLuckyMixedClaim(args: {
  session: WriteSession
  releaseDays: ReleaseDurationDays
  restakeDays: RestakeDurationDays
  restakePct: number
}): Promise<void> {
  const { session, releaseDays, restakeDays, restakePct } = args
  const { wallet, address: user, readClient } = session
  const restakeBps = restakeBpsFromPct(restakePct)

  const snapshot = await readLuckyClaimSnapshot(user, readClient)
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

  const live = await readLuckyClaimSnapshot(user, readClient)
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
  invalidateAfterTeamClaim()
}

/** Domain write only — soft gates throw sentinels. Envelope lives in `useChainMutation`. */
export async function submitDaoMixedClaim(args: {
  session: WriteSession
  token: string
  onUnauthorized: () => void
  rewardType: DaoRewardType
  releaseDays: ReleaseDurationDays
  restakeDays: RestakeDurationDays
  restakePct: number
}): Promise<void> {
  const { session, token, onUnauthorized, rewardType, releaseDays, restakeDays, restakePct } = args
  if (!token) {
    throw WALLET_GATE_ERROR.NOT_CONNECTED
  }
  const { wallet, address: user, readClient } = session
  const restakeBps = restakeBpsFromPct(restakePct)

  const payload = await requestWithSession(
    (sessionToken) => requestDaoClaim(sessionToken, rewardType),
    token,
    onUnauthorized,
  )
  const normalized = parseTeamRewardClaim(payload)
  if (normalized.expireTime <= BigInt(Math.floor(Date.now() / 1000))) {
    throw REWARDS_GATE_ERROR.signatureExpired
  }
  if (normalized.signType !== DAO_REWARD_SIGN_TYPE[rewardType]) {
    throw REWARDS_GATE_ERROR.unavailable
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
  invalidateAfterTeamClaim()
}
