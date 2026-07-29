import { useI18n } from '~/i18n/use-i18n'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { FaqList } from '~/shared/ui/faq-list'
import { Text } from '~/shared/ui/text'

const PLACEHOLDER = '—'

export function AssetsXmineContent() {
  const { messages: t } = useI18n()
  const copy = t.assets.products.xmine

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading>{copy.stats.title}</DappContentHeading>
        <div className="grid grid-cols-2 gap-3 dapp:grid-cols-3">
          {copy.stats.metrics.map((metric) => (
            <div className="grid gap-1" key={metric.label}>
              <Text as="span" tone="muted-foreground" variant="detail">
                {metric.label}
              </Text>
              <Text as="strong" className="font-semibold" variant="copy">
                {PLACEHOLDER}
              </Text>
            </div>
          ))}
        </div>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{copy.ops.title}</DappContentHeading>
        <Text as="p" tone="muted-foreground" variant="copy">
          {copy.ops.empty}
        </Text>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{copy.faq.title}</DappContentHeading>
        <FaqList defaultOpenFirst={false} items={copy.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
