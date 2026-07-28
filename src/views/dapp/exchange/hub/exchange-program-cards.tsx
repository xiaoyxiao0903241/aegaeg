import { useI18n } from '~/i18n/use-i18n'
import { useExchangeViewStore, type ExchangeView } from '~/stores/exchange-view-store'
import { ExchangeProgramCard } from '~/views/dapp/exchange/hub/exchange-program-card'

/**
 * Figma hub program grid (PC `4267:212`):
 * 0 Trade gAGX → flash · 1 Turbine → turbine · 2 Get USD1 → flash
 * 3 Get AGX → trade · 4 Sell X → trade · 5 Points → burn
 */
const PROGRAM_TARGETS: Array<ExchangeView | null> = [
  'flash',
  'turbine',
  'flash',
  'trade',
  'trade',
  'burn',
]

export function ExchangeProgramCards() {
  const { messages: t } = useI18n()
  const setView = useExchangeViewStore((state) => state.setView)
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
            onClick={target ? () => setView(target) : undefined}
            title={card.title}
          />
        )
      })}
    </div>
  )
}
