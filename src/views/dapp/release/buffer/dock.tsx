/**
 * 缓冲池左栏 Dock
 *
 * AGX / gAGX 双卡展示已释放、释放中与进度条；
 * 右上角刷新按钮重读 AGX 链上快照，gAGX 无数据源时显示 0。
 */
import { formatApproxUsd, formatGroupedNumber } from '~/shared/api/format-display'
import { tokenCarouselIcons } from '~/shared/config/assets'
import { useBuffer } from '~/views/dapp/release/buffer/use-buffer'
import { ReleasePlanCard } from '~/views/dapp/release/primitives'
import { DockConnectPromo } from '~/views/dapp/shared/dock-connect-promo'
import { DockStack } from '~/views/dapp/shared/dock-frame'
import { TabHeader } from '~/views/dapp/shared/tab-header'

export function BufferDock() {
  const vm = useBuffer()
  const { t } = vm
  const gagxZero = `${formatGroupedNumber(0, { digits: 4 })} gAGX`

  return (
    <>
      <TabHeader
        backText={t.release.backToHub}
        onBack={vm.onBack}
        subtitle={t.release.buffer.intro}
        title={t.release.buffer.title}
      />
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
            disabled={!vm.canClaim || vm.pending}
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
              data-slot-id="release-buffer-refresh-gagx"
              disabled
              label={t.release.buffer.refresh}
            />
          </ReleasePlanCard.Header>
          <ReleasePlanCard.Metrics
            releasedLabel={t.release.labels.released}
            releasedValue={gagxZero}
            releasingLabel={t.release.labels.releasing}
            releasingValue={gagxZero}
          />
          <ReleasePlanCard.Bar data-slot-id="release-buffer-bar-gagx" width="0%" />
          <ReleasePlanCard.Captions
            left={t.release.labels.releasedPct.replace('{pct}', '0')}
            right={formatApproxUsd(0, null)}
          />
          <ReleasePlanCard.Action disabled>{t.release.buffer.claim}</ReleasePlanCard.Action>
        </ReleasePlanCard>

        {vm.walletReady ? null : <DockConnectPromo />}
      </DockStack>
    </>
  )
}
