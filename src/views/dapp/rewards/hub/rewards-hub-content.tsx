import { useI18n } from '~/i18n/use-i18n'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { ResponsiveTable } from '~/app/shell/responsive-table'
import { Text } from '~/shared/ui/text'
import { Card } from '~/shared/ui/card'
import { FaqList } from '~/shared/ui/faq-list'
import { openExchangeView } from '~/shared/config/dapp-open-views'
import { Button } from '~/shared/ui/button'
import { useDappShell } from '~/app/use-dapp-shell'
import { DappCarousel } from '~/app/shell/dapp-carousel'
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
          <RewardsStatCard
            label={stats.totalRewards}
            labelClassName="text-[13px]"
            value={formatApiDecimalAmount(null)}
          />
          <RewardsStatCard
            className="relative overflow-hidden"
            label={stats.tier}
            labelClassName="text-[13px]"
          >
            <Text as="p" className="text-[13px]" tone="muted-foreground" variant="caption">
              {stats.tier}
            </Text>
            <Text as="p" className="mt-1.5 text-[13px]" tone="muted-foreground" variant="detail">
              {stats.tierEmpty}
            </Text>
          </RewardsStatCard>
          <RewardsStatCard
            label={stats.personalHolding}
            labelClassName="text-[13px]"
            value={formatApiDecimalAmount(null)}
          />
          <RewardsStatCard
            label={stats.totalPerformance}
            labelClassName="text-[13px]"
            value={formatApiDecimalAmount(null)}
          />
          <RewardsStatCard
            label={stats.smallAreaPerformance}
            labelClassName="text-[13px]"
            value={formatApiDecimalAmount(null)}
          />
          <RewardsStatCard label={stats.contribution} labelClassName="text-[13px]">
            <div className="flex items-start justify-between gap-2">
              <Text as="p" className="text-[13px]" tone="muted-foreground" variant="caption">
                {stats.contribution}
              </Text>
              <Button
                className="h-4 shrink-0 rounded-full bg-primary px-2 text-[10px] text-primary-foreground hover:bg-primary/90"
                onClick={() => openExchangeView('burn')}
                size="sm"
                type="button"
              >
                {stats.goBurn}
              </Button>
            </div>
            <Text as="p" className="mt-1.5 font-semibold" variant="copy">
              {contributionValue}
            </Text>
            <Text as="p" className="mt-1 text-[13px]" tone="muted-foreground" variant="detail">
              {stats.contributionHint}
            </Text>
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
                <Card surface="outlined" className="rounded-2xl px-4 py-6 shadow-sm">
                  <Text as="p" className="font-semibold" variant="copy">
                    {slide.title}
                  </Text>
                  <Text as="p" className="mt-3" tone="muted-foreground" variant="detail">
                    {slide.body}
                  </Text>
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
            colWidths={['160px', '160px', '160px', '1fr', '112px']}
            headers={[...tier.columns]}
            rows={tier.rows.map((row) => [
              row.level,
              row.holding,
              row.accounts,
              row.team,
              row.rate,
            ])}
          />
          <Text as="p" className="mt-3.5 text-[13px]" tone="muted-foreground" variant="detail">
            {t.rewards.hub.mechanismFooter}
          </Text>
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.rewards.faq.title}</DappContentHeading>
        <FaqList items={t.rewards.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
