/**
 * 销毁左栏 Dock
 *
 * 卖出 AGX 换取贡献点，买入侧为只读展示；下方列出销毁率、
 * 去向与提供方合约链接。未连接钱包时展示连接引导。
 */
import { FormActions } from '~/shared/components/form-actions'
import { FormInfoCard } from '~/shared/components/form-info-card'
import { MainButton } from '~/shared/components/main-button'
import { dappAssets } from '~/shared/config/assets'
import { bscscanAddress } from '~/shared/config/explorer'
import { useBurn } from '~/views/dapp/exchange/burn/use-burn'
import type { BurnExchangeState } from '~/views/dapp/exchange/exchange-session-hosts'
import {
  ExchangeAmountFlow,
  ExchangeOneWayFlowIndicator,
  exchangeProviderMetaRow,
  ExchangeWidgetSessionFooter,
} from '~/views/dapp/exchange/primitives'
import { DockStack } from '~/views/dapp/shared/dock-frame'
import { TabHeader } from '~/views/dapp/shared/tab-header'

export function BurnDock({ burn }: { burn: BurnExchangeState }) {
  const vm = useBurn(burn)
  const { t, pair } = vm

  return (
    <TabHeader
      backText={t.exchange.backToHub}
      onBack={vm.onBack}
      subtitle={t.exchange.burn.subtitle}
      title={t.exchange.burn.title}
    >
      <DockStack className="gap-0">
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

        <FormInfoCard className="mt-3.5 max-dapp:mt-3">
          <FormInfoCard.Rows
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
                  window.open(
                    bscscanAddress(burn.providerAddress),
                    '_blank',
                    'noopener,noreferrer',
                  ),
                iconSrc: dappAssets.arrowUpRight,
              }),
            ]}
          />
        </FormInfoCard>

        {vm.sessionReady && burn.walletReady ? (
          <FormActions className="mt-3.5 max-dapp:mt-3">
            <MainButton
              className="col-span-full"
              density="external"
              disabled={!burn.canSubmit}
              loading={burn.isSubmitting}
              onClick={() => void vm.onSubmit()}
            >
              {t.exchange.burn.action}
            </MainButton>
          </FormActions>
        ) : null}

        <ExchangeWidgetSessionFooter blockHint={vm.blockHint} sessionReady={vm.sessionReady} />
      </DockStack>
    </TabHeader>
  )
}
