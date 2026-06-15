import type { ReactNode } from 'react'
import {
  dappButtonClass,
  dappCardClass,
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
      className={dappCardClass('side', { className: cn(revealClass(), className) })}
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
  const variant = tone === 'coral' ? 'sideKicker' : 'sideLabel'
  return (
    <p className={dappTextClass(variant, { tone: tone === 'muted' ? 'muted' : tone, className })}>
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
    <strong className={dappTextClass('sideValue', { tone: 'ink', className })}>
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
    <small className={dappTextClass('sideHint', { tone, className })}>
      {children}
    </small>
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
      className={dappCardClass('metric', {
        className: cn(
          revealClass(),
          'group-data-[tab=swap]/shell:group-data-[connected=true]/shell:max-[820px]:rounded-[14px] group-data-[tab=swap]/shell:group-data-[connected=true]/shell:max-[820px]:p-3.5',
          'group-data-[tab=genesis]/shell:min-h-0 group-data-[tab=genesis]/shell:rounded-xl group-data-[tab=genesis]/shell:p-3.5 group-data-[tab=genesis]/shell:max-[820px]:min-h-[70px]',
          className,
        ),
      })}
      data-reveal
    >
      <span
        className={cn(
          dappTextClass('metricLabel', { tone: 'body' }),
          'text-faint group-data-[tab=swap]/shell:min-[821px]:font-medium',
        )}
      >
        {label}
      </span>
      <strong
        className={cn(
          dappTextClass('metricValue', { tone: 'ink' }),
          'group-data-[tab=swap]/shell:min-[821px]:text-lg group-data-[tab=swap]/shell:min-[821px]:leading-[1.2]',
          'group-data-[tab=swap]/shell:group-data-[connected=true]/shell:max-[820px]:mt-1.5 group-data-[tab=swap]/shell:group-data-[connected=true]/shell:max-[820px]:text-[13px] group-data-[tab=swap]/shell:group-data-[connected=true]/shell:max-[820px]:leading-[1.2]',
          'group-data-[tab=genesis]/shell:mt-[5px] group-data-[tab=genesis]/shell:text-base group-data-[tab=genesis]/shell:leading-[1.3] group-data-[tab=genesis]/shell:max-[820px]:text-[15px] group-data-[tab=genesis]/shell:max-[820px]:leading-[1.2]',
          valueClassName,
        )}
      >
        {value}
      </strong>
      {hint ? (
        <small
          className={cn(
            dappTextClass('metricHint', { tone: 'muted' }),
            'group-data-[tab=swap]/shell:group-data-[connected=false]/shell:py-3.5 group-data-[tab=swap]/shell:group-data-[connected=false]/shell:max-[820px]:hidden',
            'group-data-[tab=swap]/shell:group-data-[connected=true]/shell:max-[820px]:hidden',
            'group-data-[tab=genesis]/shell:max-[820px]:hidden',
          )}
        >
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
      className={dappCardClass('communityStat', {
        tone: dark ? 'dark' : 'surface',
        className: cn(
          revealClass(),
          dark && 'is-dark',
          image && 'relative overflow-visible',
          'group-data-[tab=community]/shell:min-h-[70px] group-data-[tab=community]/shell:rounded-xl group-data-[tab=community]/shell:p-3.5',
          'group-data-[tab=community]/shell:group-data-[connected=true]/shell:min-h-[90px] group-data-[tab=community]/shell:group-data-[connected=true]/shell:border-0 group-data-[tab=community]/shell:group-data-[connected=true]/shell:shadow-card group-data-[tab=community]/shell:group-data-[connected=true]/shell:p-[13px_12px]',
          'group-data-[tab=community]/shell:max-[820px]:items-center group-data-[tab=community]/shell:max-[820px]:text-center',
          'group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:items-start group-data-[tab=community]/shell:group-data-[connected=true]/shell:max-[820px]:text-left',
          className,
        ),
      })}
      data-reveal
    >
      <span
        className={cn(
          dappTextClass('communityLabel', { tone: dark ? 'onDark' : 'body' }),
          'relative z-[1] group-data-[tab=community]/shell:text-xs group-data-[tab=community]/shell:leading-[1.35]',
          !dark && 'group-data-[tab=community]/shell:text-faint',
          'group-data-[tab=community]/shell:group-data-[connected=true]/shell:w-full group-data-[tab=community]/shell:group-data-[connected=true]/shell:text-[11px] group-data-[tab=community]/shell:group-data-[connected=true]/shell:leading-normal',
          dark &&
            'text-on-dark group-data-[tab=community]/shell:text-[13px] group-data-[tab=community]/shell:group-data-[connected=true]/shell:text-on-dark',
        )}
      >
        {label}
      </span>
      <strong
        className={cn(
          dappTextClass('communityValue', { tone: dark ? 'inverse' : 'ink' }),
          'relative z-[1] tracking-[-1.2px] group-data-[tab=community]/shell:mt-[3px] group-data-[tab=community]/shell:text-2xl group-data-[tab=community]/shell:leading-[1.05]',
          'group-data-[tab=community]/shell:group-data-[connected=true]/shell:w-full group-data-[tab=community]/shell:group-data-[connected=true]/shell:mt-1 group-data-[tab=community]/shell:group-data-[connected=true]/shell:text-2xl',
        )}
      >
        {value}
      </strong>
      {volume ? (
        <b
          className={cn(
            dappTextClass('communityVolume', { tone: dark ? 'coralBright' : 'coral' }),
            'relative z-[1] group-data-[tab=community]/shell:hidden group-data-[tab=community]/shell:group-data-[connected=true]/shell:block group-data-[tab=community]/shell:group-data-[connected=true]/shell:w-full group-data-[tab=community]/shell:group-data-[connected=true]/shell:mt-1 group-data-[tab=community]/shell:group-data-[connected=true]/shell:text-[11px] group-data-[tab=community]/shell:group-data-[connected=true]/shell:leading-[1.2]',
          )}
        >
          {volume}
        </b>
      ) : null}
      {today ? (
        <small
          className={cn(
            dappTextClass('communityHint', { tone: dark ? 'onDark' : 'muted' }),
            'relative z-[1] group-data-[tab=community]/shell:hidden',
            dark
              ? 'group-data-[tab=community]/shell:group-data-[connected=true]/shell:block group-data-[tab=community]/shell:group-data-[connected=true]/shell:w-full group-data-[tab=community]/shell:group-data-[connected=true]/shell:mt-1 group-data-[tab=community]/shell:group-data-[connected=true]/shell:text-[11px] group-data-[tab=community]/shell:group-data-[connected=true]/shell:leading-[1.2] group-data-[tab=community]/shell:group-data-[connected=true]/shell:text-on-dark'
              : 'group-data-[tab=community]/shell:group-data-[connected=true]/shell:block group-data-[tab=community]/shell:group-data-[connected=true]/shell:w-full group-data-[tab=community]/shell:group-data-[connected=true]/shell:mt-1 group-data-[tab=community]/shell:group-data-[connected=true]/shell:text-[11px] group-data-[tab=community]/shell:group-data-[connected=true]/shell:leading-[1.2]',
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
      className={dappCardClass('program', {
        className: cn(
          revealClass(),
          'max-[820px]:rounded-[14px] max-[820px]:p-4 group-data-[tab=community]/shell:max-[820px]:gap-1.5 group-data-[tab=community]/shell:max-[820px]:py-3',
          className,
        ),
      })}
      data-reveal
    >
      <span className={dappTextClass('programKicker', { tone: 'coral' })}>{label}</span>
      <h4
        className={cn(
          dappTextClass('programTitle', { tone: 'ink' }),
          'tracking-[-0.48px] max-[820px]:mt-1.5 max-[820px]:mb-0 max-[820px]:text-sm group-data-[tab=community]/shell:max-[820px]:leading-[1.2]',
        )}
      >
        {title}
      </h4>
      <p
        className={cn(
          dappTextClass('programBody', { tone: 'body' }),
          'tracking-[-0.26px] max-[820px]:hidden',
        )}
      >
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
      className={dappCardClass('rewardBalance', { className: cn(revealClass(), className) })}
      data-reveal
    >
      <div className="flex items-center justify-between gap-3">
        <p className={dappTextClass('rewardBalanceLabel', { tone: 'body' })}>{label}</p>
        {meta ? (
          <span className={dappTextClass('rewardBalanceLabel', { tone: 'muted' })}>{meta}</span>
        ) : (
          <em className={dappTextClass('rewardBalanceBadge', { tone: 'up' })}>{badge}</em>
        )}
      </div>
      <strong className={dappTextClass('rewardBalanceValue', { tone: 'ink' })}>{value}</strong>
      {hint ? (
        <small
          className={cn(
            dappTextClass('rewardBalanceHint', { tone: 'muted' }),
            'group-data-[tab=rewards]/shell:max-[820px]:hidden',
          )}
        >
          {hint}
        </small>
      ) : null}
      {action}
    </article>
  )
}
