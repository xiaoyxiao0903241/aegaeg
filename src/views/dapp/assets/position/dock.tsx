import { TabHeader } from '~/app/shell/tab-header'
import { WidgetConnectPromo } from '~/app/shell/widget-connect-promo'
import { WidgetStack } from '~/app/shell/widget-frame'
import { useI18n } from '~/i18n/use-i18n'
import { openStakingView } from '~/shared/config/dapp-open-views'
import { useAssetsViewStore } from '~/stores/assets-view-store'
import { AssetsClaimModal } from '~/views/dapp/assets/claim-modal/assets-claim-modal'
import {
  AssetsListPager,
  AssetsPositionBondRow,
  AssetsPositionListSkeleton,
  AssetsPositionStakeRow,
} from '~/views/dapp/assets/position/primitives'
import { type AssetsProduct, usePositionDock } from '~/views/dapp/assets/position/use-position'
import { AssetsPositionEmptyCard, AssetsQuoteToolbar } from '~/views/dapp/assets/primitives'
import { AssetsRedeemConfirm } from '~/views/dapp/assets/redeem/assets-redeem-confirm'

export type { AssetsProduct }

/** 仓位产品侧栏：报价 / 排序工具条 + 持仓卡列表（含空态、加载态），及领奖 / 赎回弹窗 */
export function PositionDock({ product }: { product: AssetsProduct }) {
  const { messages: t } = useI18n()
  const setView = useAssetsViewStore((state) => state.setView)
  const w = usePositionDock(product)

  return (
    <>
      <TabHeader
        backText={t.assets.backToHub}
        onBack={() => setView('hub')}
        subtitle={w.copy.intro}
        title={w.copy.title}
      />
      <WidgetStack>
        <AssetsQuoteToolbar
          onQuoteChange={w.setQuote}
          onSortChange={w.setSort}
          quote={w.quote}
          quoteLabel={t.assets.position.quoteCurrency}
          sortLabel={t.assets.position.sort}
          sortOptions={w.sortOptions}
          sortValue={w.sort}
        />

        {!w.walletReady ? (
          <WidgetConnectPromo />
        ) : w.isLoading ? (
          <AssetsPositionListSkeleton />
        ) : w.isEmpty ? (
          <AssetsPositionEmptyCard
            body={w.copy.empty}
            ctaLabel={w.copy.emptyCta}
            onCta={() => openStakingView(w.stakingTarget)}
            title={t.assets.position.emptyTitle}
          />
        ) : product === 'stake' ? (
          w.pagedStakeRows.map((row) => (
            <AssetsPositionStakeRow
              busy={w.busy}
              currentEpoch={w.currentEpoch}
              formatAmount={w.formatAmount}
              formatPeriodLabel={w.formatPeriodLabel}
              key={row.id}
              locked={w.locked}
              onActivate={w.activateWarmup}
              onClaim={w.openStakeClaim}
              onRedeem={(claimRow) => w.requestRedeem('stake', claimRow)}
              quote={w.quote}
              row={row}
            />
          ))
        ) : (
          w.pagedBondRows.map((row) => (
            <AssetsPositionBondRow
              busy={w.busy}
              formatAmount={w.formatAmount}
              formatPeriodLabel={w.formatPeriodLabel}
              key={row.id}
              locked={w.locked}
              onClaim={w.openBondClaim}
              onRedeem={(claimRow) => w.requestRedeem('bond', claimRow)}
              quote={w.quote}
              row={row}
            />
          ))
        )}

        {!w.isEmpty && w.walletReady ? (
          <AssetsListPager
            onPageChange={w.setPage}
            page={w.safePage}
            pageCount={w.pageCount}
            pageSize={w.pageSize}
            total={w.totalRows}
          />
        ) : null}
      </WidgetStack>

      <AssetsClaimModal
        amountLabel={w.claim.open ? w.claim.amountLabel : ''}
        onOpenChange={(open) => {
          if (!open) w.closeClaim()
        }}
        open={w.claim.open}
        owner={w.claim.open ? w.claim.owner : null}
        positionLabel={w.claim.open ? w.claim.label : ''}
        target={w.claim.open ? w.claim.target : null}
      />

      <AssetsRedeemConfirm
        amountLabel={w.redeem.open ? w.redeem.amountLabel : ''}
        busy={w.busy}
        onConfirm={w.confirmRedeem}
        onOpenChange={(open) => {
          if (!open) w.closeRedeem()
        }}
        open={w.redeem.open}
      />
    </>
  )
}
