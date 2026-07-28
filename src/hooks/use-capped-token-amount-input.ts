import { useState } from 'react'
import {
  capTokenAmountInput,
  formatTokenAmount,
  parseTokenAmount,
  resolveCappedTokenAmountRaw,
  sanitizeTokenAmountInput,
} from '~/core/exchange/token-amount'

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

  const exactDraftAmountIn =
    !sessionReady || !balancesLoaded || !amountDraft
      ? 0n
      : parseTokenAmount(sanitizeTokenAmountInput(amountDraft, decimals), decimals)

  const isFullBalanceDraft = balance > 0n && exactDraftAmountIn === balance

  // 100% fill: keep full on-chain precision (do not re-cap through display digits).
  const amount = isFullBalanceDraft
    ? sanitizeTokenAmountInput(amountDraft, decimals)
    : resolveCappedTokenAmountRaw({
        amount: amountDraft,
        sessionReady,
        balancesLoaded,
        balance,
        decimals,
        maxFractionDigits,
      })

  const amountIn = isFullBalanceDraft ? balance : parseTokenAmount(amount, decimals)

  function setAmount(value: string) {
    if (!sessionReady || !balancesLoaded) {
      setAmountDraft(sanitizeTokenAmountInput(value, fractionLimit))
      return
    }

    onBeforeCap?.()
    setAmountDraft(capTokenAmountInput(value, balance, decimals, maxFractionDigits))
  }

  function clearAmount() {
    setAmountDraft('')
  }

  function fillPercent(percent: number) {
    if (balance === 0n) return
    onBeforeCap?.()
    // 100%: write full on-chain precision so amountIn === balance (no dust from display digits).
    if (percent >= 100) {
      setAmountDraft(formatTokenAmount(balance, decimals, decimals))
      return
    }
    const value = (balance * BigInt(percent)) / 100n
    setAmountDraft(formatTokenAmount(value, decimals, maxFractionDigits))
  }

  return {
    amount,
    amountIn,
    setAmount,
    clearAmount,
    fillPercent,
  }
}
