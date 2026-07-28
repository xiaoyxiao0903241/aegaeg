import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import type { PresalePhaseOnChain } from '~/core/presale/presale-math'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { approveUsd1ForPresaleIfNeeded, purchasePresale } from '~/web3/presale-write'
import { GENESIS_PURCHASE_ERROR, WALLET_GATE_ERROR } from '~/web3/resolve-contract-error-message'
import { readErc20Allowance, readErc20Balance } from '~/web3/exchange/exchange-read'
import { queryKeys } from '~/shared/api/query/query-keys'
import {
  invalidateAfterGenesisPurchase,
  invalidatePresaleChainQueries,
} from '~/shared/api/query/invalidate'
import { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { useChainReadClient } from '~/web3/use-chain-read-client'
import { readIsBindReferral } from '~/web3/referral-read'
import { readPresalePaused } from '~/web3/presale-read'
import { fetchLiveGenesisPostApproveGate } from '~/views/dapp/genesis/fetch-live-genesis-post-approve-gate'
import { isUnknownSubmitOutcome } from '~/web3/wallet/wallet-submit-unknown-error'
import {
  WRITE_PATH,
  clearUnknownReceiptLock,
  isUnknownReceiptLocked,
  lockUnknownReceipt,
} from '~/web3/wallet/unknown-receipt-lock'

export interface GenesisPurchaseResult {
  success: boolean
  /** Raw wallet / contract error — keep for selector-based i18n resolution. */
  error?: unknown
}

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

/** Approve → re-gate → purchase orchestration for Genesis. */
export function useGenesisPurchaseActions({
  wallet: { account, wallet, address },
  phase: { activePhase, isPaused, isPausedUnknown, isBoundQueryData },
  purchase: { canPurchase, isApproved, needsApproval, purchaseAmount },
}: UseGenesisPurchaseActionsArgs) {
  const queryClient = useQueryClient()
  const readClient = useChainReadClient()
  const [submittingAction, setSubmittingAction] = useState<'approve' | 'purchase' | null>(null)

  async function refresh() {
    invalidatePresaleChainQueries(address)
  }

  async function approve(): Promise<GenesisPurchaseResult> {
    if (!account || !wallet) {
      return { success: false, error: WALLET_GATE_ERROR.NOT_CONNECTED }
    }
    if (isUnknownReceiptLocked(WRITE_PATH.GENESIS) || !canPurchase) {
      return { success: false, error: GENESIS_PURCHASE_ERROR.UNAVAILABLE }
    }
    if (isApproved) {
      return { success: true }
    }

    setSubmittingAction('approve')
    try {
      await approveUsd1ForPresaleIfNeeded({ wallet, amount: purchaseAmount })
      if (address) {
        queryClient.setQueryData(
          queryKeys.chain.erc20Allowance(BSC_CONTRACTS.usd1, address, BSC_CONTRACTS.preSale),
          purchaseAmount,
        )
      }
      return { success: true }
    } catch (caught) {
      if (isUnknownSubmitOutcome(caught)) {
        lockUnknownReceipt(WRITE_PATH.GENESIS)
      }
      return { success: false, error: caught }
    } finally {
      setSubmittingAction(null)
    }
  }

  async function purchase(): Promise<GenesisPurchaseResult> {
    if (!account || !wallet) {
      return { success: false, error: WALLET_GATE_ERROR.NOT_CONNECTED }
    }
    if (isUnknownReceiptLocked(WRITE_PATH.GENESIS) || !activePhase || !canPurchase) {
      return { success: false, error: GENESIS_PURCHASE_ERROR.UNAVAILABLE }
    }

    setSubmittingAction('purchase')
    try {
      const [balance, approved] = await Promise.all([
        readErc20Balance(BSC_CONTRACTS.usd1, account.address, readClient),
        readErc20Allowance(BSC_CONTRACTS.usd1, account.address, BSC_CONTRACTS.preSale, readClient),
      ])

      if (address) {
        queryClient.setQueryData(queryKeys.chain.erc20Balance(BSC_CONTRACTS.usd1, address), balance)
        queryClient.setQueryData(
          queryKeys.chain.erc20Allowance(BSC_CONTRACTS.usd1, address, BSC_CONTRACTS.preSale),
          approved,
        )
      }

      if (approved < purchaseAmount) {
        return { success: false, error: GENESIS_PURCHASE_ERROR.INSUFFICIENT_ALLOWANCE }
      }

      if (balance < purchaseAmount) {
        return { success: false, error: GENESIS_PURCHASE_ERROR.INSUFFICIENT_USD1 }
      }

      await purchasePresale({
        wallet,
        phase: activePhase.index,
        amount: purchaseAmount,
      })
      invalidateAfterGenesisPurchase(account.address, purchaseAmount)
      clearUnknownReceiptLock(WRITE_PATH.GENESIS)
      return { success: true }
    } catch (caught) {
      if (isUnknownSubmitOutcome(caught)) {
        lockUnknownReceipt(WRITE_PATH.GENESIS)
      }
      return { success: false, error: caught }
    } finally {
      setSubmittingAction(null)
    }
  }

  async function submitPurchase(): Promise<GenesisPurchaseResult> {
    if (genesisPurchaseGate.inFlight || isUnknownReceiptLocked(WRITE_PATH.GENESIS)) {
      return { success: false, error: GENESIS_PURCHASE_ERROR.UNAVAILABLE }
    }

    // Contract requires a bound referrer before purchase; block early with a
    // friendly prompt instead of letting the tx revert (PreSaleUserNotBound).
    // Fail-closed while bind status is still loading (`undefined`).
    if (isBoundQueryData !== true) {
      return { success: false, error: GENESIS_PURCHASE_ERROR.NOT_BOUND }
    }
    if (isPaused || isPausedUnknown) {
      return { success: false, error: GENESIS_PURCHASE_ERROR.UNAVAILABLE }
    }

    genesisPurchaseGate.inFlight = true
    try {
      if (needsApproval) {
        const approveResult = await approve()
        if (!approveResult.success) {
          return approveResult
        }
        // Live re-gate: bind/pause may flip while the user signs approve.
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
          return {
            success: false,
            error:
              gate.reason === 'not_bound'
                ? GENESIS_PURCHASE_ERROR.NOT_BOUND
                : GENESIS_PURCHASE_ERROR.UNAVAILABLE,
          }
        }
      }
      return await purchase()
    } finally {
      genesisPurchaseGate.inFlight = false
    }
  }

  return {
    refresh,
    approve,
    purchase,
    submitPurchase,
    isSubmitting: submittingAction !== null,
    submittingAction,
  }
}
