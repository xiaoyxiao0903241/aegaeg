import { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { formatTokenAmount, formatTokenAmountInputDisplay } from '~/core/swap/token-amount'
import { getSwapPairTokens } from '~/views/dapp/swap/swap-pair'
import { SWAP_CONFIG } from '~/shared/config/swap'
import { queryKeys } from '~/shared/api/query/query-keys'
import { QUERY_STALE_TIME } from '~/shared/api/query/query-client'
import { hasWalletAccount } from '~/web3/wallet/wallet-connection-state'
import { useChainReadClient } from '~/web3/use-chain-read-client'
import { useSwapQuote } from '~/views/dapp/swap/use-swap-quote'
import { useQuery } from '@tanstack/react-query'
import { readFlashSwapBalances, readFlashSwapQuote } from '~/web3/swap/flash-swap-read'
import { useFlashSwapSpotRates } from '~/views/dapp/swap/flash-swap/use-flash-swap-spot-rates'
import { submitFlashSwap } from '~/views/dapp/swap/flash-swap/submit-flash-swap'
import { useWriteReadiness } from '~/web3/wallet/use-write-readiness'

/** Fixed tolerance (0.5%) below the displayed quote for the on-chain floor. */
const FLASH_SWAP_SLIPPAGE_BPS = 50

/** One-way USDT → USD1 via AegisUsd1Swap; no slippage UI (fixed small tolerance). */
export function useFlashSwapWidget(sessionReady: boolean, quotesEnabled = true) {
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  const { writeReady } = useWriteReadiness()
  const pair = getSwapPairTokens('reverse')
  const readClient = useChainReadClient()

  const address = account?.address
  const walletReady = hasWalletAccount(account)

  const balancesQuery = useQuery({
    queryKey: queryKeys.chain.flashSwapBalances(address ?? ''),
    queryFn: () => readFlashSwapBalances(address!, readClient),
    enabled: quotesEnabled && walletReady,
    staleTime: QUERY_STALE_TIME.balances,
  })

  const sellBalance = balancesQuery.data?.usdt ?? 0n
  const buyBalance = balancesQuery.data?.usd1 ?? 0n
  const balancesLoaded = balancesQuery.data !== undefined
  const isBalancesLoading = walletReady && balancesQuery.isLoading

  const core = useSwapQuote({
    sessionReady,
    quotesEnabled,
    decimals: pair.sell.decimals,
    buyDecimals: pair.buy.decimals,
    sellBalance,
    allowance: 0n,
    balancesLoaded,
    walletReady,
    writeReady,
    isBalancesLoading,
    slippageBps: FLASH_SWAP_SLIPPAGE_BPS,
    quoteRefreshIntervalMs: SWAP_CONFIG.quoteRefreshIntervalMs,
    getQuoteQueryKey: (amountIn) => queryKeys.chain.flashSwapQuote(amountIn.toString()),
    fetchQuote: (amountIn) => readFlashSwapQuote(amountIn, readClient),
    selectQuotedOut: (quote) => quote ?? 0n,
  })

  const spot = useFlashSwapSpotRates({ pair, quotesEnabled })

  const routeLabel = `${pair.sell.symbol} → ${pair.buy.symbol}`

  const minUsd1OutLabel =
    sessionReady && core.amountIn > 0n && core.amountOutMin > 0n
      ? formatTokenAmountInputDisplay(
          formatTokenAmount(core.amountOutMin, pair.buy.decimals, 6),
        )
      : '—'

  async function submit(): Promise<{ ok: true } | { ok: false; error: unknown }> {
    return submitFlashSwap({ account, wallet, core, balancesQuery })
  }

  return {
    sellAmount: core.sellAmount,
    sellAmountDisplay: core.sellAmountDisplay,
    setSellAmount: core.setSellAmount,
    pair,
    sellBalanceLabel: formatTokenAmount(sellBalance, pair.sell.decimals, 4),
    buyBalanceLabel: formatTokenAmount(buyBalance, pair.buy.decimals, 4),
    buyAmount: core.buyAmount,
    exchangePriceLabel: spot.exchangePriceLabel,
    routeLabel,
    overviewRateLabel: spot.overviewRateLabel,
    minUsd1OutLabel,
    walletReady,
    canSubmit: core.canSubmit,
    isQuoting: core.isQuoting,
    isExchangePriceQuoting: spot.isExchangePriceQuoting,
    isBalancesLoading,
    isSubmitting: core.isSubmitting,
    error: core.error,
    validationError: core.validationError,
    quoteErrorUpdatedAt: core.quoteErrorUpdatedAt,
    fillPercent: core.fillPercent,
    submit,
  }
}
