import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'
import { partners } from '~/views/home/static-layout'
import { useI18n } from '~/i18n/use-i18n'
import { HomeSection } from '~/views/home/components/home-section'
const partnerClass = {
  section:
    'partners dapp:min-h-52 border-b border-border bg-secondary pb-30 text-center max-dapp:min-h-64 max-dapp:py-12',
  row: 'partner-row mt-6 flex flex-wrap justify-center gap-3.5 max-dapp:mt-4',
  chip: 'inline-flex min-h-12 items-center gap-2.5 border border-border bg-card py-3 pl-3 pr-7 shadow-none max-dapp:min-h-9 max-dapp:py-1.5 max-dapp:pl-3 max-dapp:pr-4',
} as const

export function HomePartnersSection() {
  const { messages } = useI18n()
  const title = messages.home.sections.partners.title

  return (
    <HomeSection
      container="page"
      className={partnerClass.section}
      aria-labelledby="partners-title"
    >
        <Text
          as="h2"
          id="partners-title"
          variant="home-eyebrow"
          className="m-0"
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
              <Text as="span" tone="primary" variant="body" weight="semibold">
                {name}
              </Text>
            </Card>
          ))}
        </div>
    </HomeSection>
  )
}
