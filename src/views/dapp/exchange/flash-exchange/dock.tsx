/**
 * 闪电兑换左栏 Dock
 *
 * 顶部币对分段（gAGX / USDT），中间为卖出 / 买入金额区，
 * gAGX 对可翻转方向；底部信息行列出汇率、路由与提供方合约链接。
 * 未连接钱包时展示连接引导。
 */
import { FormActions } from '~/shared/components/form-actions'
import { FormInfoCard } from '~/shared/components/form-info-card'
import { MainButton } from '~/shared/components/main-button'
import { Segment } from '~/shared/components/segment'
import { Tooltip } from '~/shared/components/tooltip'
import { dappAssets } from '~/shared/config/assets'
import { bscscanAddress } from '~/shared/config/explorer'
import type { FlashExchangeState } from '~/views/dapp/exchange/exchange-session-hosts'
import { useFlashExchange } from '~/views/dapp/exchange/flash-exchange/use-flash-exchange'
import {
  ExchangeAmountFlow,
  ExchangeFlipGlyph,
  ExchangeFlowButton,
  ExchangeOneWayFlowIndicator,
  exchangeProviderMetaRow,
  ExchangeWidgetSessionFooter,
} from '~/views/dapp/exchange/primitives'
import { DockStack } from '~/views/dapp/shared/dock-frame'
import { TabHeader } from '~/views/dapp/shared/tab-header'

export function FlashExchangeDock({ flash }: { flash: FlashExchangeState }) {
  const vm = useFlashExchange(flash)
  const { t, pair } = vm

  return (
    <TabHeader
      backText={t.exchange.backToHub}
      onBack={vm.onBack}
      subtitle={t.exchange.flash.intros[flash.introKey]}
      title={t.exchange.flash.title}
    >
      <DockStack className="gap-0">
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
                <Tooltip content={t.exchange.flip}>
                  <ExchangeFlowButton
                    aria-label={t.exchange.flip}
                    disabled={
                      flash.isSubmitting || vm.isFlipping || (vm.sessionReady && !flash.walletReady)
                    }
                    interactive
                    onClick={vm.onFlip}
                  >
                    <ExchangeFlipGlyph rotation={vm.rotation} />
                  </ExchangeFlowButton>
                </Tooltip>
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

        <FormInfoCard className="mt-3.5 max-dapp:mt-3">
          <FormInfoCard.Rows
            items={[
              {
                label: t.exchange.exchangePrice,
                value: flash.exchangePriceLabel,
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
                  window.open(
                    bscscanAddress(flash.providerAddress),
                    '_blank',
                    'noopener,noreferrer',
                  ),
                iconSrc: dappAssets.arrowUpRight,
              }),
            ]}
          />
        </FormInfoCard>

        {vm.sessionReady && flash.walletReady ? (
          <FormActions className="mt-3.5 max-dapp:mt-3">
            <MainButton
              className="col-span-full"
              density="external"
              disabled={!flash.canSubmit}
              loading={flash.isSubmitting}
              onClick={() => void vm.onSubmit()}
            >
              {t.exchange.flash.action}
            </MainButton>
          </FormActions>
        ) : null}

        <ExchangeWidgetSessionFooter blockHint={vm.blockHint} sessionReady={vm.sessionReady} />
      </DockStack>
    </TabHeader>
  )
}
