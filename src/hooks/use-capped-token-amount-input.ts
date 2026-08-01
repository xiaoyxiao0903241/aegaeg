import { useState } from 'react'
import {
  capTokenAmountInput,
  formatTokenAmountDraft,
  parseTokenAmount,
  cappedTokenAmountRaw,
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

/**
 * Controlled token amount with balance cap.
 * 100% / MAX locks `amountIn` to the exact on-chain balance while the visible
 * draft stays at `maxFractionDigits` (avoids `…000000000001` wei dust in the input).
 */
export function useCappedTokenAmountInput({
  decimals,
  balance,
  balancesLoaded,
  sessionReady,
  maxFractionDigits = 6,
  onBeforeCap,
}: UseCappedTokenAmountInputOptions) {
  const [amountDraft, setAmountDraft] = useState('')
  /** True after 100% fill — spend exact `balance` even if the draft is truncated for display. */
  const [exactBalanceFill, setExactBalanceFill] = useState(false)
  const fractionLimit = Math.min(decimals, maxFractionDigits)

  const isExactBalance = exactBalanceFill && balance > 0n && sessionReady && balancesLoaded

  const humanMaxDraft =
    balance > 0n ? formatTokenAmountDraft(balance, decimals, maxFractionDigits) : ''

  const exactDraftAmountIn =
    !sessionReady || !balancesLoaded || !amountDraft
      ? 0n
      : parseTokenAmount(sanitizeTokenAmountInput(amountDraft, decimals), decimals)

  const isFullBalanceDraft = !isExactBalance && balance > 0n && exactDraftAmountIn === balance

  const amount = isExactBalance
    ? humanMaxDraft
    : isFullBalanceDraft
      ? sanitizeTokenAmountInput(amountDraft, fractionLimit)
      : cappedTokenAmountRaw({
          amount: amountDraft,
          sessionReady,
          balancesLoaded,
          balance,
          decimals,
          maxFractionDigits,
        })

  const amountIn =
    isExactBalance || isFullBalanceDraft ? balance : parseTokenAmount(amount, decimals)

  function setAmount(value: string) {
    setExactBalanceFill(false)
    if (!sessionReady || !balancesLoaded) {
      setAmountDraft(sanitizeTokenAmountInput(value, fractionLimit))
      return
    }

    onBeforeCap?.()
    setAmountDraft(capTokenAmountInput(value, balance, decimals, maxFractionDigits))
  }

  function clearAmount() {
    setExactBalanceFill(false)
    setAmountDraft('')
  }

  function fillPercent(percent: number) {
    if (balance === 0n) return
    onBeforeCap?.()
    if (percent >= 100) {
      // Display at human digits; amountIn stays exact via exactBalanceFill.
      setExactBalanceFill(true)
      setAmountDraft(humanMaxDraft)
      return
    }
    setExactBalanceFill(false)
    const value = (balance * BigInt(percent)) / 100n
    setAmountDraft(formatTokenAmountDraft(value, decimals, maxFractionDigits))
  }

  return {
    amount,
    amountIn,
    setAmount,
    clearAmount,
    fillPercent,
  }
}
