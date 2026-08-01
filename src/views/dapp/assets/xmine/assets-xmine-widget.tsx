import { DappTabHeader } from '~/app/shell/dapp-tab-header'
import { dappAssets } from '~/app/assets'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { formatTokenAmount } from '~/core/exchange/token-amount'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { openStakingView } from '~/shared/config/dapp-open-views'
import { Button } from '~/shared/ui/button'
import { Card } from '~/shared/ui/card'
import { Chip } from '~/shared/ui/chip'
import { Text } from '~/shared/ui/text'
import { AssetsRedeemConfirm } from '~/views/dapp/assets/redeem/assets-redeem-confirm'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import { useAssetsXmineView } from '~/views/dapp/assets/xmine/use-assets-xmine-view'

const X_DECIMALS = EXCHANGE_CONFIG.tokens.x.decimals
const GAGX_DECIMALS = EXCHANGE_CONFIG.tokens.gagx.decimals

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
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Chip className="h-6 gap-1" shape="pill" size="sm" type="button" variant="soft">
            {t.assets.position.sort}
            <DappIcon alt="" className="size-2.5" size="sm" src={dappAssets.chevron} />
          </Chip>
          <div className="flex items-center gap-1">
            <Text as="span" tone="muted-foreground" variant="detail">
              {t.assets.position.quoteCurrency}
            </Text>
            <div className="flex rounded-full bg-muted p-0.5">
              <Chip
                onClick={() => vm.setQuote('agx')}
                shape="pill"
                size="sm"
                type="button"
                variant={vm.quote === 'agx' ? 'solid' : 'soft'}
              >
                AGX
              </Chip>
              <Chip
                onClick={() => vm.setQuote('usd')}
                shape="pill"
                size="sm"
                type="button"
                variant={vm.quote === 'usd' ? 'solid' : 'soft'}
              >
                USD
              </Chip>
            </div>
          </div>
        </div>

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
          <Card surface="outlined" className="grid gap-2 p-4 shadow-none">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 items-center rounded-full bg-muted px-3 text-xs text-muted-foreground">
                {copy.periodPill}
              </span>
              <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
                <Text as="span" tone="muted-foreground" variant="detail">
                  {t.assets.position.remaining}
                </Text>
                <Text as="span" className="text-sm" variant="detail">
                  {vm.remainingLabel}
                </Text>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-1">
                <Text as="span" className="text-xs" tone="muted-foreground" variant="detail">
                  {t.assets.position.staked}
                </Text>
                <Text as="strong" className="text-base font-semibold" variant="copy">
                  {formatTokenAmount(position.miningStake, GAGX_DECIMALS, 2)} gAGX
                </Text>
                <span className="inline-flex w-fit items-center gap-1 rounded-[10px] bg-primary-soft px-2 py-0.5">
                  <Text as="span" className="text-xs text-primary" variant="detail">
                    {formatTokenAmount(vm.redeemableStake, GAGX_DECIMALS, 2)} gAGX
                  </Text>
                </span>
              </div>
              <div className="grid justify-items-end gap-1 text-right">
                <Text as="span" className="text-xs" tone="muted-foreground" variant="detail">
                  {copy.output}
                </Text>
                <Text as="strong" className="text-base font-semibold text-primary" variant="copy">
                  {formatTokenAmount(position.pending, X_DECIMALS, 2)} X
                </Text>
                {vm.quote === 'usd' ? (
                  <Text as="span" tone="muted-foreground" variant="detail">
                    ≈ —
                  </Text>
                ) : null}
              </div>
            </div>
            <div className="flex items-center justify-end gap-1">
              <Text as="span" className="text-xs" tone="muted-foreground" variant="detail">
                {t.assets.position.voucher}
              </Text>
              <Text as="span" className="text-xs" variant="detail">
                {vm.voucher}
              </Text>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {vm.warmupReady ? (
                <DappActionButton
                  className="col-span-2 h-7 min-h-7 text-xs"
                  density="inverse"
                  disabled={vm.locked || vm.busy}
                  onClick={() => void vm.handleActivateWarmup()}
                >
                  {t.assets.position.activateWarmup}
                </DappActionButton>
              ) : (
                <>
                  <DappActionButton
                    className="h-7 min-h-7 text-xs"
                    density="inverse"
                    disabled={position.pending <= 0n || vm.inWarmup || vm.locked || vm.busy}
                    onClick={() => void vm.handleClaim()}
                  >
                    {t.assets.position.claim}
                  </DappActionButton>
                  <DappActionButton
                    className="h-7 min-h-7 text-xs"
                    density="inverse"
                    disabled={position.gons <= 0n || vm.inWarmup || vm.locked || vm.busy}
                    onClick={vm.requestUnstake}
                    variant="secondary"
                  >
                    {t.assets.position.redeem}
                  </DappActionButton>
                </>
              )}
            </div>
          </Card>
        )}

        {!vm.isEmpty && vm.walletReady ? (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <Text as="span" tone="muted-foreground" variant="detail">
              {t.common.paginationTotal.replace('{total}', String(vm.totalRows))} ·{' '}
              {t.common.paginationPerPage.replace('{size}', String(vm.pageSize))}
            </Text>
            <div className="flex gap-2">
              <Button
                className="h-auto min-h-0 w-auto px-3 py-1 text-xs"
                disabled
                shape="pill"
                size="sm"
                type="button"
                variant="ghost"
              >
                {t.common.paginationPrev}
              </Button>
              <Button
                className="h-auto min-h-0 w-auto px-3 py-1 text-xs"
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
