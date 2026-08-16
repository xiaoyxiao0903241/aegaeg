import { ZERO_BI } from '~/core/constants'
import { formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import {
  genesisMaxShares,
  presaleAirdropThresholdToUsd,
  remainingPhaseAmount,
  remainingUserAmount,
  sharePriceWei,
  USD1_DECIMALS,
} from '~/core/presale/presale-math'
import { useChainQuery } from '~/hooks/use-chain-query'
import { queryKeys } from '~/shared/api/query/query-keys'
import { useDappHostStore } from '~/stores/dapp-host-store'
import { useGenesisPromoStore } from '~/stores/genesis-promo-store'
import {
  usePresaleActivePhaseQuery,
  usePresaleAgxPriceQuery,
  usePresaleAirdropThresholdQuery,
  usePresalePausedQuery,
  usePresalePhasesQuery,
  usePresaleTotalPurchasedQuery,
  usePresaleUserPhaseRemainingQuery,
  usePresaleUserTotalQuery,
  useUsd1PresaleWalletQuery,
} from '~/web3/presale/use-presale-queries'
import { readIsBindReferral } from '~/web3/referral/referral-read'
import { useActiveAccount } from '~/web3/thirdweb-react'

/**
 * 创世链上数据与活动文案
 *
 * 汇总预售各阶段、币价、暂停态、推荐绑定等只读数据，
 * 计算阶段与用户剩余额度、可购份额上限；
 * 不含份额草稿与写操作。
 *
 * @see docs/onchain-manual/contracts/presale.md
 */
export function useGenesisChainReads() {
  const account = useActiveAccount()
  const activeSeasonNumber = useGenesisPromoStore((state) => state.activeSeasonNumber)
  const discountLabel = useGenesisPromoStore((state) => state.discountLabel)
  const seasonOptions = useGenesisPromoStore((state) => state.seasonOptions)

  const address = account?.address
  const walletReady = Boolean(address)
  const purchaseQueriesEnabled = useDappHostStore((state) => state.activeTab === 'genesis')

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
  const userTotalQuery = usePresaleUserTotalQuery({ enabled: purchaseQueriesEnabled })
  const phaseRemainingQuery = usePresaleUserPhaseRemainingQuery(
    address,
    activePhaseQuery.data?.index,
    { enabled: purchaseQueriesEnabled },
  )
  const { usd1Balance, usd1BalanceKnown, allowance } = useUsd1PresaleWalletQuery(address, {
    enabled: purchaseQueriesEnabled,
  })
  /** 推荐绑定状态由这里统一查询；其它调用方直接使用 readIsBindReferral */
  const isBoundQuery = useChainQuery({
    queryKey: queryKeys.chain.referralIsBound,
    freshness: 'balances',
    enabled: purchaseQueriesEnabled && Boolean(address),
    queryFn: (walletAddress) => readIsBindReferral(walletAddress),
  })
  const isBound = isBoundQuery.data === true
  const needsReferralBind = walletReady && isBoundQuery.data === false
  const isPaused = pausedQuery.data === true
  const isPausedUnknown = walletReady && !(pausedQuery.isSuccess && pausedQuery.data !== undefined)

  const phases = phasesQuery.data ?? []
  const activePhase = activePhaseQuery.data ?? null
  const priceWei = sharePriceWei(activePhase)
  const userTotal = userTotalQuery.data ?? ZERO_BI
  const phaseRemaining = phaseRemainingQuery.data ?? null
  const agxPriceWei = agxPriceQuery.data ?? ZERO_BI
  const airdropThresholdUsd =
    airdropThresholdQuery.data !== undefined
      ? presaleAirdropThresholdToUsd(airdropThresholdQuery.data)
      : null

  const isLoading =
    phasesQuery.isLoading ||
    activePhaseQuery.isLoading ||
    agxPriceQuery.isLoading ||
    totalPurchasedQuery.isLoading ||
    (purchaseQueriesEnabled && walletReady && userTotalQuery.isLoading) ||
    (purchaseQueriesEnabled && walletReady && activePhase !== null && phaseRemainingQuery.isLoading)

  const phaseIndex = activePhase?.index ?? 0
  const fromChain = formatTokenAmountToNumber(agxPriceWei, USD1_DECIMALS)
  const agxPriceUsd = fromChain > 0 ? fromChain : 0
  const discountBps = Number(activePhase?.discountBps ?? 0)
  const minAmount = activePhase?.minAmount ?? ZERO_BI
  const maxAmount = activePhase?.maxAmount ?? ZERO_BI
  const phaseLeft = remainingPhaseAmount(phaseRemaining, activePhase)
  const userLeft = remainingUserAmount(phaseRemaining, activePhase, maxAmount)
  const maxShares = genesisMaxShares({
    sharePriceWei: priceWei,
    remainingPhaseAmount: phaseLeft,
    remainingUserAmount: userLeft,
    usd1Balance,
    walletReady,
  })
  const maxPurchasableWei = phaseLeft < userLeft ? phaseLeft : userLeft

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
    sharePriceWei: priceWei,
    userTotal,
    phaseRemaining,
    usd1Balance,
    usd1BalanceKnown,
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
    activeSeasonNumber,
    seasonOptions,
    totalPurchased: totalPurchasedQuery.data ?? ZERO_BI,
    globalPurchasedLoading: totalPurchasedQuery.isLoading,
    userPhaseAmountCurrent: phaseRemaining?.userPhaseAmountCurrent ?? ZERO_BI,
    seasonContributionMaxWei:
      phaseRemaining && phaseRemaining.userPurchaseLimit > ZERO_BI
        ? phaseRemaining.userPurchaseLimit
        : maxAmount,
    error: queryError,
  }
}
