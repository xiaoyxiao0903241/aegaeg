/**
 * 释放总览交互面板
 *
 * 两张入口卡展示释放队列与缓冲池的进度与金额，
 * 点击进入对应子视图；未连接钱包时展示连接引导。
 */
import { dappAssets } from '~/app/assets'
import { PanelToggle } from '~/app/shell/panel-toggle'
import { WidgetConnectPromo } from '~/app/shell/widget-connect-promo'
import { WidgetStack } from '~/app/shell/widget-frame'
import { useAppShell } from '~/app/use-app-shell'
import { formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { useBufferPoolSummary, useReleasePoolSummary } from '~/hooks/use-api-data'
import { useI18n } from '~/i18n/use-i18n'
import { formatApproxUsd, formatGroupedNumber } from '~/shared/api/format-display'
import { CountValue } from '~/shared/components/count-value'
import { Text } from '~/shared/components/text'
import { WidgetHeader } from '~/shared/components/widget-header'
import { openReleaseView } from '~/shared/config/dapp-open-views'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { formatReleaseApiOrChainLabel } from '~/views/dapp/release/format-release-api-or-chain-label'
import { formatReleasePct } from '~/views/dapp/release/release-display'
import { ReleaseEntryCard } from '~/views/dapp/release/release-entry-card'
import {
  useReleaseBufferSnapshot,
  useReleaseQueueSnapshot,
} from '~/views/dapp/release/use-release-reads'

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals

function parseApiAmount(raw: string | undefined): number | null {
  if (raw == null || raw.trim() === '') return null
  const n = Number(raw)
  return Number.isFinite(n) ? n : null
}

export function ReleaseHubWidget() {
  const { messages: t } = useI18n()
  const { walletReady, sessionReady } = useAppShell()
  const priceUsd = useAgxPriceUsd()
  const queueQuery = useReleaseQueueSnapshot(walletReady)
  const bufferQuery = useReleaseBufferSnapshot(walletReady)
  const releaseApi = useReleasePoolSummary(sessionReady)
  const bufferApi = useBufferPoolSummary(sessionReady)

  const queueClaimable = queueQuery.data?.totalClaimable ?? 0n
  const queueReleasing = queueQuery.data?.totalReleasing ?? 0n
  const bufferClaimable = bufferQuery.data?.totalClaimable ?? 0n
  const bufferReleasing = bufferQuery.data?.totalReleasing ?? 0n
  const chainReady = walletReady && queueQuery.data != null
  const bufferChainReady = walletReady && bufferQuery.data != null

  const queuePct = formatReleasePct(queueClaimable, queueReleasing)
  const bufferPct = formatReleasePct(bufferClaimable, bufferReleasing)

  const queueUnit = t.release.units.queue
  const queueReleasingLabel = formatReleaseApiOrChainLabel({
    sessionReady,
    apiRaw: releaseApi.data?.releasing_amount,
    chainReady,
    chainValue: queueReleasing,
    decimals: AGX_DECIMALS,
    unit: queueUnit,
  })
  const queueClaimableLabel = formatReleaseApiOrChainLabel({
    sessionReady,
    apiRaw: releaseApi.data?.released_amount,
    chainReady,
    chainValue: queueClaimable,
    decimals: AGX_DECIMALS,
    unit: queueUnit,
  })

  const bufferTotalChain = bufferClaimable + bufferReleasing
  const bufferTotalAgx = formatReleaseApiOrChainLabel({
    sessionReady,
    apiRaw: bufferApi.data?.cumulative_amount,
    chainReady: bufferChainReady,
    chainValue: bufferTotalChain,
    decimals: AGX_DECIMALS,
    unit: 'AGX',
  })
  const bufferClaimedAgx = formatReleaseApiOrChainLabel({
    sessionReady,
    apiRaw: bufferApi.data?.released_amount,
    chainReady: bufferChainReady,
    chainValue: bufferClaimable,
    decimals: AGX_DECIMALS,
    unit: 'AGX',
  })
  const gagxZeroLabel = `${formatGroupedNumber(0, { digits: 4 })} ${t.release.units.queue}`

  const queueReleasingNum =
    parseApiAmount(releaseApi.data?.releasing_amount) ??
    (chainReady ? formatTokenAmountToNumber(queueReleasing, AGX_DECIMALS) : 0)
  const queueClaimableNum =
    parseApiAmount(releaseApi.data?.released_amount) ??
    (chainReady ? formatTokenAmountToNumber(queueClaimable, AGX_DECIMALS) : 0)
  const bufferTotalNum =
    parseApiAmount(bufferApi.data?.cumulative_amount) ??
    (bufferChainReady ? formatTokenAmountToNumber(bufferTotalChain, AGX_DECIMALS) : 0)

  const queueReleasingApprox = formatApproxUsd(queueReleasingNum, priceUsd)
  const queueClaimableApprox = formatApproxUsd(queueClaimableNum, priceUsd)
  const bufferTotalApprox = formatApproxUsd(bufferTotalNum, priceUsd)
  const bufferGagxApprox = formatApproxUsd(0, null)

  return (
    <>
      <WidgetHeader
        action={<PanelToggle />}
        className="[&_h1]:text-xl/none! [&_h1]:tracking-normal"
        subtitle={t.release.intro}
        title={t.release.title}
      />
      <WidgetStack>
        <ReleaseEntryCard
          className="gap-1.5"
          data-slot-id="release-pool-card"
          onClick={() => openReleaseView('queue')}
        >
          <ReleaseEntryCard.TitleRow>
            <img alt="" className="size-(--app-icon-caption)" src={dappAssets.releasePool} />
            <ReleaseEntryCard.Title>{t.release.queue.title}</ReleaseEntryCard.Title>
            <ReleaseEntryCard.Percent value={queuePct} />
          </ReleaseEntryCard.TitleRow>
          <div className="grid grid-cols-2 gap-2">
            <Text as="p" className="m-0 text-foreground/40" variant="copy">
              {t.release.labels.releasing}
            </Text>
            <Text as="p" className="m-0 text-foreground/40" variant="copy">
              {t.release.labels.released}
            </Text>
            <Text as="strong" variant="headline">
              <CountValue text={queueReleasingLabel} />
            </Text>
            <Text as="strong" tone="primary" variant="headline">
              <CountValue text={queueClaimableLabel} />
            </Text>
            <Text as="p" className="m-0 text-foreground/40" variant="copy">
              {queueReleasingApprox}
            </Text>
            <Text as="p" className="m-0 text-foreground/40" variant="copy">
              {queueClaimableApprox}
            </Text>
          </div>
        </ReleaseEntryCard>

        <ReleaseEntryCard
          className="gap-2"
          data-slot-id="buffer-pool-card"
          onClick={() => openReleaseView('buffer')}
        >
          <ReleaseEntryCard.TitleRow>
            <img alt="" className="size-(--app-icon-caption)" src={dappAssets.bufferPool} />
            <ReleaseEntryCard.Title>{t.release.buffer.title}</ReleaseEntryCard.Title>
            <ReleaseEntryCard.Percent value={bufferPct} />
          </ReleaseEntryCard.TitleRow>
          <div className="grid grid-cols-2 gap-2">
            <Text as="strong" variant="headline">
              <CountValue text={bufferTotalAgx} />
            </Text>
            <Text as="strong" variant="headline">
              {gagxZeroLabel}
            </Text>
            <Text as="p" className="m-0 text-foreground/40" variant="copy">
              {bufferTotalApprox}
            </Text>
            <Text as="p" className="m-0 text-foreground/40" variant="copy">
              {bufferGagxApprox}
            </Text>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <Text as="span" className="text-foreground/40" variant="copy">
                {t.release.labels.released}
              </Text>
              <Text as="span" tone="primary" variant="copy">
                <CountValue text={bufferClaimedAgx} />
              </Text>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <Text as="span" className="text-foreground/40" variant="copy">
                {t.release.labels.released}
              </Text>
              <Text as="span" tone="primary" variant="copy">
                {gagxZeroLabel}
              </Text>
            </div>
          </div>
        </ReleaseEntryCard>

        {!walletReady ? <WidgetConnectPromo /> : null}
      </WidgetStack>
    </>
  )
}
