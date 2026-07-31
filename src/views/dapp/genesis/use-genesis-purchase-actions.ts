import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { PresalePhaseOnChain } from '~/core/presale/presale-math'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { approveUsd1ForPresaleIfNeeded, purchasePresale } from '~/web3/presale/presale-write'
import { GENESIS_PURCHASE_ERROR, WALLET_GATE_ERROR } from '~/web3/resolve-contract-error-message'
import { readErc20Allowance, readErc20Balance } from '~/web3/exchange/exchange-read'
import { queryKeys } from '~/shared/api/query/query-keys'
import {
  invalidateAfterGenesisPurchase,
  invalidatePresaleChainQueries,
} from '~/shared/api/query/invalidate'
import { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { useChainReadClient } from '~/web3/use-chain-read-client'
import { readIsBindReferral } from '~/web3/referral/referral-read'
import { readPresalePaused } from '~/web3/presale/presale-read'
import { fetchLiveGenesisPostApproveGate } from '~/views/dapp/genesis/fetch-live-genesis-post-approve-gate'
import { useChainMutation } from '~/hooks/use-chain-mutation'
import { useI18n } from '~/i18n/use-i18n'
import { goBindReferral } from '~/app/shell/go-bind-referral'
import { readErrorText } from '~/web3/errors/error-text'
import { WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'

/** Survives Genesis session unmount when user switches tabs mid-tx. */
const genesisPurchaseGate = { inFlight: false }

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

/** Approve → re-gate → purchase orchestration for Genesis. Envelope in `useChainMutation`. */
export function useGenesisPurchaseActions({
  wallet: { account, wallet, address },
  phase: { activePhase, isPaused, isPausedUnknown, isBoundQueryData },
  purchase: { canPurchase, isApproved, needsApproval, purchaseAmount },
}: UseGenesisPurchaseActionsArgs) {
  const queryClient = useQueryClient()
  const readClient = useChainReadClient()
  const { messages: t } = useI18n()

  async function refresh() {
    invalidatePresaleChainQueries(address)
  }

  const purchaseMutation = useChainMutation({
    path: WRITE_PATH.GENESIS,
    mutation: async (): Promise<true> => {
      if (genesisPurchaseGate.inFlight) {
        throw GENESIS_PURCHASE_ERROR.UNAVAILABLE
      }
      if (!account || !wallet) {
        throw WALLET_GATE_ERROR.NOT_CONNECTED
      }
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

      genesisPurchaseGate.inFlight = true
      try {
        if (needsApproval && !isApproved) {
          await approveUsd1ForPresaleIfNeeded({ wallet, amount: purchaseAmount })
          if (address) {
            queryClient.setQueryData(
              queryKeys.chain.erc20Allowance(BSC_CONTRACTS.usd1, address, BSC_CONTRACTS.preSale),
              purchaseAmount,
            )
          }
        }

        // Live re-gate always (money-path: [approve?] → live bind/pause → purchase).
        const gate = await fetchLiveGenesisPostApproveGate({
          address,
          fetchIsBound: (addr) =>
            queryClient.fetchQuery({
              queryKey: queryKeys.chain.referralIsBound(addr),
              queryFn: () => readIsBindReferral(addr, readClient),
              staleTime: 0,
            }),
          fetchPaused: () =>
            queryClient.fetchQuery({
              queryKey: queryKeys.chain.presalePaused,
              queryFn: () => readPresalePaused(readClient),
              staleTime: 0,
            }),
        })
        if (!gate.ok) {
          throw gate.reason === 'not_bound'
            ? GENESIS_PURCHASE_ERROR.NOT_BOUND
            : GENESIS_PURCHASE_ERROR.UNAVAILABLE
        }

        const [balance, approved] = await Promise.all([
          readErc20Balance(BSC_CONTRACTS.usd1, account.address, readClient),
          readErc20Allowance(
            BSC_CONTRACTS.usd1,
            account.address,
            BSC_CONTRACTS.preSale,
            readClient,
          ),
        ])

        if (address) {
          queryClient.setQueryData(
            queryKeys.chain.erc20Balance(BSC_CONTRACTS.usd1, address),
            balance,
          )
          queryClient.setQueryData(
            queryKeys.chain.erc20Allowance(BSC_CONTRACTS.usd1, address, BSC_CONTRACTS.preSale),
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
        genesisPurchaseGate.inFlight = false
      }
    },
    onError: (error) => {
      // GX-R1: referral gate — action toast replaces default (suppress double toast).
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
    isSubmitting: purchaseMutation.isPending || genesisPurchaseGate.inFlight,
    isLocked: purchaseMutation.isLocked || genesisPurchaseGate.inFlight,
  }
}
