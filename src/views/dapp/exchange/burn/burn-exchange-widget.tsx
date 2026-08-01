import { DappTabHeader } from '~/app/shell/dapp-tab-header'
import { flashExchangeAssets } from '~/app/assets'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappActionRow } from '~/app/shell/dapp-action-row'
import type { BurnExchangeState } from '~/views/dapp/exchange/exchange-session-hosts'
import { bscscanAddress } from '~/shared/config/explorer'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import { DappMetaPanel } from '~/app/shell/dapp-meta-panel'
import { ExchangeOneWayFlowIndicator } from '~/views/dapp/exchange/exchange-flow-button'
import { ExchangeAmountFlow } from '~/views/dapp/exchange/exchange-amount-flow'
import { useBurnExchangeView } from '~/views/dapp/exchange/burn/use-burn-exchange-view'
import { exchangeProviderMetaRow } from '~/views/dapp/exchange/exchange-provider-meta-value'
import { ExchangeWidgetSessionFooter } from '~/views/dapp/exchange/exchange-widget-session-footer'

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
          walletReady={burn.walletReady}
          amountLocked={burn.isSubmitting}
        />

        <DappMetaPanel
          items={[
            {
              label: t.exchange.burn.burnRate,
              value: burn.exchangePriceLabel || '0',
            },
            {
              label: t.exchange.burn.destination,
              value: t.exchange.burn.destinationValue,
            },
            exchangeProviderMetaRow({
              label: t.exchange.provider,
              name: t.exchange.burn.providerName,
              ariaLabel: t.exchange.burn.openProvider,
              onOpen: () =>
                window.open(bscscanAddress(burn.providerAddress), '_blank', 'noopener,noreferrer'),
              iconSrc: flashExchangeAssets.externalLink,
            }),
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

        <ExchangeWidgetSessionFooter blockHint={vm.blockHint} sessionReady={vm.sessionReady} />
      </DappWidgetStack>
    </>
  )
}
