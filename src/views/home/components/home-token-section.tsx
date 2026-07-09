import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'
import type { HomeMessagesBundle } from '~/i18n/messages/home/types'
import { tokenCardShells } from '~/views/home/static-layout'
import { useI18n } from '~/i18n/use-i18n'
import { revealClass } from '~/shared/lib/reveal'
import { cn } from '~/shared/lib/utils'
import { HomeSectionHead } from '~/views/home/components/home-section-head'
import { HomeSection } from '~/views/home/components/home-section'

type TokenCard = HomeMessagesBundle['sections']['token']['cards'][number] & {
  className: string
  icon: string
  iconClassName?: string
  shape: string
  shapeClassName?: string
  shapeWrapClassName: string
  symbol: string
}

function HomeTokenCard({ token }: { token: TokenCard }) {
  return (
    <Card
      surface="outlined"
      className={cn(
        'relative isolate h-72 overflow-hidden rounded-lg border-0 p-0 text-white shadow-token transition-[box-shadow,filter] duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-(image:--home-token-sheen) before:opacity-0 before:transition-opacity before:duration-300 before:ease-[cubic-bezier(0.2,0.7,0.2,1)] before:content-[""] max-dapp:flex max-dapp:h-auto max-dapp:min-h-44 max-dapp:flex-col max-dapp:justify-start max-dapp:gap-1.5 max-dapp:rounded-md max-dapp:p-5',
        'max-dapp:hover:shadow-none',
        'hover:shadow-(--home-token-hover-shadow) hover:saturate-[1.02]',
        'hover:before:opacity-100',
        'hover:**:data-token-tile:border-white/50 hover:**:data-token-tile:bg-white/20 hover:**:data-token-tile:shadow-(--home-token-tile-shadow)',
        'hover:[&_[data-token-tile]_img]:saturate-[1.08] hover:[&_[data-token-tile]_img]:contrast-[1.04]',
        'hover:**:data-token-shape-wrap:opacity-100 hover:**:data-token-shape-wrap:saturate-[1.08]',
        token.className,
      )}
      data-token-card
    >
      <div
        className={cn(
          'pointer-events-none absolute -z-1 transition-[filter,opacity] duration-420 ease-[cubic-bezier(0.2,0.7,0.2,1)] max-dapp:hidden',
          token.shapeWrapClassName,
        )}
        data-token-shape-wrap
        aria-hidden="true"
      >
        <img
          className={cn(
            'block size-full [[&:not([src])]]:bg-transparent',
            token.shapeClassName,
          )}
          src={token.shape}
          alt=""
          width={token.symbol === 'X' ? 585 : 170}
          height={token.symbol === 'X' ? 554 : 170}
          loading="lazy"
        />
      </div>
      <span
        className="absolute left-6 top-6 z-1 grid size-(--home-token-tile-size) origin-center place-items-center rounded-[0.875rem] border border-white/28 bg-white/16 transition-[background-color,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] max-dapp:static max-dapp:size-(--home-token-tile-size-h5) max-dapp:rounded-[0.8125rem] [&_img:not([src])]:bg-transparent"
        data-token-tile
        aria-hidden="true"
      >
        <img
          className={cn(
            'size-(--home-token-icon-size) object-contain transition-[filter] duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] max-dapp:size-(--home-token-icon-size-h5)',
            token.iconClassName,
          )}
          src={token.icon}
          alt=""
          width="30"
          height="30"
          loading="lazy"
        />
      </span>
      <div className="absolute left-6 top-40 z-1 flex w-full max-w-60 flex-col gap-1.5 max-dapp:static max-dapp:w-full max-dapp:max-w-none">
        <Text
          as="h3"
          className="m-0 text-2xl leading-[1.3] tracking-[-0.03em] text-white max-dapp:mt-0.5 max-dapp:text-xl max-dapp:leading-[1.2] max-dapp:tracking-[-0.03em]"
          variant="headline"
        >
          {token.symbol}
        </Text>
        <Text
          as="strong"
          className="text-sm font-semibold leading-[1.3] text-white max-dapp:text-xs max-dapp:leading-[1.2]"
          variant="copy"
        >
          {token.label}
        </Text>
        <Text
          as="p"
          className="w-full max-w-60 text-sm font-normal text-white max-dapp:max-w-none max-dapp:text-xs"
          variant="copy"
        >
          {token.description}
        </Text>
      </div>
    </Card>
  )
}

export function HomeTokenSection() {
  const { messages } = useI18n()
  const content = messages.home.sections.token
  const cards = content.cards.map((card, index) => ({
    ...tokenCardShells[index],
    ...card,
  }))

  return (
    <HomeSection
      spacing="content"
      container="content"
      className="dapp:min-h-176 max-dapp:min-h-240"
      id="token"
      aria-labelledby="token-title"
    >
      <HomeSectionHead
        eyebrow={content.eyebrow}
        title={content.title}
        subtitle={content.subtitle}
      />
      <div
        className={cn(
          'mt-14 grid grid-cols-4 gap-5.5 py-(--shadow-bleed) tablet:grid-cols-2 max-dapp:mt-4 max-dapp:grid-cols-1 max-dapp:gap-4',
          revealClass(),
        )}
        data-reveal
        data-token-grid
      >
        {cards.map((token) => (
          <HomeTokenCard key={token.symbol} token={token} />
        ))}
      </div>
    </HomeSection>
  )
}
