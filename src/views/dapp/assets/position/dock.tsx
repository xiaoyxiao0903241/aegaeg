import { useI18n } from '~/i18n/use-i18n'
import { useAssetsViewStore } from '~/stores/assets-view-store'
import { AssetsClaimModal } from '~/views/dapp/assets/claim-modal/modal'
import { AssetsClaimOutputModal } from '~/views/dapp/assets/claim-modal/output-modal'
import {
  AssetsListPager,
  AssetsPositionBondRow,
  AssetsPositionListSkeleton,
  AssetsPositionStakeRow,
} from '~/views/dapp/assets/position/primitives'
import { type AssetsProduct, usePositionDock } from '~/views/dapp/assets/position/use-position'
import {
  AssetsDockScrollClearance,
  AssetsPositionEmptyCard,
  AssetsQuoteToolbar,
} from '~/views/dapp/assets/primitives'
import { AssetsRedeemConfirm } from '~/views/dapp/assets/redeem/assets-redeem-confirm'
import { DockConnectPromo } from '~/views/dapp/shared/dock-connect-promo'
import { DockStack } from '~/views/dapp/shared/dock-frame'
import { openStakingView } from '~/views/dapp/shared/navigation'
import { TabHeader } from '~/views/dapp/shared/tab-header'

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
      >
        <DockStack fill={!w.walletReady || w.isEmpty}>
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
            <DockConnectPromo />
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
                epochClock={w.epochClock}
                formatAmount={w.formatAmount}
                formatPeriodLabel={w.formatPeriodLabel}
                key={row.id}
                claimLocked={w.locksIntent(`claim:${row.id}`)}
                redeemLocked={w.locksIntent(row.inWarmup ? `warmup:${row.id}` : `redeem:${row.id}`)}
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
                claimLocked={w.locksIntent(`claim:${row.id}`)}
                redeemLocked={w.locksIntent(`redeem:${row.id}`)}
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
          <AssetsDockScrollClearance />
        </DockStack>
      </TabHeader>

      <AssetsClaimOutputModal
        onOpenChange={(open) => {
          if (!open) w.closeClaimOutput()
        }}
        onSelectOutput={w.selectClaimOutput}
        open={w.claimOutput.open}
        capturedAddress={w.claimOutput.open ? w.claimOutput.capturedAddress : null}
        row={w.claimOutput.open ? w.claimOutput.row : null}
      />

      <AssetsClaimModal
        amountLabel={w.claim.open ? w.claim.amountLabel : ''}
        onOpenChange={(open) => {
          if (!open) w.closeClaim()
        }}
        open={w.claim.open}
        capturedAddress={w.claim.open ? w.claim.capturedAddress : null}
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
