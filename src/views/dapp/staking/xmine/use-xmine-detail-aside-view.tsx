import type { ReactNode } from 'react'

import { useDappShell } from '~/app/use-dapp-shell'
import { formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import {
  useAssetsHoldingsDistribution,
  useX0MiningLogs,
  useX0MiningPositions,
} from '~/hooks/use-api-data'
import { useChainQuery } from '~/hooks/use-chain-query'
import { useI18n } from '~/i18n/use-i18n'
import { formatApproxUsd, formatGroupedNumber } from '~/shared/api/format-display'
import { mapX0MiningLogToOpsRow } from '~/shared/api/map-flow-log-rows'
import { queryKeys } from '~/shared/api/query/query-keys'
import { Text } from '~/shared/components/text'
import type { Address } from '~/shared/config/contracts'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import {
  formatAsideAgxLabel,
  formatAsideGagxLabel,
  formatAsideXLabel,
  parseApiAmount,
} from '~/views/dapp/staking/staking-aside-format'
import { StakingTokenMetricValue } from '~/views/dapp/staking/staking-token-metric-value'
import { readXminePosition } from '~/web3/assets/assets-read'
import { useXmineOverviewQuery } from '~/web3/staking/use-staking-queries'
import {
  agxAmountPerXFromXPerAgx,
  formatXmineDailyYieldLabel,
} from '~/web3/staking/xmine-overview-read'

const ZERO_PCT = `${formatGroupedNumber(0, { digits: 2 })}%`
const GAGX_DECIMALS = EXCHANGE_CONFIG.tokens.gagx.decimals
const X_DECIMALS = EXCHANGE_CONFIG.tokens.x.decimals
const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals
/** 下次产出倒计时：无结算时刻 → 显示占位符（gaps §3.4） */
const NEXT_EMISSION_EMPTY = '—'

/**
 * Xmine 详情右栏
 *
 * 仓位链读 `readXminePosition`，记录走 `/x0-mining/logs`；
 * 协议概览走 `readXmineOverview`（activeGons / xPerAgx / yieldRateBP）。
 * 累计产出暂无数据源，显示 0。
 *
 * @returns 右栏概览、仓位、记录表的展示数据
 * @see docs/backend-api/api.md #x0-mining/logs
 */
export function useXmineDetailAsideView() {
  const { messages: t } = useI18n()
  const { sessionReady, walletReady } = useDappShell()
  const priceUsd = useAgxPriceUsd()
  const positionsQuery = useX0MiningPositions({}, sessionReady)
  const logsQuery = useX0MiningLogs({}, sessionReady)
  const distQuery = useAssetsHoldingsDistribution(sessionReady)
  const overviewQuery = useXmineOverviewQuery()
  const chainPosition = useChainQuery({
    queryKey: queryKeys.chain.assetsXminePosition,
    queryFn: (addr) => readXminePosition(addr as Address),
    enabled: walletReady,
  })

  const tvlGagx =
    overviewQuery.data != null
      ? formatTokenAmountToNumber(overviewQuery.data.activeGons, GAGX_DECIMALS)
      : 0
  const agxPerX =
    overviewQuery.data != null
      ? formatTokenAmountToNumber(
          agxAmountPerXFromXPerAgx(overviewQuery.data.xPerAgx),
          AGX_DECIMALS,
        )
      : 0
  const dailyYield =
    overviewQuery.data != null
      ? formatXmineDailyYieldLabel(overviewQuery.data.yieldRateBP)
      : ZERO_PCT

  const overviewItems: Array<{ label: string; value: ReactNode }> = [
    {
      label: t.staking.xmine.overviewMetrics[0]?.label ?? '',
      value: (
        <StakingTokenMetricValue
          approx={formatApproxUsd(tvlGagx, priceUsd)}
          icon="gagx"
          value={formatAsideGagxLabel(tvlGagx)}
        />
      ),
    },
    {
      label: t.staking.xmine.overviewMetrics[1]?.label ?? '',
      value: (
        <StakingTokenMetricValue
          approx={formatApproxUsd(agxPerX, priceUsd)}
          icon="agx"
          value={formatAsideAgxLabel(agxPerX)}
        />
      ),
    },
    {
      // 累计产出：无协议累计 X view / 历史 API → 显示 0（gaps §3.4）
      label: t.staking.xmine.overviewMetrics[2]?.label ?? '',
      value: <StakingTokenMetricValue icon="x" value={formatAsideXLabel(0)} />,
    },
    {
      label: t.staking.xmine.overviewMetrics[3]?.label ?? '',
      value: (
        <Text as="span" className="font-semibold text-success" variant="copy">
          {dailyYield}
        </Text>
      ),
    },
    {
      label: t.staking.xmine.overviewMetrics[4]?.label ?? '',
      value: (
        <Text as="span" className="font-semibold" variant="detail">
          {NEXT_EMISSION_EMPTY}
        </Text>
      ),
    },
  ]

  const apiHeld = parseApiAmount(
    distQuery.data?.stake_x_pool ?? positionsQuery.data?.total_stake_amount,
  )
  const chainHeld =
    chainPosition.data != null
      ? formatTokenAmountToNumber(chainPosition.data.miningStake, GAGX_DECIMALS)
      : null
  const held = chainHeld ?? (walletReady || sessionReady ? apiHeld : 0)

  const pendingX =
    chainPosition.data != null
      ? formatTokenAmountToNumber(chainPosition.data.pending, X_DECIMALS)
      : 0
  const pendingValueGagx =
    chainPosition.data != null
      ? formatTokenAmountToNumber(chainPosition.data.pendingValue, GAGX_DECIMALS)
      : 0

  const positionItems: Array<{ label: string; value: ReactNode }> = [
    {
      label: t.staking.xmine.positionMetrics[0]?.label ?? '',
      value: (
        <StakingTokenMetricValue
          approx={formatApproxUsd(held, priceUsd)}
          icon="gagx"
          value={formatAsideGagxLabel(held)}
        />
      ),
    },
    {
      label: t.staking.xmine.positionMetrics[1]?.label ?? '',
      // 已释放：本页无 PRV 已释字段 → 显示 0（资产页启发式另记 gaps）
      value: (
        <StakingTokenMetricValue
          approx={formatApproxUsd(0, priceUsd)}
          icon="gagx"
          value={formatAsideGagxLabel(0)}
        />
      ),
    },
    {
      label: t.staking.xmine.positionMetrics[2]?.label ?? '',
      value: (
        <StakingTokenMetricValue
          approx={formatApproxUsd(pendingValueGagx, priceUsd)}
          icon="x"
          value={formatAsideXLabel(pendingX)}
        />
      ),
    },
  ]

  const recordRows = logsQuery.data?.items.map(mapX0MiningLogToOpsRow) ?? []
  const recordsLoading = sessionReady && logsQuery.isLoading && logsQuery.data == null

  return {
    overviewItems,
    positionItems,
    recordRows,
    recordsLoading,
  }
}
