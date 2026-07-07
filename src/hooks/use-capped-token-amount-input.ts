import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  capTokenAmountInput,
  formatTokenAmount,
  parseTokenAmount,
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
  const [amount, setAmountRaw] = useState('')
  const fractionLimit = Math.min(decimals, maxFractionDigits)

  const amountIn = useMemo(
    () => parseTokenAmount(amount, decimals),
    [amount, decimals],
  )

  const setAmount = useCallback(
    (value: string) => {
      if (!authenticated || !balancesLoaded) {
        setAmountRaw(sanitizeTokenAmountInput(value, fractionLimit))
        return
      }

      onBeforeCap?.()
      setAmountRaw(capTokenAmountInput(value, balance, decimals, maxFractionDigits))
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

  useEffect(() => {
    if (!authenticated || !balancesLoaded || !amount) return

    const capped = capTokenAmountInput(amount, balance, decimals, maxFractionDigits)
    if (capped !== amount) {
      setAmountRaw(capped)
    }
  }, [amount, authenticated, balance, balancesLoaded, decimals, maxFractionDigits])

  const clearAmount = useCallback(() => {
    setAmountRaw('')
  }, [])

  const fillPercent = useCallback(
    (percent: number) => {
      if (balance === 0n) return
      const value = (balance * BigInt(percent)) / 100n
      setAmountRaw(formatTokenAmount(value, decimals, maxFractionDigits))
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
