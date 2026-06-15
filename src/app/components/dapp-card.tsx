import type { ReactNode } from 'react'
import {
  dappButtonClass,
  dappCardClass,
  dappResponsive,
  dappSurfaceClass,
  dappTextClass,
} from '../../components/primitive-styles'
import { revealClass } from '~/lib/reveal'
import { cn } from '~/lib/utils'

export function DappSideCard({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={dappSurfaceClass({
        border: true,
        stack: 'header',
        gap: 'sm',
        className: cn(revealClass(), className),
      })}
      data-reveal
    >
      {children}
    </section>
  )
}

export function SideLabel({
  children,
  className,
  tone = 'body',
}: {
  children: ReactNode
  className?: string
  tone?: 'body' | 'coral' | 'muted'
}) {
  const role = tone === 'coral' ? 'kicker' : 'caption'
  return (
    <p className={dappTextClass(role, { tone: tone === 'muted' ? 'muted' : tone, className })}>
      {children}
    </p>
  )
}

export function SideValue({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <strong className={dappTextClass('valueSm', { tone: 'ink', className })}>
      {children}
    </strong>
  )
}

export function SideHint({
  children,
  className,
  tone = 'muted',
}: {
  children: ReactNode
  className?: string
  tone?: 'body' | 'muted'
}) {
  return (
    <small className={dappTextClass('hint', { tone, className })}>
      {children}
    </small>
  )
}

export function SideTitle({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <strong className={dappTextClass('titleSm', { tone: 'ink', className })}>
      {children}
    </strong>
  )
}

export function DappReferrerBoundCard({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={dappSurfaceClass({
        border: true,
        stack: 'between',
        gap: 'md',
        pad: 'uniform',
        className: cn(revealClass(), className),
      })}
      data-reveal
    >
      {children}
    </section>
  )
}

export function MetricCard({
  children,
  className,
  hint,
  label,
  value,
  valueClassName,
}: {
  children?: ReactNode
  className?: string
  hint?: ReactNode
  label: ReactNode
  value: ReactNode
  valueClassName?: string
}) {
  return (
    <article
      className={dappSurfaceClass({
        stack: 'header',
        gap: 'metric',
        shadow: 'card',
        className: cn(revealClass(), dappResponsive.metricCard, className),
      })}
      data-reveal
    >
      <span className={cn(dappTextClass('metricLabel', { tone: 'muted' }))}>
        {label}
      </span>
      <strong className={cn(dappTextClass('valueMd', { tone: 'ink' }), dappResponsive.metricValue, valueClassName)}>
        {value}
      </strong>
      {hint ? (
        <small className={cn(dappTextClass('metricHint', { tone: 'muted' }), dappResponsive.metricHintHidden)}>
          {hint}
        </small>
      ) : null}
      {children}
    </article>
  )
}

export function CommunityStatCard({
  children,
  className,
  dark = false,
  image,
  label,
  today,
  value,
  volume,
}: {
  children?: ReactNode
  className?: string
  dark?: boolean
  image?: string
  label: ReactNode
  today?: ReactNode
  value: ReactNode
  volume?: ReactNode
}) {
  return (
    <article
      className={dappSurfaceClass({
        gap: 'stat',
        radius: 'lg',
        pad: 'stat',
        shadow: 'stat',
        tone: dark ? 'dark' : 'surface',
        className: cn(
          revealClass(),
          'community-stat',
          dark && 'is-dark',
          image && 'relative overflow-visible',
          dappResponsive.communityStatCard,
          className,
        ),
      })}
      data-reveal
    >
      <span
        className={cn(
          dappTextClass('caption', {
            tone: dark ? 'onDark' : 'body',
            className: 'relative z-[1] tracking-[-0.24px]',
          }),
          dappResponsive.communityStatLabel,
          dark && 'text-on-dark group-data-[tab=community]/shell:min-[821px]:text-[13px] group-data-[tab=community]/shell:min-[821px]:tracking-[-0.26px]',
          !dark && 'group-data-[tab=community]/shell:max-[820px]:text-faint',
        )}
      >
        {label}
      </span>
      <strong
        className={cn(
          dappTextClass('valueStat', { tone: dark ? 'inverse' : 'ink', className: 'relative z-[1]' }),
          dappResponsive.communityStatValue,
        )}
      >
        {value}
      </strong>
      {volume ? (
        <b
          className={cn(
            dappTextClass('valueAccent', { tone: dark ? 'coralBright' : 'coral', className: 'relative z-[1]' }),
            dappResponsive.communityStatVolume,
          )}
        >
          {volume}
        </b>
      ) : null}
      {today ? (
        <small
          className={cn(
            dappTextClass('hintStat', {
              tone: dark ? 'onDark' : 'muted',
              className: 'relative z-[1]',
            }),
            dappResponsive.communityStatHint,
          )}
        >
          {today}
        </small>
      ) : null}
      {children}
      {image ? (
        <img
          alt=""
          className="pointer-events-none absolute -bottom-6 -right-2.5 z-[1] h-auto w-[clamp(88px,8vw,110px)]"
          height="156"
          loading="lazy"
          src={image}
          width="104"
        />
      ) : null}
    </article>
  )
}

export function ProgramCard({
  action,
  body,
  className,
  label,
  onAction,
  title,
}: {
  action: string
  body: ReactNode
  className?: string
  label: string
  onAction: () => void
  title: ReactNode
}) {
  return (
    <article
      className={dappSurfaceClass({
        gap: 'sm',
        pad: 'program',
        shadow: 'card',
        className: cn(revealClass(), dappResponsive.programCard, className),
      })}
      data-reveal
    >
      <span className={dappTextClass('kicker', { tone: 'coral' })}>{label}</span>
      <h4 className={cn(dappTextClass('titleMd', { tone: 'ink', className: 'text-base tracking-[-0.48px]' }), dappResponsive.programTitle)}>
        {title}
      </h4>
      <p className={cn(dappTextClass('body', { tone: 'body', className: 'max-w-[38ch] tracking-[-0.26px]' }), 'max-[820px]:hidden')}>
        {body}
      </p>
      <button
        className={dappButtonClass('link', 'text', 'mt-2 tracking-[-0.26px]')}
        onClick={onAction}
        type="button"
      >
        {action}
      </button>
    </article>
  )
}

export function RewardBalanceCard({
  action,
  badge,
  className,
  hint,
  label,
  meta,
  value,
}: {
  action?: ReactNode
  badge?: ReactNode
  className?: string
  hint?: ReactNode
  label: ReactNode
  meta?: ReactNode
  value: ReactNode
}) {
  return (
    <article
      className={dappSurfaceClass({
        border: true,
        stack: 'header',
        className: cn(revealClass(), className),
      })}
      data-reveal
    >
      <div className="flex items-center justify-between gap-3">
        <p className={dappTextClass('caption', { tone: 'body' })}>{label}</p>
        {meta ? (
          <span className={dappTextClass('caption', { tone: 'muted' })}>{meta}</span>
        ) : (
          <em className={dappTextClass('rewardBadge', { tone: 'up' })}>{badge}</em>
        )}
      </div>
      <strong className={dappTextClass('valueLg', { tone: 'ink' })}>{value}</strong>
      {hint ? (
        <small className={cn(dappTextClass('rewardHint', { tone: 'muted' }), dappResponsive.rewardBalanceHint)}>
          {hint}
        </small>
      ) : null}
      {action}
    </article>
  )
}
