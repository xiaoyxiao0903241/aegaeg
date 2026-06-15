import { useActiveAccount } from 'thirdweb/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { calcAmountOutMin } from '../lib/swap/calc-amount-out-min'
import { formatSwapRate } from '../lib/swap/format-swap-rate'
import { resolveSwapAction } from '../lib/swap/resolve-swap-action'
import {
  capTokenAmountInput,
  formatTokenAmount,
  parseTokenAmount,
  sanitizeTokenAmountInput,
  slippagePercentToBps,
} from '../lib/swap/token-amount'
import { getSwapPairTokens, type SwapDirection } from '../lib/swap/swap-pair'
import { SWAP_CONFIG } from '../config/swap'
import { readErc20Allowance, readErc20Balance, fetchSwapQuote } from '../web3/swap-read'
import { approveTokenIfNeeded, executeTokenSwap } from '../web3/swap-write'
import { appendSwapHistory } from '../lib/swap/swap-history'
import { useVisibilityAwareInterval } from './use-visibility-aware-interval'

export function useSwapWidget(connected: boolean) {
  const account = useActiveAccount()
  const [sellAmount, setSellAmountRaw] = useState('')
  const [direction, setDirection] = useState<SwapDirection>('forward')
  const [slippage, setSlippage] = useState(1)
  const [sellBalance, setSellBalance] = useState<bigint>(0n)
  const [buyBalance, setBuyBalance] = useState<bigint>(0n)
  const [allowance, setAllowance] = useState<bigint>(0n)
  const [quotedOut, setQuotedOut] = useState<bigint>(0n)
  const [quotePath, setQuotePath] = useState<string[]>([])
  const [spotQuotedOut, setSpotQuotedOut] = useState<bigint>(0n)
  const [spotQuotePath, setSpotQuotePath] = useState<string[]>([])
  const [isQuoting, setIsQuoting] = useState(false)
  const [isSpotQuoting, setIsSpotQuoting] = useState(false)
  const [isBalancesLoading, setIsBalancesLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const pair = useMemo(() => getSwapPairTokens(direction), [direction])
  const amountIn = useMemo(
    () => parseTokenAmount(sellAmount, pair.sell.decimals),
    [pair.sell.decimals, sellAmount],
  )
  const slippageBps = slippagePercentToBps(slippage)
  const spotQuoteAmount = useMemo(
    () => 10n ** BigInt(pair.sell.decimals),
    [pair.sell.decimals],
  )

  const setSellAmount = useCallback(
    (value: string) => {
      const fractionLimit = Math.min(pair.sell.decimals, 6)

      if (!connected) {
        setSellAmountRaw(sanitizeTokenAmountInput(value, fractionLimit))
        return
      }

      setSellAmountRaw(
        capTokenAmountInput(value, sellBalance, pair.sell.decimals, 6),
      )
    },
    [connected, pair.sell.decimals, sellBalance],
  )

  useEffect(() => {
    if (!connected || !sellAmount) {
      return
    }

    const capped = capTokenAmountInput(sellAmount, sellBalance, pair.sell.decimals, 6)
    if (capped !== sellAmount) {
      setSellAmountRaw(capped)
    }
  }, [connected, pair.sell.decimals, sellAmount, sellBalance])

  const refreshBalances = useCallback(async () => {
    if (!connected || !account?.address) {
      setSellBalance(0n)
      setBuyBalance(0n)
      setAllowance(0n)
      setIsBalancesLoading(false)
      return
    }

    setIsBalancesLoading(true)

    try {
      const [sell, buy, approved] = await Promise.all([
        readErc20Balance(pair.sell.address, account.address),
        readErc20Balance(pair.buy.address, account.address),
        readErc20Allowance(pair.sell.address, account.address, SWAP_CONFIG.router),
      ])

      setSellBalance(sell)
      setBuyBalance(buy)
      setAllowance(approved)
    } finally {
      setIsBalancesLoading(false)
    }
  }, [account?.address, connected, pair.buy.address, pair.sell.address])

  useEffect(() => {
    void refreshBalances()
  }, [refreshBalances])

  const refreshSpotQuote = useCallback(
    async (showLoading = false) => {
      if (!connected) {
        setSpotQuotedOut(0n)
        setSpotQuotePath([])
        if (showLoading) {
          setIsSpotQuoting(false)
        }
        return
      }

      if (showLoading) {
        setIsSpotQuoting(true)
      }

      try {
        const quote = await fetchSwapQuote({
          amountIn: spotQuoteAmount,
          tokenIn: pair.sell.address,
          tokenOut: pair.buy.address,
        })
        setSpotQuotedOut(quote.quotedOut)
        setSpotQuotePath(quote.path)
      } catch {
        if (showLoading) {
          setSpotQuotedOut(0n)
          setSpotQuotePath([])
        }
      } finally {
        if (showLoading) {
          setIsSpotQuoting(false)
        }
      }
    },
    [connected, pair.buy.address, pair.sell.address, spotQuoteAmount],
  )

  useEffect(() => {
    void refreshSpotQuote(true)
  }, [refreshSpotQuote])

  useVisibilityAwareInterval(
    () => refreshSpotQuote(false),
    SWAP_CONFIG.quoteRefreshIntervalMs,
    connected,
  )

  const refreshQuote = useCallback(
    async (showLoading = false) => {
      if (!connected || amountIn === 0n) {
        setQuotedOut(0n)
        setQuotePath([])
        if (showLoading) {
          setIsQuoting(false)
        }
        return
      }

      if (showLoading) {
        setIsQuoting(true)
        setError(null)
      }

      try {
        const quote = await fetchSwapQuote({
          amountIn,
          tokenIn: pair.sell.address,
          tokenOut: pair.buy.address,
        })
        setQuotedOut(quote.quotedOut)
        setQuotePath(quote.path)
      } catch (quoteError: unknown) {
        if (showLoading) {
          setQuotedOut(0n)
          setQuotePath([])
          setError(quoteError instanceof Error ? quoteError.message : 'Quote failed')
        }
      } finally {
        if (showLoading) {
          setIsQuoting(false)
        }
      }
    },
    [amountIn, connected, pair.buy.address, pair.sell.address],
  )

  useEffect(() => {
    void refreshQuote(true)
  }, [refreshQuote])

  useVisibilityAwareInterval(
    () => refreshQuote(false),
    SWAP_CONFIG.quoteRefreshIntervalMs,
    connected && amountIn > 0n,
  )

  const rateQuote = useMemo(() => {
    if (amountIn > 0n && quotedOut > 0n) {
      return { amountIn, amountOut: quotedOut, path: quotePath }
    }

    return {
      amountIn: spotQuoteAmount,
      amountOut: spotQuotedOut,
      path: spotQuotePath,
    }
  }, [
    amountIn,
    quotePath,
    quotedOut,
    spotQuoteAmount,
    spotQuotePath,
    spotQuotedOut,
  ])

  const buyAmount = useMemo(
    () => (connected && quotedOut > 0n ? formatTokenAmount(quotedOut, pair.buy.decimals, 6) : ''),
    [connected, pair.buy.decimals, quotedOut],
  )

  const rateLabel = useMemo(() => {
    if (!connected) {
      return '—'
    }

    if (amountIn === 0n && isSpotQuoting) {
      return ''
    }

    return formatSwapRate({
      amountIn: rateQuote.amountIn,
      amountOut: rateQuote.amountOut,
      decimalsIn: pair.sell.decimals,
      decimalsOut: pair.buy.decimals,
      symbolIn: pair.sell.symbol,
      symbolOut: pair.buy.symbol,
    })
  }, [
    amountIn,
    connected,
    isSpotQuoting,
    pair.buy.decimals,
    pair.buy.symbol,
    pair.sell.decimals,
    pair.sell.symbol,
    rateQuote.amountIn,
    rateQuote.amountOut,
  ])

  const routeLabel = useMemo(() => {
    const path = rateQuote.path
    if (path.length === 0) {
      return `${pair.sell.symbol} → ${pair.buy.symbol}`
    }

    const labels = path.map((address) => {
      if (address.toLowerCase() === pair.sell.address.toLowerCase()) return pair.sell.symbol
      if (address.toLowerCase() === pair.buy.address.toLowerCase()) return pair.buy.symbol
      if (address.toLowerCase() === SWAP_CONFIG.wbnb.toLowerCase()) return 'WBNB'
      return address.slice(0, 6)
    })

    return labels.join(' → ')
  }, [pair.buy.address, pair.buy.symbol, pair.sell.address, pair.sell.symbol, rateQuote.path])

  const action = amountIn > 0n ? resolveSwapAction(allowance, amountIn) : 'swap'
  const exceedsBalance = connected && amountIn > sellBalance
  const canSubmit =
    connected &&
    amountIn > 0n &&
    !exceedsBalance &&
    quotedOut > 0n &&
    !isQuoting &&
    !isSubmitting

  const fillPercent = useCallback(
    (percent: number) => {
      if (!connected || sellBalance === 0n) return
      const value = (sellBalance * BigInt(percent)) / 100n
      setSellAmountRaw(formatTokenAmount(value, pair.sell.decimals, 6))
    },
    [connected, pair.sell.decimals, sellBalance],
  )

  const flipDirection = useCallback(() => {
    setDirection((current) => (current === 'forward' ? 'reverse' : 'forward'))
    setSellAmountRaw('')
    setQuotedOut(0n)
  }, [])

  const submit = useCallback(async (): Promise<boolean> => {
    if (!account || !canSubmit) return false

    setIsSubmitting(true)
    setError(null)

    try {
      if (action === 'approve') {
        await approveTokenIfNeeded({
          account,
          token: pair.sell.address,
          amountIn,
        })
        await refreshBalances()
        return true
      }

      await executeTokenSwap({
        account,
        amountIn,
        tokenIn: pair.sell.address,
        tokenOut: pair.buy.address,
        slippageBps,
      })
      appendSwapHistory({
        paidLabel: `${formatTokenAmount(amountIn, pair.sell.decimals, 4)} ${pair.sell.symbol}`,
        receivedLabel: `+${formatTokenAmount(quotedOut, pair.buy.decimals, 4)} ${pair.buy.symbol}`,
        status: 'Success',
      })
      setSellAmountRaw('')
      await refreshBalances()
      return true
    } catch (submitError: unknown) {
      setError(submitError instanceof Error ? submitError.message : 'Transaction failed')
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [
    account,
    action,
    amountIn,
    canSubmit,
    pair.buy.address,
    pair.sell.address,
    refreshBalances,
    slippageBps,
    quotedOut,
  ])

  return {
    sellAmount,
    setSellAmount,
    direction,
    flipDirection,
    slippage,
    setSlippage,
    pair,
    sellBalanceLabel: formatTokenAmount(sellBalance, pair.sell.decimals, 4),
    buyBalanceLabel: formatTokenAmount(buyBalance, pair.buy.decimals, 4),
    buyAmount,
    rateLabel,
    routeLabel,
    action,
    canSubmit,
    isQuoting,
    isSpotQuoting,
    isBalancesLoading,
    isSubmitting,
    error,
    fillPercent,
    submit,
    amountOutMin: quotedOut > 0n ? calcAmountOutMin(quotedOut, slippageBps) : 0n,
  }
}
