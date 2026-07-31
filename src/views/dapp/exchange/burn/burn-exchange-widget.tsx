import { DappTabHeader } from '~/app/shell/dapp-tab-header'
import { flashExchangeAssets } from '~/app/assets'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappActionRow } from '~/app/shell/dapp-action-row'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { ExchangeMetaValueSkeleton } from '~/app/shell/dapp-skeleton'
import type { BurnExchangeState } from '~/views/dapp/exchange/exchange-session-hosts'
import { bscscanAddress } from '~/shared/config/explorer'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import { DappMetaPanel } from '~/app/shell/dapp-meta-panel'
import { ExchangeOneWayFlowIndicator } from '~/views/dapp/exchange/exchange-flow-button'
import { ExchangeAmountFlow } from '~/views/dapp/exchange/exchange-amount-flow'
import { DappInlineAlert } from '~/shared/ui/dapp-inline-alert'
import { useBurnExchangeView } from '~/views/dapp/exchange/burn/use-burn-exchange-view'

export function BurnExchangeWidget({ burn }: { burn: BurnExchangeState }) {
  const vm = useBurnExchangeView(burn)
  const { t, pair } = vm

  return (
    <>
      <DappTabHeader
        backText={t.exchange.backToHub}
        onBack={vm.onBack}
        subtitle={t.exchange.burn.subtitle}
        title={t.exchange.burn.title}
      />
      <DappWidgetStack className="gap-0">
        <ExchangeAmountFlow
          buy={{ symbol: t.exchange.burn.pointsToken }}
          buyAmount={burn.buyAmount}
          buyBalance={vm.buyBalanceLabel}
          buyLabel={t.exchange.burn.receiveLabel}
          middleSlot={
            <div className="flex items-center justify-center py-1.5">
              <ExchangeOneWayFlowIndicator />
            </div>
          }
          onFillPercent={(percent) => burn.fillPercent(percent)}
          onSellAmountChange={burn.setSellAmount}
          sell={pair.sell}
          sellAmountDisplay={burn.sellAmountDisplay}
          sellBalance={vm.sellBalanceLabel}
          sellLabel={t.exchange.burn.sellLabel}
          sessionReady={vm.sessionReady}
          showBuyAmountSkeleton={vm.showBuyAmountSkeleton}
          walletReady={burn.walletReady}
          amountLocked={burn.isSubmitting}
        />

        <DappMetaPanel
          items={[
            {
              label: t.exchange.burn.burnRate,
              value: vm.showRateSkeleton ? (
                <ExchangeMetaValueSkeleton />
              ) : (
                burn.exchangePriceLabel || '—'
              ),
            },
            {
              label: t.exchange.burn.destination,
              value: t.exchange.burn.destinationValue,
            },
            {
              label: t.exchange.provider,
              value: (
                <>
                  {t.exchange.burn.providerName}
                  <button
                    aria-label={t.exchange.burn.openProvider}
                    className="duration-dapp-fast grid size-6 shrink-0 cursor-pointer place-items-center rounded-md border-0 bg-transparent p-0 transition-opacity ease-out hover:opacity-80"
                    onClick={() =>
                      window.open(
                        bscscanAddress(burn.providerAddress),
                        '_blank',
                        'noopener,noreferrer',
                      )
                    }
                    type="button"
                  >
                    <DappIcon alt="" size="action" src={flashExchangeAssets.externalLink} />
                  </button>
                </>
              ),
              valueClassName: 'inline-flex items-center justify-end gap-1',
            },
          ]}
        />

        {vm.sessionReady && burn.walletReady ? (
          <DappActionRow className="mt-3.5 max-dapp:mt-3">
            <DappActionButton
              className="col-span-full"
              density="external"
              disabled={!burn.canSubmit}
              loading={burn.isSubmitting}
              onClick={() => void vm.onSubmit()}
            >
              {t.exchange.burn.action}
            </DappActionButton>
          </DappActionRow>
        ) : null}

        {!vm.sessionReady ? <DappWidgetConnectPromo className="mt-3.5" /> : null}

        {vm.gateHint ? (
          <DappInlineAlert className="mt-3" role="status">
            {vm.gateHint}
          </DappInlineAlert>
        ) : null}

        {vm.submitErrorMessage ? (
          <DappInlineAlert className="mt-3" role="alert">
            {vm.submitErrorMessage}
          </DappInlineAlert>
        ) : null}
      </DappWidgetStack>
    </>
  )
}
