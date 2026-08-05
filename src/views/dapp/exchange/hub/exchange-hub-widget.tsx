/**
 * 兑换 Hub 交互面板
 *
 * 列出四种兑换模式入口卡片，点击切换子视图；
 * 顶部为面板标题与收起按钮。
 */
import { exchangeHubAssets } from '~/app/assets'
import { PanelToggle } from '~/app/shell/panel-toggle'
import { WidgetStack } from '~/app/shell/widget-frame'
import { useI18n } from '~/i18n/use-i18n'
import { Icon } from '~/shared/components/icon'
import { InteractiveCard } from '~/shared/components/interactive-card'
import { Text } from '~/shared/components/text'
import { WidgetHeader } from '~/shared/components/widget-header'
import type { ExchangeView } from '~/shared/config/dapp-deep-links'
import { openExchangeView } from '~/shared/config/dapp-open-views'

/** 兑换 Hub 模式：闪兑 / 交易 / 燃烧 / 涡轮 */
const EXCHANGE_MODES: readonly {
  view: Exclude<ExchangeView, 'hub'>
  icon: string
  tourId?: string
}[] = [
  { view: 'flash', icon: exchangeHubAssets.modeFlash },
  { view: 'trade', icon: exchangeHubAssets.modeTrade, tourId: 'swap-trade' },
  { view: 'burn', icon: exchangeHubAssets.modeBurn },
  { view: 'turbine', icon: exchangeHubAssets.modeTurbine, tourId: 'swap-turbine' },
]

export function ExchangeHubWidget() {
  const { messages: t } = useI18n()
  const copy = t.exchange.hub.modes

  return (
    <>
      <WidgetHeader
        action={<PanelToggle />}
        className="mb-4"
        subtitle={t.exchange.intro}
        title={t.exchange.title}
        titleClassName="text-xl leading-(--type-headline-leading) tracking-normal"
      />
      <WidgetStack>
        {EXCHANGE_MODES.map((mode) => {
          const text = copy[mode.view]
          return (
            <InteractiveCard
              className="flex items-center gap-3"
              key={mode.view}
              onClick={() => openExchangeView(mode.view)}
              tourId={mode.tourId}
            >
              <Icon alt="" size="xl" src={mode.icon} />
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
      </WidgetStack>
    </>
  )
}
