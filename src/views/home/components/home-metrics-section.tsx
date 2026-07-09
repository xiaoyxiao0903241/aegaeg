import { Text } from '~/shared/ui/text'
import { useI18n } from '~/i18n/use-i18n'
import { HomeSection } from '~/views/home/components/home-section'

export function HomeMetricsSection() {
  const { messages } = useI18n()
  const metrics = messages.home.metrics

  return (
    <HomeSection
      container="content"
      className="pb-10 dapp:min-h-56 max-dapp:min-h-64 max-dapp:pb-12"
      aria-label="Protocol metrics"
      data-count-panel
      data-metrics-reveal
      data-reveal
      data-reveal-manual
    >
      <div
        className="relative isolate grid min-h-48 grid-cols-4 items-center justify-between rounded-xl bg-dark px-10 py-14 text-white after:pointer-events-none after:absolute after:-top-6.5 after:left-1/2 after:z-0 after:size-16 after:-translate-x-1/2 after:rounded-full after:bg-white/56 after:blur-[1.125rem] after:content-[''] max-dapp:min-h-52 max-dapp:grid-cols-2 max-dapp:gap-y-6 max-dapp:rounded-lg max-dapp:px-5 max-dapp:py-7 max-dapp:after:hidden"
        data-metrics-panel
      >
        <div
          className="pointer-events-none absolute inset-0 z-0 mask-[radial-gradient(ellipse_88%_160%_at_50%_0%,black_0%,black_54%,rgb(0_0_0/76%)_76%,transparent_100%)] opacity-[0.82] [background:var(--home-metrics-rays)] max-dapp:hidden"
          aria-hidden="true"
        />
        {metrics.map((metric) => (
          <article
            className="relative z-1 grid justify-items-center gap-2 text-center max-dapp:gap-1.5"
            key={metric.label}
          >
            <Text
              as="strong"
              className="text-5xl leading-none font-semibold text-white max-dapp:text-3xl max-dapp:leading-[1.2] max-dapp:tracking-[-0.03em]"
              data-count-target={metric.countTarget}
              data-count-suffix={metric.suffix}
              data-count-initial={metric.value}
            >
              {metric.value}
            </Text>
            <Text
              as="span"
              className="text-sm leading-[1.2] font-medium text-white max-dapp:text-xs/normal max-dapp:font-normal max-dapp:text-white/70"
            >
              {metric.label}
            </Text>
          </article>
        ))}
      </div>
    </HomeSection>
  )
}
