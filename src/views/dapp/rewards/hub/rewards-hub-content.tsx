import { dappAssets } from '~/app/assets'
import { DappAboutCard } from '~/app/shell/dapp-about-card'
import { DappCarousel } from '~/app/shell/dapp-carousel'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { ResponsiveTable } from '~/app/shell/responsive-table'
import { useI18n } from '~/i18n/use-i18n'
import { openExchangeView } from '~/shared/config/dapp-open-views'
import { FaqList } from '~/shared/ui/faq-list'
import { Text } from '~/shared/ui/text'
import { useRewardsHubStats } from '~/views/dapp/rewards/hub/use-rewards-hub-stats'
import { RewardsStatCard } from '~/views/dapp/rewards/rewards-stat-card'

/** Figma `4297:213` about · 4 张；lavender wash + 同一人物 deco（发展/创世不进轮播）。 */
const ABOUT_VIEWS = ['referral', 'participate', 'cobuild', 'lucky'] as const

export function RewardsHubContent() {
  const { messages: t } = useI18n()
  const statsView = useRewardsHubStats()
  const tier = t.rewards.hub.tierTable
  const stats = t.rewards.hub.stats

  return (
    <DappDetailPage>
      <DappDetailBlock>
        {/* Figma tile 行 gap 9 → gap-2.5(10)；瓦内 leading 跟稿 normal，禁 copy/headline 默认 1.5/1.2 撑高 */}
        <div className="mb-6 grid gap-2.5 sm:grid-cols-3">
          <RewardsStatCard label={stats.totalRewards}>
            {/* Figma tile label：13 Medium body70 */}
            <Text as="p" className="leading-none font-medium text-foreground/70" variant="copy">
              {stats.totalRewards}
            </Text>
            <div className="mt-1.5 flex items-center gap-1.5">
              <DappIcon
                alt=""
                className="size-4.5 shrink-0"
                size="sm"
                src={dappAssets.rewardsHubGagxDot}
              />
              <Text as="p" className="leading-none font-semibold" variant="headline">
                {statsView.totalRewardGagx}
              </Text>
              <Text as="p" className="leading-none text-foreground/40" variant="copy">
                {statsView.totalRewardApprox}
              </Text>
            </div>
          </RewardsStatCard>
          <RewardsStatCard className="relative overflow-hidden" label={stats.tier}>
            <Text as="p" className="leading-none font-medium text-foreground/70" variant="copy">
              {stats.tier}
            </Text>
            <Text as="p" className="mt-1.5 leading-none text-foreground/40" variant="copy">
              {statsView.tierLabel}
            </Text>
            {/* Figma 62×88 → w-16 h-22（Δ≤2；禁任意 px） */}
            <img
              alt=""
              className="pointer-events-none absolute top-1.5 right-0 h-22 w-16 object-contain"
              src={dappAssets.rewardsHubTierDeco}
            />
          </RewardsStatCard>
          <RewardsStatCard label={stats.personalHolding}>
            <Text as="p" className="leading-none font-medium text-foreground/70" variant="copy">
              {stats.personalHolding}
            </Text>
            <div className="mt-1.5 flex items-center gap-1.5">
              <Text as="p" className="leading-none font-semibold" variant="headline">
                {statsView.personalUsd}
              </Text>
              <Text as="p" className="leading-none text-foreground/40" variant="copy">
                {statsView.personalAgx}
              </Text>
            </div>
          </RewardsStatCard>
          <RewardsStatCard label={stats.totalPerformance}>
            <Text as="p" className="leading-none font-medium text-foreground/70" variant="copy">
              {stats.totalPerformance}
            </Text>
            <div className="mt-1.5 flex items-center gap-1.5">
              <Text as="p" className="leading-none font-semibold" variant="headline">
                {statsView.makingMarketUsd}
              </Text>
              <Text as="p" className="leading-none text-foreground/40" variant="copy">
                {statsView.makingMarketAgx}
              </Text>
            </div>
          </RewardsStatCard>
          <RewardsStatCard label={stats.smallAreaPerformance}>
            <Text as="p" className="leading-none font-medium text-foreground/70" variant="copy">
              {stats.smallAreaPerformance}
            </Text>
            <div className="mt-1.5 flex items-center gap-1.5">
              <Text as="p" className="leading-none font-semibold" variant="headline">
                {statsView.smallMarketUsd}
              </Text>
              <Text as="p" className="leading-none text-foreground/40" variant="copy">
                {statsView.smallMarketAgx}
              </Text>
            </div>
          </RewardsStatCard>
          <RewardsStatCard label={stats.contribution}>
            <div className="flex items-center justify-between gap-2">
              <Text as="p" className="leading-none font-medium text-foreground/70" variant="copy">
                {stats.contribution}
              </Text>
              {/* Figma 去销毁 pill h16 · coral solid + caption 10；禁 Button sm→min-h-9 */}
              <button
                className="inline-flex h-4 shrink-0 items-center gap-0.5 rounded-full bg-coral-emphasis px-2 text-primary-foreground hover:opacity-90"
                onClick={() => openExchangeView('burn')}
                type="button"
              >
                <Text as="span" className="leading-none" tone="inverse" variant="caption">
                  {stats.goBurn}
                </Text>
                <DappIcon
                  alt=""
                  className="size-3.5 shrink-0"
                  size="xs"
                  src={dappAssets.rewardsHubGoBurnChevron}
                />
              </button>
            </div>
            <div className="mt-1.5 flex items-center gap-1.5">
              <Text as="p" className="leading-none font-semibold" variant="headline">
                {statsView.contributionValue.startsWith('$')
                  ? statsView.contributionValue
                  : `$${statsView.contributionValue}`}
              </Text>
              <Text as="p" className="leading-none text-foreground/40" variant="copy">
                {stats.contributionHint}
              </Text>
            </div>
          </RewardsStatCard>
        </div>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.rewards.hub.aboutTitle}</DappContentHeading>
        <DappCarousel
          nextLabel={t.common.paginationNext}
          prevLabel={t.common.paginationPrev}
          slides={ABOUT_VIEWS.map((view) => {
            const slide = t.rewards.hub.aboutSlides[view]
            return {
              key: view,
              content: (
                <DappAboutCard
                  body={slide.body}
                  decoSrc={dappAssets.aboutCarouselRewardsMascot}
                  title={slide.title}
                  wash="lavender"
                />
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
          {/* 无数据稿 A4「当前」徽章；有 making_rank 时跟真档，否则跟稿演示 A4 */}
          <ResponsiveTable
            colWidths={['10rem', '10rem', '10rem', '1fr', '7rem']}
            headers={[...tier.columns]}
            highlightedRows={[statsView.tierRowIndex]}
            rows={tier.rows.map((row, rowIndex) => {
              const isCurrent = rowIndex === statsView.tierRowIndex
              const levelCell = isCurrent ? (
                <span className="inline-flex items-center gap-1.5">
                  <Text as="span" className="text-coral" variant="copy">
                    {row.level}
                  </Text>
                  <span className="inline-flex h-4.5 items-center rounded-full bg-primary-soft px-2">
                    <Text as="span" className="leading-none" tone="primary" variant="caption">
                      {t.rewards.currentTierSuffix}
                    </Text>
                  </span>
                </span>
              ) : (
                row.level
              )
              const rateParts = row.rate
                .split(/(?=\+)/)
                .map((p) => p.trim())
                .filter(Boolean)
              const rateCell =
                rateParts.length > 1 ? (
                  <span className="inline-flex flex-wrap items-baseline gap-1">
                    {rateParts.map((part) => (
                      <Text as="span" key={part} variant="copy">
                        {part}
                      </Text>
                    ))}
                  </span>
                ) : (
                  row.rate
                )
              return [levelCell, row.holding, row.accounts, row.team, rateCell]
            })}
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
