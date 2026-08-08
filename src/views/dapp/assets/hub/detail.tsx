/**
 * 资产总览详情页
 *
 * 顶部深色卡展示总资产、可领、已领、贡献值；下方为持仓 / 缓冲对比、
 * Rebase 步骤说明与常见问题。
 * 未连接钱包时各项展示 0 值占位。
 */
import { assetsHubAssets, dappAssets, tokenCarouselIcons } from '~/shared/assets/dapp'
import { Detail } from '~/shared/components/detail'
import { Empty } from '~/shared/components/empty'
import { Faq } from '~/shared/components/faq'
import { Grid } from '~/shared/components/grid'
import { Icon } from '~/shared/components/icon'
import { Section } from '~/shared/components/section'
import { Text } from '~/shared/components/text'
import {
  AssetsHoldingsDistributionCard,
  AssetsHoldingsDistributionSkeleton,
  AssetsHubMetricPlain,
  AssetsHubMetricWithIcon,
  AssetsMetricGroupCard,
  AssetsOverviewCard,
  AssetsOverviewMetric,
  AssetsRebaseCard,
} from '~/views/dapp/assets/hub/primitives'
import { useAssetsHubDetail } from '~/views/dapp/assets/hub/use-hub'
import {
  mapFaqWithContributionRatio,
  withContributionRatio,
} from '~/views/dapp/shared/contribution-claim-ratio'
import { useContributionClaimRatioLabel } from '~/web3/exchange/use-burn-swap-config'

export function AssetsHubDetail() {
  const vm = useAssetsHubDetail()
  const { t, overview, rebase, values, setBufferAsset, distribution, distributionLoading } = vm
  const claimRatio = useContributionClaimRatioLabel()
  const contributionHint = withContributionRatio(overview.contributionHint, claimRatio)
  const faqItems = mapFaqWithContributionRatio(t.assets.hub.faq.items, claimRatio)
  const {
    bufferTotal,
    bufferTotalApprox,
    bufferReleased,
    bufferReleasedApprox,
    bufferLabel,
    bufferIcon,
  } = vm

  const overviewMetrics = [
    {
      key: 'totalValue',
      featured: true,
      label: overview.totalValue,
      value: values.totalValue,
      hint: overview.totalValueHint,
    },
    {
      key: 'claimable',
      label: overview.claimable,
      value: values.claimable,
      note: values.claimableApprox,
    },
    {
      key: 'claimed',
      label: overview.claimed,
      value: values.claimed,
      note: values.claimedApprox,
    },
    {
      key: 'contribution',
      label: overview.contribution,
      value: values.contribution,
      note: contributionHint,
    },
  ] as const

  const metricGroups = [
    {
      key: 'holdings',
      title: overview.holdingsTitle,
      metrics: (
        <>
          <AssetsHubMetricWithIcon
            approx={values.holdingsReleasedApprox}
            icon={tokenCarouselIcons.agxIcon}
            label={overview.holdingsReleased}
            value={values.holdingsReleased}
          />
          <AssetsHubMetricPlain
            approx={values.holdingsTotalApprox}
            label={overview.holdingsTotal}
            value={values.holdingsTotal}
          />
        </>
      ),
    },
    {
      key: 'buffer',
      title: overview.bufferTitle,
      titleAction: (
        <button
          aria-label={overview.bufferSwitchAria}
          className="flex items-center gap-1 rounded-full border-0 bg-transparent p-0"
          onClick={() => setBufferAsset((v) => (v === 'agx' ? 'gagx' : 'agx'))}
          type="button"
        >
          {/* 缓冲币种切换：描边圆标，用中性色而非兑换页珊瑚色 */}
          <span className="grid size-4 place-items-center overflow-hidden rounded-full border border-border">
            <Icon alt="" className="size-2.5" size="sm" src={assetsHubAssets.bufferSwap} />
          </span>
          <Text as="span" className="leading-4" tone="muted-foreground" variant="copy">
            {bufferLabel}
          </Text>
        </button>
      ),
      metrics: (
        <>
          <AssetsHubMetricWithIcon
            approx={bufferTotalApprox}
            icon={bufferIcon}
            label={overview.bufferTotal}
            value={bufferTotal}
          />
          <AssetsHubMetricPlain
            approx={bufferReleasedApprox}
            label={overview.bufferReleased}
            value={bufferReleased}
          />
        </>
      ),
    },
  ] as const

  return (
    <Detail>
      <Section>
        <Section.Title>{overview.title}</Section.Title>
        <AssetsOverviewCard decoSrc={dappAssets.assetsHubOverviewDeco}>
          {overviewMetrics.map((metric) => (
            <AssetsOverviewMetric
              featured={'featured' in metric ? metric.featured : undefined}
              hint={'hint' in metric ? metric.hint : undefined}
              key={metric.key}
              label={metric.label}
              note={'note' in metric ? metric.note : undefined}
              value={metric.value}
            />
          ))}
        </AssetsOverviewCard>

        <Grid className="mt-2" columns={2} stackOnDapp>
          {metricGroups.map((group) => (
            <AssetsMetricGroupCard
              key={group.key}
              title={group.title}
              titleAction={'titleAction' in group ? group.titleAction : undefined}
            >
              {group.metrics}
            </AssetsMetricGroupCard>
          ))}
        </Grid>
      </Section>

      <Section>
        <Section.Title>{t.assets.hub.distribution.title}</Section.Title>
        {distributionLoading ? (
          <AssetsHoldingsDistributionSkeleton />
        ) : distribution ? (
          <AssetsHoldingsDistributionCard
            totalCaption={overview.holdingsTotal}
            totalLabel={distribution.totalLabel}
            view={distribution}
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-dashed border-border bg-card">
            <Empty title={t.assets.hub.distribution.empty} />
          </div>
        )}
      </Section>

      <Section>
        <Section.Title>{rebase.title}</Section.Title>
        <Section.Description>{rebase.subtitle}</Section.Description>
        <AssetsRebaseCard footer={rebase.footer} steps={rebase.steps} tags={rebase.tags} />
      </Section>

      <Section>
        <Section.Title>{t.assets.hub.faq.title}</Section.Title>
        <Faq defaultOpenFirst={false} items={faqItems} variant="dapp" />
      </Section>
    </Detail>
  )
}
