import { BPS_DENOM } from '~/core/exchange/bps'
import { formatBurnSplitPercent } from '~/core/exchange/burn-contribution-swap'
import { interpolate } from '~/i18n/interpolate'
import { dappAssets } from '~/shared/assets/dapp'
import { FormActions } from '~/shared/components/form-actions'
import { FormInfoCard } from '~/shared/components/form-info-card'
import { bscscanAddress } from '~/shared/config/explorer'
import { useBurn } from '~/views/dapp/exchange/burn/use-burn'
import type { BurnExchangeState } from '~/views/dapp/exchange/exchange-session-hosts'
import {
  ExchangeAmountFlow,
  ExchangeOneWayFlowIndicator,
  exchangeProviderMetaRow,
  ExchangeSessionFooter,
} from '~/views/dapp/exchange/primitives'
import { DockStack } from '~/views/dapp/shared/dock-frame'
import { SessionButton } from '~/views/dapp/shared/session-button'
import { TabHeader } from '~/views/dapp/shared/tab-header'
import { WriteBlockAlert } from '~/views/dapp/shared/write-block-alert'

/**
 * 销毁左栏 Dock
 *
 * 输入销毁数量并预览燃烧 / 注入分配，提交写链；
 * 未连接钱包或会话未就绪时展示对应引导。
 */
export function BurnDock({ burn }: { burn: BurnExchangeState }) {
  const vm = useBurn(burn)
  const { t, pair } = vm

  const splitBps = burn.config?.splitBps
  const destinationValue =
    splitBps === undefined
      ? interpolate(t.exchange.burn.destinationValue, { burnPct: '0', injectPct: '0' })
      : interpolate(t.exchange.burn.destinationValue, {
          burnPct: formatBurnSplitPercent(splitBps),
          injectPct: formatBurnSplitPercent(BPS_DENOM - splitBps),
        })

  return (
    <TabHeader
      backText={t.exchange.backToHub}
      onBack={vm.onBack}
      subtitle={t.exchange.burn.subtitle}
      title={t.exchange.burn.title}
    >
      <DockStack>
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

        <FormInfoCard>
          <FormInfoCard.Rows
            items={[
              {
                label: t.exchange.burn.burnRate,
                value: burn.exchangePriceLabel,
              },
              {
                label: t.exchange.burn.destination,
                value: destinationValue,
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

        {burn.walletReady ? <WriteBlockAlert hint={vm.blockHint} /> : null}
        <FormActions>
          <SessionButton
            className="col-span-full"
            density="external"
            disabled={!burn.canSubmit}
            loading={burn.isSubmitting}
            onClick={() => void vm.onSubmit()}
          >
            {t.exchange.burn.action}
          </SessionButton>
        </FormActions>

        <ExchangeSessionFooter sessionReady={vm.sessionReady} />
      </DockStack>
    </TabHeader>
  )
}
