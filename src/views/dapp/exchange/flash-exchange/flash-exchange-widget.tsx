import { DappTabHeader } from '~/app/shell/dapp-tab-header'
import { bscscanAddress } from '~/shared/config/explorer'
import { flashExchangeAssets } from '~/app/assets'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappActionRow } from '~/app/shell/dapp-action-row'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { ExchangeMetaValueSkeleton } from '~/app/shell/dapp-skeleton'
import type { FlashExchangeState } from '~/views/dapp/exchange/exchange-session-hosts'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import { DappMetaPanel } from '~/app/shell/dapp-meta-panel'
import {
  ExchangeFlowButton,
  ExchangeOneWayFlowIndicator,
} from '~/views/dapp/exchange/exchange-flow-button'
import { ExchangeAmountFlow } from '~/views/dapp/exchange/exchange-amount-flow'
import { useFlashExchangeView } from '~/views/dapp/exchange/flash-exchange/use-flash-exchange-view'
import { AnchoredTooltip } from '~/shared/ui/anchored-tooltip'
import { DappInlineAlert } from '~/shared/ui/dapp-inline-alert'
import { Segment } from '~/shared/ui/segment'

export function FlashExchangeWidget({ flash }: { flash: FlashExchangeState }) {
  const vm = useFlashExchangeView(flash)
  const { t, pair } = vm

  return (
    <>
      <DappTabHeader
        backText={t.exchange.backToHub}
        onBack={vm.onBack}
        /* Figma `4430:265`: col gap16 · intro 13 · panel title already 21 */
        className="gap-4 [&_p]:text-[13px] [&_p]:leading-normal"
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
          showBuyAmountSkeleton={vm.showBuyAmountSkeleton}
          walletReady={flash.walletReady}
          amountLocked={flash.isSubmitting || vm.isFlipping}
        />

        <DappMetaPanel
          className="gap-2.5"
          items={[
            {
              label: t.exchange.exchangePrice,
              value: vm.showRateSkeleton ? (
                <ExchangeMetaValueSkeleton />
              ) : (
                flash.exchangePriceLabel || '—'
              ),
            },
            {
              label: t.exchange.route,
              value: flash.routeLabel,
            },
            {
              label: t.exchange.provider,
              value: (
                <>
                  {t.exchange.flash.providerName}
                  <button
                    aria-label={t.exchange.flash.openProvider}
                    className="duration-dapp-fast grid size-6 shrink-0 cursor-pointer place-items-center rounded-md border-0 bg-transparent p-0 transition-opacity ease-out hover:opacity-80"
                    onClick={() =>
                      window.open(
                        bscscanAddress(flash.providerAddress),
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

        {!vm.sessionReady ? <DappWidgetConnectPromo className="mt-3.5" /> : null}

        {vm.gateHint ? (
          <DappInlineAlert className="mt-3" role="status">
            {vm.gateHint}
          </DappInlineAlert>
        ) : null}
      </DappWidgetStack>
    </>
  )
}
