/**
 * 资产 Hub 详情页
 *
 * 顶部总览卡展示总资产、可领、已领、贡献值；下方为持仓 / 缓冲对比、
 * Rebase 时间轴与标签、FAQ。
 * 未连接钱包时各项展示 0 值占位。
 */
import { assetsHubAssets, dappAssets, tokenCarouselIcons } from '~/app/assets'
import { Card } from '~/shared/components/card'
import { Detail } from '~/shared/components/detail'
import { Empty } from '~/shared/components/empty'
import { FaqList } from '~/shared/components/faq-list'
import { Icon } from '~/shared/components/icon'
import { Section } from '~/shared/components/section'
import { Text } from '~/shared/components/text'
import { Tooltip } from '~/shared/components/tooltip'
import {
  AssetsHubMetricPlain,
  AssetsHubMetricWithIcon,
} from '~/views/dapp/assets/hub/assets-hub-metric'
import { useAssetsDetail } from '~/views/dapp/assets/hub/use-assets-detail'

export function AssetsDetail() {
  const vm = useAssetsDetail()
  const { t, overview, rebase, values, setBufferAsset } = vm
  const {
    bufferTotal,
    bufferTotalApprox,
    bufferReleased,
    bufferReleasedApprox,
    bufferLabel,
    bufferIcon,
  } = vm

  return (
    <Detail>
      <Section>
        <Section.Title>{overview.title}</Section.Title>
        {/* 总览卡右侧几何底纹；移动端底纹在屏外，故隐藏 */}
        <Card
          surface="inverse"
          className="relative flex items-center overflow-hidden p-4 max-dapp:items-start max-dapp:pt-7.5 max-dapp:pb-4"
        >
          <img
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-76 object-cover object-right dapp:block"
            src={dappAssets.assetsHubOverviewDeco}
          />
          <div className="relative z-1 grid w-full grid-cols-2 gap-4 dapp:grid-cols-4 dapp:gap-6">
            <div className="col-span-2 grid gap-1 dapp:col-span-1">
              <div className="flex items-center gap-1">
                <Text as="span" className="leading-4" tone="inverse" variant="copy">
                  {overview.totalValue}
                </Text>
                <Tooltip.Info
                  className="size-3 [&_svg]:size-3 [&_svg]:text-white"
                  content={overview.totalValueHint}
                />
              </div>
              <Text
                as="strong"
                className="leading-none font-semibold"
                tone="inverse"
                variant="stat"
              >
                {values.totalValue}
              </Text>
            </div>
            <div className="grid gap-0.5">
              <Text as="span" className="leading-4" tone="inverse" variant="copy">
                {overview.claimable}
              </Text>
              <Text as="strong" className="text-base/5 font-semibold" tone="inverse">
                {values.claimable}
              </Text>
              <Text as="span" className="leading-4 text-white/70" variant="copy">
                {values.claimableApprox}
              </Text>
            </div>
            <div className="grid gap-0.5">
              <Text as="span" className="leading-4" tone="inverse" variant="copy">
                {overview.claimed}
              </Text>
              <Text as="strong" className="text-base/5 font-semibold" tone="inverse">
                {values.claimed}
              </Text>
              <Text as="span" className="leading-4 text-white/70" variant="copy">
                {values.claimedApprox}
              </Text>
            </div>
            <div className="grid gap-0.5">
              <Text as="span" className="leading-4" tone="inverse" variant="copy">
                {overview.contribution}
              </Text>
              <Text as="strong" className="text-base/5 font-semibold" tone="inverse">
                {values.contribution}
              </Text>
              <Text as="span" className="leading-4 text-white/70" variant="copy">
                {overview.contributionHint}
              </Text>
            </div>
          </div>
        </Card>

        {/* 持仓 / 缓冲两卡 */}
        <div className="mt-2 grid gap-2 sm:grid-cols-2 max-dapp:gap-2">
          <Card surface="elevated" className="grid gap-1.5">
            <Text as="span" className="leading-4 font-medium" variant="copy">
              {overview.holdingsTitle}
            </Text>
            <div className="grid grid-cols-2 gap-2">
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
            </div>
          </Card>

          <Card surface="elevated" className="grid gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <Text as="span" className="leading-4 font-medium" variant="copy">
                {overview.bufferTitle}
              </Text>
              <button
                aria-label={overview.bufferSwitchAria}
                className="flex items-center gap-1 rounded-full border-0 bg-transparent p-0"
                onClick={() => setBufferAsset((v) => (v === 'agx' ? 'gagx' : 'agx'))}
                type="button"
              >
                {/* 缓冲币种切换符：描边圆形，用中性色而非兑换页的珊瑚色 */}
                <span className="grid size-4 place-items-center overflow-hidden rounded-full border border-border">
                  <Icon alt="" className="size-2.5" size="sm" src={assetsHubAssets.bufferSwap} />
                </span>
                <Text as="span" className="leading-4" tone="muted-foreground" variant="copy">
                  {bufferLabel}
                </Text>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
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
            </div>
          </Card>
        </div>
      </Section>

      <Section>
        <Section.Title>{t.assets.hub.distribution.title}</Section.Title>
        {/*
          持仓分布空态：扁平虚线边框卡，与上方 elevated 卡刻意区分，不要升级为阴影卡；
          内容用全局空态组件。
        */}
        <div className="overflow-hidden rounded-2xl border border-dashed border-border bg-card">
          <Empty title={t.assets.hub.distribution.empty} />
        </div>
      </Section>

      <Section>
        <Section.Title>{rebase.title}</Section.Title>
        <Section.Description>{rebase.subtitle}</Section.Description>
        <Card surface="elevated" className="grid gap-1.5 py-6">
          {/* 移动端时间轴：左端点 + 竖线连接 */}
          <ol className="m-0 flex list-none flex-col p-0 dapp:hidden">
            {rebase.steps.map((step, index) => (
              <li className="flex gap-3" key={`h5-${step.title}-${step.body}-${index}`}>
                <div className="flex w-3 shrink-0 flex-col items-center self-stretch">
                  <span aria-hidden className="size-2.5 shrink-0 rounded-full bg-primary" />
                  {index < rebase.steps.length - 1 ? (
                    <span aria-hidden className="mt-0.5 w-0.5 flex-1 bg-border" />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1 pb-4">
                  <Text as="p" className="leading-5 font-bold" variant="headline">
                    {step.title}
                  </Text>
                  <Text as="p" className="mt-1 leading-4" tone="muted-foreground" variant="copy">
                    {step.body.replaceAll('\n', '')}
                  </Text>
                </div>
              </li>
            ))}
          </ol>

          {/* 桌面端横轴连线：线高须显式声明，否则不渲染 */}
          <div className="relative hidden grid-cols-4 items-center dapp:grid">
            <div
              aria-hidden
              className="absolute inset-x-[12.5%] top-1/2 h-0.5 -translate-y-1/2 bg-border"
            />
            {rebase.steps.map((step) => (
              <span
                className="relative z-1 flex justify-center"
                key={`dot-${step.title}-${step.body}`}
              >
                <span aria-hidden className="size-2.5 shrink-0 rounded-full bg-primary" />
              </span>
            ))}
          </div>

          <ol className="m-0 hidden list-none grid-cols-4 gap-2 p-0 dapp:grid">
            {rebase.steps.map((step) => (
              <li className="px-1 pt-4 text-center" key={step.title + step.body}>
                <Text as="p" className="leading-5 font-bold" variant="headline">
                  {step.title}
                </Text>
                <Text
                  as="p"
                  className="mt-1.5 leading-4 whitespace-pre-line"
                  tone="muted-foreground"
                  variant="copy"
                >
                  {step.body}
                </Text>
              </li>
            ))}
          </ol>

          <div className="flex flex-col items-start gap-2.5 dapp:flex-row dapp:flex-wrap dapp:items-center dapp:justify-between dapp:gap-x-4 dapp:gap-y-2 dapp:rounded-2xl dapp:bg-muted dapp:px-6 dapp:py-3.5">
            {rebase.tags.map((tag) => (
              <span className="flex items-center gap-2 dapp:gap-1.5" key={tag}>
                <Icon
                  alt=""
                  className="h-4 w-4.5 shrink-0"
                  size="sm"
                  src={dappAssets.assetsHubCheckBadge}
                />
                <Text as="span" className="leading-4 dapp:font-semibold" variant="copy">
                  {tag}
                </Text>
              </span>
            ))}
          </div>

          <Text as="p" className="leading-4 text-foreground/40" variant="copy">
            {rebase.footer}
          </Text>
        </Card>
      </Section>

      <Section>
        <Section.Title>{t.assets.hub.faq.title}</Section.Title>
        <FaqList defaultOpenFirst={false} items={t.assets.hub.faq.items} variant="dapp" />
      </Section>
    </Detail>
  )
}
