import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

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
import { goBindReferral } from '~/views/dapp/shared/navigation'
import { GENESIS_PURCHASE_ERROR } from '~/web3/contract-error-message'
import { readErrorText } from '~/web3/errors/error-text'
import { readErc20Allowance, readErc20Balance } from '~/web3/exchange/exchange-read'
import { approveUsd1ForPresaleIfNeeded, purchasePresale } from '~/web3/presale/presale-write'
import { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { approveThenLiveWrite } from '~/web3/wallet/approve-then-live-write'
import { WRITE_PATH } from '~/web3/wallet/write-path'

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
    purchaseAmount: bigint
  }
}

type GenesisPurchaseBlock =
  'not_bound' | 'unavailable' | 'insufficient_allowance' | 'insufficient_usd1'

type GenesisPurchaseSnap = {
  postOk: boolean
  postReason: 'not_bound' | 'unavailable' | null
  allowance: bigint
  balance: bigint
}

/**
 * 创世购买编排：经统一核做预检 → 按需授权 → 实时复核 → 购买
 *
 * 前置条件不满足时抛错中断，不进入写操作；
 * 推荐未绑定错误用带操作按钮的提示呈现。
 *
 * @see docs/onchain-manual/contracts/presale.md
 */
export function useGenesisPurchaseActions({
  wallet: { address },
  phase: { activePhase, isPaused, isPausedUnknown, isBoundQueryData },
  purchase: { canPurchase, purchaseAmount },
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
      if (isBoundQueryData !== true) {
        throw GENESIS_PURCHASE_ERROR.NOT_BOUND
      }
      if (isPaused || isPausedUnknown) {
        throw GENESIS_PURCHASE_ERROR.UNAVAILABLE
      }
      if (!activePhase || !canPurchase) {
        throw GENESIS_PURCHASE_ERROR.UNAVAILABLE
      }

      const phase = activePhase

      await approveThenLiveWrite({
        readSnapshot: async (): Promise<GenesisPurchaseSnap> => {
          const post = await fetchLiveGenesisPostApprove({
            address: sessionAddress,
            purchaseAmount,
            activePhase: phase,
          })
          const [balance, allowance] = await Promise.all([
            readErc20Balance(BSC_CONTRACTS.usd1, account.address),
            readErc20Allowance(BSC_CONTRACTS.usd1, account.address, BSC_CONTRACTS.preSale),
          ])
          if (sessionAddress) {
            queryClient.setQueryData(
              queryKeys.chain.erc20BalanceOf(BSC_CONTRACTS.usd1, sessionAddress),
              balance,
            )
            queryClient.setQueryData(
              queryKeys.chain.erc20Allowance(
                BSC_CONTRACTS.usd1,
                sessionAddress,
                BSC_CONTRACTS.preSale,
              ),
              allowance,
            )
          }
          return {
            postOk: post.ok,
            postReason: post.ok ? null : post.reason,
            allowance,
            balance,
          }
        },
        evaluate: (snap): GenesisPurchaseBlock | null => {
          if (!snap.postOk) {
            return snap.postReason === 'not_bound' ? 'not_bound' : 'unavailable'
          }
          if (snap.balance < purchaseAmount) return 'insufficient_usd1'
          if (snap.allowance < purchaseAmount) return 'insufficient_allowance'
          return null
        },
        mapBlockError: (reason) => {
          if (reason === 'not_bound') return GENESIS_PURCHASE_ERROR.NOT_BOUND
          if (reason === 'insufficient_allowance') {
            return GENESIS_PURCHASE_ERROR.INSUFFICIENT_ALLOWANCE
          }
          if (reason === 'insufficient_usd1') return GENESIS_PURCHASE_ERROR.INSUFFICIENT_USD1
          return GENESIS_PURCHASE_ERROR.UNAVAILABLE
        },
        softPreBlocks: ['insufficient_allowance'],
        approve: async () => {
          const mined = await approveUsd1ForPresaleIfNeeded({
            wallet,
            amount: purchaseAmount,
          })
          if (mined && sessionAddress) {
            queryClient.setQueryData(
              queryKeys.chain.erc20Allowance(
                BSC_CONTRACTS.usd1,
                sessionAddress,
                BSC_CONTRACTS.preSale,
              ),
              purchaseAmount,
            )
          }
          return mined
        },
        write: async () => {
          await purchasePresale({
            wallet,
            phase: phase.index,
            amount: purchaseAmount,
          })
          invalidateAfterGenesisPurchase(account.address, purchaseAmount)
        },
      })
      return true
    },
    onError: (error) => {
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
  }
}
