import { dappAssets } from '~/app/assets'
import { DappPanelToggle } from '~/app/shell/dapp-panel-toggle'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import { useDappShell } from '~/app/use-dapp-shell'
import { formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { useBufferPoolSummary, useReleasePoolSummary } from '~/hooks/use-api-data'
import { useI18n } from '~/i18n/use-i18n'
import { formatApproxUsd, formatGroupedNumber } from '~/shared/api/format-display'
import { openReleaseView } from '~/shared/config/dapp-open-views'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { Card } from '~/shared/ui/card'
import { DappCountValue } from '~/shared/ui/dapp-count-value'
import { Text } from '~/shared/ui/text'
import { WidgetHeader } from '~/shared/ui/widget-header'
import { formatReleaseApiOrChainLabel } from '~/views/dapp/release/format-release-api-or-chain-label'
import { formatReleasePct } from '~/views/dapp/release/release-display'
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
  const { walletReady, sessionReady } = useDappShell()
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
  /** PRV 无 gAGX 源：空态用 0（禁 —） */
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
        action={<DappPanelToggle />}
        className="[&_h1]:text-xl/none! [&_h1]:tracking-normal"
        subtitle={t.release.intro}
        title={t.release.title}
      />
      <DappWidgetStack>
        {/* Figma 4298:365：outlined · py16 · gap · 已释放 coral；高随内容 */}
        <Card
          as="button"
          className="duration-dapp-fast flex w-full cursor-pointer flex-col gap-1.5 rounded-2xl px-4 py-4 text-left shadow-none hover:border-primary"
          data-slot-id="release-pool-card"
          onClick={() => openReleaseView('queue')}
          surface="outlined"
          type="button"
        >
          <div className="flex items-center gap-2.5">
            <img
              alt=""
              className="size-(--app-icon-caption) shrink-0"
              src={dappAssets.releasePool}
            />
            <Text as="span" className="min-w-0 flex-1 font-semibold" variant="caption">
              {t.release.queue.title}
            </Text>
            <Text as="span" variant="caption">
              <DappCountValue text={queuePct} />
            </Text>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Text as="p" className="text-foreground/40" variant="caption">
              {t.release.labels.releasing}
            </Text>
            <Text as="p" className="text-foreground/40" variant="caption">
              {t.release.labels.released}
            </Text>
            <Text as="p" className="font-semibold" variant="copy">
              <DappCountValue text={queueReleasingLabel} />
            </Text>
            <Text as="p" className="font-semibold text-primary" variant="copy">
              <DappCountValue text={queueClaimableLabel} />
            </Text>
            <Text as="p" className="text-foreground/40" variant="caption">
              {queueReleasingApprox}
            </Text>
            <Text as="p" className="text-foreground/40" variant="caption">
              {queueClaimableApprox}
            </Text>
          </div>
        </Card>

        {/* Figma 4298:376：总额行在上 · 已释放行在下（coral）；高随内容 */}
        <Card
          as="button"
          className="duration-dapp-fast flex w-full cursor-pointer flex-col gap-2 rounded-2xl px-4 py-4 text-left shadow-none hover:border-primary"
          data-slot-id="buffer-pool-card"
          onClick={() => openReleaseView('buffer')}
          surface="outlined"
          type="button"
        >
          <div className="flex items-center gap-2.5">
            <img
              alt=""
              className="size-(--app-icon-caption) shrink-0"
              src={dappAssets.bufferPool}
            />
            <Text as="span" className="min-w-0 flex-1 font-semibold" variant="caption">
              {t.release.buffer.title}
            </Text>
            <Text as="span" variant="caption">
              <DappCountValue text={bufferPct} />
            </Text>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Text as="p" className="font-semibold" variant="copy">
              <DappCountValue text={bufferTotalAgx} />
            </Text>
            <Text as="p" className="font-semibold" variant="copy">
              {gagxZeroLabel}
            </Text>
            <Text as="p" className="text-foreground/40" variant="caption">
              {bufferTotalApprox}
            </Text>
            <Text as="p" className="text-foreground/40" variant="caption">
              {bufferGagxApprox}
            </Text>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <Text as="span" className="text-foreground/40" variant="caption">
                {t.release.labels.released}
              </Text>
              <Text as="span" className="text-primary" variant="caption">
                <DappCountValue text={bufferClaimedAgx} />
              </Text>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <Text as="span" className="text-foreground/40" variant="caption">
                {t.release.labels.released}
              </Text>
              <Text as="span" className="text-primary" variant="caption">
                {gagxZeroLabel}
              </Text>
            </div>
          </div>
        </Card>

        {!walletReady ? <DappWidgetConnectPromo /> : null}
      </DappWidgetStack>
    </>
  )
}
