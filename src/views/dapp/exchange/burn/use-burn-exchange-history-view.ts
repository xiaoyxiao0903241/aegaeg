import { useState } from 'react'

import { useAppShell } from '~/app/use-app-shell'
import { useAgxContributionBurnLogs, useAgxContributionConsumeLogs } from '~/hooks/use-api-data'
import { useI18n } from '~/i18n/use-i18n'
import {
  mapAgxContributionBurnLogToRow,
  mapAgxContributionConsumeLogToRow,
} from '~/shared/api/map-flow-log-rows'

export type BurnHistoryTab = 'burn' | 'consume'

/**
 * 销毁记录视图：销毁 / 贡献点消耗两个 Tab 的列表数据
 *
 * 按当前 Tab 拉取对应日志接口并映射为表格行；
 * 会话未就绪时不发起请求。
 *
 * @see docs/backend-api/api.md #agx-contribution/burn-logs
 * @see docs/backend-api/api.md #agx-contribution/consume-logs
 */
export function useBurnExchangeHistoryView() {
  const { messages: t } = useI18n()
  const { sessionReady } = useAppShell()
  const [tab, setTab] = useState<BurnHistoryTab>('burn')
  const burnLogs = useAgxContributionBurnLogs({}, sessionReady && tab === 'burn')
  const consumeLogs = useAgxContributionConsumeLogs({}, sessionReady && tab === 'consume')

  const tabOptions: Array<{ label: string; value: BurnHistoryTab }> = [
    { label: t.exchange.burn.history.tabs.burn, value: 'burn' },
    { label: t.exchange.burn.history.tabs.consume, value: 'consume' },
  ]

  const rows =
    tab === 'burn'
      ? (burnLogs.data?.items.map(mapAgxContributionBurnLogToRow) ?? [])
      : (consumeLogs.data?.items.map(mapAgxContributionConsumeLogToRow) ?? [])
  const isLoading = sessionReady && (tab === 'burn' ? burnLogs.isLoading : consumeLogs.isLoading)
  const emptyTitle =
    tab === 'burn' ? t.exchange.burn.history.emptyBurn : t.exchange.burn.history.emptyConsume

  return {
    t,
    tab,
    setTab,
    tabOptions,
    rows,
    isLoading,
    emptyTitle,
    colWidths:
      tab === 'burn'
        ? (['12.5rem', '9.375rem', '11.25rem', '1fr'] as const)
        : (['12.5rem', '11.25rem', '1fr'] as const),
    headers:
      tab === 'burn'
        ? ([...t.exchange.burn.history.burnColumns] as string[])
        : ([...t.exchange.burn.history.consumeColumns] as string[]),
  }
}
