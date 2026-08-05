import { RefreshCw } from 'lucide-react'

import { tokenCarouselIcons } from '~/app/assets'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappTabHeader } from '~/app/shell/dapp-tab-header'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import { formatApproxUsd, formatGroupedNumber } from '~/shared/api/format-display'
import { Card } from '~/shared/components/card'
import { Icon } from '~/shared/components/icon'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'
import { useReleaseBufferView } from '~/views/dapp/release/buffer/use-release-buffer-view'

/** 币种标识：图标 + 圆角 pill（AGX / gAGX 双卡共用） */
function BufferTokenBadge({ iconSrc, label }: { iconSrc: string; label: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <Icon alt="" className="size-(--app-icon-xl) shrink-0 rounded-md" size="xl" src={iconSrc} />
      <Text
        as="span"
        className="inline-flex items-center rounded-full bg-muted px-3 py-1.5 leading-none font-semibold text-foreground/70"
        variant="support"
      >
        {label}
      </Text>
    </div>
  )
}

/**
 * 缓冲池交互面板
 *
 * AGX / gAGX 双卡展示已释放、释放中与进度条；
 * 右上角刷新按钮重读 AGX 链上快照，gAGX 无数据源时显示 0。
 */
export function ReleaseBufferWidget() {
  const vm = useReleaseBufferView()
  const { t } = vm
  const gagxZero = `${formatGroupedNumber(0, { digits: 4 })} gAGX`

  return (
    <>
      <DappTabHeader
        backText={t.release.backToHub}
        onBack={vm.onBack}
        subtitle={t.release.buffer.intro}
        title={t.release.buffer.title}
      />
      <DappWidgetStack>
        <Card
          className="rounded-2xl p-4 shadow-none"
          data-slot-id="release-buffer-card-agx"
          surface="outlined"
        >
          <Card.Content className="grid gap-3">
            <div className="flex items-center justify-between gap-2">
              <BufferTokenBadge iconSrc={tokenCarouselIcons.agxIcon} label="AGX" />
              <button
                aria-busy={vm.refreshing}
                aria-label={t.release.buffer.refresh}
                className="grid size-6 shrink-0 place-items-center bg-transparent text-foreground/40 transition-colors hover:text-foreground disabled:opacity-60"
                data-slot-id="release-buffer-refresh-agx"
                disabled={vm.refreshing}
                onClick={() => void vm.onRefresh()}
                type="button"
              >
                <RefreshCw
                  aria-hidden
                  className={cn('size-4', vm.refreshing && 'animate-spin')}
                  strokeWidth={2}
                />
              </button>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <Text as="span" className="text-foreground/40" variant="copy">
                  {t.release.labels.released}
                </Text>
                <Text as="span" className="font-semibold text-primary" variant="copy">
                  {vm.claimableLabel}
                </Text>
              </div>
              <div className="flex items-center gap-1">
                <Text as="span" className="text-foreground/40" variant="copy">
                  {t.release.labels.releasing}
                </Text>
                <Text as="span" className="font-semibold text-foreground" variant="copy">
                  {vm.releasingLabel}
                </Text>
              </div>
            </div>

            <div
              className="overflow-hidden rounded-full bg-muted"
              data-slot-id="release-buffer-bar-agx"
            >
              <div className="rounded-full bg-primary" style={{ width: vm.progressWidth }} />
            </div>

            <div className="flex justify-between gap-2">
              <Text as="span" className="text-foreground/40" variant="support">
                {vm.releasedPctLabel}
              </Text>
              <Text as="span" className="text-foreground/40" variant="support">
                {vm.valueHint}
              </Text>
            </div>

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

        <Card
          className="rounded-2xl p-4 shadow-none"
          data-slot-id="release-buffer-card-gagx"
          surface="outlined"
        >
          <Card.Content className="grid gap-3">
            <div className="flex items-center justify-between gap-2">
              <BufferTokenBadge iconSrc={tokenCarouselIcons.gagxIcon} label="gAGX" />
              <button
                aria-label={t.release.buffer.refresh}
                className="grid size-6 shrink-0 place-items-center bg-transparent text-foreground/40"
                data-slot-id="release-buffer-refresh-gagx"
                disabled
                type="button"
              >
                <RefreshCw aria-hidden className="size-4" strokeWidth={2} />
              </button>
            </div>

            {/* 释放合约无 gAGX 数据源：数值显示 0 */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <Text as="span" className="text-foreground/40" variant="copy">
                  {t.release.labels.released}
                </Text>
                <Text as="span" className="font-semibold text-primary" variant="copy">
                  {gagxZero}
                </Text>
              </div>
              <div className="flex items-center gap-1">
                <Text as="span" className="text-foreground/40" variant="copy">
                  {t.release.labels.releasing}
                </Text>
                <Text as="span" className="font-semibold text-foreground" variant="copy">
                  {gagxZero}
                </Text>
              </div>
            </div>

            <div
              className="overflow-hidden rounded-full bg-muted"
              data-slot-id="release-buffer-bar-gagx"
            >
              <div className="w-0 rounded-full bg-primary" />
            </div>

            <div className="flex justify-between gap-2">
              <Text as="span" className="text-foreground/40" variant="support">
                {t.release.labels.releasedPct.replace('{pct}', '0')}
              </Text>
              <Text as="span" className="text-foreground/40" variant="support">
                {formatApproxUsd(0, null)}
              </Text>
            </div>

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
