import { useAssetsViewStore } from '~/stores/assets-view-store'
import { DappTabHeader } from '~/app/shell/dapp-tab-header'
import { useI18n } from '~/i18n/use-i18n'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { openStakingView } from '~/shared/config/dapp-open-views'
import { Button } from '~/shared/ui/button'
import { Text } from '~/shared/ui/text'
import { AssetsClaimModal } from '~/views/dapp/assets/claim-modal/assets-claim-modal'
import { AssetsRedeemConfirm } from '~/views/dapp/assets/redeem/assets-redeem-confirm'
import { AssetsPositionStakeRow } from '~/views/dapp/assets/position/assets-position-stake-row'
import { AssetsPositionBondRow } from '~/views/dapp/assets/position/assets-position-bond-row'
import { AssetsQuoteToolbar } from '~/views/dapp/assets/assets-quote-toolbar'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import {
  useAssetsPositionWidget,
  type AssetsProduct,
} from '~/views/dapp/assets/position/use-assets-position-widget'

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
          quote={w.quote}
          quoteLabel={t.assets.position.quoteCurrency}
          sortLabel={t.assets.position.sort}
        />

        {!w.walletReady ? (
          <DappWidgetConnectPromo />
        ) : w.isLoading ? (
          <Text as="p" tone="muted-foreground" variant="copy">
            …
          </Text>
        ) : w.isEmpty ? (
          <div className="grid gap-3">
            <Text as="p" tone="muted-foreground" variant="copy">
              {w.copy.empty}
            </Text>
            <Button onClick={() => openStakingView(w.stakingTarget)} type="button">
              {w.copy.emptyCta}
            </Button>
          </div>
        ) : product === 'stake' ? (
          w.pagedStakeRows.map((row) => (
            <AssetsPositionStakeRow
              busy={w.busy}
              formatPeriodLabel={w.formatPeriodLabel}
              formatRewardUsd={w.formatRewardUsd}
              key={row.id}
              locked={w.locked}
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
              formatPeriodLabel={w.formatPeriodLabel}
              formatRewardUsd={w.formatRewardUsd}
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
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <Text as="span" tone="muted-foreground" variant="detail">
              {t.common.paginationTotal.replace('{total}', String(w.totalRows))} ·{' '}
              {t.common.paginationPerPage.replace('{size}', String(w.pageSize))}
            </Text>
            <div className="flex gap-2">
              <Button
                className="h-auto min-h-0 w-auto px-3 py-1 text-xs"
                disabled={w.safePage <= 0}
                onClick={() => w.setPage((value) => Math.max(0, value - 1))}
                shape="pill"
                size="sm"
                type="button"
                variant="ghost"
              >
                {t.common.paginationPrev}
              </Button>
              <Button
                className="h-auto min-h-0 w-auto px-3 py-1 text-xs"
                disabled={w.safePage >= w.pageCount - 1}
                onClick={() => w.setPage((value) => Math.min(w.pageCount - 1, value + 1))}
                shape="pill"
                size="sm"
                type="button"
                variant="ghost"
              >
                {t.common.paginationNext}
              </Button>
            </div>
          </div>
        ) : null}
      </DappWidgetStack>

      <AssetsClaimModal
        amountLabel={w.claim.open ? w.claim.amountLabel : ''}
        onOpenChange={(open) => {
          if (!open) w.closeClaim()
        }}
        open={w.claim.open}
        positionLabel={w.claim.open ? w.claim.label : ''}
        target={w.claim.open ? w.claim.target : null}
      />

      <AssetsRedeemConfirm
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
