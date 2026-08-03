import { DappTabHeader } from '~/app/shell/dapp-tab-header'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import { useI18n } from '~/i18n/use-i18n'
import { openStakingView } from '~/shared/config/dapp-open-views'
import { useAssetsViewStore } from '~/stores/assets-view-store'
import { AssetsPositionEmptyCard } from '~/views/dapp/assets/assets-position-empty-card'
import { AssetsQuoteToolbar } from '~/views/dapp/assets/assets-quote-toolbar'
import { AssetsClaimModal } from '~/views/dapp/assets/claim-modal/assets-claim-modal'
import { AssetsListPager } from '~/views/dapp/assets/position/assets-list-pager'
import { AssetsPositionBondRow } from '~/views/dapp/assets/position/assets-position-bond-row'
import { AssetsPositionListSkeleton } from '~/views/dapp/assets/position/assets-position-row-skeleton'
import { AssetsPositionStakeRow } from '~/views/dapp/assets/position/assets-position-stake-row'
import {
  type AssetsProduct,
  useAssetsPositionWidget,
} from '~/views/dapp/assets/position/use-assets-position-widget'
import { AssetsRedeemConfirm } from '~/views/dapp/assets/redeem/assets-redeem-confirm'

export type { AssetsProduct }

export function AssetsPositionWidget({ product }: { product: AssetsProduct }) {
  const { messages: t } = useI18n()
  const setView = useAssetsViewStore((state) => state.setView)
  const w = useAssetsPositionWidget(product)

  return (
    <>
      <DappTabHeader
        backText={t.assets.backToHub}
        onBack={() => setView('hub')}
        subtitle={w.copy.intro}
        title={w.copy.title}
      />
      <DappWidgetStack>
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
          <DappWidgetConnectPromo />
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
      </DappWidgetStack>

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
