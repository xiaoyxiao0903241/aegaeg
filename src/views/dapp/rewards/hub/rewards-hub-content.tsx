import { useI18n } from '~/i18n/use-i18n'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { Text } from '~/shared/ui/text'
import { openExchangeView } from '~/shared/config/open-exchange-view'
import { Button } from '~/shared/ui/button'
import { useDappShell } from '~/app/use-dapp-shell'

export function RewardsHubContent() {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()

  return (
    <DappDetailPage>
      <DappContentHeading id="rewards-hub-title">{t.rewards.hub.asideTitle}</DappContentHeading>
      <Text as="p" className="mb-4" tone="muted-foreground" variant="copy">
        {t.rewards.hub.asideBody}
      </Text>
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-4">
          <Text as="p" tone="muted-foreground" variant="caption">
            {t.rewards.hub.stats.totalRewards}
          </Text>
          <Text as="p" className="mt-1 font-semibold" variant="copy">
            {sessionReady ? t.rewards.hub.balancePlaceholder : t.rewards.hub.signInForBalance}
          </Text>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <Text as="p" tone="muted-foreground" variant="caption">
            {t.rewards.hub.stats.tier}
          </Text>
          <Text as="p" className="mt-1 font-semibold" variant="copy">
            {t.rewards.hub.stats.tierEmpty}
          </Text>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 sm:col-span-2">
          <Text as="p" tone="muted-foreground" variant="caption">
            {t.rewards.hub.stats.contribution}
          </Text>
          <Text as="p" className="mt-1" tone="muted-foreground" variant="caption">
            {t.rewards.hub.stats.contributionHint}
          </Text>
          <Button className="mt-3" onClick={() => openExchangeView('burn')} type="button">
            {t.rewards.hub.stats.goBurn}
          </Button>
        </div>
      </div>
      <section className="mb-6">
        <Text as="h3" className="mb-2 font-semibold" variant="headline">
          {t.rewards.hub.mechanismTitle}
        </Text>
        <Text as="p" tone="muted-foreground" variant="copy">
          {t.rewards.hub.mechanismBody}
        </Text>
      </section>
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
