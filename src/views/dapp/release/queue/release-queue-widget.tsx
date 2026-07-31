import { DappTabHeader } from '~/app/shell/dapp-tab-header'
import { tokenCarouselIcons } from '~/app/assets'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { Button } from '~/shared/ui/button'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
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
          <Card className="shadow-none" key={row.days} surface="outlined">
            <Card.Content className="grid gap-3">
              <div className="flex items-center gap-2">
                <DappIcon
                  alt=""
                  className="size-5 rounded-md"
                  size="sm"
                  src={tokenCarouselIcons.gagxIcon}
                />
                <Text
                  as="span"
                  className="rounded-full bg-muted px-3 py-1 font-semibold"
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
              <Button
                disabled={!row.canClaim || row.pending}
                onClick={() => void vm.onClaim(row.planIndex)}
                type="button"
              >
                {t.release.queue.claim}
              </Button>
            </Card.Content>
          </Card>
        ))}

        {vm.walletReady ? null : <DappWidgetConnectPromo />}
      </DappWidgetStack>
    </>
  )
}
