/**
 * 缓冲池页
 *
 * 顶部双卡展示 AGX 与 gAGX 的入池、已提取、释放中三组数据；
 * 中部为缓冲记录表，底部为机制步骤与收益说明。
 * gAGX 无链上数据源，数值显示为 0。
 */
import { useState } from 'react'

import { dappAssets, tokenCarouselIcons } from '~/app/assets'
import { useDappShell } from '~/app/use-dapp-shell'
import { formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { useBufferPoolLogs, useBufferPoolSummary } from '~/hooks/use-api-data'
import { useI18n } from '~/i18n/use-i18n'
import { formatApproxUsd, formatGroupedNumber } from '~/shared/api/format-display'
import { mapBufferPoolLogToRow } from '~/shared/api/map-flow-log-rows'
import { Card } from '~/shared/components/card'
import { Detail } from '~/shared/components/detail'
import { FaqList } from '~/shared/components/faq-list'
import { Section } from '~/shared/components/section'
import { Table } from '~/shared/components/table'
import { Text } from '~/shared/components/text'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { shouldShowTablePagination, tablePageQuery } from '~/shared/lib/table-pagination'
import { BufferAssetCard } from '~/views/dapp/release/buffer/buffer-asset-card'
import { formatReleaseApiOrChainLabel } from '~/views/dapp/release/format-release-api-or-chain-label'
import { useReleaseBufferSnapshot } from '~/views/dapp/release/use-release-reads'

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals

/** 缓冲机制四步图标 */
const MECHANISM_STEP_ICONS = [
  dappAssets.releaseBufferMechLock,
  dappAssets.releaseBufferMechWaves,
  dappAssets.releaseBufferMechClock,
  dappAssets.releaseBufferMechTrending,
] as const

export function ReleaseBufferDetail() {
  const { messages: t } = useI18n()
  const { walletReady, sessionReady } = useDappShell()
  const priceUsd = useAgxPriceUsd()
  const [recordsPage, setRecordsPage] = useState(1)
  const bufferQuery = useReleaseBufferSnapshot(walletReady)
  const apiSummaryQuery = useBufferPoolSummary(sessionReady)
  const bufferLogsQuery = useBufferPoolLogs(tablePageQuery(recordsPage), sessionReady)
  const bufferLogRows = bufferLogsQuery.data?.items.map(mapBufferPoolLogToRow) ?? []
  const bufferLogsTotal = bufferLogsQuery.data?.total ?? 0
  const bufferLogsLoading = sessionReady && bufferLogsQuery.isLoading
  const amount = bufferQuery.data?.totalAmount ?? 0n
  const claimed = bufferQuery.data?.totalClaimed ?? 0n
  const releasing = bufferQuery.data?.totalReleasing ?? 0n
  const api = apiSummaryQuery.data

  function amountNum(apiRaw: string | undefined, chain: bigint): number {
    if (sessionReady && apiRaw != null && apiRaw.trim() !== '') {
      const n = Number(apiRaw)
      if (Number.isFinite(n)) return n
    }
    return walletReady ? formatTokenAmountToNumber(chain, AGX_DECIMALS) : 0
  }

  const agxStats = [
    {
      label: t.release.buffer.entered,
      value: formatReleaseApiOrChainLabel({
        sessionReady,
        apiRaw: api?.cumulative_amount,
        chainReady: walletReady,
        chainValue: amount,
        decimals: AGX_DECIMALS,
        unit: 'AGX',
      }),
      approx: formatApproxUsd(amountNum(api?.cumulative_amount, amount), priceUsd),
    },
    {
      label: t.release.buffer.extracted,
      value: formatReleaseApiOrChainLabel({
        sessionReady,
        apiRaw: api?.released_amount,
        chainReady: walletReady,
        chainValue: claimed,
        decimals: AGX_DECIMALS,
        unit: 'AGX',
      }),
      approx: formatApproxUsd(amountNum(api?.released_amount, claimed), priceUsd),
    },
    {
      label: t.release.labels.releasing,
      value: formatReleaseApiOrChainLabel({
        sessionReady,
        apiRaw: api?.releasing_amount,
        chainReady: walletReady,
        chainValue: releasing,
        decimals: AGX_DECIMALS,
        unit: 'AGX',
      }),
      approx: formatApproxUsd(amountNum(api?.releasing_amount, releasing), priceUsd),
    },
  ]

  const gagxZero = `${formatGroupedNumber(0, { digits: 4 })} gAGX`
  const gagxZeroApprox = formatApproxUsd(0, null)
  const gagxStats = [
    { label: t.release.buffer.entered, value: gagxZero, approx: gagxZeroApprox },
    { label: t.release.buffer.extracted, value: gagxZero, approx: gagxZeroApprox },
    { label: t.release.labels.releasing, value: gagxZero, approx: gagxZeroApprox },
  ]

  const steps = t.release.buffer.mechanismSteps

  return (
    <Detail>
      <Section>
        <Section.Title id="release-buffer-title">{t.release.buffer.statsTitle}</Section.Title>
        <BufferAssetCard
          iconSrc={tokenCarouselIcons.agxIcon}
          slotId="release-buffer-stat-agx"
          stats={agxStats}
          tokenLabel="AGX"
        />
        <BufferAssetCard
          iconSrc={tokenCarouselIcons.gagxIcon}
          slotId="release-buffer-stat-gagx"
          stats={gagxStats}
          tokenLabel="gAGX"
        />
      </Section>

      <Section>
        <Section.Title>{t.release.buffer.recordsTitle}</Section.Title>
        <Table>
          <Table.Body
            colWidths={['12.5rem', '9.375rem', '11.25rem', '1fr']}
            empty={t.release.recordsEmpty}
            headers={[...t.release.recordColumns]}
            isLoading={bufferLogsLoading}
            rows={bufferLogRows}
          />
          {shouldShowTablePagination(bufferLogsTotal) ? (
            <Table.Footer>
              <Table.Pagination
                onPageChange={setRecordsPage}
                page={recordsPage}
                total={bufferLogsTotal}
              />
            </Table.Footer>
          ) : null}
        </Table>
      </Section>

      <Section>
        <Section.Title>{t.release.buffer.mechanismTitle}</Section.Title>
        <Section.Description>{t.release.buffer.mechanismSubtitle}</Section.Description>
        {/* 机制区：四张步骤卡 + 连接箭头 + 底部收益条；不用 Steps 组件与 Lucide 图标 */}
        <Card
          as="div"
          className="grid gap-2 rounded-2xl p-4"
          data-slot-id="release-buffer-mechanism"
          surface="elevated"
        >
          <div
            className="flex flex-col gap-3 lg:flex-row lg:items-center"
            data-slot-id="release-buffer-mech-stages"
          >
            {steps.map((step, index) => {
              const iconSrc = MECHANISM_STEP_ICONS[index] ?? MECHANISM_STEP_ICONS[0]
              const isLast = index >= steps.length - 1
              return (
                <div className="contents" key={`${step.title}-${step.body}`}>
                  <div className="flex w-full flex-col items-center justify-center rounded-2xl bg-muted p-4 lg:w-35 lg:shrink-0">
                    <span
                      className="grid size-11 place-items-center rounded-full"
                      data-slot-id={`release-buffer-mech-icon-${index}`}
                    >
                      <img alt="" className="size-5.5" src={iconSrc} />
                    </span>
                    <Text as="p" className="m-0 text-center font-medium" variant="copy">
                      {step.title}
                    </Text>
                    <Text as="p" className="m-0 text-center font-medium" variant="copy">
                      {step.body}
                    </Text>
                  </div>
                  {!isLast ? (
                    <span
                      className="hidden shrink-0 items-center justify-center lg:flex lg:flex-1"
                      data-slot-id={`release-buffer-mech-conn-${index}`}
                    >
                      <img
                        alt=""
                        className="h-2.5 w-3.25"
                        data-slot-id={`release-buffer-mech-arrow-${index}`}
                        src={dappAssets.releaseBufferMechArrow}
                      />
                    </span>
                  ) : null}
                </div>
              )
            })}
          </div>
          <ul
            className="m-0 flex list-none flex-wrap items-center justify-between gap-2 px-4 py-2.5"
            data-slot-id="release-buffer-mech-strip"
          >
            {t.release.buffer.mechanismBenefits.map((item) => (
              <li className="flex items-center gap-1.5" key={item}>
                <img alt="" className="size-3 shrink-0" src={dappAssets.releaseBufferMechCheck} />
                <Text as="span" className="font-medium text-foreground/70" variant="support">
                  {item}
                </Text>
              </li>
            ))}
          </ul>
        </Card>
      </Section>

      <Section>
        <Section.Title>{t.release.faq.title}</Section.Title>
        <FaqList defaultOpenFirst={false} items={t.release.faq.buffer} variant="dapp" />
      </Section>
    </Detail>
  )
}
