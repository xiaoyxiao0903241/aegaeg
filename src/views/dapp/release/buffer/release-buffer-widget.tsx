import { DappTabHeader } from '~/app/shell/dapp-tab-header'
import { tokenCarouselIcons } from '~/app/assets'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { Button } from '~/shared/ui/button'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import { useReleaseBufferView } from '~/views/dapp/release/buffer/use-release-buffer-view'

export function ReleaseBufferWidget() {
  const vm = useReleaseBufferView()
  const { t } = vm

  return (
    <>
      <DappTabHeader
        backText={t.release.backToHub}
        onBack={vm.onBack}
        subtitle={t.release.buffer.intro}
        title={t.release.buffer.title}
      />
      <DappWidgetStack>
        <Card className="shadow-none" surface="outlined">
          <Card.Content className="grid gap-3">
            <div className="flex items-center gap-2">
              <DappIcon
                alt=""
                className="size-5 rounded-md"
                size="sm"
                src={tokenCarouselIcons.agxIcon}
              />
              <Text
                as="span"
                className="rounded-full bg-muted px-3 py-1 font-semibold"
                variant="caption"
              >
                AGX
              </Text>
            </div>
            <div className="flex justify-between gap-2">
              <Text as="span" tone="muted-foreground" variant="caption">
                {t.release.labels.released}{' '}
                <Text as="span" className="font-semibold text-primary" variant="caption">
                  {vm.claimableLabel}
                </Text>
              </Text>
              <Text as="span" tone="muted-foreground" variant="caption">
                {t.release.labels.releasing}{' '}
                <Text as="span" className="font-semibold text-foreground" variant="caption">
                  {vm.releasingLabel}
                </Text>
              </Text>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: vm.progressWidth }} />
            </div>
            <div className="flex justify-between gap-2">
              <Text as="span" tone="muted-foreground" variant="caption">
                {vm.releasedPctLabel}
              </Text>
              <Text as="span" tone="muted-foreground" variant="caption">
                {vm.valueHint}
              </Text>
            </div>
            <Button
              disabled={!vm.canClaim || vm.pending}
              onClick={() => void vm.onClaim()}
              type="button"
            >
              {t.release.buffer.claim}
            </Button>
          </Card.Content>
        </Card>

        <Card className="shadow-none" surface="outlined">
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
                gAGX
              </Text>
            </div>
            <div className="flex justify-between gap-2">
              <Text as="span" tone="muted-foreground" variant="caption">
                {t.release.labels.released}{' '}
                <Text as="span" className="font-semibold text-primary" variant="caption">
                  {vm.dash} gAGX
                </Text>
              </Text>
              <Text as="span" tone="muted-foreground" variant="caption">
                {t.release.labels.releasing}{' '}
                <Text as="span" className="font-semibold text-foreground" variant="caption">
                  {vm.dash} gAGX
                </Text>
              </Text>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-0 rounded-full bg-primary" />
            </div>
            <div className="flex justify-between gap-2">
              <Text as="span" tone="muted-foreground" variant="caption">
                {t.release.labels.releasedPct.replace('{pct}', '0')}
              </Text>
              <Text as="span" tone="muted-foreground" variant="caption">
                {'≈ —'}
              </Text>
            </div>
            <Text as="p" tone="muted-foreground" variant="caption">
              {t.release.buffer.gagxHint}
            </Text>
            <Button disabled type="button">
              {t.release.buffer.claim}
            </Button>
          </Card.Content>
        </Card>

        {vm.walletReady ? null : <DappWidgetConnectPromo />}
      </DappWidgetStack>
    </>
  )
}
