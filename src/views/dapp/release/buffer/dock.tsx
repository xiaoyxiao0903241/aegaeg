/**
 * 缓冲池左栏 Dock
 *
 * AGX / gAGX 双卡展示已释放、释放中与进度条（手册 §13 分流器多 token）；
 * 刷新重读链上快照；两卡各走独立领取 mutation（只领对应币种）。
 */
import { tokenCarouselIcons } from '~/shared/assets/dapp'
import { useBuffer } from '~/views/dapp/release/buffer/use-buffer'
import { ReleasePlanCard } from '~/views/dapp/release/primitives'
import { DockConnectPromo } from '~/views/dapp/shared/dock-connect-promo'
import { DockStack } from '~/views/dapp/shared/dock-frame'
import { TabHeader } from '~/views/dapp/shared/tab-header'
import { WriteBlockAlert } from '~/views/dapp/shared/write-block-alert'

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
        <WriteBlockAlert hint={vm.blockHint} />
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
            disabled={!vm.canClaimAgx}
            loading={vm.claimingAgx}
            onClick={() => void vm.onClaimAgx()}
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
            disabled={!vm.canClaimGagx}
            loading={vm.claimingGagx}
            onClick={() => void vm.onClaimGagx()}
          >
            {t.release.buffer.claim}
          </ReleasePlanCard.Action>
        </ReleasePlanCard>

        {vm.walletReady ? null : <DockConnectPromo />}
      </DockStack>
    </TabHeader>
  )
}
