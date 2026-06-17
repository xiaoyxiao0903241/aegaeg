import { Card } from '~/components/card'
import { Text } from '~/components/text'
import type { HomeContent, IconCard } from '~/home/content/types'
import { cn } from '~/lib/utils'
import { DeferredImage } from '~/home/components/home-primitives'
import { HomeSectionHead } from '~/home/components/home-section-head'

const sectionClass = {
  protocol:
    'relative py-[120px] max-[820px]:min-h-[827px] max-[820px]:pt-0 max-[820px]:pb-14',
  engine:
    'relative py-[120px] max-[820px]:min-h-[976px] max-[820px]:pt-0 max-[820px]:pb-14',
} as const

const gridClass = {
  protocol:
    'feature-card three-col mt-14 grid grid-cols-3 overflow-hidden rounded-[22px] bg-card shadow-card max-[820px]:mt-4 max-[820px]:grid-cols-1 max-[820px]:gap-4 max-[820px]:overflow-visible max-[820px]:rounded-none max-[820px]:bg-transparent max-[820px]:shadow-none',
  engine:
    'engine-card mt-14 grid grid-cols-2 overflow-hidden rounded-[22px] bg-card shadow-card max-[820px]:mt-6 max-[820px]:grid-cols-1 max-[820px]:gap-6 max-[820px]:overflow-visible max-[820px]:rounded-none max-[820px]:bg-transparent max-[820px]:shadow-none',
} as const

const cardClass = {
  protocol:
    'min-h-[281px] px-[34px] py-9 max-[820px]:min-h-0 max-[820px]:rounded-[18px] max-[820px]:bg-card max-[820px]:p-[22px] max-[820px]:shadow-card max-[520px]:px-6 max-[520px]:py-7',
  engine:
    'group/engine min-h-[265px] p-[34px] transition-[background-color,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] max-[820px]:min-h-0 max-[820px]:rounded-[18px] max-[820px]:bg-card max-[820px]:p-[22px] max-[820px]:shadow-card max-[520px]:px-6 max-[520px]:py-7',
} as const

const iconClass = {
  protocol: 'feature-icon size-20 object-contain max-[820px]:size-11',
  engine: 'size-20 object-cover max-[820px]:size-11 max-[820px]:object-contain',
} as const

const protocolIndexClass =
  'feature-index mt-2.5 hidden text-xs font-semibold leading-[1.2] tracking-[0.96px] text-faint max-[820px]:block'

function cardBorderClass(variant: 'protocol' | 'engine', index: number) {
  if (variant === 'protocol') {
    return cn(
      index > 0 && 'min-[821px]:border-l min-[821px]:border-border',
      index === 0 ? 'max-[820px]:min-h-[218px]' : 'max-[820px]:min-h-[197px]',
    )
  }

  return cn(
    index % 2 === 1 && 'min-[821px]:border-l min-[821px]:border-border',
    index > 1 && 'min-[821px]:border-t min-[821px]:border-border',
    index < 2 ? 'max-[820px]:min-h-[194px]' : 'max-[820px]:min-h-[173px]',
  )
}

function HomeIconCard({
  card,
  index,
  variant,
}: {
  card: IconCard
  index: number
  variant: 'protocol' | 'engine'
}) {
  return (
    <Card
      className={cn(cardClass[variant], cardBorderClass(variant, index))}
      context="home"
      data-engine-card={variant === 'engine' ? true : undefined}
      data-protocol-card={variant === 'protocol' ? true : undefined}
      fill="transparent"
      hover="shadow"
      radius="none"
      style={{ '--card-index': index } as React.CSSProperties}
    >
      <DeferredImage
        className={cn(iconClass[variant], 'feature-card-icon')}
        src={card.icon}
        alt=""
        width="80"
        height="80"
      />
      {variant === 'protocol' && card.index ? (
        <Text as="span" className={cn(protocolIndexClass, 'feature-card-index')} tone="muted">
          {card.index}
        </Text>
      ) : null}
      <Text
        as="h3"
        size="lg"
        weight="semibold"
        className={cn(
          'feature-card-title mt-3 text-xl leading-[1.2] max-[820px]:mt-2.5 max-[820px]:text-[19px]',
          variant === 'engine' &&
            'transition-colors duration-300 ease-out group-hover/engine:text-primary group-focus-within/engine:text-primary max-[820px]:whitespace-nowrap',
        )}
      >
        {card.title}
      </Text>
      <Text
        as="p"
        size="md"
        tone="body"
        className="feature-card-body mt-3 max-w-[420px] text-[15px] leading-[1.5] max-[820px]:mt-2.5 max-[820px]:w-full max-[820px]:max-w-[318px] max-[820px]:text-sm"
      >
        {card.body}
      </Text>
    </Card>
  )
}

function HomeIconCardGrid({
  cards,
  variant,
}: {
  cards: IconCard[]
  variant: 'protocol' | 'engine'
}) {
  return (
    <div
      className={gridClass[variant]}
      data-engine-grid={variant === 'engine' ? true : undefined}
      data-protocol-grid={variant === 'protocol' ? true : undefined}
      data-reveal
    >
      {cards.map((card, index) => (
        <HomeIconCard card={card} index={index} key={card.title} variant={variant} />
      ))}
    </div>
  )
}

function HomeIconFeatureSection({
  content,
  id,
  variant,
}: {
  content: HomeContent['sections']['protocol'] | HomeContent['sections']['engine']
  id: 'protocol' | 'engine'
  variant: 'protocol' | 'engine'
}) {
  return (
    <section className={sectionClass[variant]} id={id} aria-labelledby={`${id}-title`}>
      <div className="container">
        <HomeSectionHead
          eyebrow={content.eyebrow}
          title={content.title}
          subtitle={content.subtitle}
        />
        <HomeIconCardGrid cards={content.cards} variant={variant} />
      </div>
    </section>
  )
}

export function HomeProtocolSection({
  content,
}: {
  content: HomeContent['sections']['protocol']
}) {
  return <HomeIconFeatureSection content={content} id="protocol" variant="protocol" />
}

export function HomeEngineSection({
  content,
}: {
  content: HomeContent['sections']['engine']
}) {
  return <HomeIconFeatureSection content={content} id="engine" variant="engine" />
}
