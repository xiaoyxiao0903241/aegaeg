import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'
import { partners } from '~/views/home/static-layout'
import { useI18n } from '~/i18n/use-i18n'
import { HomeSection } from '~/views/home/components/home-section'

export function HomePartnersSection() {
  const { messages } = useI18n()
  const title = messages.home.sections.partners.title

  return (
    <HomeSection
      container="page"
      className="dapp:min-h-52 border-b border-border bg-secondary pb-30 text-center max-dapp:min-h-64 max-dapp:py-12"
      data-partners
      aria-labelledby="partners-title"
    >
      <Text
        as="h2"
        id="partners-title"
        tone="primary"
        variant="eyebrow"
        className="m-0 text-xs leading-[1.25] normal-case"
      >
        {title}
      </Text>
      <div
        className="mt-6 flex flex-wrap justify-center gap-3.5 max-dapp:mt-4"
        data-partner-row
      >
        {partners.map(([name, icon]) => (
          <Card
            as="span"
            surface="outlined"
            className="inline-flex min-h-12 items-center gap-2.5 rounded-full border border-border bg-card p-0 py-3 pl-3 pr-7 text-sm font-semibold text-muted-foreground shadow-none transition-shadow duration-200 ease-out hover:shadow-card max-dapp:min-h-9 max-dapp:py-1.5 max-dapp:pl-3 max-dapp:pr-4 max-dapp:text-xs"
            key={name}
          >
            <img
              className="size-[var(--home-partner-icon-size)] shrink-0 object-contain max-dapp:size-[var(--home-partner-icon-size-h5)]"
              src={icon}
              alt=""
              width="24"
              height="24"
              loading="lazy"
            />
            <Text as="span" variant="copy" tone="muted-foreground" className="font-semibold max-dapp:text-xs">
              {name}
            </Text>
          </Card>
        ))}
      </div>
    </HomeSection>
  )
}
