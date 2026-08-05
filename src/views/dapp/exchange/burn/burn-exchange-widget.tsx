/**
 * 销毁交互面板
 *
 * 卖出 AGX 换取贡献点，买入侧为只读展示；下方列出销毁率、
 * 去向与提供方合约链接。未连接钱包时展示连接引导。
 */
import { dappAssets } from '~/app/assets'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappActionRow } from '~/app/shell/dapp-action-row'
import { DappTabHeader } from '~/app/shell/dapp-tab-header'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import { Card } from '~/shared/components/card'
import { List } from '~/shared/components/list'
import { bscscanAddress } from '~/shared/config/explorer'
import { useBurnExchangeView } from '~/views/dapp/exchange/burn/use-burn-exchange-view'
import { ExchangeAmountFlow } from '~/views/dapp/exchange/exchange-amount-flow'
import { ExchangeOneWayFlowIndicator } from '~/views/dapp/exchange/exchange-flow-button'
import { exchangeProviderMetaRow } from '~/views/dapp/exchange/exchange-provider-meta-value'
import type { BurnExchangeState } from '~/views/dapp/exchange/exchange-session-hosts'
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

        <Card as="div" className="mt-3.5 max-dapp:mt-3" surface="outlined">
          <List
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
        </Card>

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
