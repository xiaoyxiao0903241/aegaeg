/**
 * 奖励去向计划卡（组合式）
 *
 * 领取（入释放池）与复投（入单币质押）同构：标题行、代币金额、周期下拉。
 */
import { type ReactNode } from 'react'

import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'
import { RewardsClaimTokenRow } from '~/views/dapp/rewards/claim-token-row'

type DestinationTone = 'release' | 'restake'

const toneClass: Record<DestinationTone, string> = {
  release: 'border-primary/35 bg-primary-soft',
  restake: 'border-success/35 bg-success-soft',
}

const titleTone: Record<DestinationTone, 'primary' | 'success'> = {
  release: 'primary',
  restake: 'success',
}

function Root({ children, tone }: { children: ReactNode; tone: DestinationTone }) {
  return <div className={cn('grid gap-2 rounded-2xl border p-4', toneClass[tone])}>{children}</div>
}

function Header({
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

function Amount({ amountText, tokenLabel }: { amountText: string; tokenLabel: string }) {
  return <RewardsClaimTokenRow amountText={amountText} tokenLabel={tokenLabel} />
}

function Period({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <Text as="span" className="leading-4 text-foreground/40" variant="copy">
        {label}
      </Text>
      {children}
    </div>
  )
}

export const RewardsDestinationCard = Object.assign(Root, {
  Header,
  Amount,
  Period,
})
