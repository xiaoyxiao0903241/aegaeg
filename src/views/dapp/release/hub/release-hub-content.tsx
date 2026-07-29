import { useI18n } from '~/i18n/use-i18n'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { Text } from '~/shared/ui/text'
import { FaqList } from '~/shared/ui/faq-list'

export function ReleaseHubContent() {
  const { messages: t } = useI18n()

  return (
    <DappDetailPage>
      <DappContentHeading id="release-hub-title">{t.release.hub.aboutTitle}</DappContentHeading>
      <div className="mb-6 rounded-2xl border border-border bg-card p-4">
        <Text as="p" className="mb-2 font-semibold" variant="copy">
          {t.release.hub.aboutCardTitle}
        </Text>
        <Text as="p" tone="muted-foreground" variant="copy">
          {t.release.hub.aboutCardBody}
        </Text>
      </div>

      <section className="mb-6">
        <Text as="h3" className="mb-1 font-semibold" variant="headline">
          {t.release.hub.mechanismTitle}
        </Text>
        <Text as="p" className="mb-4" tone="muted-foreground" variant="caption">
          {t.release.hub.mechanismSubtitle}
        </Text>
        <ol className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {t.release.hub.mechanismSteps.map((step, index) => (
            <li className="rounded-2xl border border-border bg-card p-3" key={step.title}>
              <Text as="p" className="mb-1 font-semibold text-primary" variant="caption">
                {index + 1}
              </Text>
              <Text as="p" className="font-semibold" variant="copy">
                {step.title}
              </Text>
              <Text as="p" className="mt-1" tone="muted-foreground" variant="caption">
                {step.body}
              </Text>
            </li>
          ))}
        </ol>
        <div className="rounded-2xl border border-border bg-card p-4">
          <Text as="p" className="mb-3 font-semibold" variant="copy">
            {t.release.hub.taxTitle}
          </Text>
          <div className="grid grid-cols-5 gap-2 text-center">
            <Text as="span" tone="muted-foreground" variant="caption">
              {t.release.hub.taxPeriod}
            </Text>
            {t.release.hub.taxRows.periods.map((p) => (
              <Text as="span" key={p} variant="caption">
                {p}
              </Text>
            ))}
            <Text as="span" tone="muted-foreground" variant="caption">
              {t.release.hub.taxRate}
            </Text>
            {t.release.hub.taxRows.rates.map((r) => (
              <Text
                as="span"
                className={r === '1%' ? 'font-semibold text-primary' : undefined}
                key={r}
                variant="caption"
              >
                {r}
              </Text>
            ))}
          </div>
        </div>
      </section>

      <section>
        <Text as="h3" className="mb-3 font-semibold" variant="headline">
          {t.release.faq.title}
        </Text>
        <FaqList items={t.release.faq.hub} variant="dapp" />
      </section>
    </DappDetailPage>
  )
}
