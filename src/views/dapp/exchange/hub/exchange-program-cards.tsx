import { useI18n } from '~/i18n/use-i18n'
import { useExchangeViewStore, type ExchangeView } from '~/stores/exchange-view-store'
import { ExchangeProgramCard } from '~/views/dapp/exchange/hub/exchange-program-card'

/** Cards 0 → flash, 1 → trade, 2–4 inactive (per product doc). */
const PROGRAM_TARGETS: Array<ExchangeView | null> = ['flash', 'trade', null, null, null]

export function ExchangeProgramCards() {
  const { messages: t } = useI18n()
  const setView = useExchangeViewStore((state) => state.setView)
  const cards = t.exchange.hub.program.cards
  const [hero, ...rest] = cards
  if (!hero) return null

  const openTarget = (index: number) => {
    const target = PROGRAM_TARGETS[index] ?? null
    if (target) setView(target)
  }

  return (
    <div className="grid gap-2">
      <ExchangeProgramCard
        body={hero.body}
        index={0}
        onClick={() => openTarget(0)}
        title={hero.title}
      />
      <div className="grid gap-2 dapp:grid-cols-2">
        {rest.map((card, offset) => {
          const index = offset + 1
          const target = PROGRAM_TARGETS[index] ?? null

          return (
            <ExchangeProgramCard
              body={card.body}
              index={index}
              key={card.title}
              onClick={target ? () => openTarget(index) : undefined}
              title={card.title}
            />
          )
        })}
      </div>
    </div>
  )
}
