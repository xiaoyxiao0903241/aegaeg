import { keepPreviousData, useQuery } from '@tanstack/react-query'
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
import { QUERY_STALE_TIME } from '../lib/query/query-client'
import { queryKeys } from '../lib/query/query-keys'
import { useDappActions } from '../stores/dapp-actions'
import { GENESIS_PURCHASE_ERROR } from '../lib/web3/resolve-contract-error-message'
import { useVisibleQueryInterval } from './queries/use-visible-query-interval'

export function useSwapWidget(connected: boolean) {
  const account = useActiveAccount()
  const afterSwap = useDappActions((state) => state.afterSwap)
  const [sellAmount, setSellAmountRaw] = useState('')
  const [direction, setDirection] = useState<SwapDirection>('forward')
  const [slippage, setSlippage] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const pair = useMemo(() => getSwapPairTokens(direction), [direction])
  const address = account?.address
  const walletReady = Boolean(address)
  const amountIn = useMemo(
    () => parseTokenAmount(sellAmount, pair.sell.decimals),
    [pair.sell.decimals, sellAmount],
  )
  const slippageBps = slippagePercentToBps(slippage)
  const spotQuoteAmount = useMemo(
    () => 10n ** BigInt(pair.sell.decimals),
    [pair.sell.decimals],
  )

  const balancesQuery = useQuery({
    queryKey: queryKeys.chain.swapBalances(
      address ?? '',
      pair.sell.address,
      pair.buy.address,
    ),
    queryFn: async () => {
      const [sell, buy, approved] = await Promise.all([
        readErc20Balance(pair.sell.address, address!),
        readErc20Balance(pair.buy.address, address!),
        readErc20Allowance(pair.sell.address, address!, SWAP_CONFIG.router),
      ])
      return { sell, buy, approved }
    },
    enabled: walletReady,
    staleTime: QUERY_STALE_TIME.balances,
  })

  const spotQuoteQuery = useQuery({
    queryKey: queryKeys.chain.swapQuote(
      pair.sell.address,
      pair.buy.address,
      spotQuoteAmount.toString(),
    ),
    queryFn: () =>
      fetchSwapQuote({
        amountIn: spotQuoteAmount,
        tokenIn: pair.sell.address,
        tokenOut: pair.buy.address,
      }),
    enabled: connected,
    staleTime: QUERY_STALE_TIME.quote,
    placeholderData: keepPreviousData,
  })

  const amountQuoteQuery = useQuery({
    queryKey: queryKeys.chain.swapQuote(
      pair.sell.address,
      pair.buy.address,
      amountIn.toString(),
    ),
    queryFn: () =>
      fetchSwapQuote({
        amountIn,
        tokenIn: pair.sell.address,
        tokenOut: pair.buy.address,
      }),
    enabled: connected && amountIn > 0n,
    staleTime: QUERY_STALE_TIME.quote,
    placeholderData: keepPreviousData,
  })

  useVisibleQueryInterval(spotQuoteQuery, SWAP_CONFIG.quoteRefreshIntervalMs, connected)
  useVisibleQueryInterval(
    amountQuoteQuery,
    SWAP_CONFIG.quoteRefreshIntervalMs,
    connected && amountIn > 0n,
  )

  const sellBalance = balancesQuery.data?.sell ?? 0n
  const buyBalance = balancesQuery.data?.buy ?? 0n
  const allowance = balancesQuery.data?.approved ?? 0n
  const isBalancesLoading = connected && balancesQuery.isLoading
  const quotedOut = amountQuoteQuery.data?.quotedOut ?? 0n
  const quotePath = amountQuoteQuery.data?.path ?? []
  const spotQuotedOut = spotQuoteQuery.data?.quotedOut ?? 0n
  const spotQuotePath = spotQuoteQuery.data?.path ?? []
  const isQuoting =
    connected && amountIn > 0n && amountQuoteQuery.isPending && quotedOut === 0n
  const isSpotQuoting =
    connected && amountIn === 0n && spotQuoteQuery.isPending && spotQuotedOut === 0n

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

  useEffect(() => {
    if (amountQuoteQuery.error) {
      setError(
        amountQuoteQuery.error instanceof Error
          ? amountQuoteQuery.error.message
          : 'Quote failed',
      )
      return
    }

    if (amountIn > 0n) {
      setError(null)
    }
  }, [amountIn, amountQuoteQuery.error])

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

    if (rateQuote.amountOut === 0n) {
      return isSpotQuoting || isQuoting ? '' : '—'
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
    connected,
    isQuoting,
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

    const labels = path.map((pathAddress) => {
      if (pathAddress.toLowerCase() === pair.sell.address.toLowerCase()) return pair.sell.symbol
      if (pathAddress.toLowerCase() === pair.buy.address.toLowerCase()) return pair.buy.symbol
      if (pathAddress.toLowerCase() === SWAP_CONFIG.wbnb.toLowerCase()) return 'WBNB'
      return pathAddress.slice(0, 6)
    })

    return labels.join(' → ')
  }, [pair.buy.address, pair.buy.symbol, pair.sell.address, pair.sell.symbol, rateQuote.path])

  const action =
    walletReady && amountIn > 0n ? resolveSwapAction(allowance, amountIn) : 'swap'
  const exceedsBalance = walletReady && amountIn > sellBalance
  const canSubmit =
    walletReady &&
    amountIn > 0n &&
    !exceedsBalance &&
    quotedOut > 0n &&
    !amountQuoteQuery.isPending &&
    !isSubmitting

  const fillPercent = useCallback(
    (percent: number) => {
      if (!walletReady || sellBalance === 0n) return
      const value = (sellBalance * BigInt(percent)) / 100n
      setSellAmountRaw(formatTokenAmount(value, pair.sell.decimals, 6))
    },
    [connected, pair.sell.decimals, sellBalance],
  )

  const flipDirection = useCallback(() => {
    setDirection((current) => (current === 'forward' ? 'reverse' : 'forward'))
    setSellAmountRaw('')
  }, [])

  const submit = useCallback(async (): Promise<boolean> => {
    if (!account) {
      setError(GENESIS_PURCHASE_ERROR.WALLET_NOT_CONNECTED)
      return false
    }
    if (!canSubmit) return false

    setIsSubmitting(true)
    setError(null)

    try {
      if (action === 'approve') {
        await approveTokenIfNeeded({
          account,
          token: pair.sell.address,
          amountIn,
        })
        await balancesQuery.refetch()
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
      afterSwap(account.address, pair.sell.address, pair.buy.address)
      await balancesQuery.refetch()
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
    afterSwap,
    amountIn,
    balancesQuery,
    canSubmit,
    pair.buy.address,
    pair.buy.decimals,
    pair.sell.address,
    pair.sell.decimals,
    pair.sell.symbol,
    quotedOut,
    slippageBps,
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
    walletReady,
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
