import { exchangeHubAssets } from '~/app/assets'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappPanelToggle } from '~/app/shell/dapp-panel-toggle'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import { useI18n } from '~/i18n/use-i18n'
import { InteractiveCard } from '~/shared/components/interactive-card'
import { Text } from '~/shared/components/text'
import { WidgetHeader } from '~/shared/components/widget-header'
import type { ExchangeView } from '~/shared/config/dapp-deep-links'
import { openExchangeView } from '~/shared/config/dapp-open-views'

/** 兑换 Hub 模式：闪兑 / 交易 / 燃烧 / 涡轮 */
const EXCHANGE_MODES: readonly {
  view: Exclude<ExchangeView, 'hub'>
  icon: string
  minHeight: string
  tourId?: string
}[] = [
  { view: 'flash', icon: exchangeHubAssets.modeFlash, minHeight: 'min-h-22' },
  {
    view: 'trade',
    icon: exchangeHubAssets.modeTrade,
    minHeight: 'min-h-17.5',
    tourId: 'swap-trade',
  },
  { view: 'burn', icon: exchangeHubAssets.modeBurn, minHeight: 'min-h-17.5' },
  {
    view: 'turbine',
    icon: exchangeHubAssets.modeTurbine,
    minHeight: 'min-h-17.5',
    tourId: 'swap-turbine',
  },
]

export function ExchangeHubWidget() {
  const { messages: t } = useI18n()
  const copy = t.exchange.hub.modes

  return (
    <>
      <WidgetHeader
        action={<DappPanelToggle />}
        className="mb-4"
        subtitle={t.exchange.intro}
        title={t.exchange.title}
        titleClassName="text-xl leading-(--type-headline-leading) tracking-normal"
      />
      <DappWidgetStack>
        {EXCHANGE_MODES.map((mode) => {
          const text = copy[mode.view]
          return (
            <InteractiveCard
              className={`flex items-center gap-3 ${mode.minHeight}`}
              key={mode.view}
              onClick={() => openExchangeView(mode.view)}
              tourId={mode.tourId}
            >
              <DappIcon alt="" size="xl" src={mode.icon} />
              <div className="grid min-w-0 flex-1 gap-1.5">
                <Text as="span" className="font-semibold" variant="detail">
                  {text.title}
                </Text>
                <Text as="p" className="m-0 text-foreground/40" variant="copy">
                  {text.body}
                </Text>
              </div>
            </InteractiveCard>
          )
        })}
      </DappWidgetStack>
    </>
  )
}
