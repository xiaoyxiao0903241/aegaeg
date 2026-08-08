import type { ReactNode } from 'react'
import { toast } from 'sonner'

import { ZERO_BI } from '~/core/constants'
import { formatTokenAmount, formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import type { BondKind } from '~/core/staking/staking-period'
import { formatAmountBalanceLabel, writeCtaLabel } from '~/core/wallet/write-cta'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { useBondFlowBurnPurchases, useBondFlowLpPurchases } from '~/hooks/use-api-data'
import { useChainQuery } from '~/hooks/use-chain-query'
import { useDappHost } from '~/hooks/use-dapp-host'
import { useI18n } from '~/i18n/use-i18n'
import { queryKeys } from '~/shared/api/query/query-keys'
import type { Address } from '~/shared/config/contracts'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { formatNumber, formatUsdApprox } from '~/shared/presenters/format'
import { mapBondPurchaseToAsideRow } from '~/shared/presenters/map-flow-log-rows'
import { useStakingViewStore } from '~/stores/staking-view-store'
import { goBindReferral } from '~/views/dapp/shared/navigation'
import { BOND_ZAP_BLOCKED } from '~/views/dapp/staking/bond/submit-bond-zap'
import { useBondSession } from '~/views/dapp/staking/bond/use-bond-session'
import { RebaseCountdownValue, StakingTokenMetricValue } from '~/views/dapp/staking/primitives'
import { formatRebasePct } from '~/views/dapp/staking/shared'
import { readBurnBondPositions, readLpBondPositions } from '~/web3/assets/assets-read'
import { readErrorText } from '~/web3/errors/error-text'
import {
  burnBondDepositoryAddress,
  lpBondDepositoryAddress,
} from '~/web3/staking/staking-addresses'
import { formatBondDiscountLabel, readBondMarketMeta } from '~/web3/staking/staking-read'
import { useStakingHubOverviewQuery } from '~/web3/staking/use-staking-queries'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { hasWalletAccount } from '~/web3/wallet/wallet-connection-state'

/**
 * 债券视图：组合表单状态、CTA 文案与提交入口
 *
 * 提交被推荐关系拦截时引导补绑；
 * 被迁移拦截时停留在原页。
 *
 * @param kind 债券类型：lp / burn
 * @returns 债券表单状态与交互回调
 */
export function useBondDock(kind: BondKind) {
  const { messages: t } = useI18n()
  const setView = useStakingViewStore((state) => state.setView)
  const { sessionReady, walletReady } = useDappHost()
  const copy = kind === 'lp' ? t.staking.lpbond : t.staking.burnbond

  const bond = useBondSession(kind, sessionReady, {
    onSuccess: () => {
      toast.success(copy.success)
    },
    onError: (error) => {
      if (readErrorText(error) === BOND_ZAP_BLOCKED.notBound) goBindReferral()
    },
  })

  const ctaLabel = writeCtaLabel(bond.writePhase, {
    accountMigrated: t.staking.blocked.accountMigrated,
    bindReferral: t.staking.stake.bindCta,
    submit: copy.submit,
  })

  const amountLabel = formatAmountBalanceLabel(copy.amountBalance, {
    balance: sessionReady && walletReady ? bond.balanceLabel : '',
    digits: 4,
  })

  async function onSubmit() {
    if (bond.blockReason === 'accountMigrated') return
    if (bond.blockReason === 'notBound') {
      goBindReferral()
      return
    }
    await bond.submit()
  }

  return {
    t,
    bond,
    copy,
    sessionReady,
    walletReady,
    setView,
    amountLabel,
    ctaLabel,
    onSubmit,
    periodLabels: {
      '180': t.staking.stake.periods.d180,
      '360': t.staking.stake.periods.d360,
      '540': t.staking.stake.periods.d540,
    },
  }
}

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals
const GAGX_DECIMALS = EXCHANGE_CONFIG.tokens.gagx.decimals
const ZERO_PCT = `${formatNumber(0, { digits: 2 })}%`

/**
 * 债券详情右栏（LP / 燃烧债券共用）
 *
 * 概览 TVL / 折扣来自各周期 BondDepository 市场元数据；
 * Rebase 与倒计时与质押 hub 同源。
 *
 * @param kind 债券类型：lp / burn
 * @returns 右栏概览、仓位、记录表的展示数据
 */
export function useBondDetail(kind: BondKind) {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappHost()
  const account = useActiveAccount()
  const walletReady = hasWalletAccount(account)
  const copy = kind === 'lp' ? t.staking.lpbond : t.staking.burnbond
  const priceUsd = useAgxPriceUsd()
  const overviewQuery = useStakingHubOverviewQuery()
  const depositoryAddress = kind === 'lp' ? lpBondDepositoryAddress : burnBondDepositoryAddress
  const market180 = useChainQuery({
    queryKey: queryKeys.chain.bondMarketMeta(depositoryAddress('180')),
    scope: 'public',
    freshness: 'quote',
    queryFn: () => readBondMarketMeta(depositoryAddress('180')),
  })
  const market360 = useChainQuery({
    queryKey: queryKeys.chain.bondMarketMeta(depositoryAddress('360')),
    scope: 'public',
    freshness: 'quote',
    queryFn: () => readBondMarketMeta(depositoryAddress('360')),
  })
  const market540 = useChainQuery({
    queryKey: queryKeys.chain.bondMarketMeta(depositoryAddress('540')),
    scope: 'public',
    freshness: 'quote',
    queryFn: () => readBondMarketMeta(depositoryAddress('540')),
  })
  const bondProduct = kind === 'lp' ? 'lpbond' : 'burnbond'
  const bondQuery = useChainQuery({
    queryKey: queryKeys.chain.assetsBondPositions(bondProduct),
    queryFn: (addr) =>
      kind === 'lp' ? readLpBondPositions(addr as Address) : readBurnBondPositions(addr as Address),
  })
  const lpPurchases = useBondFlowLpPurchases({}, sessionReady && kind === 'lp')
  const burnPurchases = useBondFlowBurnPurchases({}, sessionReady && kind === 'burn')
  const purchasesQuery = kind === 'lp' ? lpPurchases : burnPurchases

  const rebaseLabel = formatRebasePct(overviewQuery.data?.rebaseRate1e18)

  const totalDeposit = [market180.data, market360.data, market540.data].reduce(
    (sum, m) => sum + (m?.totalDeposit ?? ZERO_BI),
    ZERO_BI,
  )
  const totalDepositNum = formatTokenAmountToNumber(totalDeposit, AGX_DECIMALS)
  // 溢价/折扣：取已加载周期中折扣最深（discountRateBP 最小）的展示
  const deepestDiscount = [market180.data, market360.data, market540.data]
    .filter((m): m is NonNullable<typeof m> => m != null)
    .reduce<bigint | null>((best, m) => {
      if (best == null || m.discountRateBP < best) return m.discountRateBP
      return best
    }, null)
  const premiumLabel = deepestDiscount == null ? ZERO_PCT : formatBondDiscountLabel(deepestDiscount)

  const rows = walletReady && bondQuery.data != null ? bondQuery.data : []
  let payoutRemaining = ZERO_BI
  let pendingPayout = ZERO_BI
  let profit = ZERO_BI
  for (const row of rows) {
    payoutRemaining += row.payoutRemaining
    pendingPayout += row.pendingPayout
    profit += row.profit
  }
  const pendingRelease = payoutRemaining > pendingPayout ? payoutRemaining - pendingPayout : ZERO_BI

  const held = formatTokenAmountToNumber(payoutRemaining, AGX_DECIMALS)
  const released = formatTokenAmountToNumber(pendingPayout, AGX_DECIMALS)
  const pending = formatTokenAmountToNumber(pendingRelease, AGX_DECIMALS)
  const rebaseGagx = formatTokenAmountToNumber(profit, GAGX_DECIMALS)

  const overviewItems: Array<{ label: string; value: ReactNode }> = [
    {
      label: copy.overviewMetrics[0]?.label ?? '',
      value: (
        <StakingTokenMetricValue
          approx={formatUsdApprox(totalDepositNum, priceUsd)}
          icon="agx"
          value={`${formatTokenAmount(totalDeposit, AGX_DECIMALS, 2)} AGX`}
        />
      ),
    },
    {
      label: copy.overviewMetrics[1]?.label ?? '',
      value: premiumLabel,
    },
    {
      label: copy.overviewMetrics[2]?.label ?? '',
      value: (
        <RebaseCountdownValue
          currentBlock={overviewQuery.data?.currentBlock}
          epochEndBlock={overviewQuery.data?.epochEndBlock}
          secondsPerBlock={overviewQuery.data?.secondsPerBlock}
        />
      ),
    },
    {
      label: copy.overviewMetrics[3]?.label ?? '',
      value: rebaseLabel,
    },
  ]

  const positionItems: Array<{ label: string; value: ReactNode }> = [
    {
      label: copy.positionMetrics[0]?.label ?? '',
      value: (
        <StakingTokenMetricValue
          approx={formatUsdApprox(held, priceUsd)}
          icon="agx"
          value={`${formatTokenAmount(payoutRemaining, AGX_DECIMALS, 2)} AGX`}
        />
      ),
    },
    {
      label: copy.positionMetrics[1]?.label ?? '',
      value: (
        <StakingTokenMetricValue
          approx={formatUsdApprox(released, priceUsd)}
          icon="agx"
          value={`${formatTokenAmount(pendingPayout, AGX_DECIMALS, 2)} AGX`}
        />
      ),
    },
    {
      label: copy.positionMetrics[2]?.label ?? '',
      value: (
        <StakingTokenMetricValue
          approx={formatUsdApprox(pending, priceUsd)}
          icon="agx"
          value={`${formatTokenAmount(pendingRelease, AGX_DECIMALS, 2)} AGX`}
        />
      ),
    },
    {
      label: copy.positionMetrics[3]?.label ?? '',
      value: (
        <StakingTokenMetricValue
          approx={formatUsdApprox(rebaseGagx, priceUsd)}
          icon="gagx"
          value={`${formatTokenAmount(profit, GAGX_DECIMALS, 2)} gAGX`}
        />
      ),
    },
  ]

  const recordRows = purchasesQuery.data?.items.map(mapBondPurchaseToAsideRow) ?? []
  const recordsLoading = sessionReady && purchasesQuery.isLoading && purchasesQuery.data == null

  return {
    copy,
    overviewItems,
    positionItems,
    recordRows,
    recordsLoading,
  }
}
