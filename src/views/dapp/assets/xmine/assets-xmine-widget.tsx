import { DappTabHeader } from '~/app/shell/dapp-tab-header'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import { openStakingView } from '~/shared/config/dapp-open-views'
import { Button } from '~/shared/ui/button'
import { Text } from '~/shared/ui/text'
import { AssetsQuoteToolbar } from '~/views/dapp/assets/assets-quote-toolbar'
import { AssetsRedeemConfirm } from '~/views/dapp/assets/redeem/assets-redeem-confirm'
import { AssetsXminePositionCard } from '~/views/dapp/assets/xmine/assets-xmine-position-card'
import { useAssetsXmineView } from '~/views/dapp/assets/xmine/use-assets-xmine-view'

export function AssetsXmineWidget() {
  const vm = useAssetsXmineView()
  const { t, copy, position } = vm

  return (
    <>
      <DappTabHeader
        backText={t.assets.backToHub}
        onBack={() => vm.setView('hub')}
        subtitle={copy.intro}
        title={copy.title}
      />
      <DappWidgetStack>
        <AssetsQuoteToolbar
          onQuoteChange={vm.setQuote}
          quote={vm.quote}
          quoteLabel={t.assets.position.quoteCurrency}
          sortLabel={t.assets.position.sort}
        />

        {!vm.walletReady ? (
          <DappWidgetConnectPromo />
        ) : vm.isLoading ? (
          <Text as="p" tone="muted-foreground" variant="copy">
            …
          </Text>
        ) : vm.isEmpty || !position ? (
          <div className="grid gap-3">
            <Text as="p" tone="muted-foreground" variant="copy">
              {copy.empty}
            </Text>
            <Button onClick={() => openStakingView('xmine')} type="button">
              {copy.emptyCta}
            </Button>
          </div>
        ) : (
          <AssetsXminePositionCard
            activateWarmupLabel={t.assets.position.activateWarmup}
            busy={vm.busy}
            claimLabel={t.assets.position.claim}
            gons={position.gons}
            locked={vm.locked}
            lockedPrefix={t.assets.position.lockedPrefix}
            miningStake={position.miningStake}
            onActivateWarmup={() => void vm.handleActivateWarmup()}
            onClaim={() => void vm.handleClaim()}
            onRequestUnstake={vm.requestUnstake}
            outputCaption={copy.output}
            pending={position.pending}
            periodPill={copy.periodPill}
            quote={vm.quote}
            redeemAnytimeLabel={t.assets.position.redeemAnytime}
            redeemLabel={t.assets.position.redeem}
            remainingCaption={t.assets.position.remaining}
            stakedCaption={t.assets.position.staked}
            voucher={vm.voucher}
            voucherCaption={t.assets.position.voucher}
            warmupEndTime={position.warmupEndTime}
            warmupGons={position.warmupGons}
          />
        )}

        {!vm.isEmpty && vm.walletReady ? (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <Text as="span" tone="muted-foreground" variant="detail">
              {t.common.paginationTotal.replace('{total}', String(vm.totalRows))} ·{' '}
              {t.common.paginationPerPage.replace('{size}', String(vm.pageSize))}
            </Text>
            <div className="flex gap-2">
              <Button
                className="size-auto min-h-0 px-3 py-1 text-xs"
                disabled
                shape="pill"
                size="sm"
                type="button"
                variant="ghost"
              >
                {t.common.paginationPrev}
              </Button>
              <Button
                className="size-auto min-h-0 px-3 py-1 text-xs"
                disabled
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

      <AssetsRedeemConfirm
        busy={vm.busy}
        onConfirm={() => void vm.handleUnstake()}
        onOpenChange={vm.setConfirmUnstake}
        open={vm.confirmUnstake}
      />
    </>
  )
}
