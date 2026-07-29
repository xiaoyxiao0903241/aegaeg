import { exchangeHubAssets } from '~/app/assets'
import { tv } from 'tailwind-variants'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'
import { cn } from '~/shared/lib/utils'

/** Figma hub program card `4323:704`: h70, px16 py14, elevated. */
const exchangeProgramCard = tv({
  base: 'flex h-[70px] w-full px-4 py-3.5 text-left',
  variants: {
    layout: {
      text: 'flex-col items-start justify-center gap-1.5',
      split: 'items-center justify-between gap-2',
    },
    interactive: {
      true: 'duration-dapp-fast cursor-pointer transition-[transform,box-shadow] ease-out hover:scale-[1.008] active:scale-[0.992]',
      false: 'cursor-not-allowed opacity-45 shadow-none',
    },
  },
})

function ProgramCardCopy({ body, title }: { body: string; title: string }) {
  return (
    <span className="grid min-w-0 gap-1.5 text-left">
      <Text as="strong" variant="copy" className="text-[14px] leading-normal font-semibold">
        {title}
      </Text>
      <Text as="span" variant="support" className="leading-normal text-foreground/40">
        {body}
      </Text>
    </span>
  )
}

function DualCoin({ left, right }: { left: string; right: string }) {
  return (
    <span className="relative flex h-7 w-[53px] shrink-0 items-center">
      <img
        alt=""
        className="absolute top-0 left-[2px] size-7 rounded-md object-cover"
        height={28}
        src={left}
        width={28}
      />
      <img
        alt=""
        className="absolute top-0 left-[25px] size-7 rounded-md object-cover"
        height={28}
        src={right}
        width={28}
      />
    </span>
  )
}

function SingleCoin({ src }: { src: string }) {
  return (
    <img
      alt=""
      className="size-7 shrink-0 rounded-md object-cover"
      height={28}
      src={src}
      width={28}
    />
  )
}

function ProgramCardIcon({ index }: { index: number }) {
  if (index === 0) {
    return <DualCoin left={exchangeHubAssets.programGagx} right={exchangeHubAssets.programAgx} />
  }

  if (index === 1) {
    return <DualCoin left={exchangeHubAssets.programUsd1} right={exchangeHubAssets.programGagx} />
  }

  if (index === 2) {
    return <DualCoin left={exchangeHubAssets.programUsdt} right={exchangeHubAssets.programUsd1} />
  }

  if (index === 3) {
    return <SingleCoin src={exchangeHubAssets.programPancake} />
  }

  if (index === 4) {
    return <SingleCoin src={exchangeHubAssets.programX} />
  }

  return null
}

export function ExchangeProgramCard({
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
  const textOnly = index === 5
  const interactive = Boolean(onClick)

  return (
    <Card
      as="button"
      surface="elevated"
      aria-disabled={!interactive}
      className={cn(
        exchangeProgramCard({
          layout: textOnly ? 'text' : 'split',
          interactive,
        }),
      )}
      disabled={!interactive}
      onClick={onClick}
      type="button"
    >
      {textOnly ? (
        <ProgramCardCopy body={body} title={title} />
      ) : (
        <>
          <span className="min-w-0 flex-1">
            <ProgramCardCopy body={body} title={title} />
          </span>
          <ProgramCardIcon index={index} />
        </>
      )}
    </Card>
  )
}
