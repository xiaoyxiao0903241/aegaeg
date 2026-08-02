import { dappAssets } from '~/app/assets'
import { DappCarousel } from '~/app/shell/dapp-carousel'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { ResponsiveTable } from '~/app/shell/responsive-table'
import { useDappShell } from '~/app/use-dapp-shell'
import { useI18n } from '~/i18n/use-i18n'
import { openExchangeView } from '~/shared/config/dapp-open-views'
import { Card } from '~/shared/ui/card'
import { FaqList } from '~/shared/ui/faq-list'
import { Text } from '~/shared/ui/text'
import { formatApiDecimalAmount } from '~/views/dapp/rewards/rewards-display'
import { RewardsStatCard } from '~/views/dapp/rewards/rewards-stat-card'
import { useRewardsContributionDisplay } from '~/views/dapp/rewards/use-rewards-contribution-display'

/** Figma about carousel · 4 dots（推荐/参与/共建/幸运）；发展/创世不进轮播。 */
const ABOUT_VIEWS = ['referral', 'participate', 'cobuild', 'lucky'] as const

export function RewardsHubContent() {
  const { messages: t } = useI18n()
  const { walletReady } = useDappShell()
  const { contributionValue } = useRewardsContributionDisplay(walletReady)

  const tier = t.rewards.hub.tierTable
  const stats = t.rewards.hub.stats

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <div className="mb-6 grid gap-2 sm:grid-cols-3">
          <RewardsStatCard label={stats.totalRewards}>
            <Text as="p" tone="muted-foreground" variant="copy">
              {stats.totalRewards}
            </Text>
            <div className="mt-1.5 flex items-center gap-1.5">
              <DappIcon
                alt=""
                className="size-4.5 shrink-0"
                size="sm"
                src={dappAssets.rewardsHubGagxDot}
              />
              <Text as="p" className="leading-5 font-semibold" variant="headline">
                {formatApiDecimalAmount(null)} gAGX
              </Text>
              <Text as="p" className="leading-4 text-foreground/40" variant="copy">
                ≈ {formatApiDecimalAmount(null, { prefix: '$' })}
              </Text>
            </div>
          </RewardsStatCard>
          <RewardsStatCard className="relative overflow-hidden" label={stats.tier}>
            <Text as="p" tone="muted-foreground" variant="copy">
              {stats.tier}
            </Text>
            <Text as="p" className="mt-1.5 text-foreground/40" variant="copy">
              {stats.tierEmpty}
            </Text>
            {/* Figma 62×88 → w-16 h-22（Δ≤2；禁任意 px） */}
            <img
              alt=""
              className="pointer-events-none absolute top-1.5 right-0 h-22 w-16 object-contain"
              src={dappAssets.rewardsHubTierDeco}
            />
          </RewardsStatCard>
          <RewardsStatCard label={stats.personalHolding}>
            <Text as="p" tone="muted-foreground" variant="copy">
              {stats.personalHolding}
            </Text>
            <div className="mt-1.5 flex items-center gap-1.5">
              <Text as="p" className="leading-5 font-semibold" variant="headline">
                {formatApiDecimalAmount(null, { prefix: '$' })}
              </Text>
              <Text as="p" className="leading-4 text-foreground/40" variant="copy">
                0.00 AGX
              </Text>
            </div>
          </RewardsStatCard>
          <RewardsStatCard label={stats.totalPerformance}>
            <Text as="p" tone="muted-foreground" variant="copy">
              {stats.totalPerformance}
            </Text>
            <div className="mt-1.5 flex items-center gap-1.5">
              <Text as="p" className="leading-5 font-semibold" variant="headline">
                {formatApiDecimalAmount(null, { prefix: '$' })}
              </Text>
              <Text as="p" className="leading-4 text-foreground/40" variant="copy">
                0.00 AGX
              </Text>
            </div>
          </RewardsStatCard>
          <RewardsStatCard label={stats.smallAreaPerformance}>
            <Text as="p" tone="muted-foreground" variant="copy">
              {stats.smallAreaPerformance}
            </Text>
            <div className="mt-1.5 flex items-center gap-1.5">
              <Text as="p" className="leading-5 font-semibold" variant="headline">
                {formatApiDecimalAmount(null, { prefix: '$' })}
              </Text>
              <Text as="p" className="leading-4 text-foreground/40" variant="copy">
                0.00 AGX
              </Text>
            </div>
          </RewardsStatCard>
          <RewardsStatCard label={stats.contribution}>
            <div className="flex items-center justify-between gap-2">
              <Text as="p" className="leading-4" tone="muted-foreground" variant="copy">
                {stats.contribution}
              </Text>
              {/* Figma 去销毁 pill h16 · coral solid + chevron；禁 Button sm→min-h-9 */}
              <button
                className="inline-flex h-4 shrink-0 items-center gap-0.5 rounded-full bg-coral-emphasis px-2 text-(length:--type-caption-size) leading-none text-primary-foreground hover:opacity-90"
                onClick={() => openExchangeView('burn')}
                type="button"
              >
                {stats.goBurn}
                <DappIcon
                  alt=""
                  className="size-3.5 shrink-0"
                  size="xs"
                  src={dappAssets.rewardsHubGoBurnChevron}
                />
              </button>
            </div>
            <div className="mt-1.5 flex items-center gap-1.5">
              <Text as="p" className="leading-5 font-semibold" variant="headline">
                {contributionValue.startsWith('$') ? contributionValue : `$${contributionValue}`}
              </Text>
              <Text as="p" className="leading-4 text-foreground/40" variant="copy">
                {stats.contributionHint}
              </Text>
            </div>
          </RewardsStatCard>
        </div>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.rewards.hub.aboutTitle}</DappContentHeading>
        <DappCarousel
          slides={ABOUT_VIEWS.map((view) => {
            const slide = t.rewards.hub.aboutSlides[view]
            return {
              key: view,
              content: (
                <Card
                  surface="outlined"
                  className="relative min-h-30 overflow-hidden rounded-2xl px-4 py-6 shadow-sm"
                >
                  <Text as="p" className="leading-5 font-semibold" variant="copy">
                    {slide.title}
                  </Text>
                  <Text
                    as="p"
                    className="mt-3 w-3/4 leading-5"
                    tone="muted-foreground"
                    variant="detail"
                  >
                    {slide.body}
                  </Text>
                  <img
                    alt=""
                    className="pointer-events-none absolute top-2 right-2 h-36 w-24 object-contain"
                    src={dappAssets.rewardsHubTierDeco}
                  />
                </Card>
              ),
            }
          })}
        />
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.rewards.hub.mechanismTitle}</DappContentHeading>
        <Text as="p" className="mb-3" tone="muted-foreground" variant="detail">
          {t.rewards.hub.mechanismBody}
        </Text>
        <DappTableCard>
          <ResponsiveTable
            colWidths={['10rem', '10rem', '10rem', '1fr', '7rem']}
            headers={[...tier.columns]}
            rows={tier.rows.map((row) => [
              row.level,
              row.holding,
              row.accounts,
              row.team,
              row.rate,
            ])}
          />
          <Text as="p" className="mt-3.5" tone="muted-foreground" variant="detail">
            {t.rewards.hub.mechanismFooter}
          </Text>
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.rewards.faq.title}</DappContentHeading>
        {/* Figma FAQ 收起 50：py-4 覆盖 dapp 默认 py-4.5（禁任意 px） */}
        <FaqList
          className="[&_[data-faq-item]>div]:py-4"
          items={t.rewards.faq.items}
          variant="dapp"
        />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
