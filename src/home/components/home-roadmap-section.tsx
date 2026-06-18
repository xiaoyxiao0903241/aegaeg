import type { CSSProperties } from 'react'
import { Card } from '~/components/card'
import { useI18n } from '~/i18n/use-i18n'
import { revealClass } from '~/lib/reveal'
import { cn } from '~/lib/utils'
import { HomeSectionHead } from '~/home/components/home-section-head'

const roadmapClass = {
  section:
    'roadmap relative py-[120px] dapp:min-h-[1215px] max-dapp:min-h-[911px] max-dapp:pt-0 max-dapp:pb-14',
  timeline:
    'timeline relative mt-5 flex min-h-[776px] w-full flex-col gap-0 pl-0 dapp:mt-12 dapp:block dapp:min-h-[851px]',
  rail:
    'timeline-rail hidden dapp:absolute dapp:left-[calc(50%-2px)] dapp:top-[58px] dapp:block dapp:h-[727px] dapp:w-1 dapp:rounded-[2px] dapp:bg-border',
  phase:
    'phase relative grid min-h-[132px] grid-cols-[32px_minmax(0,1fr)] items-start gap-3.5 dapp:absolute dapp:block dapp:min-h-0 dapp:w-full',
  card:
    'phase-card w-full min-h-[116px] p-4 max-dapp:rounded-[14px] dapp:min-h-[120px] dapp:w-[min(540px,calc(50%_-_60px))] dapp:p-[22px_24px]',
  cardRight: 'dapp:ml-auto',
  currentCard: 'min-h-[119px] border border-primary dapp:min-h-[124px]',
  header:
    'flex items-center justify-between gap-2.5 overflow-hidden dapp:justify-start',
  phaseLabel:
    'text-[11px] font-semibold leading-[1.2] tracking-[0.72px] dapp:text-xs dapp:leading-normal',
  phaseLabelActive: 'text-primary',
  phaseLabelMuted: 'text-ink-muted',
  now:
    'rounded-[999px] bg-primary px-2 py-0.5 text-[10px] font-semibold not-italic text-white dapp:px-2.5 dapp:py-[3px] dapp:text-[11px]',
  time:
    'ml-auto text-[11px] font-semibold leading-[1.2] dapp:text-xs dapp:leading-[1.4]',
  timeMuted: 'text-ink-muted',
  timeCurrent: 'text-primary',
  title:
    'mt-1.5 text-base font-semibold leading-[1.2] tracking-[-0.64px] text-foreground dapp:mt-2 dapp:text-lg dapp:leading-[1.4] dapp:tracking-[-0.72px]',
  body:
    'mt-1.5 text-[13px] font-normal leading-[1.4] tracking-[-0.26px] text-ink-muted dapp:mt-2',
  dot:
    'phase-dot relative left-0 top-0 z-[2] grid size-8 place-items-center rounded-[999px] text-sm font-semibold dapp:absolute dapp:left-[calc(50%_-_18px)] dapp:top-[42px] dapp:size-9 dapp:border-[3px]',
  dotComplete: 'bg-primary text-white dapp:border-primary',
  dotUpcoming: 'border-[3px] border-border bg-card text-ink-muted',
  dotCurrent:
    'dapp:shadow-[0_0_0_8px_oklch(94.92%_0.0224_45.6_/_96%)]',
  dotConnector:
    "after:absolute after:left-[14.5px] after:top-8 after:h-[100px] after:w-[3px] after:rounded-[2px] after:content-[''] dapp:after:hidden",
  dotConnectorDone: 'after:bg-primary',
  dotConnectorUpcoming: 'after:bg-border',
} as const

const phaseTopClass = [
  'dapp:top-4',
  'dapp:top-[154px]',
  'dapp:top-[292px]',
  'dapp:top-[430px]',
  'dapp:top-[577px]',
  'dapp:top-[715px]',
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
