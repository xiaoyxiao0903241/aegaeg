/**
 * 释放队列左栏 Dock
 *
 * 按天数档位逐卡展示已释放、释放中与进度条；
 * 可刷新单档快照并领取已释放部分。
 */
import { tokenCarouselIcons } from '~/shared/config/assets'
import { ReleasePlanCard } from '~/views/dapp/release/primitives'
import { useQueue } from '~/views/dapp/release/queue/use-queue'
import { DockConnectPromo } from '~/views/dapp/shared/dock-connect-promo'
import { DockStack } from '~/views/dapp/shared/dock-frame'
import { TabHeader } from '~/views/dapp/shared/tab-header'

export function QueueDock() {
  const vm = useQueue()
  const { t } = vm

  return (
    <>
      <TabHeader
        backText={t.release.backToHub}
        onBack={vm.onBack}
        subtitle={t.release.queue.intro}
        title={t.release.queue.title}
      />
      <DockStack>
        <div
          aria-label={t.release.queue.title}
          className="grid gap-3"
          data-slot-id="release-queue-plan-list"
        >
          {vm.rows.map((row) => (
            <ReleasePlanCard data-slot-id={`release-queue-plan-${row.days}`} key={row.days}>
              <ReleasePlanCard.Header>
                <ReleasePlanCard.Token
                  iconSrc={tokenCarouselIcons.gagxIcon}
                  label={row.planLabel}
                />
                <ReleasePlanCard.Refresh
                  busy={vm.refreshingDays === row.days}
                  data-slot-id={`release-queue-refresh-${row.days}`}
                  disabled={vm.refreshingDays != null}
                  label={t.release.queue.refresh}
                  onClick={() => void vm.onRefresh(row.days)}
                />
              </ReleasePlanCard.Header>
              <ReleasePlanCard.Metrics
                releasedLabel={t.release.labels.released}
                releasedValue={row.claimableLabel}
                releasingLabel={t.release.labels.releasing}
                releasingValue={row.releasingLabel}
              />
              <ReleasePlanCard.Bar
                data-slot-id={`release-queue-bar-${row.days}`}
                width={row.progressWidth}
              />
              <ReleasePlanCard.Captions left={row.releasedPctLabel} right={row.valueHint} />
              <ReleasePlanCard.Action
                disabled={!row.canClaim || row.pending}
                loading={row.pending}
                onClick={() => void vm.onClaim(row.planIndex)}
              >
                {t.release.queue.claim}
              </ReleasePlanCard.Action>
            </ReleasePlanCard>
          ))}
        </div>

        {vm.walletReady ? null : <DockConnectPromo />}
      </DockStack>
    </>
  )
}
