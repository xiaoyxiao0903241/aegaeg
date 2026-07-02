import { Card } from '~/components/card'
import { Text } from '~/components/text'
import type { HomeMessagesBundle } from '~/i18n/messages/home/types'
import { tokenCardShells } from '~/home/static-layout'
import { useI18n } from '~/i18n/use-i18n'
import { revealClass } from '~/lib/reveal'
import { cn } from '~/lib/utils'
import { HomeSectionHead } from '~/home/components/home-section-head'
import { homeSectionContainerClass } from '~/home/home-layout'

type TokenCard = HomeMessagesBundle['sections']['token']['cards'][number] & {
  className: string
  icon: string
  iconClassName?: string
  shape: string
  shapeClassName?: string
  shapeWrapClassName: string
  symbol: string
}

const tokenClass = {
  section:
    'token-section relative py-30 dapp:min-h-176 max-dapp:min-h-240 max-dapp:pt-0 max-dapp:pb-14',
  container: homeSectionContainerClass,
  grid:
    'token-grid mt-14 grid grid-cols-4 gap-5.5 py-[var(--shadow-bleed)] max-[1100px]:grid-cols-2 max-dapp:mt-4 max-dapp:grid-cols-1 max-dapp:gap-4',
  card:
    'token-card relative isolate h-72 overflow-hidden rounded-lg transition-[box-shadow,filter] duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(135deg,oklch(100%_0_0_/_16%),transparent_58%)] before:opacity-0 before:transition-opacity before:duration-300 before:ease-[cubic-bezier(0.2,0.7,0.2,1)] before:content-[""] max-dapp:flex max-dapp:h-auto max-dapp:min-h-44 max-dapp:flex-col max-dapp:justify-start max-dapp:gap-1.5 max-dapp:rounded-md max-dapp:p-5',
  iconWrap:
    'token-tile absolute left-6 top-6 z-1 grid size-[var(--home-token-tile-size)] origin-center place-items-center rounded-[0.875rem] border border-white/28 bg-white/16 transition-[background-color,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] max-dapp:static max-dapp:size-[var(--home-token-tile-size-h5)] max-dapp:rounded-[0.8125rem] [&_img:not([src])]:bg-transparent',
  icon:
    'size-[var(--home-token-icon-size)] object-contain transition-[filter] duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] max-dapp:size-[var(--home-token-icon-size-h5)]',
  shapeWrap:
    'token-shape-wrap pointer-events-none absolute -z-1 transition-[filter,opacity] duration-[420ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] max-dapp:hidden',
  shapeImg: 'token-shape block size-full [[&:not([src])]]:bg-transparent',
  info:
    'token-info absolute left-6 top-40 z-1 flex w-full max-w-60 flex-col gap-1.5 max-dapp:static max-dapp:w-full max-dapp:max-w-none',
} as const

const tokenCardHoverClass = cn(
  'max-dapp:hover:shadow-none',
  'hover:shadow-[0_20px_56px_oklch(22%_0.04_265_/_18%)] hover:saturate-[1.02]',
  'hover:before:opacity-100',
  'hover:[&_.token-tile]:border-white/50 hover:[&_.token-tile]:bg-white/20 hover:[&_.token-tile]:shadow-[0_10px_26px_oklch(0%_0_0_/_12%)]',
  'hover:[&_.token-tile_img]:saturate-[1.08] hover:[&_.token-tile_img]:contrast-[1.04]',
  'hover:[&_.token-shape-wrap]:opacity-100 hover:[&_.token-shape-wrap]:saturate-[1.08]',
)

function HomeTokenCard({ token }: { token: TokenCard }) {
  return (
    <Card
      className={cn(tokenClass.card, token.className, tokenCardHoverClass)}
      context="home"
      data-token-card
      fill="token"
      radius="xl"
    >
      <div
        className={cn(tokenClass.shapeWrap, token.shapeWrapClassName)}
        aria-hidden="true"
      >
        <img
          className={cn(tokenClass.shapeImg, token.shapeClassName)}
          src={token.shape}
          alt=""
          width={token.symbol === 'X' ? 585 : 170}
          height={token.symbol === 'X' ? 554 : 170}
          loading="lazy"
        />
      </div>
      <span className={tokenClass.iconWrap} aria-hidden="true">
        <img
          className={cn(tokenClass.icon, token.iconClassName)}
          src={token.icon}
          alt=""
          width="30"
          height="30"
          loading="lazy"
        />
      </span>
      <div className={tokenClass.info}>
        <Text
          as="h3"
          weight="semibold"
          className="m-0 text-white text-2xl leading-[1.3] tracking-[-0.78px] max-dapp:mt-0.5 max-dapp:text-xl max-dapp:leading-[1.2] max-dapp:tracking-[-0.66px]"
        >
          {token.symbol}
        </Text>
        <Text
          as="strong"
          size="sm"
          weight="semibold"
          className="text-white leading-[1.3] tracking-[-0.28px] max-dapp:leading-[1.2]"
        >
          {token.label}
        </Text>
        <Text
          as="p"
          size="sm"
          className="w-full max-w-60 font-normal text-white leading-[1.5] tracking-[-0.26px] max-dapp:max-w-none"
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
    <section className={tokenClass.section} id="token" aria-labelledby="token-title">
      <div className={tokenClass.container}>
        <HomeSectionHead
          eyebrow={content.eyebrow}
          title={content.title}
          subtitle={content.subtitle}
        />
        <div
          className={cn(tokenClass.grid, revealClass())}
          data-reveal
          data-token-grid
        >
          {cards.map((token) => (
            <HomeTokenCard key={token.symbol} token={token} />
          ))}
        </div>
      </div>
    </section>
  )
}
