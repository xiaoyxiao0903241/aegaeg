import { swapHubAssets } from '~/app/assets'
import { useI18n } from '~/i18n/use-i18n'
import { useSwapViewStore, type SwapView } from '~/stores/swap-view-store'
import { cn } from '~/lib/utils'

/** Cards 0–1 → flash, 2 → trade, 3–4 inactive (per product doc). */
const PROGRAM_TARGETS: Array<SwapView | null> = ['flash', 'flash', 'trade', null, null]

function ProgramCardCopy({ body, title }: { body: string; title: string }) {
  return (
    <span className="grid min-w-0 gap-1 text-left">
      <strong className="text-[0.8125rem] font-semibold leading-[1.3] tracking-[0.08em] text-foreground">
        {title}
      </strong>
      <span className="text-[0.8125rem] font-normal leading-[1.3] tracking-[-0.03em] text-muted-foreground">
        {body}
      </span>
    </span>
  )
}

function ProgramCardIcon({ index }: { index: number }) {
  if (index === 0) {
    return (
      <span className="flex shrink-0 items-center justify-end">
        <img
          alt=""
          className="size-7 shrink-0 -mr-[0.4375rem]"
          height={28}
          src={swapHubAssets.programUsdt}
          width={28}
        />
        <img
          alt=""
          className="size-7 shrink-0"
          height={28}
          src={swapHubAssets.programUsd1}
          width={28}
        />
      </span>
    )
  }

  if (index === 1) {
    return (
      <img alt="" className="size-7 shrink-0" height={28} src={swapHubAssets.programUsd1} width={28} />
    )
  }

  if (index === 2) {
    return (
      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#232833]">
        <img
          alt=""
          className="h-[1.09375rem] w-[1.3125rem] object-contain"
          height={17.5}
          src={swapHubAssets.programAgx}
          width={21}
        />
      </span>
    )
  }

  if (index === 3) {
    return (
      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-dark">
        <img
          alt=""
          className="h-[1.0625rem] w-[1.125rem] object-contain"
          height={17}
          src={swapHubAssets.programX}
          width={18}
        />
      </span>
    )
  }

  return null
}

function ProgramCardButton({
  body,
  index,
  onClick,
  title,
}: {
  body: string
  index: number
  onClick?: () => void
  title: string
}) {
  const textOnly = index === 4
  const interactive = Boolean(onClick)

  return (
    <button
      className={cn(
        'flex w-full rounded-md bg-card p-4 text-left shadow-card',
        interactive &&
          'cursor-pointer transition-[transform,box-shadow] duration-180 ease-out hover:-translate-y-px',
        textOnly ? 'flex-col items-start gap-1' : 'items-center justify-between gap-2',
      )}
      onClick={onClick}
      type="button"
    >
      {textOnly ? (
        <ProgramCardCopy body={body} title={title} />
      ) : (
        <>
          <span className={cn('min-w-0', index === 0 ? 'shrink-0' : 'flex-1')}>
            <ProgramCardCopy body={body} title={title} />
          </span>
          <ProgramCardIcon index={index} />
        </>
      )}
    </button>
  )
}

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
      <ProgramCardButton
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
            <ProgramCardButton
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
