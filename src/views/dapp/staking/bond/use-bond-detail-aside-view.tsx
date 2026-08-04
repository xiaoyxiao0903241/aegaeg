import type { ReactNode } from 'react'

import { useDappShell } from '~/app/use-dapp-shell'
import { formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { useBondFlowBurnPurchases, useBondFlowLpPurchases } from '~/hooks/use-api-data'
import { useChainQuery } from '~/hooks/use-chain-query'
import { useI18n } from '~/i18n/use-i18n'
import { formatApproxUsd, formatGroupedNumber } from '~/shared/api/format-display'
import { mapBondPurchaseToAsideRow } from '~/shared/api/map-flow-log-rows'
import { queryKeys } from '~/shared/api/query/query-keys'
import type { Address } from '~/shared/config/contracts'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import type { BondKind } from '~/views/dapp/staking/bond/submit-bond-zap'
import { RebaseCountdownValue } from '~/views/dapp/staking/rebase-countdown-value'
import {
  formatAsideAgxLabel,
  formatAsideGagxLabel,
  formatAsideRebasePct,
} from '~/views/dapp/staking/staking-aside-format'
import { StakingTokenMetricValue } from '~/views/dapp/staking/staking-token-metric-value'
import { readBurnBondPositions, readLpBondPositions } from '~/web3/assets/assets-read'
import { useStakingHubOverviewQuery } from '~/web3/staking/use-staking-queries'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { hasWalletAccount } from '~/web3/wallet/wallet-connection-state'

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals
const GAGX_DECIMALS = EXCHANGE_CONFIG.tokens.gagx.decimals
const ZERO_PCT = `${formatGroupedNumber(0, { digits: 2 })}%`

/**
 * Bond 右栏 — chrome 跟 Stake（`StakingDetailAside`）；仓位与资产仓位同源链读。
 * 协议 TVL / 溢价率：无 OpenAPI/手册读 → 诚实 0（gaps §3.3）。
 */
export function useBondDetailAsideView(kind: BondKind) {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
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
