/**
 * X 长期价值轮播
 *
 * 四页：发行分配、价值来源、通缩路径、核心特征。
 * 轮播壳走共用 Carousel；卡片底色走 `dark`。
 */
import type { ReactNode } from 'react'

import { useI18n } from '~/i18n/use-i18n'
import { dappAssets, xmineValueAssets } from '~/shared/assets/dapp'
import { Card } from '~/shared/components/card'
import { Carousel } from '~/shared/components/carousel'
import { Icon } from '~/shared/components/icon'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

type TitleCopy = { title: string; copy: string }

type XValueCopy = {
  title: string
  supplyLabel: string
  supplyValue: string
  badge: string
  columns: ReadonlyArray<{ pct: string; title: string; bullets: ReadonlyArray<string> }>
  sourcesKicker: string
  sourcesHeadline: string
  sourcesBadge: string
  sources: ReadonlyArray<TitleCopy>
  deflationKicker: string
  deflationHeadline: string
  deflationBadge: string
  deflationSteps: ReadonlyArray<TitleCopy>
  featuresKicker: string
  featuresHeadline: string
  featuresBadge: string
  features: ReadonlyArray<TitleCopy>
}

const SOURCE_ICONS = [
  xmineValueAssets.mine,
  xmineValueAssets.rewards,
  xmineValueAssets.genesis,
] as const
const DEFLATION_ICONS = [
  xmineValueAssets.genesis,
  xmineValueAssets.community,
  xmineValueAssets.swap,
  xmineValueAssets.burn,
] as const
const FEATURE_ICONS = [
  xmineValueAssets.vault,
  xmineValueAssets.burn,
  xmineValueAssets.swap,
  xmineValueAssets.globe,
] as const

function SlideIcon({ src, tone = 'bright' }: { src: string; tone?: 'bright' | 'primary' }) {
  const fill = tone === 'primary' ? 'bg-primary' : 'bg-primary-bright'
  return (
    <span
      aria-hidden
      className="grid size-6 shrink-0 place-items-center rounded-full bg-primary-bright/14"
    >
      <span
        className={cn('size-[13px]', fill)}
        style={{
          maskImage: `url("${src}")`,
          WebkitMaskImage: `url("${src}")`,
          maskPosition: 'center',
          WebkitMaskPosition: 'center',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          maskSize: 'contain',
          WebkitMaskSize: 'contain',
        }}
      />
    </span>
  )
}

function SlideShell({
  badge,
  children,
  headline,
  kicker,
}: {
  badge: string
  children: ReactNode
  headline: string
  kicker: string
}) {
  return (
    <Card
      as="article"
      className="relative flex h-full min-h-52 min-w-0 flex-1 flex-col justify-between overflow-hidden p-5 max-dapp:px-4 max-dapp:py-3.5"
      surface="inverse"
    >
      <div className="flex min-w-0 items-center justify-between gap-4 border-b border-white/8 pb-4 max-dapp:flex-col max-dapp:items-start max-dapp:gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-3 max-dapp:gap-2">
          <Icon
            alt=""
            className="size-8 shrink-0 rounded-full max-dapp:size-7.5"
            src={dappAssets.tokenX}
          />
          <div className="grid min-w-0 gap-0.5">
            <Text as="span" className="font-semibold" tone="primary-bright" variant="eyebrow">
              {kicker}
            </Text>
            <Text as="strong" className="min-w-0 wrap-break-word" tone="inverse" variant="panel">
              {headline}
            </Text>
          </div>
        </div>
        <Text
          as="span"
          className="min-w-0 rounded-full bg-primary-bright/14 px-3.5 py-1.5 font-semibold wrap-break-word"
          tone="primary-bright"
          variant="support"
        >
          {badge}
        </Text>
      </div>
      <div className="min-w-0 pt-4 max-dapp:pt-3">{children}</div>
    </Card>
  )
}

function Tile({
  compact,
  copy,
  icon,
  title,
  titleTone = 'inverse',
  wash,
}: {
  compact?: boolean
  copy: string
  icon: string
  title: string
  titleTone?: 'inverse' | 'primary'
  wash?: boolean
}) {
  return (
    <div
      className={cn(
        'grid min-w-0 content-start rounded-faq',
        compact ? 'gap-[5px] px-3 py-[9px]' : 'gap-1.5 px-3.5 py-3',
        wash ? 'bg-primary/10' : 'bg-white/5',
      )}
    >
      <span className="flex min-w-0 items-center gap-2">
        <SlideIcon src={icon} tone={titleTone === 'primary' ? 'primary' : 'bright'} />
        <Text
          as="strong"
          className="min-w-0 font-semibold wrap-break-word"
          tone={titleTone === 'primary' ? 'primary' : 'inverse'}
          variant="copy"
        >
          {title}
        </Text>
      </span>
      <Text as="p" className="m-0 min-w-0 wrap-break-word" tone="inverse-muted" variant="support">
        {copy}
      </Text>
    </div>
  )
}

function JoinMark({ children }: { children: string }) {
  return (
    <Text
      as="span"
      className="hidden shrink-0 self-center font-semibold dapp:inline"
      tone="primary-bright"
      variant={children === '+' ? 'detail' : 'copy'}
    >
      {children}
    </Text>
  )
}

export function StakingXValueCarousel({ copy }: { copy: XValueCopy }) {
  const { messages: t } = useI18n()
  const slides = [
    {
      key: 'supply',
      node: (
        <SlideShell badge={copy.badge} headline={copy.supplyValue} kicker={copy.supplyLabel}>
          <div className="grid min-w-0 grid-cols-1 items-start gap-5 dapp:grid-cols-2 max-dapp:gap-3">
            {copy.columns.map((col) => (
              <div className="grid min-w-0 content-start gap-2" key={col.title}>
                <span className="inline-flex flex-wrap items-baseline gap-2">
                  <Text as="strong" className="font-semibold" tone="inverse" variant="section">
                    {col.pct}
                  </Text>
                  <Text
                    as="span"
                    className="min-w-0 font-semibold"
                    tone="inverse-muted"
                    variant="copy"
                  >
                    {col.title}
                  </Text>
                </span>
                <ul className="m-0 grid list-none gap-1 p-0">
                  {col.bullets.map((bullet) => (
                    <li className="flex items-baseline gap-2" key={bullet}>
                      <span
                        aria-hidden
                        className="size-1 shrink-0 translate-y-[-2px] rounded-full bg-primary"
                      />
                      <Text as="span" className="min-w-0" tone="inverse-muted" variant="support">
                        {bullet}
                      </Text>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </SlideShell>
      ),
    },
    {
      key: 'sources',
      node: (
        <SlideShell
          badge={copy.sourcesBadge}
          headline={copy.sourcesHeadline}
          kicker={copy.sourcesKicker}
        >
          <div className="grid min-w-0 grid-cols-1 items-stretch gap-2.5 dapp:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)]">
            {copy.sources.flatMap((item, index) => {
              const tile = (
                <Tile
                  copy={item.copy}
                  icon={SOURCE_ICONS[index] ?? xmineValueAssets.globe}
                  key={item.title}
                  title={item.title}
                />
              )
              if (index >= copy.sources.length - 1) return [tile]
              return [tile, <JoinMark key={`${item.title}-plus`}>+</JoinMark>]
            })}
          </div>
        </SlideShell>
      ),
    },
    {
      key: 'deflation',
      node: (
        <SlideShell
          badge={copy.deflationBadge}
          headline={copy.deflationHeadline}
          kicker={copy.deflationKicker}
        >
          <div className="grid min-w-0 grid-cols-1 items-stretch gap-2 dapp:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)]">
            {copy.deflationSteps.flatMap((step, index) => {
              const last = index === copy.deflationSteps.length - 1
              const tile = (
                <Tile
                  compact
                  copy={step.copy}
                  icon={DEFLATION_ICONS[index] ?? xmineValueAssets.globe}
                  key={step.title}
                  title={step.title}
                  titleTone={last ? 'primary' : 'inverse'}
                  wash={last}
                />
              )
              if (last) return [tile]
              return [tile, <JoinMark key={`${step.title}-arrow`}>→</JoinMark>]
            })}
          </div>
        </SlideShell>
      ),
    },
    {
      key: 'features',
      node: (
        <SlideShell
          badge={copy.featuresBadge}
          headline={copy.featuresHeadline}
          kicker={copy.featuresKicker}
        >
          <div className="grid min-w-0 grid-cols-1 gap-2.5 dapp:grid-cols-4">
            {copy.features.map((item, index) => (
              <Tile
                copy={item.copy}
                icon={FEATURE_ICONS[index] ?? xmineValueAssets.globe}
                key={item.title}
                title={item.title}
              />
            ))}
          </div>
        </SlideShell>
      ),
    },
  ]

  return (
    <Carousel
      aria-label={copy.title}
      autoplayMs={4000}
      opts={{ align: 'start', loop: true, containScroll: 'trimSnaps' }}
    >
      <Carousel.Content>
        {slides.map((slide, index) => (
          <Carousel.Item index={index} key={slide.key}>
            {slide.node}
          </Carousel.Item>
        ))}
      </Carousel.Content>
      <Carousel.Indicators
        dotLabel={(index) => `${copy.title} ${index + 1}`}
        nextLabel={t.common.paginationNext}
        prevLabel={t.common.paginationPrev}
      />
    </Carousel>
  )
}
