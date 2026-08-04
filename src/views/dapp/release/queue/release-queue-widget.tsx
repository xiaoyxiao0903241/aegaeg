import { RefreshCw } from 'lucide-react'

import { tokenCarouselIcons } from '~/app/assets'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappTabHeader } from '~/app/shell/dapp-tab-header'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import { Card } from '~/shared/components/card'
import { Icon } from '~/shared/components/icon'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'
import { useReleaseQueueView } from '~/views/dapp/release/queue/use-release-queue-view'

/**
 * Figma `4466:442` plan 卡：icon20 + pill · 金额行 · bar6 · 领取 pill。
 * 右上：产品改刷新（替稿 radio）；只重读被点档并 patch 缓存，loading 时图标旋转。
 * 高随内容（禁 min-h 钉稿 183）。
 */
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
        <div
          aria-label={t.release.queue.title}
          className="grid gap-3"
          data-slot-id="release-queue-plan-list"
        >
          {vm.rows.map((row) => (
            <Card
              className="rounded-2xl p-4 shadow-none"
              data-slot-id={`release-queue-plan-${row.days}`}
              key={row.days}
              surface="outlined"
            >
              <Card.Content className="grid gap-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <Icon
                      alt=""
                      className="size-(--app-icon-xl) shrink-0 rounded-md"
                      size="xl"
                      src={tokenCarouselIcons.gagxIcon}
                    />
                    <Text
                      as="span"
                      className="inline-flex items-center rounded-full bg-muted px-3 py-1 font-semibold text-foreground/70"
                      variant="caption"
                    >
                      {row.planLabel}
                    </Text>
                  </div>
                  <button
                    aria-busy={vm.refreshingDays === row.days}
                    aria-label={t.release.queue.refresh}
                    className="grid size-6 shrink-0 place-items-center bg-transparent text-foreground/40 transition-colors hover:text-foreground disabled:opacity-60"
                    data-slot-id={`release-queue-refresh-${row.days}`}
                    disabled={vm.refreshingDays != null}
                    onClick={() => void vm.onRefresh(row.days)}
                    type="button"
                  >
                    <RefreshCw
                      aria-hidden
                      className={cn('size-4', vm.refreshingDays === row.days && 'animate-spin')}
                      strokeWidth={2}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <Text as="span" className="text-foreground/40" variant="detail">
                      {t.release.labels.released}
                    </Text>
                    <Text as="span" className="font-semibold text-primary" variant="detail">
                      {row.claimableLabel}
                    </Text>
                  </div>
                  <div className="flex items-center gap-1">
                    <Text as="span" className="text-foreground/40" variant="detail">
                      {t.release.labels.releasing}
                    </Text>
                    <Text as="span" className="font-semibold text-foreground" variant="detail">
                      {row.releasingLabel}
                    </Text>
                  </div>
                </div>

                <div
                  className="h-1.5 overflow-hidden rounded-full bg-muted"
                  data-slot-id={`release-queue-bar-${row.days}`}
                >
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: row.progressWidth }}
                  />
                </div>

                <div className="flex justify-between gap-2">
                  <Text as="span" className="text-foreground/40" variant="caption">
                    {row.releasedPctLabel}
                  </Text>
                  <Text as="span" className="text-foreground/40" variant="caption">
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
        </div>

        {vm.walletReady ? null : <DappWidgetConnectPromo />}
      </DappWidgetStack>
    </>
  )
}
