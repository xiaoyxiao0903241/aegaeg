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
        {/* Figma 资产总览/card 116：min-h-29 + 垂直居中（禁 h-[116px] / text-[2rem]） */}
        <Card surface="inverse" className="relative flex min-h-29 items-center overflow-hidden p-4">
          <div className="grid w-full gap-4 sm:grid-cols-2 dapp:grid-cols-4 dapp:gap-6">
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
          {/* Figma 持仓/缓冲 110：min-h-27.5 + p-4（禁 h-[110px]） */}
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
        {/* Figma 持仓分布/empty 108 → min-h-27（禁 min-h-[6.75rem]） */}
        <div className="flex min-h-27 items-center justify-center rounded-2xl border border-dashed border-border bg-card px-4 py-10">
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
        <Text as="h3" className="mb-1 font-semibold" variant="headline">
          {rebase.title}
        </Text>
        <Text as="p" className="mb-4" tone="muted-foreground" variant="detail">
          {rebase.subtitle}
        </Text>
        {/* Figma Rebase/card 237：px-4 py-6 + gap-4；step 文案 leading 合成行高 */}
        <Card surface="elevated" className="grid gap-4 px-4 py-6 shadow-card">
          <ol className="m-0 grid list-none gap-2 p-0 sm:grid-cols-2 dapp:grid-cols-4">
            {rebase.steps.map((step) => (
              <li
                className="min-h-25.5 rounded-2xl bg-card p-3 text-center"
                key={step.title + step.body}
              >
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
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl bg-muted px-4 py-3">
            {rebase.tags.map((tag) => (
              <span className="flex items-center gap-1.5" key={tag}>
                <DappIcon alt="" className="size-4" size="sm" src={dappAssets.check} />
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
