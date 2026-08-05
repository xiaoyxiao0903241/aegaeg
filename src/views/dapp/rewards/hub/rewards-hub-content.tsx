import type { ReactNode } from 'react'

import { dappAssets } from '~/app/assets'
import { DappAboutCard } from '~/app/shell/dapp-about-card'
import { OverviewGrid } from '~/app/shell/overview-grid'
import { useI18n } from '~/i18n/use-i18n'
import { Card } from '~/shared/components/card'
import { Carousel } from '~/shared/components/carousel'
import { CountValue } from '~/shared/components/count-value'
import { Detail } from '~/shared/components/detail'
import { FaqList } from '~/shared/components/faq-list'
import { Icon } from '~/shared/components/icon'
import { Section } from '~/shared/components/section'
import { Table } from '~/shared/components/table'
import { Text } from '~/shared/components/text'
import { openExchangeView } from '~/shared/config/dapp-open-views'
import { useRewardsHubStats } from '~/views/dapp/rewards/hub/use-rewards-hub-stats'

/** Figma `4297:213` about · 4 张；lavender wash + 同一人物 deco（发展/创世不进轮播）。 */
const ABOUT_VIEWS = ['referral', 'participate', 'cobuild', 'lucky'] as const

type HubStatTile = {
  key: string
  label: string
  value?: string
  approx?: string
  iconSrc?: string
  mutedBody?: string
  decoSrc?: string
  labelAction?: ReactNode
}

export function RewardsHubContent() {
  const { messages: t } = useI18n()
  const statsView = useRewardsHubStats()
  const tier = t.rewards.hub.tierTable
  const stats = t.rewards.hub.stats

  const tiles: HubStatTile[] = [
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
      decoSrc: dappAssets.rewardsHubTierDeco,
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
      value: statsView.contributionValue.startsWith('$')
        ? statsView.contributionValue
        : `$${statsView.contributionValue}`,
      approx: stats.contributionHint,
      labelAction: (
        // Figma 去销毁 pill · coral；禁 Button sm→min-h-9；多语完整可见
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
        {/* PC 三列；H5 一行两卡 — OverviewGrid gap SSOT */}
        <OverviewGrid className="mb-6" columns={3}>
          {tiles.map((tile) => (
            <Card
              as="div"
              className={
                tile.decoSrc != null
                  ? 'relative flex flex-col gap-1.5 overflow-hidden'
                  : 'flex flex-col gap-1.5'
              }
              key={tile.key}
              surface="elevated"
            >
              {tile.labelAction != null ? (
                <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5">
                  <Text
                    as="p"
                    className="min-w-0 leading-none font-medium wrap-break-word text-foreground/70"
                    variant="copy"
                  >
                    {tile.label}
                  </Text>
                  {tile.labelAction}
                </div>
              ) : (
                <Text as="p" className="leading-none font-medium text-foreground/70" variant="copy">
                  {tile.label}
                </Text>
              )}
              {tile.value != null ? (
                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                  {tile.iconSrc != null ? (
                    <Icon alt="" className="size-4.5 shrink-0" size="sm" src={tile.iconSrc} />
                  ) : null}
                  <Text
                    as="p"
                    className="leading-none font-semibold wrap-break-word"
                    variant="headline"
                  >
                    <CountValue text={tile.value} />
                  </Text>
                  {tile.approx != null ? (
                    <Text
                      as="p"
                      className="leading-none wrap-break-word text-foreground/40"
                      variant="copy"
                    >
                      <CountValue text={tile.approx} />
                    </Text>
                  ) : null}
                </div>
              ) : null}
              {tile.mutedBody != null ? (
                <Text
                  as="p"
                  className="leading-none wrap-break-word text-foreground/40"
                  variant="copy"
                >
                  {tile.mutedBody}
                </Text>
              ) : null}
              {tile.decoSrc != null ? (
                // Figma 62×88 → w-16 h-22；资产朝右，跟稿水平翻转；禁溢出圆角
                <img
                  alt=""
                  className="pointer-events-none absolute top-1.5 right-0 w-16 -scale-x-100 object-contain object-right max-dapp:hidden"
                  src={tile.decoSrc}
                />
              ) : null}
            </Card>
          ))}
        </OverviewGrid>
      </Section>

      <Section>
        <Section.Title>{t.rewards.hub.aboutTitle}</Section.Title>
        <Carousel opts={{ align: 'start', loop: true, containScroll: 'trimSnaps' }}>
          <Carousel.Content>
            {ABOUT_VIEWS.map((view) => {
              const slide = t.rewards.hub.aboutSlides[view]
              return (
                <Carousel.Item key={view}>
                  <DappAboutCard
                    body={slide.body}
                    decoSrc={dappAssets.aboutCarouselRewardsMascot}
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
          {/* 无数据稿 A4「当前」徽章；有 making_rank 时跟真档，否则跟稿演示 A4 */}
          <Table.Body
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
          <Table.Footer>
            <Text as="p" className="text-foreground/40" variant="detail">
              {t.rewards.hub.mechanismFooter}
            </Text>
          </Table.Footer>
        </Table>
      </Section>

      <Section>
        <Section.Title>{t.rewards.faq.title}</Section.Title>
        {/* Figma FAQ 收起 50：py-4 覆盖 dapp 默认 py-4.5（禁任意 px） */}
        <FaqList
          className="[&_[data-faq-item]>div]:py-4"
          items={t.rewards.faq.items}
          variant="dapp"
        />
      </Section>
    </Detail>
  )
}
