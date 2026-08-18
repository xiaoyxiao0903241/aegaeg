/**
 * 奖励总览详情页
 *
 * 顶部六张摘要卡汇总总奖励、等级、持仓与做市数据；
 * 中部为四种奖励类型的轮播介绍；下方为机制档位表与 FAQ。
 * 未登录时摘要卡显示空态占位。
 */
import { interpolate } from '~/i18n/interpolate'
import { useI18n } from '~/i18n/use-i18n'
import { dappAssets } from '~/shared/assets/dapp'
import { StatusBadge } from '~/shared/components/badge'
import { Carousel } from '~/shared/components/carousel'
import { Detail } from '~/shared/components/detail'
import { Faq } from '~/shared/components/faq'
import { Grid } from '~/shared/components/grid'
import { Icon } from '~/shared/components/icon'
import { Section } from '~/shared/components/section'
import { Table } from '~/shared/components/table'
import { Text } from '~/shared/components/text'
import {
  RewardsSummaryCard,
  type RewardsSummaryCardProps,
} from '~/views/dapp/rewards/hub/primitives'
import { useRewardsHub } from '~/views/dapp/rewards/hub/use-hub'
import { AboutCard } from '~/views/dapp/shared/about-card'
import {
  mapFaqWithContributionRatio,
  withContributionRatio,
} from '~/views/dapp/shared/contribution-claim-ratio'
import { openExchangeView } from '~/views/dapp/shared/navigation'
import { useContributionClaimRatioLabel } from '~/web3/exchange/use-burn-swap-config'
import { useEpochScheduleLabels } from '~/web3/staking/use-staking-queries'

/** 轮播展示的奖励类型：4 张（发展 / 创世不进轮播） */
const ABOUT_VIEWS = ['referral', 'participate', 'cobuild', 'lucky'] as const

type RewardsSummaryItem = RewardsSummaryCardProps & { key: string }

export function RewardsHubDetail() {
  const { messages: t } = useI18n()
  const statsView = useRewardsHub()
  const claimRatio = useContributionClaimRatioLabel()
  const tier = t.rewards.hub.tierTable
  const stats = t.rewards.hub.stats
  const contributionHint = withContributionRatio(stats.contributionHint, claimRatio)
  const epochSchedule = useEpochScheduleLabels()
  const faqItems = mapFaqWithContributionRatio(t.rewards.faq.items, claimRatio).map((item) => ({
    ...item,
    a: interpolate(item.a, { hours: epochSchedule.hours }),
  }))

  const tiles: RewardsSummaryItem[] = [
    {
      key: 'totalRewards',
      label: stats.totalRewards,
      value: statsView.totalRewardGagx,
      approx: statsView.totalRewardApprox,
      iconSrc: dappAssets.rewardsHubGagxDot,
    },
    {
      key: 'tier',
      label: stats.tier,
      mutedBody: statsView.tierLabel,
      decorationSrc: dappAssets.rewardsHubTierDeco,
    },
    {
      key: 'personalHolding',
      label: stats.personalHolding,
      value: statsView.personalUsd,
      approx: statsView.personalAgx,
    },
    {
      key: 'totalPerformance',
      label: stats.totalPerformance,
      value: statsView.makingMarketUsd,
      approx: statsView.makingMarketAgx,
    },
    {
      key: 'smallAreaPerformance',
      label: stats.smallAreaPerformance,
      value: statsView.smallMarketUsd,
      approx: statsView.smallMarketAgx,
    },
    {
      key: 'contribution',
      label: stats.contribution,
      value: statsView.contributionValue,
      approx: contributionHint,
      labelAction: (
        // 去销毁按钮：用原生 button 而非 Button 组件，保证多语文案完整可见
        <button
          className="inline-flex max-w-full shrink-0 items-center gap-0.5 rounded-full bg-coral-emphasis px-2 py-0.5 text-primary-foreground hover:opacity-90"
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
      ),
    },
  ]

  return (
    <Detail>
      <Section>
        {/* 摘要卡间距由 Grid 统一控制 */}
        <Grid className="mb-6" columns={3}>
          {tiles.map((tile) => {
            const { key, ...cardProps } = tile
            return <RewardsSummaryCard key={key} {...cardProps} />
          })}
        </Grid>
      </Section>

      <Section>
        <Section.Title>{t.rewards.hub.aboutTitle}</Section.Title>
        <Carousel opts={{ align: 'start', loop: true, containScroll: 'trimSnaps' }}>
          <Carousel.Content>
            {ABOUT_VIEWS.map((view) => {
              const slide = t.rewards.hub.aboutSlides[view]
              return (
                <Carousel.Item key={view}>
                  <AboutCard
                    body={withContributionRatio(slide.body, claimRatio)}
                    decorationSrc={dappAssets.aboutCarouselRewardsMascot}
                    title={slide.title}
                    wash="lavender"
                  />
                </Carousel.Item>
              )
            })}
          </Carousel.Content>
          <Carousel.Indicators
            dotLabel={(index) =>
              t.rewards.hub.aboutSlides[ABOUT_VIEWS[index]!]?.title ?? String(index + 1)
            }
            nextLabel={t.common.paginationNext}
            prevLabel={t.common.paginationPrev}
          />
        </Carousel>
      </Section>

      <Section>
        <Section.Title>{t.rewards.hub.mechanismTitle}</Section.Title>
        <Section.Description>{t.rewards.hub.mechanismBody}</Section.Description>
        <Table>
          {/* 当前等级：有 making_rank 才高亮该行并标「当前」；无档不高亮 */}
          <Table.Body
            className="[&_tbody_tr:last-child>td]:align-top"
            colWidths={['10rem', '10rem', '10rem', '1fr', '7rem']}
            endColumns={[4]}
            headers={[...tier.columns]}
            highlightedRows={statsView.tierRowIndex != null ? [statsView.tierRowIndex] : []}
            rows={tier.rows.map((row, rowIndex) => {
              const isCurrent =
                statsView.tierRowIndex != null && rowIndex === statsView.tierRowIndex
              // 当前档：仅「当前」标签高亮，等级名本身不着色
              const levelCell = isCurrent ? (
                <span className="inline-flex items-center gap-2">
                  <Text as="span" className="font-semibold" variant="copy">
                    {row.level}
                  </Text>
                  <StatusBadge className="font-normal text-coral" size="compact" tone="pending">
                    {t.rewards.currentTierSuffix}
                  </StatusBadge>
                </span>
              ) : (
                row.level
              )
              // 末行利率：附加说明（如「+全球分红 5%」）拆行展示
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
          <Table.Footer>
            <Text as="p" className="text-foreground/40" variant="detail">
              {t.rewards.hub.mechanismFooter}
            </Text>
          </Table.Footer>
        </Table>
      </Section>

      <Section>
        <Section.Title>{t.rewards.faq.title}</Section.Title>
        {/* FAQ 收起项间距覆盖 dapp 默认值 */}
        <Faq className="[&_[data-faq-item]>div]:py-4" items={faqItems} variant="dapp" />
      </Section>
    </Detail>
  )
}
