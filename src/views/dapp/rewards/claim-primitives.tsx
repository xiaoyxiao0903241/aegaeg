/**
 * 奖励领取界面 UI 零件（域附属，非 mode mega-primitives）。
 */
import { type ReactNode } from 'react'

import { dappAssets } from '~/shared/assets/dapp'
import { Card } from '~/shared/components/card'
import { Icon } from '~/shared/components/icon'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

/**
 * 代币图标 + 数值 / 标签行（领取控件共用）
 *
 * 默认 gAGX 图；发展津贴传入 AGX 图。
 *
 * @param children 数值或标签内容
 * @param iconSrc 代币图标；缺省为 gAGX
 * @param textVariant 文字样式
 */
export function RewardsGagxAmount({
  children,
  iconSrc = dappAssets.tokenGagx,
  textVariant = 'copy',
}: {
  children: ReactNode
  iconSrc?: string
  textVariant?: 'copy' | 'headline'
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon
        alt=""
        className="size-(--app-icon-lg) rounded-full"
        loading="lazy"
        size="token"
        src={iconSrc}
      />
      <Text as="p" className="font-semibold" variant={textVariant}>
        {children}
      </Text>
    </div>
  )
}

/**
 * 领取界面上的代币胶囊 + 金额行
 *
 * 用于混合领取的释放 / 复投金额，以及简单领取的可领金额。
 *
 * @param tokenLabel 代币名称
 * @param amountText 金额文本
 * @param iconSrc 代币图标；缺省为 gAGX
 */
export function RewardsClaimTokenRow({
  tokenLabel,
  amountText,
  iconSrc = dappAssets.tokenGagx,
}: {
  tokenLabel: string
  amountText: string
  iconSrc?: string
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="inline-flex h-8.5 items-center gap-2 rounded-full bg-card pr-3.5 pl-2">
        <Icon alt="" className="size-6 rounded-2xl" loading="lazy" size="token" src={iconSrc} />
        <Text as="span" className="leading-4 font-semibold" variant="detail">
          {tokenLabel}
        </Text>
      </span>
      <Text as="span" className="text-2xl leading-none font-semibold" variant="headline">
        {amountText}
      </Text>
    </div>
  )
}

/**
 * 奖励去向计划卡（组合组件）
 *
 * 领取（入释放池）与复投（入单币质押）同构：标题行、代币金额、周期下拉。
 */
type DestinationTone = 'release' | 'restake'

const toneClass: Record<DestinationTone, string> = {
  release: 'border-primary/35 bg-accent',
  restake: 'border-claim/35 bg-claim/12',
}

const titleTone: Record<DestinationTone, 'primary' | 'claim'> = {
  release: 'primary',
  restake: 'claim',
}

function DestinationRoot({ children, tone }: { children: ReactNode; tone: DestinationTone }) {
  return <div className={cn('grid gap-2 rounded-2xl border p-4', toneClass[tone])}>{children}</div>
}

function DestinationHeader({
  title,
  trailing,
  tone,
}: {
  title: string
  trailing: string
  tone: DestinationTone
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <Text as="span" className="leading-5 font-normal" tone={titleTone[tone]} variant="headline">
        {title}
      </Text>
      <Text as="span" className="leading-4 text-foreground/40" variant="copy">
        {trailing}
      </Text>
    </div>
  )
}

function DestinationAmount({ amountText, tokenLabel }: { amountText: string; tokenLabel: string }) {
  return <RewardsClaimTokenRow amountText={amountText} tokenLabel={tokenLabel} />
}

function DestinationPeriod({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <Text as="span" className="leading-4 text-foreground/40" variant="copy">
        {label}
      </Text>
      {children}
    </div>
  )
}

export const RewardsDestinationCard = Object.assign(DestinationRoot, {
  Header: DestinationHeader,
  Amount: DestinationAmount,
  Period: DestinationPeriod,
})

/** 简单领取：可领至钱包的强调卡 */
export function SimpleClaimableCard({
  amountText,
  children,
  claimIntoWallet,
  claimableLabel,
  showTokenChip,
  tokenGagx,
  tokenIcon,
  usdLabel,
}: {
  amountText: string
  children?: ReactNode
  claimIntoWallet: string
  claimableLabel: string
  showTokenChip: boolean
  tokenGagx: string
  tokenIcon: string
  usdLabel: string
}) {
  return (
    <div className="grid gap-2 rounded-2xl border border-primary/35 bg-accent p-4">
      <div className="flex items-center justify-between gap-2">
        {claimableLabel ? (
          <Text as="span" className="leading-5 text-foreground" variant="copy">
            {claimableLabel}
          </Text>
        ) : (
          <span />
        )}
        <Text as="span" className="leading-4 text-foreground/40" variant="copy">
          {claimIntoWallet}
        </Text>
      </div>
      {showTokenChip ? (
        <RewardsClaimTokenRow amountText={amountText} iconSrc={tokenIcon} tokenLabel={tokenGagx} />
      ) : (
        <div className="flex items-center justify-between gap-2">
          <Text as="span" className="font-semibold" variant="detail">
            {usdLabel}
          </Text>
          <Text as="span" className="text-2xl font-semibold" variant="headline">
            {amountText}
          </Text>
        </div>
      )}
      {children}
    </div>
  )
}

/** 混合领取：可领额 + 所需贡献摘要卡 */
export function MixedClaimSummaryCard({
  amountKnown,
  amountText,
  claimableLabel,
  requiredContributionLabel,
  requiredText,
  tokenGagx,
}: {
  amountKnown: boolean
  amountText: string
  claimableLabel: string
  requiredContributionLabel: string
  requiredText: string
  tokenGagx: string
}) {
  return (
    <Card surface="outlined">
      <div className="flex items-start justify-between gap-3">
        <div className="grid gap-1">
          {claimableLabel ? (
            <Text as="p" className="leading-4 text-foreground/40" variant="copy">
              {claimableLabel}
            </Text>
          ) : null}
          <RewardsGagxAmount textVariant="headline">
            {amountKnown ? `${amountText} ${tokenGagx}` : amountText}
          </RewardsGagxAmount>
        </div>
        <div className="grid gap-1.5 text-right">
          <Text as="p" className="leading-4 text-foreground/40" variant="copy">
            {requiredContributionLabel}
          </Text>
          <Text as="p" className="leading-5 font-semibold" variant="headline">
            {requiredText}
          </Text>
        </div>
      </div>
    </Card>
  )
}
