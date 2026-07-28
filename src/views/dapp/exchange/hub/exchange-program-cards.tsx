import { useExchangeViewStore } from '~/stores/exchange-view-store'
import { openExchangeView } from '~/shared/config/open-exchange-view'
import type { ExchangeView } from '~/stores/exchange-view-store'
import { ExchangeProgramCard } from '~/views/dapp/exchange/hub/exchange-program-card'
import { useI18n } from '~/i18n/use-i18n'

/**
 * Figma hub program grid (PC `4267:212`):
 * 0 Trade gAGX → flash · 1 Turbine → turbine · 2 Get USD1 → flash
 * 3 Get AGX → trade · 4 Sell X → null (X trade not enabled) · 5 Points → burn
 */
const PROGRAM_TARGETS: Array<ExchangeView | null> = [
  'flash',
  'turbine',
  'flash',
  'trade',
  null,
  'burn',
]

export function ExchangeProgramCards() {
  const { messages: t } = useI18n()
  useExchangeViewStore((state) => state.view)
  const cards = t.exchange.hub.program.cards

  return (
    <div className="grid gap-2 dapp:grid-cols-2">
      {cards.map((card, index) => {
        const target = PROGRAM_TARGETS[index] ?? null

        return (
          <ExchangeProgramCard
            body={card.body}
            index={index}
            key={`${card.title}:${index}`}
            onClick={target ? () => openExchangeView(target) : undefined}
            title={card.title}
          />
        )
      })}
    </div>
  )
}
