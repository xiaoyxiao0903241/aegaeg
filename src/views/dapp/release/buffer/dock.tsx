/**
 * 缓冲池左栏 Dock
 *
 * AGX / gAGX 双卡展示已释放、释放中与进度条（手册 §13 分流器多 token）；
 * 刷新重读链上快照；领取对两边有可领的源一并 claimMany。
 */
import { tokenCarouselIcons } from '~/shared/assets/dapp'
import { useBuffer } from '~/views/dapp/release/buffer/use-buffer'
import { ReleasePlanCard } from '~/views/dapp/release/primitives'
import { DockConnectPromo } from '~/views/dapp/shared/dock-connect-promo'
import { DockStack } from '~/views/dapp/shared/dock-frame'
import { TabHeader } from '~/views/dapp/shared/tab-header'

export function BufferDock() {
  const vm = useBuffer()
  const { t } = vm

  return (
    <TabHeader
      backText={t.release.backToHub}
      onBack={vm.onBack}
      subtitle={vm.intro}
      title={t.release.buffer.title}
    >
      <DockStack>
        <ReleasePlanCard data-slot-id="release-buffer-card-agx">
          <ReleasePlanCard.Header>
            <ReleasePlanCard.Token iconSrc={tokenCarouselIcons.agxIcon} label="AGX" />
            <ReleasePlanCard.Refresh
              busy={vm.refreshing}
              data-slot-id="release-buffer-refresh-agx"
              disabled={vm.refreshing}
              label={t.release.buffer.refresh}
              onClick={() => void vm.onRefresh()}
            />
          </ReleasePlanCard.Header>
          <ReleasePlanCard.Metrics
            releasedLabel={t.release.labels.released}
            releasedValue={vm.claimableLabel}
            releasingLabel={t.release.labels.releasing}
            releasingValue={vm.releasingLabel}
          />
          <ReleasePlanCard.Bar data-slot-id="release-buffer-bar-agx" width={vm.progressWidth} />
          <ReleasePlanCard.Captions left={vm.releasedPctLabel} right={vm.valueHint} />
          <ReleasePlanCard.Action
            disabled={!vm.canClaimAgx || vm.pending}
            loading={vm.pending}
            onClick={() => void vm.onClaim()}
          >
            {t.release.buffer.claim}
          </ReleasePlanCard.Action>
        </ReleasePlanCard>

        <ReleasePlanCard data-slot-id="release-buffer-card-gagx">
          <ReleasePlanCard.Header>
            <ReleasePlanCard.Token iconSrc={tokenCarouselIcons.gagxIcon} label="gAGX" />
            <ReleasePlanCard.Refresh
              busy={vm.refreshing}
              data-slot-id="release-buffer-refresh-gagx"
              disabled={vm.refreshing}
              label={t.release.buffer.refresh}
              onClick={() => void vm.onRefresh()}
            />
          </ReleasePlanCard.Header>
          <ReleasePlanCard.Metrics
            releasedLabel={t.release.labels.released}
            releasedValue={vm.gagxClaimableLabel}
            releasingLabel={t.release.labels.releasing}
            releasingValue={vm.gagxReleasingLabel}
          />
          <ReleasePlanCard.Bar
            data-slot-id="release-buffer-bar-gagx"
            width={vm.gagxProgressWidth}
          />
          <ReleasePlanCard.Captions left={vm.gagxReleasedPctLabel} right={vm.gagxValueHint} />
          <ReleasePlanCard.Action
            disabled={!vm.canClaimGagx || vm.pending}
            loading={vm.pending}
            onClick={() => void vm.onClaim()}
          >
            {t.release.buffer.claim}
          </ReleasePlanCard.Action>
        </ReleasePlanCard>

        {vm.walletReady ? null : <DockConnectPromo />}
      </DockStack>
    </TabHeader>
  )
}
