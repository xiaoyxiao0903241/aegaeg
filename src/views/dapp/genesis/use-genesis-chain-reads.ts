import {
  USD1_DECIMALS,
  resolvePhaseCountdownTarget,
  resolveRemainingPhaseAmount,
  resolveRemainingUserAmount,
  resolveSharePriceWei,
  presaleAirdropThresholdToUsd,
  resolveGenesisMaxShares,
} from '~/core/presale/presale-math'
import { formatTokenAmountToNumber } from '~/core/swap/token-amount'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { useGenesisPromoStore } from '~/stores/genesis-promo-store'
import {
  usePresaleActivePhaseQuery,
  usePresaleAgxPriceQuery,
  usePresaleAirdropThresholdQuery,
  usePresalePausedQuery,
  usePresalePhasesQuery,
  usePresaleTotalPurchasedQuery,
  useIsBindReferralQuery,
  usePresaleUserPhaseRemainingQuery,
  usePresaleUserTotalQuery,
  useUsd1PresaleWalletQuery,
} from '~/web3/use-presale-queries'
import { useDappShellStore } from '~/stores/dapp-shell-store'

/** Chain + promo reads for Genesis — no shares draft, no write actions. */
export function useGenesisChainReads() {
  const account = useActiveAccount()
  const nowSeconds = useGenesisPromoStore((state) => state.nowSeconds)
  const activeSeasonNumber = useGenesisPromoStore((state) => state.activeSeasonNumber)
  const discountLabel = useGenesisPromoStore((state) => state.discountLabel)
  const seasonOptions = useGenesisPromoStore((state) => state.seasonOptions)

  const address = account?.address
  const walletReady = Boolean(address)
  const purchaseQueriesEnabled = useDappShellStore((state) => state.activeTab === 'genesis')

  const phasesQuery = usePresalePhasesQuery()
  const activePhaseQuery = usePresaleActivePhaseQuery()
  const agxPriceQuery = usePresaleAgxPriceQuery()
  const totalPurchasedQuery = usePresaleTotalPurchasedQuery({
    enabled: purchaseQueriesEnabled,
  })
  const airdropThresholdQuery = usePresaleAirdropThresholdQuery({
    enabled: purchaseQueriesEnabled,
  })
  const pausedQuery = usePresalePausedQuery({ enabled: purchaseQueriesEnabled })
  const userTotalQuery = usePresaleUserTotalQuery(address, { enabled: purchaseQueriesEnabled })
  const phaseRemainingQuery = usePresaleUserPhaseRemainingQuery(
    address,
    activePhaseQuery.data?.index,
    { enabled: purchaseQueriesEnabled },
  )
  const { usd1Balance, allowance } = useUsd1PresaleWalletQuery(address, {
    enabled: purchaseQueriesEnabled,
  })
  const isBoundQuery = useIsBindReferralQuery(address, { enabled: purchaseQueriesEnabled })
  const isBound = isBoundQuery.data === true
  const needsReferralBind = walletReady && isBoundQuery.data === false
  const isPaused = pausedQuery.data === true
  const isPausedUnknown = walletReady && !(pausedQuery.isSuccess && pausedQuery.data !== undefined)

  const phases = phasesQuery.data ?? []
  const activePhase = activePhaseQuery.data ?? null
  const sharePriceWei = resolveSharePriceWei(activePhase)
  const userTotal = userTotalQuery.data ?? 0n
  const phaseRemaining = phaseRemainingQuery.data ?? null
  const agxPriceWei = agxPriceQuery.data ?? 0n
  const airdropThresholdUsd =
    airdropThresholdQuery.data !== undefined
      ? presaleAirdropThresholdToUsd(airdropThresholdQuery.data)
      : presaleAirdropThresholdToUsd(0n)

  const isLoading =
    phasesQuery.isLoading ||
    activePhaseQuery.isLoading ||
    agxPriceQuery.isLoading ||
    totalPurchasedQuery.isLoading ||
    (purchaseQueriesEnabled && walletReady && userTotalQuery.isLoading) ||
    (purchaseQueriesEnabled &&
      walletReady &&
      activePhase !== null &&
      phaseRemainingQuery.isLoading)

  const phaseIndex = activePhase?.index ?? 0
  const fromChain = formatTokenAmountToNumber(agxPriceWei, USD1_DECIMALS)
  const agxPriceUsd = fromChain > 0 ? fromChain : 0
  const discountBps = Number(activePhase?.discountBps ?? 0)
  const minAmount = activePhase?.minAmount ?? 0n
  const maxAmount = activePhase?.maxAmount ?? 0n
  const remainingPhaseAmount = resolveRemainingPhaseAmount(phaseRemaining, activePhase)
  const remainingUserAmount = resolveRemainingUserAmount(phaseRemaining, activePhase, maxAmount)
  const maxShares = resolveGenesisMaxShares({
    sharePriceWei,
    remainingPhaseAmount,
    remainingUserAmount,
    usd1Balance,
    walletReady,
  })
  const maxPurchasableWei =
    remainingPhaseAmount < remainingUserAmount ? remainingPhaseAmount : remainingUserAmount

  const countdownTarget = resolvePhaseCountdownTarget(phases, nowSeconds)

  const queryError =
    phasesQuery.error ??
    activePhaseQuery.error ??
    agxPriceQuery.error ??
    totalPurchasedQuery.error ??
    (purchaseQueriesEnabled ? userTotalQuery.error : null) ??
    (purchaseQueriesEnabled ? phaseRemainingQuery.error : null)

  return {
    account,
    address,
    walletReady,
    purchaseQueriesEnabled,
    phases,
    activePhase,
    phaseIndex,
    sharePriceWei,
    userTotal,
    phaseRemaining,
    usd1Balance,
    allowance,
    isBound,
    isBoundQueryData: isBoundQuery.data,
    needsReferralBind,
    isPaused,
    isPausedUnknown,
    airdropThresholdUsd,
    airdropThresholdLoading: airdropThresholdQuery.isLoading,
    isLoading,
    isPhasesLoading: phasesQuery.isLoading,
    agxPriceUsd,
    discountBps,
    discountLabel,
    minAmount,
    maxAmount,
    maxShares,
    maxPurchasableWei,
    nowSeconds,
    countdownTarget,
    activeSeasonNumber,
    seasonOptions,
    totalPurchased: totalPurchasedQuery.data ?? 0n,
    globalPurchasedLoading: totalPurchasedQuery.isLoading,
    userPhaseAmountCurrent: phaseRemaining?.userPhaseAmountCurrent ?? 0n,
    seasonContributionMaxWei:
      phaseRemaining && phaseRemaining.userPurchaseLimit > 0n
        ? phaseRemaining.userPurchaseLimit
        : maxAmount,
    error: queryError,
  }
}
