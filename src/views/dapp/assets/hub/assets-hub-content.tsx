import { dappAssets, tokenCarouselIcons } from '~/app/assets'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappInfoTooltip } from '~/app/shell/dapp-info-tooltip'
import { Card } from '~/shared/ui/card'
import { FaqList } from '~/shared/ui/faq-list'
import { Text } from '~/shared/ui/text'
import {
  AssetsHubMetricPlain,
  AssetsHubMetricWithIcon,
} from '~/views/dapp/assets/hub/assets-hub-metric'
import { useAssetsHubContentView } from '~/views/dapp/assets/hub/use-assets-hub-content-view'

export function AssetsHubContent() {
  const vm = useAssetsHubContentView()
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
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading>{overview.title}</DappContentHeading>
        {/* Figma 资产总览/card 116：min-h-29 + 右侧几何底纹（禁 h-[116px] / text-[2rem]） */}
        <Card surface="inverse" className="relative flex min-h-29 items-center overflow-hidden p-4">
          <img
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 h-full w-76 object-cover object-right"
            src={dappAssets.assetsHubOverviewDeco}
          />
          <div className="relative z-1 grid w-full gap-4 sm:grid-cols-2 dapp:grid-cols-4 dapp:gap-6">
            <div className="grid gap-1">
              <div className="flex items-center gap-1">
                <Text as="span" className="leading-4" tone="inverse-muted" variant="support">
                  {overview.totalValue}
                </Text>
                <DappInfoTooltip
                  className="size-3 opacity-80 [&_svg]:size-3 [&_svg]:text-white"
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
              <Text as="span" className="leading-4" tone="inverse-muted" variant="support">
                {overview.claimable}
              </Text>
              <Text as="strong" className="text-base leading-5 font-semibold" tone="inverse">
                {values.claimable}
              </Text>
              <Text
                as="span"
                className="leading-4 opacity-70"
                tone="inverse-muted"
                variant="support"
              >
                {values.claimableApprox}
              </Text>
            </div>
            <div className="grid gap-0.5">
              <Text as="span" className="leading-4" tone="inverse-muted" variant="support">
                {overview.claimed}
              </Text>
              <Text as="strong" className="text-base leading-5 font-semibold" tone="inverse">
                {values.claimed}
              </Text>
              <Text
                as="span"
                className="leading-4 opacity-70"
                tone="inverse-muted"
                variant="support"
              >
                {values.claimedApprox}
              </Text>
            </div>
            <div className="grid gap-0.5">
              <Text as="span" className="leading-4" tone="inverse-muted" variant="support">
                {overview.contribution}
              </Text>
              <Text as="strong" className="text-base leading-5 font-semibold" tone="inverse">
                {values.contribution}
              </Text>
              <Text
                as="span"
                className="leading-4 opacity-70"
                tone="inverse-muted"
                variant="support"
              >
                {overview.contributionHint}
              </Text>
            </div>
          </div>
        </Card>

        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {/* Figma 持仓/缓冲 110：min-h-27.5 + elevated（禁 h-[110px]） */}
          <Card surface="elevated" className="grid min-h-27.5 gap-1 p-4 shadow-card">
            <Text as="span" className="leading-4 font-medium" variant="support">
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

          <Card surface="elevated" className="grid min-h-27.5 gap-1 p-4 shadow-card">
            <div className="flex items-center justify-between gap-2">
              <Text as="span" className="leading-4 font-medium" variant="support">
                {overview.bufferTitle}
              </Text>
              <button
                aria-label={overview.bufferSwitchAria}
                className="flex items-center gap-1 rounded-full border-0 bg-transparent p-0"
                onClick={() => setBufferAsset((v) => (v === 'agx' ? 'gagx' : 'agx'))}
                type="button"
              >
                <span className="grid size-4 place-items-center overflow-hidden rounded-full border border-border">
                  <DappIcon alt="" className="size-2.5" size="sm" src={dappAssets.exchangeFlip} />
                </span>
                <Text as="span" className="leading-4" tone="muted-foreground" variant="support">
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
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.assets.hub.distribution.title}</DappContentHeading>
        {/*
          Figma 持仓分布/empty：扁平 dashed 空壳（非 elevated）。
          与持仓/缓冲 elevated 刻意不同；勿升为 shadow-card。
        */}
        <div className="flex min-h-27 items-center justify-center rounded-2xl border border-dashed border-border bg-background px-4 py-10">
          <Text
            as="p"
            className="text-center leading-4.5"
            tone="muted-foreground"
            variant="support"
          >
            {t.assets.hub.distribution.empty}
          </Text>
        </div>
      </DappDetailBlock>

      <DappDetailBlock>
        <Text as="h3" className="mb-1.5 font-semibold" variant="headline">
          {rebase.title}
        </Text>
        <Text as="p" className="mb-4" tone="muted-foreground" variant="support">
          {rebase.subtitle}
        </Text>
        {/*
          Figma Rebase/card：珊瑚圆点时间轴 + 四列纯文案（禁嵌套 bg-card 小白卡）+ tags + footer
        */}
        <Card surface="elevated" className="grid gap-1.5 px-4 py-6 shadow-card">
          <div className="relative grid h-2.5 grid-cols-4 items-center">
            <div className="absolute top-1/2 right-[12.5%] left-[12.5%] h-0.5 -translate-y-1/2 bg-border" />
            {rebase.steps.map((step) => (
              <span
                className="relative z-1 flex justify-center"
                key={`dot-${step.title}-${step.body}`}
              >
                <span aria-hidden className="size-2.5 shrink-0 rounded-full bg-primary" />
              </span>
            ))}
          </div>

          <ol className="m-0 grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-2 dapp:grid-cols-4">
            {rebase.steps.map((step) => (
              <li className="min-h-25.5 px-1 pt-4 text-center" key={step.title + step.body}>
                <Text as="p" className="leading-5 font-bold" variant="copy">
                  {step.title}
                </Text>
                <Text
                  as="p"
                  className="mt-1.5 leading-4 whitespace-pre-line"
                  tone="muted-foreground"
                  variant="support"
                >
                  {step.body}
                </Text>
              </li>
            ))}
          </ol>

          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-2xl bg-muted px-6 py-3">
            {rebase.tags.map((tag) => (
              <span className="flex items-center gap-1.5" key={tag}>
                {/* Figma `4285:232` tags：实心珊瑚圆+白勾（禁描边 ic-check） */}
                <DappIcon
                  alt=""
                  className="h-4 w-4.5 shrink-0"
                  size="sm"
                  src={dappAssets.assetsHubCheckBadge}
                />
                <Text as="span" className="leading-4 font-semibold" variant="support">
                  {tag}
                </Text>
              </span>
            ))}
          </div>

          <Text as="p" className="leading-4" tone="muted-foreground" variant="support">
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
