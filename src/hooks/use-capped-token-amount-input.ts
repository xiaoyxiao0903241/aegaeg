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
  authenticated: boolean
  maxFractionDigits?: number
  /** Called before applying balance cap (e.g. clear submit/validation error). */
  onBeforeCap?: () => void
}

export function useCappedTokenAmountInput({
  decimals,
  balance,
  balancesLoaded,
  authenticated,
  maxFractionDigits = 6,
  onBeforeCap,
}: UseCappedTokenAmountInputOptions) {
  const [amountDraft, setAmountDraft] = useState('')
  const fractionLimit = Math.min(decimals, maxFractionDigits)

  const amount = resolveCappedTokenAmountRaw({
    amount: amountDraft,
    authenticated,
    balancesLoaded,
    balance,
    decimals,
    maxFractionDigits,
  })

  const amountIn = useMemo(() => parseTokenAmount(amount, decimals), [amount, decimals])

  const setAmount = useCallback(
    (value: string) => {
      if (!authenticated || !balancesLoaded) {
        setAmountDraft(sanitizeTokenAmountInput(value, fractionLimit))
        return
      }

      onBeforeCap?.()
      setAmountDraft(capTokenAmountInput(value, balance, decimals, maxFractionDigits))
    },
    [
      authenticated,
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
      const value = (balance * BigInt(percent)) / 100n
      setAmountDraft(formatTokenAmount(value, decimals, maxFractionDigits))
    },
    [balance, decimals, maxFractionDigits],
  )

  return {
    amount,
    amountIn,
    setAmount,
    clearAmount,
    fillPercent,
  }
}
