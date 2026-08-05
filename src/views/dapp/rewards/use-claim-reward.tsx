import { useCallback } from 'react'

import {
  type ClaimRewardExecuteResult,
  claimRewardOutcome,
} from '~/core/rewards/claim-reward-outcome'
import { useAuth } from '~/hooks/use-auth'
import { useChainMutation } from '~/hooks/use-chain-mutation'
import { invalidateAfterTeamClaim } from '~/shared/api/query/invalidate'
import type { ClaimConfirmResult } from '~/shared/api/types'
import {
  claimCommunityFund,
  claimIncentiveReward,
  claimMarketFundReward,
  claimTeamReward,
} from '~/web3/claim/claim-reward'
import { WALLET_BLOCKED } from '~/web3/contract-error-message'
import { useActiveAccount } from '~/web3/thirdweb-react'
import type { WriteSession } from '~/web3/wallet/require-write-session'
import { WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'
import { useWriteReadiness } from '~/web3/wallet/use-write-readiness'

type RewardClaimExecutor = (args: {
  wallet: WriteSession['wallet']
  token: string
  onUnauthorized: () => void
}) => Promise<ClaimRewardExecuteResult>

/**
 * 面向界面的领取结果
 *
 * confirm_failed 属于成功路径（链上已确认），不作为异常抛出。
 */
export type ClaimRewardUiResult = {
  status: 'success' | 'confirm_failed'
  confirmResult: ClaimConfirmResult | null
  txHash?: string
}

/**
 * 领取通用封装：串起登录会话、写就绪检查与链上提交
 *
 * 提交失败时返回结果而非抛出，由调用方决定提示方式。
 *
 * @param execute 具体领取执行函数（签发 + 上链）
 */
export function useClaimReward(execute: RewardClaimExecutor) {
  const account = useActiveAccount()
  const { writeReady } = useWriteReadiness()
  const { token, sessionReady, invalidateSession } = useAuth()

  const claimMutation = useChainMutation({
    path: WRITE_PATH.REWARD_CLAIM,
    mutation: async (_vars, session): Promise<ClaimRewardUiResult> => {
      if (!token || !sessionReady || !writeReady) {
        throw WALLET_BLOCKED.NOT_CONNECTED
      }

      const result = await execute({
        wallet: session.wallet,
        token,
        onUnauthorized: invalidateSession,
      })
      const outcome = claimRewardOutcome(result)
      // confirm_failed 表示链上已成功，不抛错；由视图 toast 区分警告与成功
      if (outcome.shouldInvalidate) {
        invalidateAfterTeamClaim()
      }
      return {
        status: outcome.status,
        confirmResult: outcome.confirmResult as ClaimConfirmResult | null,
        txHash: outcome.txHash,
      }
    },
  })

  return {
    claim: () => claimMutation.mutate(),
    isClaiming: claimMutation.isPending,
    canClaim: Boolean(account && token && sessionReady && writeReady) && !claimMutation.isLocked,
  }
}

/** 团队奖励（预售等级奖励）领取
 * @see docs/backend-api/api.md #claim/team-reward
 */
export function useTeamRewardClaim() {
  const execute = useCallback(
    (args: Parameters<typeof claimTeamReward>[0]) => claimTeamReward(args),
    [],
  )
  return useClaimReward(execute)
}

/** 发展基金（市场津贴）领取
 * @see docs/backend-api/api.md #claim/market-fund
 */
export function useMarketFundClaim() {
  const execute = useCallback(
    (args: Parameters<typeof claimMarketFundReward>[0]) => claimMarketFundReward(args),
    [],
  )
  return useClaimReward(execute)
}

/** 参与奖激励领取 */
export function useIncentiveClaim() {
  const execute = useCallback(
    (args: Parameters<typeof claimIncentiveReward>[0]) => claimIncentiveReward(args),
    [],
  )
  return useClaimReward(execute)
}

/** 社区基金领取
 * @see docs/backend-api/api.md #claim/community-fund
 */
export function useCommunityFundClaim() {
  const execute = useCallback(
    (args: Parameters<typeof claimCommunityFund>[0]) => claimCommunityFund(args),
    [],
  )
  return useClaimReward(execute)
}
