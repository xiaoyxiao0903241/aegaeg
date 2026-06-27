import { Card } from '~/components/card'
import { Text } from '~/components/text'
import type { HomeMessagesBundle } from '~/i18n/messages/home/types'
import { engineIcons, protocolIcons } from '~/home/static-layout'
import { useI18n } from '~/i18n/use-i18n'
import { cn } from '~/lib/utils'
import { HomeSectionHead } from '~/home/components/home-section-head'

type IconCard = (
  | HomeMessagesBundle['sections']['protocol']['cards'][number]
  | HomeMessagesBundle['sections']['engine']['cards'][number]
) & { icon: string }

const sectionConfig = {
  protocol: {
    icons: protocolIcons,
    id: 'protocol',
  },
  engine: {
    icons: engineIcons,
    id: 'engine',
  },
} as const

const sectionClass = {
  protocol:
    'relative py-30 max-dapp:min-h-208 max-dapp:pt-0 max-dapp:pb-14',
  engine:
    'relative py-30 max-dapp:min-h-240 max-dapp:pt-0 max-dapp:pb-14',
} as const

const gridClass = {
  protocol:
    'feature-card three-col mt-14 grid grid-cols-3 rounded-lg bg-card shadow-card max-dapp:mt-4 max-dapp:grid-cols-1 max-dapp:gap-4 max-dapp:overflow-visible max-dapp:rounded-none max-dapp:bg-transparent max-dapp:shadow-none',
  engine:
    'engine-card mt-14 grid grid-cols-2 rounded-lg bg-card shadow-card max-dapp:mt-6 max-dapp:grid-cols-1 max-dapp:gap-6 max-dapp:overflow-visible max-dapp:rounded-none max-dapp:bg-transparent max-dapp:shadow-none',
} as const

const cardClass = {
  protocol:
    'min-h-72 px-8 py-9 max-dapp:min-h-0 max-dapp:rounded-md max-dapp:bg-card max-dapp:p-5.5 max-dapp:shadow-card max-[520px]:px-6 max-[520px]:py-7',
  engine:
    'group/engine min-h-64 p-8 transition-[background-color,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] max-dapp:min-h-0 max-dapp:rounded-md max-dapp:bg-card max-dapp:p-5.5 max-dapp:shadow-card max-[520px]:px-6 max-[520px]:py-7',
} as const

const iconClass = {
  protocol:
    'feature-icon size-[var(--home-feature-icon-size)] object-contain max-dapp:size-[var(--home-feature-icon-size-h5)]',
  engine:
    'size-[var(--home-feature-icon-size)] object-cover max-dapp:size-[var(--home-feature-icon-size-h5)] max-dapp:object-contain',
} as const

function cardBorderClass(variant: 'protocol' | 'engine', index: number) {
  if (variant === 'protocol') {
    return cn(
      index > 0 && 'dapp:border-l dapp:border-border',
      index === 0 ? 'max-dapp:min-h-56' : 'max-dapp:min-h-48',
    )
  }

  return cn(
    index % 2 === 1 && 'dapp:border-l dapp:border-border',
    index > 1 && 'dapp:border-t dapp:border-border',
    index < 2 ? 'max-dapp:min-h-48' : 'max-dapp:min-h-44',
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
      <img
        className={cn(iconClass[variant], 'feature-card-icon')}
        src={card.icon}
        alt=""
        width="80"
        height="80"
        loading="lazy"
      />
      <Text
        as="h3"
        size="lg"
        weight="semibold"
        className={cn(
          'feature-card-title mt-3 text-xl leading-[1.2] max-dapp:mt-2.5 max-dapp:min-w-0 max-dapp:text-lg max-dapp:text-balance',
          variant === 'engine' &&
            'transition-colors duration-300 ease-out group-hover/engine:text-primary group-focus-within/engine:text-primary',
        )}
      >
        {card.title}
      </Text>
      <Text
        as="p"
        size="md"
        tone="body"
        className="feature-card-body mt-3 max-w-112 text-sm leading-[1.5] max-dapp:mt-2.5 max-dapp:w-full max-dapp:max-w-80 max-dapp:text-sm"
      >
        {card.body}
      </Text>
    </Card>
  )
}

export function HomeIconFeatureSection({
  variant,
}: {
  variant: 'protocol' | 'engine'
}) {
  const { messages } = useI18n()
  const content = messages.home.sections[variant]
  const { icons, id } = sectionConfig[variant]
  const cards = content.cards.map((card, index) => ({
    ...card,
    icon: icons[index],
  }))

  return (
    <section className={sectionClass[variant]} id={id} aria-labelledby={`${id}-title`}>
      <div className="container">
        <HomeSectionHead
          eyebrow={content.eyebrow}
          title={content.title}
          subtitle={content.subtitle}
        />
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
      </div>
    </section>
  )
}
