import type { CSSProperties } from 'react'
import { Card } from '~/components/card'
import { useI18n } from '~/i18n/use-i18n'
import { revealClass } from '~/lib/reveal'
import { cn } from '~/lib/utils'
import { HomeSectionHead } from '~/home/components/home-section-head'

const roadmapClass = {
  section:
    'roadmap relative py-30 dapp:min-h-288 max-dapp:min-h-240 max-dapp:pt-0 max-dapp:pb-14',
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
  phaseLabel:
    'text-xs font-semibold leading-[1.2] tracking-[0.72px] dapp:text-xs dapp:leading-normal',
  phaseLabelActive: 'text-primary',
  phaseLabelMuted: 'text-ink-muted',
  now:
    'rounded-3xl bg-primary px-2 py-0.5 text-xs font-semibold not-italic text-white dapp:px-2.5 dapp:py-0.5 dapp:text-xs',
  time:
    'ml-auto text-xs font-semibold leading-[1.2] dapp:text-xs dapp:leading-[1.4]',
  timeMuted: 'text-ink-muted',
  timeCurrent: 'text-primary',
  title:
    'mt-1.5 text-base font-semibold leading-[1.2] tracking-[-0.64px] text-foreground dapp:mt-2 dapp:text-lg dapp:leading-[1.4] dapp:tracking-[-0.72px]',
  body:
    'mt-1.5 text-xs font-normal leading-[1.4] tracking-[-0.26px] text-ink-muted dapp:mt-2',
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
    <section className={roadmapClass.section} id="roadmap" aria-labelledby="roadmap-title">
      <div className="container">
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
                  <span
                    className={cn(
                      roadmapClass.phaseLabel,
                      phase.state
                        ? roadmapClass.phaseLabelActive
                        : roadmapClass.phaseLabelMuted,
                    )}
                  >
                    {phase.phase}
                  </span>
                  {phase.state === 'current' ? (
                    <em className={roadmapClass.now}>NOW</em>
                  ) : null}
                  <time
                    className={cn(
                      roadmapClass.time,
                      phase.state === 'current'
                        ? roadmapClass.timeCurrent
                        : roadmapClass.timeMuted,
                    )}
                  >
                    {phase.time}
                  </time>
                </div>
                <h3 className={roadmapClass.title}>{phase.title}</h3>
                <p className={roadmapClass.body}>{phase.description}</p>
              </Card>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
