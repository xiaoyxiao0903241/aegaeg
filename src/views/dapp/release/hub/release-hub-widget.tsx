import { dappAssets, exchangeHubAssets } from '~/app/assets'
import { useI18n } from '~/i18n/use-i18n'
import { openReleaseView } from '~/shared/config/open-release-view'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { useDappShell } from '~/app/use-dapp-shell'
import { Text } from '~/shared/ui/text'
import { WidgetHeader } from '~/shared/ui/widget-header'
import { Card } from '~/shared/ui/card'
import {
  ExchangePanelToggle,
  ExchangeWidgetBody,
} from '~/views/dapp/exchange/exchange-widget-composites'
import {
  useReleaseBufferSnapshot,
  useReleaseQueueSnapshot,
} from '~/views/dapp/release/use-release-reads'
import { formatReleaseAmount, formatReleasePct } from '~/views/dapp/release/release-display'

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

  return (
    <>
      <WidgetHeader
        action={<ExchangePanelToggle />}
        subtitle={t.release.intro}
        title={t.release.title}
      />
      <ExchangeWidgetBody>
        <Card
          as="button"
          className="duration-dapp-fast w-full cursor-pointer text-left shadow-none hover:border-primary"
          onClick={() => openReleaseView('queue')}
          surface="outlined"
          type="button"
        >
          <Card.Content className="grid gap-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <img alt="" className="size-5" src={dappAssets.release} />
                <Text as="span" className="font-semibold" variant="copy">
                  {t.release.queue.title}
                </Text>
              </div>
              <Text as="span" tone="muted-foreground" variant="caption">
                {walletReady ? formatReleasePct(queueClaimable, queueReleasing) : dash}
              </Text>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Text as="p" tone="muted-foreground" variant="caption">
                  {t.release.labels.releasing}
                </Text>
                <Text as="p" className="font-semibold" variant="copy">
                  {walletReady
                    ? `${formatReleaseAmount(queueReleasing)} ${t.release.units.queue}`
                    : dash}
                </Text>
              </div>
              <div>
                <Text as="p" tone="muted-foreground" variant="caption">
                  {t.release.labels.released}
                </Text>
                <Text as="p" className="font-semibold" variant="copy">
                  {walletReady
                    ? `${formatReleaseAmount(queueClaimable)} ${t.release.units.queue}`
                    : dash}
                </Text>
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card
          as="button"
          className="duration-dapp-fast w-full cursor-pointer text-left shadow-none hover:border-primary"
          onClick={() => openReleaseView('buffer')}
          surface="outlined"
          type="button"
        >
          <Card.Content className="grid gap-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <img alt="" className="size-5" src={exchangeHubAssets.modeTurbine} />
                <Text as="span" className="font-semibold" variant="copy">
                  {t.release.buffer.title}
                </Text>
              </div>
              <Text as="span" tone="muted-foreground" variant="caption">
                {walletReady ? formatReleasePct(bufferClaimable, bufferReleasing) : dash}
              </Text>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Text as="p" className="font-semibold" variant="copy">
                  {walletReady
                    ? `${formatReleaseAmount(bufferClaimable + bufferReleasing)} AGX`
                    : dash}
                </Text>
                <Text as="p" tone="muted-foreground" variant="caption">
                  {t.release.labels.released}{' '}
                  {walletReady ? `${formatReleaseAmount(bufferClaimable)} AGX` : dash}
                </Text>
              </div>
              <div>
                <Text as="p" className="font-semibold" variant="copy">
                  {dash} gAGX
                </Text>
                <Text as="p" tone="muted-foreground" variant="caption">
                  {t.release.labels.released} {dash} gAGX
                </Text>
              </div>
            </div>
          </Card.Content>
        </Card>

        {!walletReady ? <DappWidgetConnectPromo /> : null}
      </ExchangeWidgetBody>
    </>
  )
}
