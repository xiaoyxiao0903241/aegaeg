import type { ReactNode } from 'react'
import { toast } from 'sonner'

import { goBindReferral } from '~/app/shell/go-bind-referral'
import { useAppShell } from '~/app/use-app-shell'
import { formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { formatAmountBalanceLabel, writeCtaLabel } from '~/core/wallet/write-cta'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { useBondFlowBurnPurchases, useBondFlowLpPurchases } from '~/hooks/use-api-data'
import { useChainQuery } from '~/hooks/use-chain-query'
import { useI18n } from '~/i18n/use-i18n'
import { formatApproxUsd, formatGroupedNumber } from '~/shared/api/format-display'
import { mapBondPurchaseToAsideRow } from '~/shared/api/map-flow-log-rows'
import { queryKeys } from '~/shared/api/query/query-keys'
import type { Address } from '~/shared/config/contracts'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { useStakingViewStore } from '~/stores/staking-view-store'
import { BOND_ZAP_BLOCKED, type BondKind } from '~/views/dapp/staking/bond/submit-bond-zap'
import { useBondWidget } from '~/views/dapp/staking/bond/use-bond-widget'
import { RebaseCountdownValue, StakingTokenMetricValue } from '~/views/dapp/staking/primitives'
import {
  formatAsideAgxLabel,
  formatAsideGagxLabel,
  formatAsideRebasePct,
} from '~/views/dapp/staking/shared'
import { readBurnBondPositions, readLpBondPositions } from '~/web3/assets/assets-read'
import { readErrorText } from '~/web3/errors/error-text'
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
  const { sessionReady, walletReady } = useAppShell()
  const copy = kind === 'lp' ? t.staking.lpbond : t.staking.burnbond

  const bond = useBondWidget(kind, sessionReady, {
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
    balance: !sessionReady || !walletReady ? '0.00' : bond.balanceLabel,
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
const ZERO_PCT = `${formatGroupedNumber(0, { digits: 2 })}%`

/**
 * 债券详情右栏（LP / 燃烧债券共用）
 *
 * 概览与仓位数值与资产页同源链读；
 * 协议 TVL / 溢价率暂无数据源，显示 0。
 *
 * @param kind 债券类型：lp / burn
 * @returns 右栏概览、仓位、记录表的展示数据
 */
export function useBondDetail(kind: BondKind) {
  const { messages: t } = useI18n()
  const { sessionReady } = useAppShell()
  const account = useActiveAccount()
  const walletReady = hasWalletAccount(account)
  const copy = kind === 'lp' ? t.staking.lpbond : t.staking.burnbond
  const priceUsd = useAgxPriceUsd()
  const overviewQuery = useStakingHubOverviewQuery()
  const bondProduct = kind === 'lp' ? 'lpbond' : 'burnbond'
  const bondQuery = useChainQuery({
    queryKey: queryKeys.chain.assetsBondPositions(bondProduct),
    queryFn: (addr) =>
      kind === 'lp' ? readLpBondPositions(addr as Address) : readBurnBondPositions(addr as Address),
  })
  const lpPurchases = useBondFlowLpPurchases({}, sessionReady && kind === 'lp')
  const burnPurchases = useBondFlowBurnPurchases({}, sessionReady && kind === 'burn')
  const purchasesQuery = kind === 'lp' ? lpPurchases : burnPurchases

  const rebaseLabel = formatAsideRebasePct(overviewQuery.data?.rebaseRate1e18)

  const overviewItems: Array<{ label: string; value: ReactNode }> = [
    {
      label: copy.overviewMetrics[0]?.label ?? '',
      value: (
        <StakingTokenMetricValue
          approx={formatApproxUsd(0, priceUsd)}
          icon="agx"
          value={formatAsideAgxLabel(0)}
        />
      ),
    },
    {
      label: copy.overviewMetrics[1]?.label ?? '',
      value: ZERO_PCT,
    },
    {
      label: copy.overviewMetrics[2]?.label ?? '',
      value: (
        <RebaseCountdownValue
          currentBlock={overviewQuery.data?.currentBlock}
          epochEndBlock={overviewQuery.data?.epochEndBlock}
        />
      ),
    },
    {
      label: copy.overviewMetrics[3]?.label ?? '',
      value: rebaseLabel,
    },
  ]

  const rows = walletReady && bondQuery.data != null ? bondQuery.data : []
  let payoutRemaining = 0n
  let pendingPayout = 0n
  let profit = 0n
  for (const row of rows) {
    payoutRemaining += row.payoutRemaining
    pendingPayout += row.pendingPayout
    profit += row.profit
  }
  const pendingRelease = payoutRemaining > pendingPayout ? payoutRemaining - pendingPayout : 0n

  const held = formatTokenAmountToNumber(payoutRemaining, AGX_DECIMALS)
  const released = formatTokenAmountToNumber(pendingPayout, AGX_DECIMALS)
  const pending = formatTokenAmountToNumber(pendingRelease, AGX_DECIMALS)
  const rebaseGagx = formatTokenAmountToNumber(profit, GAGX_DECIMALS)

  const positionItems: Array<{ label: string; value: ReactNode }> = [
    {
      label: copy.positionMetrics[0]?.label ?? '',
      value: (
        <StakingTokenMetricValue
          approx={formatApproxUsd(held, priceUsd)}
          icon="agx"
          value={formatAsideAgxLabel(held)}
        />
      ),
    },
    {
      label: copy.positionMetrics[1]?.label ?? '',
      value: (
        <StakingTokenMetricValue
          approx={formatApproxUsd(released, priceUsd)}
          icon="agx"
          value={formatAsideAgxLabel(released)}
        />
      ),
    },
    {
      label: copy.positionMetrics[2]?.label ?? '',
      value: (
        <StakingTokenMetricValue
          approx={formatApproxUsd(pending, priceUsd)}
          icon="agx"
          value={formatAsideAgxLabel(pending)}
        />
      ),
    },
    {
      label: copy.positionMetrics[3]?.label ?? '',
      value: (
        <StakingTokenMetricValue
          approx={formatApproxUsd(rebaseGagx, priceUsd)}
          icon="gagx"
          value={formatAsideGagxLabel(rebaseGagx)}
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
