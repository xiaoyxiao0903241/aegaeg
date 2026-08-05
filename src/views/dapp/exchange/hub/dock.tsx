/**
 * 兑换 Hub 左栏 Dock
 *
 * 列出四种兑换模式入口卡片，点击切换子视图；
 * 顶部为面板标题与收起按钮。
 */
import { exchangeHubAssets } from '~/app/assets'
import { useI18n } from '~/i18n/use-i18n'
import { ModeCard } from '~/shared/components/mode-card'
import { WidgetHeader } from '~/shared/components/widget-header'
import type { ExchangeView } from '~/shared/config/dapp-deep-links'
import { openExchangeView } from '~/shared/config/dapp-open-views'
import { DetailToggle } from '~/views/dapp/shared/detail-toggle'
import { DockStack } from '~/views/dapp/shared/dock-frame'

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

export function HubDock() {
  const { messages: t } = useI18n()
  const copy = t.exchange.hub.modes

  return (
    <>
      <WidgetHeader
        action={<DetailToggle />}
        className="mb-4"
        subtitle={t.exchange.intro}
        title={t.exchange.title}
        titleClassName="text-xl leading-(--type-headline-leading) tracking-normal"
      />
      <DockStack>
        {EXCHANGE_MODES.map((mode) => {
          const text = copy[mode.view]
          return (
            <ModeCard
              key={mode.view}
              onClick={() => openExchangeView(mode.view)}
              tourId={mode.tourId}
            >
              <ModeCard.Icon src={mode.icon} />
              <ModeCard.Copy>
                <ModeCard.Title>{text.title}</ModeCard.Title>
                <ModeCard.Body>{text.body}</ModeCard.Body>
              </ModeCard.Copy>
            </ModeCard>
          )
        })}
      </DockStack>
    </>
  )
}
