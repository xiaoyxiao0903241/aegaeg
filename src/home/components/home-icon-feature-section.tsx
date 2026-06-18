import { Card } from '~/components/card'
import { Text } from '~/components/text'
import type { HomeMessagesBundle } from '~/i18n/messages/home/en'
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
    'relative py-[120px] max-dapp:min-h-[827px] max-dapp:pt-0 max-dapp:pb-14',
  engine:
    'relative py-[120px] max-dapp:min-h-[976px] max-dapp:pt-0 max-dapp:pb-14',
} as const

const gridClass = {
  protocol:
    'feature-card three-col mt-14 grid grid-cols-3 rounded-[22px] bg-card shadow-card max-dapp:mt-4 max-dapp:grid-cols-1 max-dapp:gap-4 max-dapp:overflow-visible max-dapp:rounded-none max-dapp:bg-transparent max-dapp:shadow-none',
  engine:
    'engine-card mt-14 grid grid-cols-2 rounded-[22px] bg-card shadow-card max-dapp:mt-6 max-dapp:grid-cols-1 max-dapp:gap-6 max-dapp:overflow-visible max-dapp:rounded-none max-dapp:bg-transparent max-dapp:shadow-none',
} as const

const cardClass = {
  protocol:
    'min-h-[281px] px-[34px] py-9 max-dapp:min-h-0 max-dapp:rounded-[18px] max-dapp:bg-card max-dapp:p-[22px] max-dapp:shadow-card max-[520px]:px-6 max-[520px]:py-7',
  engine:
    'group/engine min-h-[265px] p-[34px] transition-[background-color,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] max-dapp:min-h-0 max-dapp:rounded-[18px] max-dapp:bg-card max-dapp:p-[22px] max-dapp:shadow-card max-[520px]:px-6 max-[520px]:py-7',
} as const

const iconClass = {
  protocol: 'feature-icon size-20 object-contain max-dapp:size-11',
  engine: 'size-20 object-cover max-dapp:size-11 max-dapp:object-contain',
} as const

const protocolIndexClass =
  'feature-index mt-2.5 hidden text-xs font-semibold leading-[1.2] tracking-[0.96px] text-faint max-dapp:block'

function cardBorderClass(variant: 'protocol' | 'engine', index: number) {
  if (variant === 'protocol') {
    return cn(
      index > 0 && 'dapp:border-l dapp:border-border',
      index === 0 ? 'max-dapp:min-h-[218px]' : 'max-dapp:min-h-[197px]',
    )
  }

  return cn(
    index % 2 === 1 && 'dapp:border-l dapp:border-border',
    index > 1 && 'dapp:border-t dapp:border-border',
    index < 2 ? 'max-dapp:min-h-[194px]' : 'max-dapp:min-h-[173px]',
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
      {variant === 'protocol' && 'index' in card && card.index ? (
        <Text as="span" className={cn(protocolIndexClass, 'feature-card-index')} tone="muted">
          {card.index}
        </Text>
      ) : null}
      <Text
        as="h3"
        size="lg"
        weight="semibold"
        className={cn(
          'feature-card-title mt-3 text-xl leading-[1.2] max-dapp:mt-2.5 max-dapp:text-[19px]',
          variant === 'engine' &&
            'transition-colors duration-300 ease-out group-hover/engine:text-primary group-focus-within/engine:text-primary max-dapp:whitespace-nowrap',
        )}
      >
        {card.title}
      </Text>
      <Text
        as="p"
        size="md"
        tone="body"
        className="feature-card-body mt-3 max-w-[420px] text-[15px] leading-[1.5] max-dapp:mt-2.5 max-dapp:w-full max-dapp:max-w-[318px] max-dapp:text-sm"
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
