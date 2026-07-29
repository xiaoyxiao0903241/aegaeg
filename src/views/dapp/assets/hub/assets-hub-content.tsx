import { useI18n } from '~/i18n/use-i18n'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { FaqList } from '~/shared/ui/faq-list'
import { Text } from '~/shared/ui/text'
import { Button } from '~/shared/ui/button'
import { openStakingView } from '~/shared/config/open-staking-view'

const PLACEHOLDER = '—'

export function AssetsHubContent() {
  const { messages: t } = useI18n()
  const overview = t.assets.hub.overview

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading>{overview.title}</DappContentHeading>
        <div className="grid grid-cols-2 gap-3 dapp:grid-cols-4">
          {overview.metrics.map((metric) => (
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
        <DappContentHeading>{t.assets.hub.distribution.title}</DappContentHeading>
        <Text as="p" tone="muted-foreground" variant="copy">
          {t.assets.hub.distribution.empty}
        </Text>
        <Button
          className="mt-3"
          onClick={() => openStakingView('stake')}
          type="button"
          variant="secondary"
        >
          {t.assets.hub.distribution.cta}
        </Button>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.assets.hub.faq.title}</DappContentHeading>
        <FaqList defaultOpenFirst={false} items={t.assets.hub.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
