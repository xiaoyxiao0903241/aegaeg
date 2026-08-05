import type { CSSProperties } from 'react'

import type { HomeMessagesBundle } from '~/i18n/messages/home/types'
import { useI18n } from '~/i18n/use-i18n'
import { Card } from '~/shared/components/card'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'
import { HomeSection } from '~/views/home/home-section'
import { HomeSectionHead } from '~/views/home/home-section-head'
import { engineIcons, protocolIcons } from '~/views/home/static-layout'

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

/** 按 variant 与序号生成卡片分隔边框类名。 */
function cardBorderClass(variant: 'protocol' | 'engine', index: number) {
  if (variant === 'protocol') {
    return cn(
      'border-0',
      index > 0 && 'dapp:border-l-[0.03125rem] dapp:border-border',
      index === 0 ? 'max-dapp:min-h-56' : 'max-dapp:min-h-48',
    )
  }

  return cn(
    'border-0',
    index % 2 === 1 && 'dapp:border-l-[0.03125rem] dapp:border-border',
    index > 1 && 'dapp:border-t-[0.03125rem] dapp:border-border',
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
  const isEngine = variant === 'engine'

  return (
    <Card
      className={cn(
        'rounded-none bg-transparent p-0 shadow-none',
        isEngine
          ? 'group/engine min-h-64 p-8 transition-[background-color,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] hover:shadow-card max-narrow:px-6 max-narrow:py-7 max-dapp:min-h-0 max-dapp:rounded-md max-dapp:bg-card max-dapp:p-5.5 max-dapp:shadow-card'
          : 'min-h-72 px-8 py-9 transition-shadow duration-200 ease-out hover:shadow-card max-narrow:px-6 max-narrow:py-7 max-dapp:min-h-0 max-dapp:rounded-md max-dapp:bg-card max-dapp:p-5.5 max-dapp:shadow-card',
        cardBorderClass(variant, index),
      )}
      surface="outlined"
      data-engine-card={isEngine ? true : undefined}
      data-protocol-card={variant === 'protocol' ? true : undefined}
      style={{ '--card-index': index } as CSSProperties}
    >
      <img
        className={
          isEngine
            ? 'size-(--home-feature-icon-size) object-cover max-dapp:size-(--home-feature-icon-size-h5) max-dapp:object-contain'
            : 'size-(--home-feature-icon-size) object-contain max-dapp:size-(--home-feature-icon-size-h5)'
        }
        src={card.icon}
        alt=""
        width="80"
        height="80"
        loading="lazy"
        data-feature-line="icon"
      />
      <Text
        as="h3"
        variant="headline"
        className={cn(
          'mt-3 text-xl leading-[1.2] tracking-tight max-dapp:mt-2.5 max-dapp:min-w-0 max-dapp:text-lg max-dapp:text-balance',
          isEngine &&
            'transition-colors duration-300 ease-out group-focus-within/engine:text-primary group-hover/engine:text-primary',
        )}
        data-feature-line="title"
      >
        {card.title}
      </Text>
      <Text
        as="p"
        className="mt-3 max-w-md text-sm/normal max-dapp:mt-2.5 max-dapp:w-full max-dapp:max-w-80"
        tone="muted-foreground"
        variant="copy"
        data-feature-line="body"
      >
        {card.body}
      </Text>
    </Card>
  )
}

/**
 * 特性卡片区块（协议 / 引擎）
 *
 * 按 variant 复用同一布局：协议为三卡一行、引擎为 2×2 网格，
 * 卡片图标来自静态布局表，正文由 i18n 文案提供，H5 下收敛为单列。
 *
 * @param variant 区块类型，决定图标组、网格行列与卡片内边距
 */
export function HomeIconFeatureSection({ variant }: { variant: 'protocol' | 'engine' }) {
  const { messages } = useI18n()
  const content = messages.home.sections[variant]
  const { icons, id } = sectionConfig[variant]
  const cards: IconCard[] = content.cards.flatMap((card, index) => {
    const icon = icons[index]
    if (!icon) return []
    return [{ ...card, icon }]
  })
  const isEngine = variant === 'engine'

  return (
    <HomeSection
      spacing="content"
      container="page"
      className={isEngine ? 'max-dapp:min-h-240' : 'max-dapp:min-h-208'}
      id={id}
      aria-labelledby={`${id}-title`}
    >
      <HomeSectionHead
        eyebrow={content.eyebrow}
        title={content.title}
        subtitle={content.subtitle}
      />
      <div
        className={
          isEngine
            ? 'mt-14 grid grid-cols-2 rounded-lg bg-card shadow-card max-dapp:mt-6 max-dapp:grid-cols-1 max-dapp:gap-6 max-dapp:rounded-none max-dapp:bg-transparent max-dapp:shadow-none'
            : 'mt-14 grid grid-cols-3 rounded-lg bg-card shadow-card max-dapp:mt-4 max-dapp:grid-cols-1 max-dapp:gap-4 max-dapp:rounded-none max-dapp:bg-transparent max-dapp:shadow-none'
        }
        data-engine-grid={isEngine ? true : undefined}
        data-protocol-grid={variant === 'protocol' ? true : undefined}
        data-reveal
      >
        {cards.map((card, index) => (
          <HomeIconCard card={card} index={index} key={card.title} variant={variant} />
        ))}
      </div>
    </HomeSection>
  )
}
