import { Text } from '~/components/text'
import type { HomeContent } from '~/home/content/types'
import { cn } from '~/lib/utils'

const homeMetricsRaysClass = cn(
  'pointer-events-none absolute inset-0 z-0 opacity-[0.82]',
  '[background:radial-gradient(280px_110px_at_50%_-2%,oklch(100%_0_0_/_16%),transparent_72%),repeating-conic-gradient(from_-90deg_at_50%_-12%,oklch(100%_0_0_/_10%)_0deg_0.28deg,transparent_0.28deg_2.4deg)]',
  '[mask-image:radial-gradient(ellipse_88%_160%_at_50%_0%,black_0%,black_54%,rgb(0_0_0_/_76%)_76%,transparent_100%)]',
  'max-[820px]:hidden',
)

const homeMetricsPanelGlowClass = cn(
  "after:pointer-events-none after:absolute after:top-[-26px] after:left-1/2 after:z-0 after:h-[62px] after:w-[62px] after:-translate-x-1/2 after:rounded-full after:bg-white/56 after:blur-[18px] after:content-['']",
  'max-[820px]:after:hidden',
)

const metricClass = {
  section:
    'metrics-wrap min-[821px]:min-h-[231px] pb-10 max-[820px]:min-h-[252px] max-[820px]:pb-12',
  container: 'container max-[820px]:!w-[min(calc(100vw-40px),362px)]',
  panel:
    'relative isolate grid min-h-[191px] grid-cols-4 items-center justify-between overflow-hidden rounded-[28px] bg-dark px-10 py-14 text-white max-[820px]:min-h-[204px] max-[820px]:grid-cols-2 max-[820px]:gap-y-6 max-[820px]:rounded-[22px] max-[820px]:px-5 max-[820px]:py-7',
  item: 'relative z-[1] grid justify-items-center gap-2 text-center max-[820px]:gap-1.5',
  value:
    'text-[44px] font-semibold leading-none text-white max-[820px]:text-[30px] max-[820px]:leading-[1.2] max-[820px]:tracking-[-0.9px]',
  label:
    'text-sm font-medium leading-[1.2] text-white max-[820px]:text-[13px] max-[820px]:font-normal max-[820px]:leading-[1.5] max-[820px]:text-on-dark',
} as const

export function HomeMetricsSection({ metrics }: { metrics: HomeContent['metrics'] }) {
  return (
    <section
      className={metricClass.section}
      aria-label="Protocol metrics"
      data-count-panel
      data-metrics-reveal
      data-reveal
      data-reveal-manual
    >
      <div className={metricClass.container}>
        <div className={cn(metricClass.panel, homeMetricsPanelGlowClass)} data-metrics-panel>
          <div className={homeMetricsRaysClass} aria-hidden="true" />
          {metrics.map((metric) => (
            <article className={metricClass.item} key={metric.label}>
              <Text as="strong" className={metricClass.value} data-count-target={metric.countTarget} data-count-suffix={metric.suffix} data-count-initial={metric.value}>
                {metric.value}
              </Text>
              <Text as="span" className={metricClass.label}>
                {metric.label}
              </Text>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
