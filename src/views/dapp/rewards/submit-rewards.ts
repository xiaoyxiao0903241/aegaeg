import { matchClaimPlanIndices, restakeBpsFromPct } from '~/core/assets/claim-plans'
import { evaluateRewardsMixedClaim } from '~/core/rewards/rewards-block-reasons'
import { requestDaoClaim } from '~/shared/api/endpoints'
import { parseTeamRewardClaim } from '~/shared/api/parse-team-reward-claim'
import { invalidateAfterRewardsMixedClaim } from '~/shared/api/query/invalidate'
import { requestWithSession } from '~/shared/api/query/session-request'
import { DAO_REWARD_SIGN_TYPE, type DaoRewardType } from '~/shared/api/types'
import { readClaimPlans, readContributionSnapshot } from '~/web3/assets/assets-read'
import { WALLET_BLOCKED } from '~/web3/contract-error-message'
import { REWARDS_BLOCKED } from '~/web3/errors/write-block-errors'
import { readDaoPoolRewardAvailable, readLuckyClaimRound } from '~/web3/rewards/rewards-read'
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

/**
 * 幸运奖混合领取提交（仅领域写入）
 *
 * 意图轮由调用方钉死（展示层已选出的可领轮）；提交只对该轮做 pre / live 两读，
 * 不再全量回溯。贡献门槛用该轮链上金额。
 *
 * @param args.session 写会话（钱包 + 地址 + 读客户端）
 * @param args.roundId 意图轮次
 * @param args.releaseDays 释放时长档位
 * @param args.restakeDays 复投时长档位
 * @param args.restakePct 复投占比
 */
export async function submitLuckyMixedClaim(args: {
  session: WriteSession
  roundId: bigint
  releaseDays: number
  restakeDays: number
  restakePct: number
}): Promise<void> {
  const { session, roundId, releaseDays, restakeDays, restakePct } = args
  const { wallet, address: user, readClient } = session
  const restakeBps = restakeBpsFromPct(restakePct)

  async function gatePinnedRound() {
    const snap = await readLuckyClaimRound(user, roundId, readClient)
    const plans = await readClaimPlans(readClient)
    const { releaseIndex, restakeIndex } = matchClaimPlanIndices(plans, releaseDays, restakeDays)
    const contrib = await readContributionSnapshot(user, snap.rewardAmount, readClient)
    const block = evaluateRewardsMixedClaim({
      amount: snap.rewardAmount,
      rewardAvailable: snap.rewardAmount,
      contribution: contrib.contribution,
      requiredContribution: contrib.requiredContribution,
      releasePlanIndex: releaseIndex,
      restakePlanIndex: restakeIndex,
      luckyPaused: snap.paused,
      luckyClaimable: snap.claimable,
    })
    const err = gateError(mapMixedReason(block))
    if (err) throw err
    if (releaseIndex == null || restakeIndex == null) {
      throw REWARDS_BLOCKED.releasePlanUnresolved
    }
    return { releaseIndex, restakeIndex }
  }

  await gatePinnedRound()
  const live = await gatePinnedRound()

  await writeLuckyMixedClaim({
    wallet,
    roundId,
    releasePlanIndex: live.releaseIndex,
    restakePlanIndex: live.restakeIndex,
    restakeBps,
  })
  invalidateAfterRewardsMixedClaim()
}

/**
 * 共建奖混合领取提交（仅领域写入）
 *
 * 先向后端申请领取签名，校验签名类型与过期时间，
 * 再按释放 / 复投计划做预检查与二次实时校验，全部通过后上链。
 *
 * @param args.session 写会话
 * @param args.token 登录会话令牌
 * @param args.onUnauthorized 令牌失效回调
 * @param args.rewardType 共建奖励类型（等级 / 超越）
 * @param args.releaseDays 释放时长档位
 * @param args.restakeDays 复投时长档位
 * @param args.restakePct 复投占比
 * @see docs/backend-api/api.md #claim/dao-reward
 */
export async function submitDaoMixedClaim(args: {
  session: WriteSession
  token: string
  onUnauthorized: () => void
  rewardType: DaoRewardType
  releaseDays: number
  restakeDays: number
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

  // 实时校验：重读 DaoPool 池余额、贡献快照与释放计划，签名不能作为唯一依据
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
  invalidateAfterRewardsMixedClaim()
}
