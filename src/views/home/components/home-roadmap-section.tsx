import type { CSSProperties } from 'react'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'
import { useI18n } from '~/i18n/use-i18n'
import { revealClass } from '~/shared/lib/reveal'
import { cn } from '~/shared/lib/utils'
import { HomeSectionHead } from '~/views/home/components/home-section-head'
import { HomeSection } from '~/views/home/components/home-section'

const roadmapClass = {
  section: 'roadmap dapp:min-h-288 max-dapp:min-h-240',
  timeline:
    'timeline relative mt-5 flex min-h-192 w-full flex-col gap-0 pl-0 dapp:mt-12 dapp:block dapp:min-h-208',
  rail:
    'timeline-rail hidden dapp:absolute dapp:left-1/2 dapp:top-14 dapp:block dapp:h-176 dapp:w-1 dapp:-translate-x-1/2 dapp:rounded-[0.125rem] dapp:bg-border',
  phase:
    'phase relative grid min-h-32 grid-cols-[auto_minmax(0,1fr)] items-start gap-3.5 dapp:absolute dapp:block dapp:min-h-0 dapp:w-full',
  card:
    'phase-card w-full min-h-28 p-4 max-dapp:rounded-md dapp:min-h-30 dapp:w-[calc(50%-15)] dapp:max-w-128 dapp:px-6 dapp:py-5.5',
  cardRight: 'dapp:ml-auto',
  currentCard: 'min-h-30 border border-primary dapp:min-h-30',
  header:
    'flex items-center justify-between gap-2.5 overflow-hidden dapp:justify-start',
  now:
    'rounded-3xl bg-primary px-2 py-0.5 not-italic dapp:px-2.5 dapp:py-0.5',
  time: 'ml-auto',
  title: 'mt-1.5 dapp:mt-2',
  body: 'mt-1.5 dapp:mt-2',
  dot:
    'phase-dot relative left-0 top-0 z-[2] grid size-8 place-items-center rounded-3xl text-sm font-semibold dapp:absolute dapp:left-1/2 dapp:top-10 dapp:size-9 dapp:-translate-x-1/2 dapp:border-[3px]',
  dotComplete: 'bg-primary text-white dapp:border-primary',
  dotUpcoming: 'border-[3px] border-border bg-card text-ink-muted',
  dotCurrent:
    'dapp:shadow-[0_0_0_8px_oklch(94.92%_0.0224_45.6_/_96%)]',
  dotConnector:
    "after:absolute after:left-3.5 after:top-8 after:h-24 after:w-[3px] after:rounded-[0.125rem] after:content-[''] dapp:after:hidden",
  dotConnectorDone: 'after:bg-primary',
  dotConnectorUpcoming: 'after:bg-border',
} as const

const phaseTopClass = [
  'dapp:top-4',
  'dapp:top-40',
  'dapp:top-72',
  'dapp:top-112',
  'dapp:top-144',
  'dapp:top-176',
] as const

export function HomeRoadmapSection() {
  const { messages } = useI18n()
  const content = messages.home.sections.roadmap

  return (
    <HomeSection
      spacing="content"
      container="page"
      className={roadmapClass.section}
      id="roadmap"
      aria-labelledby="roadmap-title"
    >
      <HomeSectionHead eyebrow={content.eyebrow} title={content.title} />
        <div
          className={cn(roadmapClass.timeline, revealClass())}
          data-reveal
          data-timeline
        >
          <div className={roadmapClass.rail} data-timeline-rail aria-hidden="true" />
          {content.phases.map((phase, index) => (
            <article
              className={cn(
                roadmapClass.phase,
                phase.side === 'right' ? 'phase-right' : 'phase-left',
                phase.state === 'current' && 'phase-current',
                phaseTopClass[index],
              )}
              data-phase-current={phase.state === 'current' ? true : undefined}
              data-phase-side={phase.side}
              key={phase.phase}
              style={{ '--phase-index': index } as CSSProperties}
            >
              <div
                className={cn(
                  roadmapClass.dot,
                  phase.state === 'done' || phase.state === 'current'
                    ? roadmapClass.dotComplete
                    : roadmapClass.dotUpcoming,
                  phase.state === 'current' && roadmapClass.dotCurrent,
                  index < content.phases.length - 1 && roadmapClass.dotConnector,
                  index < content.phases.length - 1 &&
                    (phase.state === 'done'
                      ? roadmapClass.dotConnectorDone
                      : roadmapClass.dotConnectorUpcoming),
                )}
                data-phase-dot
                aria-hidden="true"
              >
                {phase.dot}
              </div>
              <Card
                className={cn(
                  roadmapClass.card,
                  phase.side === 'right' && roadmapClass.cardRight,
                  phase.state === 'current' && roadmapClass.currentCard,
                )}
                context="home"
                data-phase-card
                hover="shadow"
                radius="md"
              >
                <div className={roadmapClass.header}>
                  <Text
                    as="span"
                    tone={phase.state ? 'primary' : 'muted-foreground'}
                    variant="kicker"
                  >
                    {phase.phase}
                  </Text>
                  {phase.state === 'current' ? (
                    <Text
                      as="em"
                      className={roadmapClass.now}
                      tone="inverse"
                      variant="meta"
                    >
                      NOW
                    </Text>
                  ) : null}
                  <Text
                    as="time"
                    className={roadmapClass.time}
                    tone={phase.state === 'current' ? 'primary' : 'muted-foreground'}
                    variant="kicker"
                  >
                    {phase.time}
                  </Text>
                </div>
                <Text
                  as="h3"
                  className={roadmapClass.title}
                  tone="foreground"
                  variant="headline"
                >
                  {phase.title}
                </Text>
                <Text as="p" className={roadmapClass.body} tone="muted-foreground" variant="meta">
                  {phase.description}
                </Text>
              </Card>
            </article>
          ))}
        </div>
    </HomeSection>
  )
}
