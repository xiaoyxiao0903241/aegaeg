import { keepPreviousData } from '@tanstack/react-query'

import {
  burnContributionSwapBlocksSubmit,
  evaluateBurnContributionSwap,
  formatBurnContributionRateLabel,
} from '~/core/exchange/burn-contribution-swap'
import { formatTokenAmount } from '~/core/exchange/token-amount'
import { decisionBigint, isDecisionFresh } from '~/core/query/decision-freshness'
import { useChainQuery } from '~/hooks/use-chain-query'
import { useI18n } from '~/i18n/use-i18n'
import { queryKeys } from '~/shared/api/query/query-keys'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { submitBurnExchange } from '~/views/dapp/exchange/burn/submit-burn-exchange'
import { useExchangeQuote } from '~/views/dapp/exchange/use-exchange-quote'
import {
  readBurnContributionQuote,
  readBurnContributionSwapConfig,
  readBurnExchangeBalances,
  readBurnUserStats,
} from '~/web3/exchange/burn-exchange-read'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { useWriteReadiness } from '~/web3/wallet/use-write-readiness'
import { hasWalletAccount } from '~/web3/wallet/wallet-connection-state'

const BURN_PAIR = {
  sell: EXCHANGE_CONFIG.tokens.agx,
  buy: {
    symbol: 'contribution',
    icon: '',
    decimals: EXCHANGE_CONFIG.tokens.agx.decimals,
  },
}

/**
 * 销毁 AGX 换贡献点会话状态
 *
 * 买入侧只读，兑换比例来自链上 rateBps；管理余额、报价与提交。
 *
 * @see docs/onchain-manual/contracts/agxcontributionswap.md
 */
export function useBurnExchangeWidget(
  sessionReady: boolean,
  quotesEnabled = true,
  readsEnabled = quotesEnabled,
) {
  const { messages: t } = useI18n()
  const account = useActiveAccount()
  const { writeReady } = useWriteReadiness()
  const walletReady = hasWalletAccount(account)

  const configQuery = useChainQuery({
    queryKey: queryKeys.chain.burnSwapConfig,
    queryFn: () => readBurnContributionSwapConfig(),
    scope: 'public',
    freshness: 'quote',
    enabled: readsEnabled,
    placeholderData: keepPreviousData,
  })

  const decimals = configQuery.data?.decimals ?? EXCHANGE_CONFIG.tokens.agx.decimals
  const buyDecimals = decimals

  const balancesQuery = useChainQuery({
    queryKey: queryKeys.chain.burnSwapBalances,
    queryFn: (addr) => readBurnExchangeBalances(addr),
    enabled: readsEnabled,
    placeholderData: keepPreviousData,
  })

  const userStatsQuery = useChainQuery({
    queryKey: queryKeys.chain.burnSwapUserStats,
    queryFn: (addr) => readBurnUserStats(addr),
    enabled: readsEnabled,
    placeholderData: keepPreviousData,
  })

  const sellBalance =
    decisionBigint(balancesQuery.data?.sell, balancesQuery.isPlaceholderData) ?? 0n
  const allowance =
    decisionBigint(balancesQuery.data?.approved, balancesQuery.isPlaceholderData) ?? 0n
  const balancesLoaded = isDecisionFresh(balancesQuery.isPlaceholderData, balancesQuery.data)
  const isBalancesLoading = walletReady && (!balancesLoaded || balancesQuery.isLoading)

  const core = useExchangeQuote({
    sessionReady,
    quotesEnabled,
    decimals,
    buyDecimals,
    sellBalance,
    allowance,
    balancesLoaded,
    walletReady,
    writeReady,
    isBalancesLoading,
    slippageBps: 0,
    quoteRefreshIntervalMs: EXCHANGE_CONFIG.quoteRefreshIntervalMs,
    getQuoteQueryKey: (amountIn) => queryKeys.chain.burnSwapQuote(amountIn.toString()),
    fetchQuote: (amountIn) => readBurnContributionQuote(amountIn),
    selectQuotedOut: (quote) => quote ?? 0n,
  })

  const contributionBalance = userStatsQuery.data?.contributionBalance ?? 0n
  const rateBps = configQuery.data?.rateBps ?? 0n

  const pointsLabel = t.exchange.burn.pointsToken
  const exchangePriceLabel =
    configQuery.data === undefined
      ? ''
      : formatBurnContributionRateLabel({
          rateBps,
          decimals,
          agxSymbol: EXCHANGE_CONFIG.tokens.agx.symbol,
          pointsLabel,
        })
  const overviewRateLabel = exchangePriceLabel

  const blockReason = evaluateBurnContributionSwap({
    amountIn: core.debouncedAmountIn,
    config: configQuery.data,
  })

  const canSubmit =
    core.canSubmit &&
    configQuery.data !== undefined &&
    !burnContributionSwapBlocksSubmit(blockReason)

  async function submit(): Promise<{ ok: true } | { ok: false; error: unknown }> {
    return submitBurnExchange({
      core,
    })
  }

  return {
    pair: {
      sell: EXCHANGE_CONFIG.tokens.agx,
      buy: { ...BURN_PAIR.buy, decimals: buyDecimals },
    },
    sellAmount: core.sellAmount,
    sellAmountDisplay: core.sellAmountDisplay,
    setSellAmount: core.setSellAmount,
    sellBalanceLabel:
      balancesQuery.data === undefined
        ? ''
        : formatTokenAmount(balancesQuery.data.sell, decimals, 4),
    contributionBalanceLabel:
      userStatsQuery.data === undefined
        ? ''
        : formatTokenAmount(contributionBalance, buyDecimals, 2),
    buyAmount: core.buyAmount,
    exchangePriceLabel,
    overviewRateLabel,
    providerAddress: BSC_CONTRACTS.agxContributionSwap,
    config: configQuery.data,
    userStats: userStatsQuery.data,
    blockReason,
    walletReady,
    canSubmit,
    isQuoting: core.isQuoting,
    isExchangePriceQuoting: configQuery.isLoading && !exchangePriceLabel,
    isBalancesLoading,
    isSubmitting: core.isSubmitting,
    error: core.error,
    validationError: core.validationError,
    quoteErrorUpdatedAt: core.quoteErrorUpdatedAt,
    fillPercent: core.fillPercent,
    submit,
  }
}
