import { tokenCarouselIcons } from '~/app/assets'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappTabHeader } from '~/app/shell/dapp-tab-header'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'
import { useReleaseQueueView } from '~/views/dapp/release/queue/use-release-queue-view'

export function ReleaseQueueWidget() {
  const vm = useReleaseQueueView()
  const { t } = vm

  return (
    <>
      <DappTabHeader
        backText={t.release.backToHub}
        onBack={vm.onBack}
        subtitle={t.release.queue.intro}
        title={t.release.queue.title}
      />
      <DappWidgetStack>
        {vm.rows.map((row) => (
          <Card
            className="min-h-45.75 rounded-2xl p-4 shadow-none"
            key={row.days}
            surface="outlined"
          >
            <Card.Content className="grid gap-3">
              <div className="flex items-center gap-2">
                <DappIcon
                  alt=""
                  className="size-5 rounded-md"
                  size="sm"
                  src={tokenCarouselIcons.gagxIcon}
                />
                {/* Figma pill 25：min-h-6.25 */}
                <Text
                  as="span"
                  className="inline-flex min-h-6.25 items-center rounded-full bg-muted px-3 font-semibold"
                  variant="caption"
                >
                  {row.planLabel}
                </Text>
              </div>
              <div className="flex justify-between gap-2">
                <Text as="span" tone="muted-foreground" variant="caption">
                  {t.release.labels.released}{' '}
                  <Text as="span" className="font-semibold text-primary" variant="caption">
                    {row.claimableLabel}
                  </Text>
                </Text>
                <Text as="span" tone="muted-foreground" variant="caption">
                  {t.release.labels.releasing}{' '}
                  <Text as="span" className="font-semibold text-foreground" variant="caption">
                    {row.releasingLabel}
                  </Text>
                </Text>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: row.progressWidth }}
                />
              </div>
              <div className="flex justify-between gap-2">
                <Text as="span" tone="muted-foreground" variant="caption">
                  {row.releasedPctLabel}
                </Text>
                <Text as="span" tone="muted-foreground" variant="caption">
                  {row.valueHint}
                </Text>
              </div>
              <DappActionButton
                density="card"
                disabled={!row.canClaim || row.pending}
                loading={row.pending}
                onClick={() => void vm.onClaim(row.planIndex)}
                type="button"
              >
                {t.release.queue.claim}
              </DappActionButton>
            </Card.Content>
          </Card>
        ))}

        {vm.walletReady ? null : <DappWidgetConnectPromo />}
      </DappWidgetStack>
    </>
  )
}
