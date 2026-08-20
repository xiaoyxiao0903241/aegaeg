import { useState } from 'react'

import { isHardWriteBlockReason } from '~/core/wallet/write-cta'
import { useAgxContributionBurnLogs, useAgxContributionConsumeLogs } from '~/hooks/use-api-data'
import { useDappHost } from '~/hooks/use-dapp-host'
import { usePresentUserFacingError } from '~/hooks/use-present-user-facing-error'
import { useI18n } from '~/i18n/use-i18n'
import { tablePageQuery } from '~/shared/lib/table-pagination'
import {
  mapAgxContributionBurnLogToRow,
  mapAgxContributionConsumeLogToRow,
} from '~/shared/presenters/map-flow-log-rows'
import { useExchangeViewStore } from '~/stores/exchange-view-store'
import type { BurnExchangeState } from '~/views/dapp/exchange/exchange-session-hosts'
import { formatExchangeBalanceLabel } from '~/views/dapp/exchange/labels'
import { submitExchangeWithSuccessToast } from '~/views/dapp/exchange/submit-with-success-toast'

/** 组装销毁面板渲染所需：会话状态 + 文案 + 错误提示编排。 */
export function useBurn(burn: BurnExchangeState) {
  const { messages: t } = useI18n()
  const setView = useExchangeViewStore((state) => state.setView)
  const { sessionReady } = useDappHost()
  const { pair } = burn

  const sellBalanceLabel = formatExchangeBalanceLabel({
    label: t.exchange.balance,
    value: burn.sellBalanceLabel,
    sessionReady,
    walletReady: burn.walletReady,
  })
  const buyBalanceLabel = formatExchangeBalanceLabel({
    label: t.exchange.burn.currentContribution,
    value: burn.contributionBalanceLabel,
    sessionReady,
    walletReady: burn.walletReady,
  })

  const blockHint =
    burn.blockReason != null && isHardWriteBlockReason(burn.blockReason)
      ? t.exchange.burn.blocked[burn.blockReason]
      : null

  usePresentUserFacingError(burn.validationError, {
    id: 'burn-exchange-quote-error',
    trigger: burn.quoteErrorUpdatedAt,
  })

  return {
    t,
    sessionReady,
    pair,
    onBack: () => setView('hub'),
    sellBalanceLabel,
    buyBalanceLabel,
    blockHint,
    onSubmit: () => submitExchangeWithSuccessToast(burn.submit, t.exchange.burn.success),
  }
}

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
export function useBurnHistory() {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappHost()
  const [tab, setTabState] = useState<BurnHistoryTab>('burn')
  const [page, setPage] = useState(1)
  const pageQuery = tablePageQuery(page)
  const burnLogs = useAgxContributionBurnLogs(pageQuery, sessionReady && tab === 'burn')
  const consumeLogs = useAgxContributionConsumeLogs(pageQuery, sessionReady && tab === 'consume')

  const tabOptions: Array<{ label: string; value: BurnHistoryTab }> = [
    { label: t.exchange.burn.history.tabs.burn, value: 'burn' },
    { label: t.exchange.burn.history.tabs.consume, value: 'consume' },
  ]

  function setTab(next: BurnHistoryTab) {
    if (next === tab) return
    setTabState(next)
    setPage(1)
  }

  const activeQuery = tab === 'burn' ? burnLogs : consumeLogs
  const rows =
    tab === 'burn'
      ? (burnLogs.data?.items.map(mapAgxContributionBurnLogToRow) ?? [])
      : (consumeLogs.data?.items.map((item) =>
          mapAgxContributionConsumeLogToRow(item, t.exchange.burn.history.purpose),
        ) ?? [])
  const isLoading = sessionReady && activeQuery.isLoading
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
    page,
    setPage,
    total: activeQuery.data?.total ?? 0,
    headers:
      tab === 'burn'
        ? ([...t.exchange.burn.history.burnColumns] as string[])
        : ([...t.exchange.burn.history.consumeColumns] as string[]),
  }
}
