import { Text } from '~/components/text'
import { useI18n } from '~/i18n/use-i18n'
import { cn } from '~/lib/utils'
import { homeSectionContainerClass } from '~/home/home-layout'

const homeMetricsRaysClass = cn(
  'pointer-events-none absolute inset-0 z-0 opacity-[0.82]',
  '[background:radial-gradient(18rem_7rem_at_50%_-2%,oklch(100%_0_0_/_16%),transparent_72%),repeating-conic-gradient(from_-90deg_at_50%_-12%,oklch(100%_0_0_/_10%)_0deg_0.28deg,transparent_0.28deg_2.4deg)]',
  '[mask-image:radial-gradient(ellipse_88%_160%_at_50%_0%,black_0%,black_54%,rgb(0_0_0_/_76%)_76%,transparent_100%)]',
  'max-dapp:hidden',
)

const homeMetricsPanelGlowClass = cn(
  "after:pointer-events-none after:absolute after:-top-6.5 after:left-1/2 after:z-0 after:h-16 after:w-16 after:-translate-x-1/2 after:rounded-full after:bg-white/56 after:blur-[1.125rem] after:content-['']",
  'max-dapp:after:hidden',
)

const metricClass = {
  section:
    'metrics-wrap dapp:min-h-56 pb-10 max-dapp:min-h-64 max-dapp:pb-12',
  container: homeSectionContainerClass,
  panel:
    'relative isolate grid min-h-48 grid-cols-4 items-center justify-between rounded-xl bg-dark px-10 py-14 text-white max-dapp:min-h-52 max-dapp:grid-cols-2 max-dapp:gap-y-6 max-dapp:rounded-lg max-dapp:px-5 max-dapp:py-7',
  item: 'relative z-1 grid justify-items-center gap-2 text-center max-dapp:gap-1.5',
  value:
    'text-5xl font-semibold leading-none text-white max-dapp:text-3xl max-dapp:leading-[1.2] max-dapp:tracking-[-0.9px]',
  label:
    'text-sm font-medium leading-[1.2] text-white max-dapp:text-xs max-dapp:font-normal max-dapp:leading-[1.5] max-dapp:text-on-dark',
} as const

export function HomeMetricsSection() {
  const { messages } = useI18n()
  const metrics = messages.home.metrics

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
