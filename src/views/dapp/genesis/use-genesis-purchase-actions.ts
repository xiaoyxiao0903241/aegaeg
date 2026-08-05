import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { goBindReferral } from '~/app/go-bind-referral'
import type { PresalePhaseOnChain } from '~/core/presale/presale-math'
import { useChainMutation } from '~/hooks/use-chain-mutation'
import { useI18n } from '~/i18n/use-i18n'
import {
  invalidateAfterGenesisPurchase,
  invalidatePresaleChainQueries,
} from '~/shared/api/query/invalidate'
import { queryKeys } from '~/shared/api/query/query-keys'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { fetchLiveGenesisPostApprove } from '~/views/dapp/genesis/fetch-live-genesis-post-approve'
import { GENESIS_PURCHASE_ERROR } from '~/web3/contract-error-message'
import { readErrorText } from '~/web3/errors/error-text'
import { readErc20Allowance, readErc20Balance } from '~/web3/exchange/exchange-read'
import { readPresalePaused, readUserPhaseRemainingAmount } from '~/web3/presale/presale-read'
import { approveUsd1ForPresaleIfNeeded, purchasePresale } from '~/web3/presale/presale-write'
import { readIsBindReferral } from '~/web3/referral/referral-read'
import { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'

type UseGenesisPurchaseActionsArgs = {
  wallet: {
    account: ReturnType<typeof useActiveAccount>
    wallet: ReturnType<typeof useActiveWallet>
    address: string | undefined
  }
  phase: {
    activePhase: PresalePhaseOnChain | null
    isPaused: boolean
    isPausedUnknown: boolean
    isBoundQueryData: boolean | undefined
  }
  purchase: {
    canPurchase: boolean
    isApproved: boolean
    needsApproval: boolean
    purchaseAmount: bigint
  }
}

/**
 * 创世购买编排：授权 → 重读门闸 → 购买
 *
 * 前置条件不满足时抛错中断，不进入写操作；
 * 推荐未绑定错误用带操作按钮的提示呈现。
 *
 * @see docs/onchain-manual/contracts/presale.md
 */
export function useGenesisPurchaseActions({
  wallet: { address },
  phase: { activePhase, isPaused, isPausedUnknown, isBoundQueryData },
  purchase: { canPurchase, isApproved, needsApproval, purchaseAmount },
}: UseGenesisPurchaseActionsArgs) {
  const queryClient = useQueryClient()
  const { messages: t } = useI18n()

  async function refresh() {
    invalidatePresaleChainQueries(address)
  }

  const purchaseMutation = useChainMutation({
    path: WRITE_PATH.GENESIS,
    mutation: async (_vars, session): Promise<true> => {
      const { wallet, account, address: sessionAddress } = session
      // 合约要求购买前已绑定推荐人；提前拦截并给出友好提示，
      // 避免交易在链上回滚（PreSaleUserNotBound）。
      // 绑定态仍在加载（undefined）时按未绑定处理。
      if (isBoundQueryData !== true) {
        throw GENESIS_PURCHASE_ERROR.NOT_BOUND
      }
      if (isPaused || isPausedUnknown) {
        throw GENESIS_PURCHASE_ERROR.UNAVAILABLE
      }
      if (!activePhase || !canPurchase) {
        throw GENESIS_PURCHASE_ERROR.UNAVAILABLE
      }

      if (needsApproval && !isApproved) {
        await approveUsd1ForPresaleIfNeeded({ wallet, amount: purchaseAmount })
        if (sessionAddress) {
          queryClient.setQueryData(
            queryKeys.chain.erc20Allowance(
              BSC_CONTRACTS.usd1,
              sessionAddress,
              BSC_CONTRACTS.preSale,
            ),
            purchaseAmount,
          )
        }
      }

      // 实时重读：绑定/暂停 + 阶段与用户剩余，避免沿用闭包快照
      const blockReason = await fetchLiveGenesisPostApprove({
        address: sessionAddress,
        purchaseAmount,
        activePhase,
        fetchIsBound: (addr) =>
          queryClient.fetchQuery({
            queryKey: queryKeys.chain.referralIsBoundOf(addr),
            queryFn: () => readIsBindReferral(addr),
            staleTime: 0,
          }),
        fetchPaused: () =>
          queryClient.fetchQuery({
            queryKey: queryKeys.chain.presalePaused,
            queryFn: () => readPresalePaused(),
            staleTime: 0,
          }),
        fetchPhaseRemaining: (addr, phaseIndex) =>
          queryClient.fetchQuery({
            queryKey: queryKeys.chain.presaleUserPhaseRemaining(addr, phaseIndex),
            queryFn: () => readUserPhaseRemainingAmount(addr, phaseIndex),
            staleTime: 0,
          }),
      })
      if (!blockReason.ok) {
        throw blockReason.reason === 'not_bound'
          ? GENESIS_PURCHASE_ERROR.NOT_BOUND
          : GENESIS_PURCHASE_ERROR.UNAVAILABLE
      }

      const [balance, approved] = await Promise.all([
        readErc20Balance(BSC_CONTRACTS.usd1, account.address),
        readErc20Allowance(BSC_CONTRACTS.usd1, account.address, BSC_CONTRACTS.preSale),
      ])

      if (sessionAddress) {
        queryClient.setQueryData(
          queryKeys.chain.erc20BalanceOf(BSC_CONTRACTS.usd1, sessionAddress),
          balance,
        )
        queryClient.setQueryData(
          queryKeys.chain.erc20Allowance(BSC_CONTRACTS.usd1, sessionAddress, BSC_CONTRACTS.preSale),
          approved,
        )
      }

      if (approved < purchaseAmount) {
        throw GENESIS_PURCHASE_ERROR.INSUFFICIENT_ALLOWANCE
      }

      if (balance < purchaseAmount) {
        throw GENESIS_PURCHASE_ERROR.INSUFFICIENT_USD1
      }

      await purchasePresale({
        wallet,
        phase: activePhase.index,
        amount: purchaseAmount,
      })
      invalidateAfterGenesisPurchase(account.address, purchaseAmount)
      return true
    },
    onError: (error) => {
      // 推荐未绑定错误用带操作按钮的提示替代默认提示，避免双重 toast
      if (readErrorText(error) !== GENESIS_PURCHASE_ERROR.NOT_BOUND) return
      toast.error(t.genesis.errors.notBound, {
        id: 'genesis-not-bound',
        action: {
          label: t.genesis.goBindReferrer,
          onClick: () => goBindReferral(),
        },
      })
      return 'handled'
    },
  })

  return {
    refresh,
    submitPurchase: () => purchaseMutation.mutate(),
    isSubmitting: purchaseMutation.isPending,
    isLocked: purchaseMutation.isLocked,
  }
}
