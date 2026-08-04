import { dappAssets } from '~/app/assets'
import { DappAboutCard } from '~/app/shell/dapp-about-card'
import { DappCarousel } from '~/app/shell/dapp-carousel'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { ResponsiveTable } from '~/app/shell/responsive-table'
import { useI18n } from '~/i18n/use-i18n'
import { FaqList } from '~/shared/components/faq-list'
import { Icon } from '~/shared/components/icon'
import { Text } from '~/shared/components/text'
import { openExchangeView } from '~/shared/config/dapp-open-views'
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
        {/* PC 三列；H5 一行两卡（≡ staking hub max-dapp:grid-cols-2） */}
        <div className="mb-6 grid grid-cols-2 gap-2.5 dapp:grid-cols-3">
          <RewardsStatCard label={stats.totalRewards}>
            {/* Figma tile label：13 Medium body70 */}
            <Text as="p" className="leading-none font-medium text-foreground/70" variant="copy">
              {stats.totalRewards}
            </Text>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
              <Icon
                alt=""
                className="size-4.5 shrink-0"
                size="sm"
                src={dappAssets.rewardsHubGagxDot}
              />
              <Text
                as="p"
                className="leading-none font-semibold wrap-break-word"
                variant="headline"
              >
                {statsView.totalRewardGagx}
              </Text>
              <Text
                as="p"
                className="leading-none wrap-break-word text-foreground/40"
                variant="copy"
              >
                {statsView.totalRewardApprox}
              </Text>
            </div>
          </RewardsStatCard>
          {/* Figma 4296:218：overflow-clip；IP `-scale-y-100 rotate-180` ≡ `-scale-x-100` 朝左 */}
          <RewardsStatCard className="relative overflow-hidden" label={stats.tier}>
            <Text as="p" className="leading-none font-medium text-foreground/70" variant="copy">
              {stats.tier}
            </Text>
            <Text
              as="p"
              className="mt-1.5 leading-none wrap-break-word text-foreground/40"
              variant="copy"
            >
              {statsView.tierLabel}
            </Text>
            {/* Figma 62×88 → w-16 h-22；资产朝右，跟稿水平翻转；禁溢出圆角 */}
            <img
              alt=""
              className="pointer-events-none absolute top-1.5 right-0 h-22 w-16 -scale-x-100 object-contain object-right max-dapp:hidden"
              src={dappAssets.rewardsHubTierDeco}
            />
          </RewardsStatCard>
          <RewardsStatCard label={stats.personalHolding}>
            <Text as="p" className="leading-none font-medium text-foreground/70" variant="copy">
              {stats.personalHolding}
            </Text>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
              <Text
                as="p"
                className="leading-none font-semibold wrap-break-word"
                variant="headline"
              >
                {statsView.personalUsd}
              </Text>
              <Text
                as="p"
                className="leading-none wrap-break-word text-foreground/40"
                variant="copy"
              >
                {statsView.personalAgx}
              </Text>
            </div>
          </RewardsStatCard>
          <RewardsStatCard label={stats.totalPerformance}>
            <Text as="p" className="leading-none font-medium text-foreground/70" variant="copy">
              {stats.totalPerformance}
            </Text>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
              <Text
                as="p"
                className="leading-none font-semibold wrap-break-word"
                variant="headline"
              >
                {statsView.makingMarketUsd}
              </Text>
              <Text
                as="p"
                className="leading-none wrap-break-word text-foreground/40"
                variant="copy"
              >
                {statsView.makingMarketAgx}
              </Text>
            </div>
          </RewardsStatCard>
          <RewardsStatCard label={stats.smallAreaPerformance}>
            <Text as="p" className="leading-none font-medium text-foreground/70" variant="copy">
              {stats.smallAreaPerformance}
            </Text>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
              <Text
                as="p"
                className="leading-none font-semibold wrap-break-word"
                variant="headline"
              >
                {statsView.smallMarketUsd}
              </Text>
              <Text
                as="p"
                className="leading-none wrap-break-word text-foreground/40"
                variant="copy"
              >
                {statsView.smallMarketAgx}
              </Text>
            </div>
          </RewardsStatCard>
          <RewardsStatCard label={stats.contribution}>
            <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5">
              <Text
                as="p"
                className="min-w-0 leading-none font-medium wrap-break-word text-foreground/70"
                variant="copy"
              >
                {stats.contribution}
              </Text>
              {/* Figma 去销毁 pill · coral；禁 Button sm→min-h-9；多语完整可见 */}
              <button
                className="inline-flex min-h-4 max-w-full shrink-0 items-center gap-0.5 rounded-full bg-coral-emphasis px-2 py-0.5 text-primary-foreground hover:opacity-90"
                onClick={() => openExchangeView('burn')}
                type="button"
              >
                <Text
                  as="span"
                  className="leading-none whitespace-nowrap"
                  tone="inverse"
                  variant="caption"
                >
                  {stats.goBurn}
                </Text>
                <Icon
                  alt=""
                  className="size-3.5 shrink-0"
                  size="xs"
                  src={dappAssets.rewardsHubGoBurnChevron}
                />
              </button>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
              <Text
                as="p"
                className="leading-none font-semibold wrap-break-word"
                variant="headline"
              >
                {statsView.contributionValue.startsWith('$')
                  ? statsView.contributionValue
                  : `$${statsView.contributionValue}`}
              </Text>
              <Text
                as="p"
                className="leading-none wrap-break-word text-foreground/40"
                variant="copy"
              >
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
        <Text as="p" className="mb-3 text-foreground/40" variant="detail">
          {t.rewards.hub.mechanismBody}
        </Text>
        <DappTableCard
          footer={
            <Text as="p" className="text-foreground/40" variant="detail">
              {t.rewards.hub.mechanismFooter}
            </Text>
          }
        >
          {/* 无数据稿 A4「当前」徽章；有 making_rank 时跟真档，否则跟稿演示 A4 */}
          <ResponsiveTable
            colWidths={['10rem', '10rem', '10rem', '1fr', '7rem']}
            headers={[...tier.columns]}
            highlightedRows={[statsView.tierRowIndex]}
            rows={tier.rows.map((row, rowIndex) => {
              const isCurrent = rowIndex === statsView.tierRowIndex
              // Figma 4699:234：等级 ink semibold + coral-soft「当前」pill（非等级染 coral）
              const levelCell = isCurrent ? (
                <span className="inline-flex items-center gap-2">
                  <Text as="span" className="font-semibold" variant="copy">
                    {row.level}
                  </Text>
                  <span className="inline-flex items-center rounded-full bg-primary-soft px-2 py-0.5">
                    <Text as="span" className="leading-none text-coral" variant="caption">
                      {t.rewards.currentTierSuffix}
                    </Text>
                  </span>
                </span>
              ) : (
                row.level
              )
              // Figma 末行：130% semibold +「+全球分红 5%」primary 竖排
              const plusIdx = row.rate.indexOf('+')
              const rateCell =
                plusIdx > 0 ? (
                  <span className="flex flex-col items-start leading-normal">
                    <Text as="span" className="font-semibold" variant="copy">
                      {row.rate.slice(0, plusIdx).trim()}
                    </Text>
                    <Text as="span" className="text-primary" variant="copy">
                      {row.rate.slice(plusIdx).trim()}
                    </Text>
                  </span>
                ) : (
                  <Text as="span" className="font-semibold" variant="copy">
                    {row.rate}
                  </Text>
                )
              return [levelCell, row.holding, row.accounts, row.team, rateCell]
            })}
          />
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
