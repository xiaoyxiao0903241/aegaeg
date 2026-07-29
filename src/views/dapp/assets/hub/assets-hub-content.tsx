import { useI18n } from '~/i18n/use-i18n'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { tokenCarouselIcons } from '~/app/assets'
import { FaqList } from '~/shared/ui/faq-list'
import { Text } from '~/shared/ui/text'
import { Button } from '~/shared/ui/button'
import { Card } from '~/shared/ui/card'
import { DappIcon } from '~/app/shell/dapp-icon'
import { openStakingView } from '~/shared/config/open-staking-view'
import { useAssetsHubOverviewStats } from '~/views/dapp/assets/hub/use-assets-hub-overview-stats'

export function AssetsHubContent() {
  const { messages: t } = useI18n()
  const overview = t.assets.hub.overview
  const rebase = t.assets.hub.rebase
  const values = useAssetsHubOverviewStats()

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading>{overview.title}</DappContentHeading>
        <Card surface="inverse" className="relative overflow-hidden p-4">
          <div className="grid gap-4 sm:grid-cols-2 dapp:grid-cols-4 dapp:gap-6">
            <div className="grid gap-1">
              <Text as="span" tone="inverse-muted" variant="detail">
                {overview.totalValue}
              </Text>
              <Text as="strong" className="text-[32px] leading-none font-semibold" tone="inverse">
                {values.totalValue}
              </Text>
            </div>
            <div className="grid gap-0.5">
              <Text as="span" tone="inverse-muted" variant="detail">
                {overview.claimable}
              </Text>
              <Text as="strong" className="text-base font-semibold" tone="inverse">
                {values.claimable}
              </Text>
              <Text as="span" className="opacity-70" tone="inverse-muted" variant="detail">
                {values.claimableApprox}
              </Text>
            </div>
            <div className="grid gap-0.5">
              <Text as="span" tone="inverse-muted" variant="detail">
                {overview.claimed}
              </Text>
              <Text as="strong" className="text-base font-semibold" tone="inverse">
                {values.claimed}
              </Text>
              <Text as="span" className="opacity-70" tone="inverse-muted" variant="detail">
                {values.claimedApprox}
              </Text>
            </div>
            <div className="grid gap-0.5">
              <Text as="span" tone="inverse-muted" variant="detail">
                {overview.contribution}
              </Text>
              <Text as="strong" className="text-base font-semibold" tone="inverse">
                {values.contribution}
              </Text>
              <Text as="span" className="opacity-70" tone="inverse-muted" variant="detail">
                {overview.contributionHint}
              </Text>
            </div>
          </div>
        </Card>

        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <Card surface="elevated" className="grid gap-1.5 p-4 shadow-card">
            <Text as="span" className="font-medium" variant="detail">
              {overview.holdingsTitle}
            </Text>
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-0.5">
                <Text as="span" tone="muted-foreground" variant="detail">
                  {overview.holdingsReleased}
                </Text>
                <div className="flex items-start gap-1">
                  <DappIcon
                    alt=""
                    className="mt-0.5 size-[18px] rounded-[10px]"
                    size="sm"
                    src={tokenCarouselIcons.agxIcon}
                  />
                  <div className="grid gap-1">
                    <Text as="strong" className="text-base font-semibold" variant="copy">
                      {values.holdingsReleased}
                    </Text>
                    <Text as="span" tone="muted-foreground" variant="detail">
                      {values.holdingsReleasedApprox}
                    </Text>
                  </div>
                </div>
              </div>
              <div className="grid gap-0.5">
                <Text as="span" tone="muted-foreground" variant="detail">
                  {overview.holdingsTotal}
                </Text>
                <Text as="strong" className="text-base font-semibold" variant="copy">
                  {values.holdingsTotal}
                </Text>
                <Text as="span" tone="muted-foreground" variant="detail">
                  {values.holdingsTotalApprox}
                </Text>
              </div>
            </div>
          </Card>

          <Card surface="elevated" className="grid gap-1.5 p-4 shadow-card">
            <div className="flex items-center justify-between gap-2">
              <Text as="span" className="font-medium" variant="detail">
                {overview.bufferTitle}
              </Text>
              <Text as="span" tone="muted-foreground" variant="detail">
                {overview.bufferAssetGagx}
              </Text>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-0.5">
                <Text as="span" tone="muted-foreground" variant="detail">
                  {overview.bufferTotal}
                </Text>
                <div className="flex items-start gap-1">
                  <DappIcon
                    alt=""
                    className="mt-0.5 size-[18px] rounded-[10px]"
                    size="sm"
                    src={tokenCarouselIcons.agxIcon}
                  />
                  <div className="grid gap-1">
                    <Text as="strong" className="text-base font-semibold" variant="copy">
                      {values.bufferTotal}
                    </Text>
                    <Text as="span" tone="muted-foreground" variant="detail">
                      {values.bufferTotalApprox}
                    </Text>
                  </div>
                </div>
              </div>
              <div className="grid gap-0.5">
                <Text as="span" tone="muted-foreground" variant="detail">
                  {overview.bufferReleased}
                </Text>
                <Text as="strong" className="text-base font-semibold" variant="copy">
                  {values.bufferReleased}
                </Text>
                <Text as="span" tone="muted-foreground" variant="detail">
                  {values.bufferReleasedApprox}
                </Text>
              </div>
            </div>
          </Card>
        </div>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.assets.hub.distribution.title}</DappContentHeading>
        <div className="flex min-h-[108px] items-center justify-center rounded-2xl border border-dashed border-border bg-card px-4 py-10">
          <Text as="p" className="text-center" tone="muted-foreground" variant="detail">
            {t.assets.hub.distribution.empty}
          </Text>
        </div>
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
        <Text as="h3" className="mb-1 font-semibold" variant="headline">
          {rebase.title}
        </Text>
        <Text as="p" className="mb-4" tone="muted-foreground" variant="detail">
          {rebase.subtitle}
        </Text>
        <Card surface="elevated" className="grid gap-4 px-4 py-6 shadow-card">
          <ol className="m-0 grid list-none gap-2 p-0 sm:grid-cols-2 dapp:grid-cols-4">
            {rebase.steps.map((step) => (
              <li className="rounded-2xl bg-card p-3 text-center" key={step.title + step.body}>
                <Text as="p" className="font-bold" variant="copy">
                  {step.title}
                </Text>
                <Text
                  as="p"
                  className="mt-2 whitespace-pre-line"
                  tone="muted-foreground"
                  variant="detail"
                >
                  {step.body}
                </Text>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl bg-muted px-4 py-3">
            {rebase.tags.map((tag) => (
              <Text as="span" className="font-semibold" key={tag} variant="detail">
                {tag}
              </Text>
            ))}
          </div>
          <Text as="p" tone="muted-foreground" variant="detail">
            {rebase.footer}
          </Text>
        </Card>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.assets.hub.faq.title}</DappContentHeading>
        <FaqList items={t.assets.hub.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
