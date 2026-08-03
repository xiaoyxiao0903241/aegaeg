import type { ReactNode } from 'react'

import { tokenCarouselIcons } from '~/app/assets'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappTabHeader } from '~/app/shell/dapp-tab-header'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import { formatApproxUsd, formatGroupedNumber } from '~/shared/api/format-display'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'
import { useReleaseBufferView } from '~/views/dapp/release/buffer/use-release-buffer-view'

function BufferTokenHeader({ iconSrc, label }: { iconSrc: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <DappIcon alt="" className="size-5 rounded-md" size="sm" src={iconSrc} />
      <Text
        as="span"
        className="inline-flex min-h-6.25 items-center rounded-full bg-muted px-3 font-semibold"
        variant="caption"
      >
        {label}
      </Text>
    </div>
  )
}

function BufferProgressBar({ width }: { width: string }) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
      <div className="h-full rounded-full bg-primary" style={{ width }} />
    </div>
  )
}

function BufferStatPair({
  releasedLabel,
  releasedValue,
  releasingLabel,
  releasingValue,
}: {
  releasedLabel: string
  releasedValue: string
  releasingLabel: string
  releasingValue: string
}) {
  return (
    <div className="flex justify-between gap-2">
      <Text as="span" tone="muted-foreground" variant="caption">
        {releasedLabel}{' '}
        <Text as="span" className="font-semibold text-primary" variant="caption">
          {releasedValue}
        </Text>
      </Text>
      <Text as="span" tone="muted-foreground" variant="caption">
        {releasingLabel}{' '}
        <Text as="span" className="font-semibold text-foreground" variant="caption">
          {releasingValue}
        </Text>
      </Text>
    </div>
  )
}

function BufferFooterPair({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <div className="flex justify-between gap-2">
      <Text as="span" tone="muted-foreground" variant="caption">
        {left}
      </Text>
      <Text as="span" tone="muted-foreground" variant="caption">
        {right}
      </Text>
    </div>
  )
}

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
        {/* Figma buf 卡 183：min-h-45.75 + p-4；CTA card≈41 */}
        <Card className="min-h-45.75 rounded-2xl p-4 shadow-none" surface="outlined">
          <Card.Content className="grid gap-3">
            <BufferTokenHeader iconSrc={tokenCarouselIcons.agxIcon} label="AGX" />
            <BufferStatPair
              releasedLabel={t.release.labels.released}
              releasedValue={vm.claimableLabel}
              releasingLabel={t.release.labels.releasing}
              releasingValue={vm.releasingLabel}
            />
            <BufferProgressBar width={vm.progressWidth} />
            <BufferFooterPair left={vm.releasedPctLabel} right={vm.valueHint} />
            <DappActionButton
              density="card"
              disabled={!vm.canClaim || vm.pending}
              loading={vm.pending}
              onClick={() => void vm.onClaim()}
              type="button"
            >
              {t.release.buffer.claim}
            </DappActionButton>
          </Card.Content>
        </Card>

        <Card className="min-h-45.75 rounded-2xl p-4 shadow-none" surface="outlined">
          <Card.Content className="grid gap-3">
            <BufferTokenHeader iconSrc={tokenCarouselIcons.gagxIcon} label="gAGX" />
            {/* PRV 无 gAGX 源：空态 0 */}
            <BufferStatPair
              releasedLabel={t.release.labels.released}
              releasedValue={`${formatGroupedNumber(0, { digits: 4 })} gAGX`}
              releasingLabel={t.release.labels.releasing}
              releasingValue={`${formatGroupedNumber(0, { digits: 4 })} gAGX`}
            />
            <BufferProgressBar width="0%" />
            <BufferFooterPair
              left={t.release.labels.releasedPct.replace('{pct}', '0')}
              right={formatApproxUsd(0, null)}
            />
            <DappActionButton density="card" disabled type="button">
              {t.release.buffer.claim}
            </DappActionButton>
          </Card.Content>
        </Card>

        {vm.walletReady ? null : <DappWidgetConnectPromo />}
      </DappWidgetStack>
    </>
  )
}
