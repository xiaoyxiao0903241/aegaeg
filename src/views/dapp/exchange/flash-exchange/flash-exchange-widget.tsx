import { flashExchangeAssets } from '~/app/assets'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappActionRow } from '~/app/shell/dapp-action-row'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappMetaPanel } from '~/app/shell/dapp-meta-panel'
import { DappTabHeader } from '~/app/shell/dapp-tab-header'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import { AnchoredTooltip } from '~/shared/components/anchored-tooltip'
import { Segment } from '~/shared/components/segment'
import { bscscanAddress } from '~/shared/config/explorer'
import { ExchangeAmountFlow } from '~/views/dapp/exchange/exchange-amount-flow'
import {
  ExchangeFlowButton,
  ExchangeOneWayFlowIndicator,
} from '~/views/dapp/exchange/exchange-flow-button'
import { exchangeProviderMetaRow } from '~/views/dapp/exchange/exchange-provider-meta-value'
import type { FlashExchangeState } from '~/views/dapp/exchange/exchange-session-hosts'
import { ExchangeWidgetSessionFooter } from '~/views/dapp/exchange/exchange-widget-session-footer'
import { useFlashExchangeView } from '~/views/dapp/exchange/flash-exchange/use-flash-exchange-view'

export function FlashExchangeWidget({ flash }: { flash: FlashExchangeState }) {
  const vm = useFlashExchangeView(flash)
  const { t, pair } = vm

  return (
    <>
      <DappTabHeader
        backText={t.exchange.backToHub}
        onBack={vm.onBack}
        subtitle={t.exchange.flash.intros[flash.introKey]}
        title={t.exchange.flash.title}
      />
      <DappWidgetStack className="gap-0">
        <Segment
          aria-label={t.exchange.flash.pairAriaLabel}
          className="mb-3"
          disabled={flash.isSubmitting || vm.isFlipping}
          onChange={flash.setPairId}
          options={vm.pairOptions}
          size="lg"
          tone="ink"
          value={flash.pairId}
        />

        <ExchangeAmountFlow
          amountBoxClassName={flash.canFlip ? vm.flipCardClass : undefined}
          buy={pair.buy}
          buyAmount={flash.buyAmount}
          buyBalance={vm.buyLabel}
          middleSlot={
            <div className="flex items-center justify-center py-1.5">
              {flash.canFlip ? (
                <AnchoredTooltip content={t.exchange.flip}>
                  <ExchangeFlowButton
                    aria-label={t.exchange.flip}
                    disabled={
                      flash.isSubmitting || vm.isFlipping || (vm.sessionReady && !flash.walletReady)
                    }
                    interactive
                    onClick={vm.onFlip}
                  >
                    <span
                      className="duration-dapp-emphasis grid place-items-center transition-transform ease-dapp"
                      style={{ transform: `rotate(${vm.rotation}deg)` }}
                    >
                      <span className="grid size-4 place-items-center">
                        <span className="-rotate-90">
                          <DappIcon alt="" size="base" src={flashExchangeAssets.flowDivider} />
                        </span>
                      </span>
                    </span>
                  </ExchangeFlowButton>
                </AnchoredTooltip>
              ) : (
                <ExchangeOneWayFlowIndicator />
              )}
            </div>
          }
          onFillPercent={(percent) => flash.fillPercent(percent)}
          onSellAmountChange={flash.setSellAmount}
          sell={pair.sell}
          sellAmountDisplay={flash.sellAmountDisplay}
          sellBalance={vm.sellLabel}
          sessionReady={vm.sessionReady}
          walletReady={flash.walletReady}
          amountLocked={flash.isSubmitting || vm.isFlipping}
        />

        <DappMetaPanel
          className="gap-2.5 p-4"
          items={[
            {
              label: t.exchange.exchangePrice,
              value: flash.exchangePriceLabel || '0',
            },
            {
              label: t.exchange.route,
              value: flash.routeLabel,
            },
            exchangeProviderMetaRow({
              label: t.exchange.provider,
              name: t.exchange.flash.providerName,
              ariaLabel: t.exchange.flash.openProvider,
              onOpen: () =>
                window.open(bscscanAddress(flash.providerAddress), '_blank', 'noopener,noreferrer'),
              iconSrc: flashExchangeAssets.externalLink,
            }),
          ]}
        />

        {vm.sessionReady && flash.walletReady ? (
          <DappActionRow className="mt-3.5 max-dapp:mt-3">
            <DappActionButton
              className="col-span-full"
              density="external"
              disabled={!flash.canSubmit}
              loading={flash.isSubmitting}
              onClick={() => void vm.onSubmit()}
            >
              {t.exchange.flash.action}
            </DappActionButton>
          </DappActionRow>
        ) : null}

        <ExchangeWidgetSessionFooter blockHint={vm.blockHint} sessionReady={vm.sessionReady} />
      </DappWidgetStack>
    </>
  )
}
