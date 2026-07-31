import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { PresalePhaseOnChain } from '~/core/presale/presale-math'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { approveUsd1ForPresaleIfNeeded, purchasePresale } from '~/web3/presale/presale-write'
import { GENESIS_PURCHASE_ERROR } from '~/web3/contract-error-message'
import { readErc20Allowance, readErc20Balance } from '~/web3/exchange/exchange-read'
import { queryKeys } from '~/shared/api/query/query-keys'
import {
  invalidateAfterGenesisPurchase,
  invalidatePresaleChainQueries,
} from '~/shared/api/query/invalidate'
import { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { readIsBindReferral } from '~/web3/referral/referral-read'
import { readPresalePaused } from '~/web3/presale/presale-read'
import { fetchLiveGenesisPostApprove } from '~/views/dapp/genesis/fetch-live-genesis-post-approve'
import { useChainMutation } from '~/hooks/use-chain-mutation'
import { useI18n } from '~/i18n/use-i18n'
import { goBindReferral } from '~/app/shell/go-bind-referral'
import { readErrorText } from '~/web3/errors/error-text'
import { WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'

/** Survives Genesis session unmount when user switches tabs mid-tx. */
const genesisPurchaseBlock = { inFlight: false }

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

/** Approve → re-check → purchase orchestration for Genesis. Envelope in `useChainMutation`. */
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
      if (genesisPurchaseBlock.inFlight) {
        throw GENESIS_PURCHASE_ERROR.UNAVAILABLE
      }
      const { wallet, account, address: sessionAddress } = session
      // Contract requires a bound referrer before purchase; block early with a
      // friendly prompt instead of letting the tx revert (PreSaleUserNotBound).
      // Fail-closed while bind status is still loading (`undefined`).
      if (isBoundQueryData !== true) {
        throw GENESIS_PURCHASE_ERROR.NOT_BOUND
      }
      if (isPaused || isPausedUnknown) {
        throw GENESIS_PURCHASE_ERROR.UNAVAILABLE
      }
      if (!activePhase || !canPurchase) {
        throw GENESIS_PURCHASE_ERROR.UNAVAILABLE
      }

      genesisPurchaseBlock.inFlight = true
      try {
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

        // Live re-check always (money-path: [approve?] → live bind/pause → purchase).
        const blockReason = await fetchLiveGenesisPostApprove({
          address: sessionAddress,
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
            queryKeys.chain.erc20Allowance(
              BSC_CONTRACTS.usd1,
              sessionAddress,
              BSC_CONTRACTS.preSale,
            ),
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
      } finally {
        genesisPurchaseBlock.inFlight = false
      }
    },
    onError: (error) => {
      // GX-R1: referral check — action toast replaces default (suppress double toast).
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
    isSubmitting: purchaseMutation.isPending || genesisPurchaseBlock.inFlight,
    isLocked: purchaseMutation.isLocked || genesisPurchaseBlock.inFlight,
  }
}
