import type { CSSProperties } from 'react'
import { Card } from '~/components/card'
import type { HomeContent } from '~/home/content/types'
import { revealClass } from '~/lib/reveal'
import { cn } from '~/lib/utils'
import { HomeSectionHead } from './home-section-head'

const roadmapClass = {
  section:
    'roadmap relative py-[120px] min-[821px]:min-h-[1215px] max-[820px]:min-h-[911px] max-[820px]:pt-0 max-[820px]:pb-14',
  timeline:
    'timeline relative mt-5 flex min-h-[776px] w-full flex-col gap-0 pl-0 min-[821px]:mt-12 min-[821px]:block min-[821px]:min-h-[851px]',
  rail:
    'timeline-rail hidden min-[821px]:absolute min-[821px]:left-[calc(50%-2px)] min-[821px]:top-[58px] min-[821px]:block min-[821px]:h-[727px] min-[821px]:w-1 min-[821px]:rounded-[2px] min-[821px]:bg-border',
  phase:
    'phase relative grid min-h-[132px] grid-cols-[32px_minmax(0,1fr)] items-start gap-3.5 min-[821px]:absolute min-[821px]:block min-[821px]:min-h-0 min-[821px]:w-full',
  card:
    'phase-card w-full min-h-[116px] p-4 max-[820px]:rounded-[14px] min-[821px]:min-h-[120px] min-[821px]:w-[min(540px,calc(50%_-_60px))] min-[821px]:p-[22px_24px]',
  cardRight: 'min-[821px]:ml-auto',
  currentCard: 'min-h-[119px] border border-primary min-[821px]:min-h-[124px]',
  header:
    'flex items-center justify-between gap-2.5 overflow-hidden min-[821px]:justify-start',
  phaseLabel:
    'text-[11px] font-semibold leading-[1.2] tracking-[0.72px] min-[821px]:text-xs min-[821px]:leading-normal',
  phaseLabelActive: 'text-primary',
  phaseLabelMuted: 'text-ink-muted',
  now:
    'rounded-[999px] bg-primary px-2 py-0.5 text-[10px] font-semibold not-italic text-white min-[821px]:px-2.5 min-[821px]:py-[3px] min-[821px]:text-[11px]',
  time:
    'ml-auto text-[11px] font-semibold leading-[1.2] min-[821px]:text-xs min-[821px]:leading-[1.4]',
  timeMuted: 'text-ink-muted',
  timeCurrent: 'text-primary',
  title:
    'mt-1.5 text-base font-semibold leading-[1.2] tracking-[-0.64px] text-foreground min-[821px]:mt-2 min-[821px]:text-lg min-[821px]:leading-[1.4] min-[821px]:tracking-[-0.72px]',
  body:
    'mt-1.5 text-[13px] font-normal leading-[1.4] tracking-[-0.26px] text-ink-muted min-[821px]:mt-2',
  dot:
    'phase-dot relative left-0 top-0 z-[2] grid size-8 place-items-center rounded-[999px] text-sm font-semibold min-[821px]:absolute min-[821px]:left-[calc(50%_-_18px)] min-[821px]:top-[42px] min-[821px]:size-9 min-[821px]:border-[3px]',
  dotComplete: 'bg-primary text-white min-[821px]:border-primary',
  dotUpcoming: 'border-[3px] border-border bg-card text-ink-muted',
  dotCurrent:
    'min-[821px]:shadow-[0_0_0_8px_oklch(94.92%_0.0224_45.6_/_96%)]',
  dotConnector:
    "after:absolute after:left-[14.5px] after:top-8 after:h-[100px] after:w-[3px] after:rounded-[2px] after:content-[''] min-[821px]:after:hidden",
  dotConnectorDone: 'after:bg-primary',
  dotConnectorUpcoming: 'after:bg-border',
} as const

const phaseTopClass = [
  'min-[821px]:top-4',
  'min-[821px]:top-[154px]',
  'min-[821px]:top-[292px]',
  'min-[821px]:top-[430px]',
  'min-[821px]:top-[577px]',
  'min-[821px]:top-[715px]',
] as const

export function HomeRoadmapSection({
  content,
}: {
  content: HomeContent['sections']['roadmap']
}) {
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
