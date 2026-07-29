import { useI18n } from '~/i18n/use-i18n'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { Text } from '~/shared/ui/text'
import type { RewardsView } from '~/shared/config/rewards-deep-link'

export function RewardsDetailContent({ view }: { view: Exclude<RewardsView, 'hub'> }) {
  const { messages: t } = useI18n()
  const card = t.rewards.cards[view]

  return (
    <DappDetailPage>
      <DappContentHeading id={`rewards-${view}-title`}>{card.title}</DappContentHeading>
      <Text as="p" className="mb-4" tone="muted-foreground" variant="copy">
        {card.aside}
      </Text>
      <section>
        <Text as="h3" className="mb-3 font-semibold" variant="headline">
          {t.rewards.faq.title}
        </Text>
        <ul className="grid gap-3">
          {t.rewards.faq.items.map((item) => (
            <li className="rounded-2xl border border-border bg-card p-4" key={item.q}>
              <Text as="p" className="font-semibold" variant="copy">
                {item.q}
              </Text>
              <Text as="p" className="mt-2" tone="muted-foreground" variant="copy">
                {item.a}
              </Text>
            </li>
          ))}
        </ul>
      </section>
    </DappDetailPage>
  )
}
