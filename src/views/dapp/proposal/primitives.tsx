/**
 * 提案页袋零件：状态徽标、进度条、列表卡、机制卡。
 */
import type { ReactNode } from 'react'

import {
  PROPOSAL_STATE,
  type ProposalClaimKind,
  type ProposalLockKind,
  type ProposalStateValue,
  type VoteSupportValue,
} from '~/core/proposal/proposal-state'
import { Card } from '~/shared/components/card'
import { Skeleton } from '~/shared/components/skeleton'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

export { proposalStateKey } from '~/core/proposal/proposal-state'

const chipClass = 'inline-flex items-center rounded-full px-2.25 py-0.5 font-semibold'

function proposalChipTone(state: ProposalStateValue | null): string {
  switch (state) {
    case PROPOSAL_STATE.active:
      return 'bg-accent text-primary'
    case PROPOSAL_STATE.pending:
      return 'bg-caution-soft text-caution'
    case PROPOSAL_STATE.succeeded:
    case PROPOSAL_STATE.executed:
      return 'bg-claim-soft text-claim'
    default:
      return 'bg-muted text-foreground/45'
  }
}

export function ProposalStateBadge({
  children,
  state,
}: {
  children: ReactNode
  state: ProposalStateValue | null
}) {
  return (
    <Text as="span" className={cn(chipClass, proposalChipTone(state))} variant="support">
      {children}
    </Text>
  )
}

export function ProposalVotedBadge({ children }: { children: ReactNode }) {
  return (
    <Text as="span" className={cn(chipClass, 'bg-muted text-foreground/50')} variant="support">
      {children}
    </Text>
  )
}

export function ProposalSupportBadge({
  children,
  support,
}: {
  children: ReactNode
  support: VoteSupportValue | null
}) {
  const forVote = support === 1
  return (
    <Text
      as="span"
      className={cn(chipClass, forVote ? 'bg-accent text-primary' : 'bg-claim-soft text-claim')}
      variant="support"
    >
      {children}
    </Text>
  )
}

function statusCopyTone(live: boolean): string {
  return live ? 'font-semibold text-primary' : 'text-foreground/45'
}

/** 锁定列文案色：锁定中珊瑚色，其余弱化。 */
export function ProposalLockCopy({ children, kind }: { children: string; kind: ProposalLockKind }) {
  return (
    <Text as="span" className={statusCopyTone(kind === 'locked')} variant="copy">
      {children}
    </Text>
  )
}

/** 奖励状态文案色：进行中珊瑚色，其余弱化。 */
export function ProposalClaimCopy({
  children,
  kind,
}: {
  children: string
  kind: ProposalClaimKind
}) {
  return (
    <Text as="span" className={statusCopyTone(kind === 'in_progress')} variant="copy">
      {children}
    </Text>
  )
}

export function VoteShareBar({
  label,
  amount,
  percent,
  tone,
}: {
  label: string
  amount: string
  percent: number
  tone: 'for' | 'against'
}) {
  return (
    <div className="grid gap-1.5">
      <div className="flex items-baseline justify-between gap-2.5">
        <Text
          as="span"
          className={tone === 'for' ? 'font-semibold text-primary' : 'font-semibold text-claim'}
          variant="copy"
        >
          {label}
        </Text>
        <Text as="span" className="text-foreground/50 tabular-nums" variant="copy">
          <Text as="b" className="font-semibold text-foreground" variant="copy">
            {amount}
          </Text>
          {` · ${percent}%`}
        </Text>
      </div>
      <span className="block h-2 overflow-hidden rounded-full bg-muted">
        <span
          className={cn(
            'block h-full rounded-full transition-[width] duration-300',
            tone === 'for' ? 'bg-primary' : 'bg-claim',
          )}
          style={{ width: `${percent}%` }}
        />
      </span>
    </div>
  )
}

export function ProposalCodeLabel({ children }: { children: string }) {
  return (
    <Text as="span" className="text-foreground/40" variant="eyebrow">
      {children}
    </Text>
  )
}

/** 左栏列表加载：对齐描边卡 chrome，不用整块脉冲矩形。 */
export function ProposalListCardSkeleton() {
  return (
    <Card aria-busy aria-hidden className="grid gap-2 p-4">
      <div className="flex items-center justify-between gap-2.5">
        <Skeleton className="h-3 w-14" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-3 w-2/3" />
    </Card>
  )
}

export function ProposalListCard({
  code,
  meta,
  onOpen,
  stateBadge,
  title,
  votedBadge,
}: {
  code: string
  meta: string
  onOpen: () => void
  stateBadge: ReactNode
  title: string | null
  votedBadge: ReactNode
}) {
  return (
    <Card
      as="button"
      className="grid cursor-pointer gap-2 p-4 text-left transition-[border-color,transform] duration-180 hover:-translate-y-px"
      onClick={onOpen}
      type="button"
    >
      <div className="flex items-center justify-between gap-2.5">
        <ProposalCodeLabel>{code}</ProposalCodeLabel>
        <span className="inline-flex items-center gap-1.5">
          {votedBadge}
          {stateBadge}
        </span>
      </div>
      <Text as="strong" className="font-semibold text-pretty" variant="copy">
        {title ?? code}
      </Text>
      <Text as="span" className="text-foreground/40 tabular-nums" variant="caption">
        {meta}
      </Text>
    </Card>
  )
}

export function MechanismCard({ body, title }: { body: string; title: string }) {
  return (
    <Card className="grid content-start gap-2 p-4.5" surface="elevated">
      <Text as="strong" className="font-semibold" variant="detail">
        {title}
      </Text>
      <Text as="p" className="m-0 text-pretty text-foreground/55" variant="copy">
        {body}
      </Text>
    </Card>
  )
}

/** 详情底栏说明：已投票用珊瑚底，关闭态用灰底。 */
export function ProposalNotice({
  children,
  tone,
}: {
  children: ReactNode
  tone: 'voted' | 'closed'
}) {
  return (
    <Text
      as="p"
      className={cn(
        'm-0 rounded-chip px-3.25 py-2.5 font-semibold',
        tone === 'voted' ? 'bg-accent text-primary' : 'bg-muted text-foreground/55',
      )}
      variant="copy"
    >
      {children}
    </Text>
  )
}
