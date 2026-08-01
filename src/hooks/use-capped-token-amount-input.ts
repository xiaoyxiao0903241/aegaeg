import { useState } from 'react'

import {
  cappedTokenAmountRaw,
  capTokenAmountInput,
  formatTokenAmountDraft,
  parseTokenAmount,
  sanitizeTokenAmountInput,
} from '~/core/exchange/token-amount'

type UseCappedTokenAmountInputOptions = {
  decimals: number
  balance: bigint
  balancesLoaded: boolean
  sessionReady: boolean
  /** Visible / fill fraction digits — `min(decimals, maxFractionDigits)`. Default 6. */
  maxFractionDigits?: number
  /** Called before applying balance cap (e.g. clear submit/validation error). */
  onBeforeCap?: () => void
}

/** Controlled token amount capped to balance; % / MAX fill truncates to `maxFractionDigits`. */
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

  const amount = cappedTokenAmountRaw({
    amount: amountDraft,
    sessionReady,
    balancesLoaded,
    balance,
    decimals,
    maxFractionDigits,
  })

  const amountIn = parseTokenAmount(amount, decimals)

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
    const value = percent >= 100 ? balance : (balance * BigInt(percent)) / 100n
    setAmountDraft(formatTokenAmountDraft(value, decimals, fractionLimit))
  }

  return {
    amount,
    amountIn,
    setAmount,
    clearAmount,
    fillPercent,
  }
}
