import { useI18n } from '~/i18n/use-i18n'
import { useSwapViewStore, type SwapView } from '~/stores/swap-view-store'
import { SwapProgramCard } from '~/views/dapp/swap/swap-program-card'

/** Cards 0 → flash, 1 → trade, 2–4 inactive (per product doc). */
const PROGRAM_TARGETS: Array<SwapView | null> = ['flash', 'trade', null, null, null]

export function SwapProgramCards() {
  const { messages: t } = useI18n()
  const setView = useSwapViewStore((state) => state.setView)
  const cards = t.swap.hub.program.cards
  const [hero, ...rest] = cards

  const openTarget = (index: number) => {
    const target = PROGRAM_TARGETS[index] ?? null
    if (target) setView(target)
  }

  return (
    <div className="grid gap-2">
      <SwapProgramCard
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
            <SwapProgramCard
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
