import { swapHubAssets } from '~/app/assets'
import { tv } from 'tailwind-variants'

const swapProgramCard = tv({
  base: 'flex w-full rounded-md bg-card p-4 text-left shadow-card',
  variants: {
    layout: {
      text: 'flex-col items-start gap-1',
      split: 'items-center justify-between gap-2',
    },
    interactive: {
      true: 'cursor-pointer transition-[transform,box-shadow] duration-180 ease-out hover:-translate-y-px',
      false: '',
    },
  },
})

const swapProgramCardBody = tv({
  base: 'min-w-0',
  variants: {
    width: {
      hero: 'shrink-0',
      default: 'flex-1',
    },
  },
})

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

export function SwapProgramCard({
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
      className={swapProgramCard({
        layout: textOnly ? 'text' : 'split',
        interactive,
      })}
      onClick={onClick}
      type="button"
    >
      {textOnly ? (
        <ProgramCardCopy body={body} title={title} />
      ) : (
        <>
          <span className={swapProgramCardBody({ width: index === 0 ? 'hero' : 'default' })}>
            <ProgramCardCopy body={body} title={title} />
          </span>
          <ProgramCardIcon index={index} />
        </>
      )}
    </button>
  )
}
