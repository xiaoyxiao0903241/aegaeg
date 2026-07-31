import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { formatTokenAmount } from '~/core/exchange/token-amount'
import { dappAssets, exchangeHubAssets } from '~/app/assets'
import { useI18n } from '~/i18n/use-i18n'
import { openReleaseView } from '~/shared/config/open-release-view'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { useDappShell } from '~/app/use-dapp-shell'
import { Text } from '~/shared/ui/text'
import { WidgetHeader } from '~/shared/ui/widget-header'
import { Card } from '~/shared/ui/card'
import { DappPanelToggle } from '~/app/shell/dapp-panel-toggle'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import {
  useReleaseBufferSnapshot,
  useReleaseQueueSnapshot,
} from '~/views/dapp/release/use-release-reads'
import { formatReleasePct } from '~/views/dapp/release/release-display'

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals
const DASH = '—'

export function ReleaseHubWidget() {
  const { messages: t } = useI18n()
  const { walletReady } = useDappShell()
  const queueQuery = useReleaseQueueSnapshot(walletReady)
  const bufferQuery = useReleaseBufferSnapshot(walletReady)

  const queueClaimable = queueQuery.data?.totalClaimable ?? 0n
  const queueReleasing = queueQuery.data?.totalReleasing ?? 0n
  const bufferClaimable = bufferQuery.data?.totalClaimable ?? 0n
  const bufferReleasing = bufferQuery.data?.totalReleasing ?? 0n

  const dash = t.release.dash
  const queuePct = walletReady ? formatReleasePct(queueClaimable, queueReleasing) : dash
  const bufferPct = walletReady ? formatReleasePct(bufferClaimable, bufferReleasing) : dash
  const queueReleasingLabel = walletReady
    ? `${formatTokenAmount(queueReleasing, AGX_DECIMALS, 4)} ${t.release.units.queue}`
    : dash
  const queueClaimableLabel = walletReady
    ? `${formatTokenAmount(queueClaimable, AGX_DECIMALS, 4)} ${t.release.units.queue}`
    : dash
  const bufferTotalAgx = walletReady
    ? `${formatTokenAmount(bufferClaimable + bufferReleasing, AGX_DECIMALS, 4)} AGX`
    : dash
  const bufferClaimedAgx = walletReady
    ? `${formatTokenAmount(bufferClaimable, AGX_DECIMALS, 4)} AGX`
    : dash

  return (
    <>
      <WidgetHeader
        action={<DappPanelToggle />}
        subtitle={t.release.intro}
        title={t.release.title}
      />
      <DappWidgetStack>
        <Card
          as="button"
          className="duration-dapp-fast flex w-full cursor-pointer flex-col gap-2 text-left shadow-none hover:border-primary"
          data-tour-id="release-pool-card"
          onClick={() => openReleaseView('queue')}
          surface="outlined"
          type="button"
        >
          <div className="flex items-center gap-2">
            <img alt="" className="size-5 shrink-0" src={dappAssets.release} />
            <Text as="span" className="min-w-0 flex-1 text-[13px] font-semibold" variant="copy">
              {t.release.queue.title}
            </Text>
            <Text as="span" className="text-[13px]" variant="caption">
              {queuePct}
            </Text>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Text as="p" tone="muted-foreground" variant="caption">
              {t.release.labels.releasing}
            </Text>
            <Text as="p" tone="muted-foreground" variant="caption">
              {t.release.labels.released}
            </Text>
            <Text as="p" className="font-semibold" variant="copy">
              {queueReleasingLabel}
            </Text>
            <Text as="p" className="font-semibold text-primary" variant="copy">
              {queueClaimableLabel}
            </Text>
            <Text as="p" tone="muted-foreground" variant="caption">
              {walletReady ? '≈ —' : dash}
            </Text>
            <Text as="p" tone="muted-foreground" variant="caption">
              {walletReady ? '≈ —' : dash}
            </Text>
          </div>
        </Card>

        <Card
          as="button"
          className="duration-dapp-fast flex w-full cursor-pointer flex-col gap-2 text-left shadow-none hover:border-primary"
          data-tour-id="buffer-pool-card"
          onClick={() => openReleaseView('buffer')}
          surface="outlined"
          type="button"
        >
          <div className="flex items-center gap-2">
            <img alt="" className="size-5 shrink-0" src={exchangeHubAssets.modeTurbine} />
            <Text as="span" className="min-w-0 flex-1 text-[13px] font-semibold" variant="copy">
              {t.release.buffer.title}
            </Text>
            <Text as="span" className="text-[13px]" variant="caption">
              {bufferPct}
            </Text>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Text as="p" className="font-semibold" variant="copy">
              {bufferTotalAgx}
            </Text>
            <Text as="p" className="font-semibold" variant="copy">
              {DASH} gAGX
            </Text>
            <Text as="p" tone="muted-foreground" variant="caption">
              {walletReady ? '≈ —' : dash}
            </Text>
            <Text as="p" tone="muted-foreground" variant="caption">
              {walletReady ? '≈ —' : dash}
            </Text>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5">
              <Text as="span" tone="muted-foreground" variant="caption">
                {t.release.labels.released}
              </Text>
              <Text as="span" className="text-primary" variant="caption">
                {bufferClaimedAgx}
              </Text>
            </div>
            <div className="flex items-center gap-1.5">
              <Text as="span" tone="muted-foreground" variant="caption">
                {t.release.labels.released}
              </Text>
              <Text as="span" className="text-primary" variant="caption">
                {DASH} gAGX
              </Text>
            </div>
          </div>
        </Card>

        {!walletReady ? <DappWidgetConnectPromo /> : null}
      </DappWidgetStack>
    </>
  )
}
