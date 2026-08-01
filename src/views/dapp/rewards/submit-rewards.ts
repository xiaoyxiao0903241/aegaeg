import {
  matchClaimPlanIndices,
  type ReleaseDurationDays,
  restakeBpsFromPct,
  type RestakeDurationDays,
} from '~/core/assets/claim-plans'
import { evaluateRewardsMixedClaim } from '~/core/rewards/rewards-block-reasons'
import { requestDaoClaim } from '~/shared/api/endpoints'
import { parseTeamRewardClaim } from '~/shared/api/parse-team-reward-claim'
import { invalidateAfterTeamClaim } from '~/shared/api/query/invalidate'
import { requestWithSession } from '~/shared/api/query/session-request'
import { DAO_REWARD_SIGN_TYPE, type DaoRewardType } from '~/shared/api/types'
import { readClaimPlans, readContributionSnapshot } from '~/web3/assets/assets-read'
import { WALLET_BLOCKED } from '~/web3/contract-error-message'
import { REWARDS_BLOCKED } from '~/web3/errors/write-block-errors'
import { readDaoPoolRewardAvailable, readLuckyClaimSnapshot } from '~/web3/rewards/rewards-read'
import { writeDaoMixedClaim, writeLuckyMixedClaim } from '~/web3/rewards/rewards-write'
import type { WriteSession } from '~/web3/wallet/require-write-session'

export { REWARDS_BLOCKED } from '~/web3/errors/write-block-errors'

function gateError(
  reason: keyof typeof REWARDS_BLOCKED | null,
): (typeof REWARDS_BLOCKED)[keyof typeof REWARDS_BLOCKED] | null {
  if (!reason) return null
  return REWARDS_BLOCKED[reason]
}

function mapMixedReason(
  reason: ReturnType<typeof evaluateRewardsMixedClaim>,
): keyof typeof REWARDS_BLOCKED | null {
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
  // Intent from first read; live check must compare against a second chain read (never self-certify).
  const amount = snapshot.rewardAmount
  const plans = await readClaimPlans(readClient)
  const { releaseIndex: releasePlanIndex, restakeIndex: restakePlanIndex } = matchClaimPlanIndices(
    plans,
    releaseDays,
    restakeDays,
  )
  const contrib = await readContributionSnapshot(user, amount, readClient)

  const preBlock = evaluateRewardsMixedClaim({
    amount,
    rewardAvailable: snapshot.rewardAmount,
    contribution: contrib.contribution,
    requiredContribution: contrib.requiredContribution,
    releasePlanIndex,
    restakePlanIndex,
    luckyPaused: snapshot.paused,
    luckyClaimable: snapshot.claimable,
  })
  const preErr = gateError(mapMixedReason(preBlock))
  if (preErr) throw preErr

  const live = await readLuckyClaimSnapshot(user, readClient)
  const livePlans = await readClaimPlans(readClient)
  const { releaseIndex: liveRelease, restakeIndex: liveRestake } = matchClaimPlanIndices(
    livePlans,
    releaseDays,
    restakeDays,
  )
  const liveContrib = await readContributionSnapshot(user, amount, readClient)
  const liveBlock = evaluateRewardsMixedClaim({
    amount,
    rewardAvailable: live.rewardAmount,
    contribution: liveContrib.contribution,
    requiredContribution: liveContrib.requiredContribution,
    releasePlanIndex: liveRelease,
    restakePlanIndex: liveRestake,
    luckyPaused: live.paused,
    luckyClaimable: live.claimable,
  })
  const liveErr = gateError(mapMixedReason(liveBlock))
  if (liveErr) throw liveErr
  if (liveRelease == null || liveRestake == null) {
    throw REWARDS_BLOCKED.releasePlanUnresolved
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
    throw WALLET_BLOCKED.NOT_CONNECTED
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
    throw REWARDS_BLOCKED.signatureExpired
  }
  if (normalized.signType !== DAO_REWARD_SIGN_TYPE[rewardType]) {
    throw REWARDS_BLOCKED.unavailable
  }
  const amount = normalized.amountWei

  const plans = await readClaimPlans(readClient)
  const { releaseIndex: releasePlanIndex, restakeIndex: restakePlanIndex } = matchClaimPlanIndices(
    plans,
    releaseDays,
    restakeDays,
  )
  const [rewardAvailable, contrib] = await Promise.all([
    readDaoPoolRewardAvailable(readClient),
    readContributionSnapshot(user, amount, readClient),
  ])
  const preBlock = evaluateRewardsMixedClaim({
    amount,
    rewardAvailable,
    contribution: contrib.contribution,
    requiredContribution: contrib.requiredContribution,
    releasePlanIndex,
    restakePlanIndex,
  })
  const preErr = gateError(mapMixedReason(preBlock))
  if (preErr) throw preErr

  // Live: re-read DaoPool AGX solvency + contribution + plans (never signature-self-certify).
  const livePlans = await readClaimPlans(readClient)
  const { releaseIndex: liveRelease, restakeIndex: liveRestake } = matchClaimPlanIndices(
    livePlans,
    releaseDays,
    restakeDays,
  )
  const [liveReward, liveContrib] = await Promise.all([
    readDaoPoolRewardAvailable(readClient),
    readContributionSnapshot(user, amount, readClient),
  ])
  const liveBlock = evaluateRewardsMixedClaim({
    amount,
    rewardAvailable: liveReward,
    contribution: liveContrib.contribution,
    requiredContribution: liveContrib.requiredContribution,
    releasePlanIndex: liveRelease,
    restakePlanIndex: liveRestake,
  })
  const liveErr = gateError(mapMixedReason(liveBlock))
  if (liveErr) throw liveErr
  if (liveRelease == null || liveRestake == null) {
    throw REWARDS_BLOCKED.releasePlanUnresolved
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
