/**
 * 释放总览左栏 Dock
 *
 * 两张入口卡展示释放队列与缓冲池的进度与金额，
 * 点击进入对应子视图；未连接钱包时展示连接引导。
 */
import { dappAssets } from '~/app/assets'
import { CountValue } from '~/shared/components/count-value'
import { Text } from '~/shared/components/text'
import { WidgetHeader } from '~/shared/components/widget-header'
import { openReleaseView } from '~/shared/config/dapp-open-views'
import { ReleaseEntryCard } from '~/views/dapp/release/hub/primitives'
import { useHub } from '~/views/dapp/release/hub/use-hub'
import { DetailToggle } from '~/views/dapp/shared/detail-toggle'
import { DockConnectPromo } from '~/views/dapp/shared/dock-connect-promo'
import { DockStack } from '~/views/dapp/shared/dock-frame'

export function HubDock() {
  const vm = useHub()
  const { t } = vm

  return (
    <>
      <WidgetHeader
        action={<DetailToggle />}
        className="[&_h1]:text-xl/none! [&_h1]:tracking-normal"
        subtitle={t.release.intro}
        title={t.release.title}
      />
      <DockStack>
        <ReleaseEntryCard
          className="gap-1.5"
          data-slot-id="release-pool-card"
          onClick={() => openReleaseView('queue')}
        >
          <ReleaseEntryCard.TitleRow>
            <img alt="" className="size-(--app-icon-caption)" src={dappAssets.releasePool} />
            <ReleaseEntryCard.Title>{t.release.queue.title}</ReleaseEntryCard.Title>
            <ReleaseEntryCard.Percent value={vm.queuePct} />
          </ReleaseEntryCard.TitleRow>
          <div className="grid grid-cols-2 gap-2">
            <Text as="p" className="m-0 text-foreground/40" variant="copy">
              {t.release.labels.releasing}
            </Text>
            <Text as="p" className="m-0 text-foreground/40" variant="copy">
              {t.release.labels.released}
            </Text>
            <Text as="strong" variant="headline">
              <CountValue text={vm.queueReleasingLabel} />
            </Text>
            <Text as="strong" tone="primary" variant="headline">
              <CountValue text={vm.queueClaimableLabel} />
            </Text>
            <Text as="p" className="m-0 text-foreground/40" variant="copy">
              {vm.queueReleasingApprox}
            </Text>
            <Text as="p" className="m-0 text-foreground/40" variant="copy">
              {vm.queueClaimableApprox}
            </Text>
          </div>
        </ReleaseEntryCard>

        <ReleaseEntryCard
          className="gap-2"
          data-slot-id="buffer-pool-card"
          onClick={() => openReleaseView('buffer')}
        >
          <ReleaseEntryCard.TitleRow>
            <img alt="" className="size-(--app-icon-caption)" src={dappAssets.bufferPool} />
            <ReleaseEntryCard.Title>{t.release.buffer.title}</ReleaseEntryCard.Title>
            <ReleaseEntryCard.Percent value={vm.bufferPct} />
          </ReleaseEntryCard.TitleRow>
          <div className="grid grid-cols-2 gap-2">
            <Text as="strong" variant="headline">
              <CountValue text={vm.bufferTotalAgx} />
            </Text>
            <Text as="strong" variant="headline">
              {vm.gagxZeroLabel}
            </Text>
            <Text as="p" className="m-0 text-foreground/40" variant="copy">
              {vm.bufferTotalApprox}
            </Text>
            <Text as="p" className="m-0 text-foreground/40" variant="copy">
              {vm.bufferGagxApprox}
            </Text>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <Text as="span" className="text-foreground/40" variant="copy">
                {t.release.labels.released}
              </Text>
              <Text as="span" tone="primary" variant="copy">
                <CountValue text={vm.bufferClaimedAgx} />
              </Text>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <Text as="span" className="text-foreground/40" variant="copy">
                {t.release.labels.released}
              </Text>
              <Text as="span" tone="primary" variant="copy">
                {vm.gagxZeroLabel}
              </Text>
            </div>
          </div>
        </ReleaseEntryCard>

        {!vm.walletReady ? <DockConnectPromo /> : null}
      </DockStack>
    </>
  )
}
