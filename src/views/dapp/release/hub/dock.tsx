/**
 * 释放总览左栏 Dock
 *
 * 两张入口卡展示释放队列与缓冲池的进度与金额，
 * 点击进入对应子视图；未连接钱包时展示连接引导。
 */
import { usePrincipalReleaseDurationDays } from '~/hooks/use-principal-release-duration-days'
import { interpolate } from '~/i18n/interpolate'
import { dappAssets } from '~/shared/assets/dapp'
import { CountValue } from '~/shared/components/count-value'
import { Text } from '~/shared/components/text'
import { ReleaseEntryCard } from '~/views/dapp/release/hub/primitives'
import { useReleaseHub } from '~/views/dapp/release/hub/use-hub'
import { DockConnectPromo } from '~/views/dapp/shared/dock-connect-promo'
import { DockFrame } from '~/views/dapp/shared/dock-frame'
import { openReleaseView } from '~/views/dapp/shared/navigation'

export function ReleaseHubDock() {
  const vm = useReleaseHub()
  const { t } = vm
  const bufferDays = usePrincipalReleaseDurationDays().data ?? 30

  return (
    <DockFrame
      subtitle={t.release.intro}
      title={t.release.title}
      titleClassName="text-xl/none tracking-normal"
    >
      <ReleaseEntryCard
        aria-label={t.release.queue.title}
        className="gap-1.5"
        onClick={() => openReleaseView('queue')}
        tourId="release-pool-card"
      >
        <ReleaseEntryCard.TitleGroup>
          <div className="inline-flex min-w-0 items-center gap-2.25">
            <img alt="" className="size-(--app-icon-caption)" src={dappAssets.releasePool} />
            <ReleaseEntryCard.Title>{t.release.queue.title}</ReleaseEntryCard.Title>
          </div>
          <ReleaseEntryCard.Percent hint={t.release.queue.hubHint} value={vm.queuePct} />
        </ReleaseEntryCard.TitleGroup>
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
        aria-label={t.release.buffer.title}
        className="gap-2"
        onClick={() => openReleaseView('buffer')}
        tourId="buffer-pool-card"
      >
        <ReleaseEntryCard.TitleGroup>
          <div className="inline-flex min-w-0 items-center gap-2.25">
            <img alt="" className="size-(--app-icon-caption)" src={dappAssets.bufferPool} />
            <ReleaseEntryCard.Title>{t.release.buffer.title}</ReleaseEntryCard.Title>
          </div>
          <ReleaseEntryCard.Percent
            hint={interpolate(t.release.buffer.hubHint, { days: bufferDays })}
            value={vm.bufferPct}
          />
        </ReleaseEntryCard.TitleGroup>
        <div className="grid grid-cols-2 gap-2">
          <Text as="strong" variant="headline">
            <CountValue text={vm.bufferTotalAgx} />
          </Text>
          <Text as="strong" variant="headline">
            {vm.gagxTotalLabel}
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
              <CountValue text={vm.bufferClaimableAgx} />
            </Text>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <Text as="span" className="text-foreground/40" variant="copy">
              {t.release.labels.released}
            </Text>
            <Text as="span" tone="primary" variant="copy">
              {vm.bufferClaimableGagx}
            </Text>
          </div>
        </div>
      </ReleaseEntryCard>

      {!vm.walletReady ? <DockConnectPromo /> : null}
    </DockFrame>
  )
}
