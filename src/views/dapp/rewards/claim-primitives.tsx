/**
 * 奖励领取界面 UI 零件（域附属，非 mode mega-primitives）。
 */
import { ChevronDown } from 'lucide-react'
import { type ReactNode } from 'react'

import { dappAssets } from '~/shared/assets/dapp'
import { Card } from '~/shared/components/card'
import { Icon } from '~/shared/components/icon'
import { Reveal } from '~/shared/components/reveal'
import { Text } from '~/shared/components/text'
import { COMMUNITY_SOCIAL_LINKS } from '~/shared/config/community-links'
import { cn } from '~/shared/lib/utils'

/**
 * gAGX 图标 + 数值 / 标签行（领取控件共用）
 *
 * @param children 数值或标签内容
 * @param textVariant 文字样式
 */
export function RewardsGagxAmount({
  children,
  textVariant = 'copy',
}: {
  children: ReactNode
  textVariant?: 'copy' | 'headline'
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon
        alt=""
        className="size-(--app-icon-lg) rounded-full"
        loading="lazy"
        size="token"
        src={dappAssets.tokenGagx}
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
 */
export function RewardsClaimTokenRow({
  tokenLabel,
  amountText,
}: {
  tokenLabel: string
  amountText: string
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="inline-flex h-8.5 items-center gap-2 rounded-full bg-card pr-3.5 pl-2">
        <Icon
          alt=""
          className="size-6 rounded-2xl"
          loading="lazy"
          size="token"
          src={dappAssets.tokenGagx}
        />
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
  restake: 'border-success/35 bg-success-soft',
}

const titleTone: Record<DestinationTone, 'primary' | 'success'> = {
  release: 'primary',
  restake: 'success',
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

/** 发展津贴：待审批金额卡 */
export function GrantPendingCard({
  contactSupport,
  pendingAmount,
  pendingBody,
  pendingHint,
  pendingLabel,
  tokenGagx,
}: {
  contactSupport: string
  pendingAmount: string
  pendingBody: string
  pendingHint: string
  pendingLabel: string
  tokenGagx: string
}) {
  return (
    <Card surface="outlined">
      <div className="flex items-start justify-between gap-3">
        <Text as="p" className="leading-4 text-foreground/40" variant="copy">
          {pendingLabel}
        </Text>
        <Text as="p" className="max-w-40 text-right leading-4 text-foreground/40" variant="copy">
          {pendingHint}
        </Text>
      </div>
      <div className="mt-1.5 flex items-center justify-between gap-3">
        <RewardsGagxAmount textVariant="copy">{tokenGagx}</RewardsGagxAmount>
        <Text as="p" className="text-2xl leading-none font-semibold" variant="headline">
          {pendingAmount}
        </Text>
      </div>
      <div className="mt-1.5 grid gap-1">
        <a
          className="inline-flex w-fit items-center gap-1 font-medium text-coral-emphasis underline"
          href={COMMUNITY_SOCIAL_LINKS.telegram}
          rel="noreferrer"
          target="_blank"
        >
          <Text as="span" className="font-medium text-coral-emphasis" variant="copy">
            {contactSupport}
          </Text>
          <img alt="" aria-hidden className="size-2.5 shrink-0" src={dappAssets.arrowUpRight} />
        </a>
        <Text as="p" className="leading-none text-foreground/40" variant="copy">
          {pendingBody}
        </Text>
      </div>
    </Card>
  )
}

/** 待审批卡与可领卡之间的静态分隔 */
export function ClaimStackDivider() {
  return (
    <div className="flex items-center justify-center">
      <span className="inline-flex size-8.5 items-center justify-center rounded-control border border-border bg-card shadow-sm">
        <ChevronDown aria-hidden className="size-2.5 text-foreground/40" strokeWidth={1.5} />
      </span>
    </div>
  )
}

/** 简单领取：可领至钱包的强调卡 */
export function SimpleClaimableCard({
  amountText,
  children,
  claimIntoWallet,
  claimableLabel,
  showTokenChip,
  tokenGagx,
  usdLabel,
}: {
  amountText: string
  children?: ReactNode
  claimIntoWallet: string
  claimableLabel: string
  showTokenChip: boolean
  tokenGagx: string
  usdLabel: string
}) {
  return (
    <div className="grid gap-2 rounded-2xl border border-primary/35 bg-accent p-4">
      <div className="flex items-center justify-between gap-2">
        <Text as="span" className="leading-5 text-foreground" variant="copy">
          {claimableLabel}
        </Text>
        <Text as="span" className="leading-4 text-foreground/40" variant="copy">
          {claimIntoWallet}
        </Text>
      </div>
      {showTokenChip ? (
        <RewardsClaimTokenRow amountText={amountText} tokenLabel={tokenGagx} />
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
          <Text as="p" className="leading-4 text-foreground/40" variant="copy">
            {claimableLabel}
          </Text>
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

/** 贡献不足提醒条（可缓动显隐） */
export function ContributionShortBanner({
  open = true,
  children,
}: {
  open?: boolean
  children: ReactNode
}) {
  return (
    <Reveal open={open}>
      <div className="rounded-2xl bg-accent px-4 py-3">{children}</div>
    </Reveal>
  )
}
