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
import { approveThenLiveWrite } from '~/web3/wallet/approve-then-live-write'
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

function mapMixedBlockError(reason: NonNullable<ReturnType<typeof evaluateRewardsMixedClaim>>) {
  return gateError(mapMixedReason(reason)) ?? REWARDS_BLOCKED.unavailable
}

/**
 * 幸运奖混合领取提交（仅领域写入）
 *
 * 意图轮由调用方钉死；经统一编排核做预检与实时复核后再写。
 * 贡献门槛用该轮链上金额；两读之间轮次不可领或金额变化会阻断。
 *
 * @param args.session 写会话
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
  const { wallet, address: user } = session
  const restakeBps = restakeBpsFromPct(restakePct)

  type LuckySnap = {
    rewardAmount: bigint
    paused: boolean
    claimable: boolean
    releaseIndex: number | null
    restakeIndex: number | null
    contribution: bigint
    requiredContribution: bigint
  }

  await approveThenLiveWrite({
    readSnapshot: async (): Promise<LuckySnap> => {
      const snap = await readLuckyClaimRound(user, roundId)
      const plans = await readClaimPlans()
      const { releaseIndex, restakeIndex } = matchClaimPlanIndices(plans, releaseDays, restakeDays)
      const contrib = await readContributionSnapshot(user, snap.rewardAmount)
      return {
        rewardAmount: snap.rewardAmount,
        paused: snap.paused,
        claimable: snap.claimable,
        releaseIndex,
        restakeIndex,
        contribution: contrib.contribution,
        requiredContribution: contrib.requiredContribution,
      }
    },
    evaluate: (snap) =>
      evaluateRewardsMixedClaim({
        amount: snap.rewardAmount,
        rewardAvailable: snap.rewardAmount,
        contribution: snap.contribution,
        requiredContribution: snap.requiredContribution,
        releasePlanIndex: snap.releaseIndex,
        restakePlanIndex: snap.restakeIndex,
        luckyPaused: snap.paused,
        luckyClaimable: snap.claimable,
      }),
    mapBlockError: mapMixedBlockError,
    write: async (live) => {
      if (live.releaseIndex == null || live.restakeIndex == null) {
        throw REWARDS_BLOCKED.releasePlanUnresolved
      }
      await writeLuckyMixedClaim({
        wallet,
        roundId,
        releasePlanIndex: live.releaseIndex,
        restakePlanIndex: live.restakeIndex,
        restakeBps,
      })
    },
  })
  invalidateAfterRewardsMixedClaim()
}

/**
 * 共建奖混合领取提交（仅领域写入）
 *
 * 先向后端申请领取签名，校验签名类型与过期时间，
 * 再经统一编排核对池余额、贡献与计划做预检与实时复核，通过后上链。
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
  const { wallet, address: user } = session
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

  type DaoSnap = {
    rewardAvailable: bigint
    contribution: bigint
    requiredContribution: bigint
    releaseIndex: number | null
    restakeIndex: number | null
  }

  await approveThenLiveWrite({
    readSnapshot: async (): Promise<DaoSnap> => {
      const plans = await readClaimPlans()
      const { releaseIndex, restakeIndex } = matchClaimPlanIndices(plans, releaseDays, restakeDays)
      const [rewardAvailable, contrib] = await Promise.all([
        readDaoPoolRewardAvailable(),
        readContributionSnapshot(user, amount),
      ])
      return {
        rewardAvailable,
        contribution: contrib.contribution,
        requiredContribution: contrib.requiredContribution,
        releaseIndex,
        restakeIndex,
      }
    },
    evaluate: (snap) =>
      evaluateRewardsMixedClaim({
        amount,
        rewardAvailable: snap.rewardAvailable,
        contribution: snap.contribution,
        requiredContribution: snap.requiredContribution,
        releasePlanIndex: snap.releaseIndex,
        restakePlanIndex: snap.restakeIndex,
      }),
    mapBlockError: mapMixedBlockError,
    write: async (live) => {
      if (live.releaseIndex == null || live.restakeIndex == null) {
        throw REWARDS_BLOCKED.releasePlanUnresolved
      }
      await writeDaoMixedClaim({
        wallet,
        signType: normalized.signType,
        amount,
        expireTime: normalized.expireTime,
        salt: normalized.salt,
        signature: normalized.signature,
        releasePlanIndex: live.releaseIndex,
        restakePlanIndex: live.restakeIndex,
        restakeBps,
      })
    },
  })
  invalidateAfterRewardsMixedClaim()
}
