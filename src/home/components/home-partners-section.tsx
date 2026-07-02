import { Card } from '~/components/card'
import { Text } from '~/components/text'
import { partners } from '~/home/static-layout'
import { useI18n } from '~/i18n/use-i18n'
const partnerClass = {
  section:
    'partners dapp:min-h-52 border-b border-border bg-secondary pb-30 text-center max-dapp:min-h-64 max-dapp:py-12',
  row: 'partner-row mt-6 flex flex-wrap justify-center gap-3.5 max-dapp:mt-4',
  chip: 'inline-flex min-h-12 items-center gap-2.5 border border-border bg-card py-3 pl-3 pr-7 text-sm font-semibold text-ink-strong shadow-none max-dapp:min-h-9 max-dapp:py-1.5 max-dapp:pl-3 max-dapp:pr-4 max-dapp:text-xs',
} as const

export function HomePartnersSection() {
  const { messages } = useI18n()
  const title = messages.home.sections.partners.title

  return (
    <section className={partnerClass.section} aria-labelledby="partners-title">
      <div className="container">
        <Text
          as="h2"
          id="partners-title"
          size="sm"
          weight="semibold"
          tone="coral"
          className="m-0 text-xs leading-[1.25] tracking-[1.82px] text-primary max-dapp:text-xs max-dapp:tracking-[1.68px]"
        >
          {title}
        </Text>
        <div className={partnerClass.row}>
          {partners.map(([name, icon]) => (
            <Card
              as="span"
              className={partnerClass.chip}
              context="home"
              hover="shadow"
              key={name}
              radius="full"
            >
              <img
                className="partner-icon size-[var(--home-partner-icon-size)] shrink-0 object-contain max-dapp:size-[var(--home-partner-icon-size-h5)]"
                src={icon}
                alt=""
                width="24"
                height="24"
                loading="lazy"
              />
              {name}
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
