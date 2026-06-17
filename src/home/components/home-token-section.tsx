import { Card } from '~/components/card'
import { Text } from '~/components/text'
import type { HomeContent, TokenCard } from '~/home/content/types'
import { revealClass } from '~/lib/reveal'
import { cn } from '~/lib/utils'
import { DeferredImage } from './home-primitives'
import { HomeSectionHead } from './home-section-head'

const tokenClass = {
  section:
    'token-section relative py-[120px] min-[821px]:min-h-[696px] max-[820px]:min-h-[902px] max-[820px]:pt-0 max-[820px]:pb-14',
  container: 'container max-[820px]:!w-[min(calc(100vw-40px),362px)]',
  grid:
    'token-grid mt-14 grid grid-cols-4 gap-[22px] max-[1100px]:grid-cols-2 max-[820px]:mt-4 max-[820px]:grid-cols-1 max-[820px]:gap-4',
  card:
    'token-card relative isolate h-[280px] overflow-hidden transition-[box-shadow,filter] duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,oklch(100%_0_0_/_16%),transparent_58%)] before:opacity-0 before:transition-opacity before:duration-300 before:ease-[cubic-bezier(0.2,0.7,0.2,1)] before:content-[""] max-[820px]:flex max-[820px]:h-auto max-[820px]:min-h-[173px] max-[820px]:flex-col max-[820px]:justify-start max-[820px]:gap-[7px] max-[820px]:rounded-[18px] max-[820px]:p-5',
  iconWrap:
    'token-tile absolute left-6 top-6 z-[1] grid size-[52px] origin-center place-items-center rounded-[14px] border border-white/28 bg-white/16 transition-[background-color,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] max-[820px]:static max-[820px]:size-[46px] max-[820px]:rounded-[13px] max-[820px]:border-0 max-[820px]:bg-card [&_img:not([src])]:bg-transparent',
  icon:
    'size-[30px] object-contain transition-[filter] duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] max-[820px]:size-[26px]',
  shapeWrap:
    'token-shape-wrap pointer-events-none absolute -z-[1] transition-[filter,opacity] duration-[420ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] max-[820px]:hidden',
  shapeImg: 'token-shape block size-full [[&:not([src])]]:bg-transparent',
  info:
    'token-info absolute left-6 top-[154px] z-[1] flex w-[min(calc(100%-48px),235px)] flex-col gap-1.5 max-[820px]:static max-[820px]:w-full',
} as const

const tokenCardHoverClass = cn(
  'max-[820px]:hover:shadow-none',
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
        <DeferredImage
          className={cn(tokenClass.shapeImg, token.shapeClassName)}
          src={token.shape}
          alt=""
          width="170"
          height="170"
        />
      </div>
      <span className={tokenClass.iconWrap} aria-hidden="true">
        <DeferredImage
          className={cn(tokenClass.icon, token.iconClassName)}
          src={token.icon}
          alt=""
          width="30"
          height="30"
        />
      </span>
      <div className={tokenClass.info}>
        <Text
          as="h3"
          weight="semibold"
          className="m-0 text-white text-[26px] leading-[1.3] tracking-[-0.78px] max-[820px]:mt-0.5 max-[820px]:text-[22px] max-[820px]:leading-[1.2] max-[820px]:tracking-[-0.66px]"
        >
          {token.symbol}
        </Text>
        <Text
          as="strong"
          size="sm"
          weight="semibold"
          className="text-white leading-[1.3] tracking-[-0.28px] max-[820px]:leading-[1.2]"
        >
          {token.label}
        </Text>
        <Text
          as="p"
          size="sm"
          className="w-[min(100%,235px)] font-normal text-white leading-[1.5] tracking-[-0.26px] max-[820px]:w-full"
        >
          {token.description}
        </Text>
      </div>
    </Card>
  )
}

export function HomeTokenSection({
  content,
}: {
  content: HomeContent['sections']['token']
}) {
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
          {content.cards.map((token) => (
            <HomeTokenCard key={token.symbol} token={token} />
          ))}
        </div>
      </div>
    </section>
  )
}
