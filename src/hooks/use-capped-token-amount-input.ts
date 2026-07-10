import { useCallback, useMemo, useState } from 'react'
import {
  capTokenAmountInput,
  formatTokenAmount,
  parseTokenAmount,
  resolveCappedTokenAmountRaw,
  sanitizeTokenAmountInput,
} from '~/core/swap/token-amount'

type UseCappedTokenAmountInputOptions = {
  decimals: number
  balance: bigint
  balancesLoaded: boolean
  sessionReady: boolean
  maxFractionDigits?: number
  /** Called before applying balance cap (e.g. clear submit/validation error). */
  onBeforeCap?: () => void
}

export function useCappedTokenAmountInput({
  decimals,
  balance,
  balancesLoaded,
  sessionReady,
  maxFractionDigits = 6,
  onBeforeCap,
}: UseCappedTokenAmountInputOptions) {
  const [amountDraft, setAmountDraft] = useState('')
  const fractionLimit = Math.min(decimals, maxFractionDigits)

  const exactDraftAmountIn = useMemo(() => {
    if (!sessionReady || !balancesLoaded || !amountDraft) return 0n
    return parseTokenAmount(sanitizeTokenAmountInput(amountDraft, decimals), decimals)
  }, [amountDraft, balancesLoaded, decimals, sessionReady])

  const isFullBalanceDraft = balance > 0n && exactDraftAmountIn === balance

  const amount = useMemo(() => {
    // 100% fill: keep full on-chain precision (do not re-cap through display digits).
    if (isFullBalanceDraft) {
      return sanitizeTokenAmountInput(amountDraft, decimals)
    }
    return resolveCappedTokenAmountRaw({
      amount: amountDraft,
      sessionReady,
      balancesLoaded,
      balance,
      decimals,
      maxFractionDigits,
    })
  }, [
    amountDraft,
    balance,
    balancesLoaded,
    decimals,
    isFullBalanceDraft,
    maxFractionDigits,
    sessionReady,
  ])

  const amountIn = useMemo(() => {
    if (isFullBalanceDraft) return balance
    return parseTokenAmount(amount, decimals)
  }, [amount, balance, decimals, isFullBalanceDraft])

  const setAmount = useCallback(
    (value: string) => {
      if (!sessionReady || !balancesLoaded) {
        setAmountDraft(sanitizeTokenAmountInput(value, fractionLimit))
        return
      }

      onBeforeCap?.()
      setAmountDraft(capTokenAmountInput(value, balance, decimals, maxFractionDigits))
    },
    [
      sessionReady,
      balance,
      balancesLoaded,
      decimals,
      fractionLimit,
      maxFractionDigits,
      onBeforeCap,
    ],
  )

  const clearAmount = useCallback(() => {
    setAmountDraft('')
  }, [])

  const fillPercent = useCallback(
    (percent: number) => {
      if (balance === 0n) return
      onBeforeCap?.()
      // 100%: write full on-chain precision so amountIn === balance (no dust from display digits).
      if (percent >= 100) {
        setAmountDraft(formatTokenAmount(balance, decimals, decimals))
        return
      }
      const value = (balance * BigInt(percent)) / 100n
      setAmountDraft(formatTokenAmount(value, decimals, maxFractionDigits))
    },
    [balance, decimals, maxFractionDigits, onBeforeCap],
  )

  return {
    amount,
    amountIn,
    setAmount,
    clearAmount,
    fillPercent,
  }
}
