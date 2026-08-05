import type { CSSProperties } from 'react'

import { useI18n } from '~/i18n/use-i18n'
import { Card } from '~/shared/components/card'
import { Text } from '~/shared/components/text'
import { revealClass } from '~/shared/lib/reveal'
import { cn } from '~/shared/lib/utils'
import { HomeSection } from '~/views/home/home-section'
import { HomeSectionHead } from '~/views/home/home-section-head'

/** PC 端各阶段卡片的纵向定位偏移（按阶段序号取用）。 */
const phaseTopOffsets = [
  'dapp:top-4',
  'dapp:top-40',
  'dapp:top-72',
  'dapp:top-112',
  'dapp:top-144',
  'dapp:top-176',
] as const

/**
 * 路线图区块
 *
 * 纵向时间线：PC 为居中主轴、卡片左右交错排列；H5 为单列流式。
 * 当前阶段带 NOW 徽标并高亮描边。
 */
export function HomeRoadmapSection() {
  const { messages } = useI18n()
  const content = messages.home.sections.roadmap

  return (
    <HomeSection
      spacing="content"
      container="page"
      className="dapp:min-h-288 max-dapp:min-h-240"
      id="roadmap"
      aria-labelledby="roadmap-title"
    >
      <HomeSectionHead eyebrow={content.eyebrow} title={content.title} />
      <div
        className={cn(
          'relative mt-5 flex min-h-192 w-full flex-col gap-0 pl-0 dapp:mt-12 dapp:block dapp:min-h-208',
          revealClass(),
        )}
        data-reveal
        data-timeline
      >
        <div
          className="hidden dapp:absolute dapp:top-14 dapp:left-1/2 dapp:block dapp:h-176 dapp:w-1 dapp:-translate-x-1/2 dapp:rounded-xs dapp:bg-border"
          data-timeline-rail
          aria-hidden="true"
        />
        {content.phases.map((phase, index) => (
          <article
            className={cn(
              'relative grid min-h-32 grid-cols-[auto_minmax(0,1fr)] items-start gap-3.5 dapp:absolute dapp:block dapp:min-h-0 dapp:w-full',
              phaseTopOffsets[index],
            )}
            data-phase-current={phase.state === 'current' ? true : undefined}
            data-phase-side={phase.side}
            key={phase.phase}
            style={{ '--phase-index': index } as CSSProperties}
          >
            <div
              className={cn(
                'relative z-2 grid size-8 place-items-center rounded-3xl text-sm font-semibold dapp:absolute dapp:top-10 dapp:left-1/2 dapp:size-9 dapp:-translate-x-1/2 dapp:border-[0.1875rem]',
                phase.state === 'done' || phase.state === 'current'
                  ? 'bg-primary text-white dapp:border-primary'
                  : 'border-[0.1875rem] border-border bg-card text-muted-foreground',
                phase.state === 'current' && 'dapp:shadow-roadmap-ring',
                index < content.phases.length - 1 &&
                  "after:absolute after:top-8 after:left-3.5 after:h-24 after:w-0.75 after:rounded-xs after:content-[''] dapp:after:hidden",
                index < content.phases.length - 1 &&
                  (phase.state === 'done' ? 'after:bg-primary' : 'after:bg-border'),
              )}
              data-phase-dot
              aria-hidden="true"
            >
              {phase.dot}
            </div>
            <Card
              className={cn(
                'min-h-28 w-full border-0 p-4 transition-shadow duration-200 ease-out dapp:min-h-30 dapp:w-[calc(50%-0.9375rem)] dapp:max-w-lg dapp:px-6 dapp:py-5.5 max-dapp:rounded-md',
                phase.side === 'right' && 'dapp:ml-auto',
                phase.state === 'current' && 'min-h-30 border border-primary',
              )}
              surface="elevated"
              data-phase-card
            >
              <div className="flex items-center justify-between gap-2.5 overflow-hidden dapp:justify-start">
                <Text
                  as="span"
                  className="text-xs leading-[1.2] normal-case dapp:leading-normal"
                  tone={phase.state ? 'primary' : 'muted-foreground'}
                  variant="eyebrow"
                >
                  {phase.phase}
                </Text>
                {phase.state === 'current' ? (
                  <Text
                    as="em"
                    className="rounded-3xl bg-primary px-2 py-0.5 text-xs font-semibold not-italic dapp:px-2.5"
                    tone="inverse"
                    variant="copy"
                  >
                    NOW
                  </Text>
                ) : null}
                <Text
                  as="time"
                  className="ml-auto text-xs leading-[1.2] dapp:leading-[1.4]"
                  tone={phase.state === 'current' ? 'primary' : 'muted-foreground'}
                  variant="eyebrow"
                >
                  {phase.time}
                </Text>
              </div>
              <Text
                as="h3"
                className="mt-1.5 text-base leading-[1.2] tracking-[-0.04em] dapp:mt-2 dapp:text-lg dapp:leading-[1.4]"
                tone="foreground"
                variant="headline"
              >
                {phase.title}
              </Text>
              <Text
                as="p"
                className="mt-1.5 text-xs leading-[1.4] dapp:mt-2"
                tone="muted-foreground"
                variant="copy"
              >
                {phase.description}
              </Text>
            </Card>
          </article>
        ))}
      </div>
    </HomeSection>
  )
}
