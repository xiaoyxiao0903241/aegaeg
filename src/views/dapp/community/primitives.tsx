/**
 * 社区页袋 UI 零件（左栏绑定卡 + 右栏统计/邀请/推广）。
 */
import { Loader2, Wallet } from 'lucide-react'
import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'

import { dappAssets } from '~/shared/assets/dapp'
import { Card } from '~/shared/components/card'
import { FieldActionChip } from '~/shared/components/chip'
import { ExplorerLink } from '~/shared/components/explorer-link'
import { Icon, iconVariants } from '~/shared/components/icon'
import { Input } from '~/shared/components/input'
import { MainButton } from '~/shared/components/main-button'
import { Steps } from '~/shared/components/steps'
import { Text } from '~/shared/components/text'
import { cn, navigableHref, revealClass } from '~/shared/lib/utils'

/** 社区数据卡在 H5 下共用的容器样式。 */
export const communityStatCardMobileFrame = tv({
  base: cn(
    'max-dapp:items-start max-dapp:rounded-md max-dapp:border-0',
    'max-dapp:p-(--dapp-community-stat-padding) max-dapp:text-left max-dapp:shadow-card',
  ),
})

export function CommunityInviteCard({
  steps,
}: {
  steps: ReadonlyArray<{ title: string; body: ReactNode }>
}) {
  return (
    <div data-slot-id="community-invite-steps">
      <Card className="rounded-2xl p-4" surface="elevated">
        <Steps align="start">
          {steps.map((step) => (
            <Steps.Item
              body={step.body}
              key={String(step.title)}
              title={step.title}
              className="pr-9"
            />
          ))}
        </Steps>
      </Card>
    </div>
  )
}

const communityProgramCard = tv({
  slots: {
    root: cn(
      revealClass(),
      'relative flex w-full min-w-0 flex-col gap-2 overflow-clip rounded-2xl p-5',
    ),
    action: cn(
      'm-0 cursor-pointer border-0 bg-transparent p-0 text-left font-semibold text-coral no-underline',
      'duration-dapp-fast transition-opacity ease-out hover:opacity-80',
    ),
  },
})

export function CommunityProgramCard({
  action,
  body,
  className,
  href = '',
  label,
  title,
}: {
  action: string
  body: ReactNode
  className?: string
  href?: string
  label: string
  title: ReactNode
}) {
  const styles = communityProgramCard()
  const safeHref = navigableHref(href)

  const actionNode = (
    <Text as="span" className="font-semibold text-coral" variant="copy">
      {action}
    </Text>
  )

  return (
    <Card as="article" className={cn(styles.root(), className)} data-reveal surface="elevated">
      <Text as="span" className="m-0 text-coral" variant="eyebrow">
        {label}
      </Text>
      <Text as="h3" className="m-0 font-semibold" tone="foreground" variant="headline">
        {title}
      </Text>
      <Text as="p" className="m-0" tone="muted-foreground" variant="copy">
        {body}
      </Text>
      {safeHref ? (
        <a className={styles.action()} href={safeHref} rel="noopener noreferrer" target="_blank">
          {actionNode}
        </a>
      ) : (
        <button className={styles.action()} type="button">
          {actionNode}
        </button>
      )}
    </Card>
  )
}

const communityStatCard = tv({
  slots: {
    root: cn(
      revealClass(),
      'community-stat relative flex flex-col items-start gap-1 rounded-2xl p-4',
      communityStatCardMobileFrame(),
    ),
    label: cn('relative z-1', 'max-dapp:w-full'),
    value: cn('relative z-1', 'max-dapp:mt-1 max-dapp:w-full'),
    volume: cn('relative z-1', 'max-dapp:mt-1 max-dapp:block max-dapp:w-full'),
    note: cn('relative z-1', 'max-dapp:mt-1 max-dapp:block max-dapp:w-full'),
  },
  variants: {
    dark: {
      true: {
        root: 'is-dark border-0 shadow-none',
      },
      false: {},
    },
    withImage: {
      true: { root: 'overflow-visible max-dapp:overflow-clip' },
      false: { root: 'overflow-clip' },
    },
  },
  defaultVariants: {
    dark: false,
    withImage: false,
  },
})

export function CommunityStatCard({
  children,
  className,
  dark = false,
  image,
  label,
  note,
  value,
  volume,
}: {
  children?: ReactNode
  className?: string
  dark?: boolean
  image?: string
  label: ReactNode
  note?: ReactNode
  value: ReactNode
  volume?: ReactNode
}) {
  const styles = communityStatCard({
    dark,
    withImage: Boolean(image),
  })

  return (
    <Card
      as="article"
      className={cn(styles.root(), className)}
      data-reveal
      surface={dark ? 'inverse' : 'elevated'}
    >
      <Text
        as="span"
        className={cn(styles.label(), !dark && 'text-foreground/70')}
        tone={dark ? 'inverse-muted' : undefined}
        variant="support"
      >
        {label}
      </Text>
      <Text
        as="strong"
        className={cn(styles.value(), 'text-2xl/7 font-semibold tracking-tight')}
        tone={dark ? 'inverse' : 'foreground'}
        variant="figure"
      >
        {value}
      </Text>
      {volume ? (
        <Text
          as="b"
          className={cn(styles.volume(), 'text-sm/tight font-medium', !dark && 'text-primary')}
          tone={dark ? 'primary-bright' : undefined}
          variant="support"
        >
          {volume}
        </Text>
      ) : null}
      {note ? (
        <Text
          as="small"
          className={cn(styles.note(), !dark && 'text-foreground/40')}
          tone={dark ? 'inverse-muted' : undefined}
          variant="caption"
        >
          {note}
        </Text>
      ) : null}
      {children}
      {image ? (
        // 站立角色脚贴卡片底边；H5 不展示
        <img
          alt=""
          className="pointer-events-none absolute -right-3.5 bottom-0 z-2 h-full w-30 object-contain object-bottom max-dapp:hidden"
          data-slot-id="community-stat-rank-deco"
          src={image}
        />
      ) : null}
    </Card>
  )
}

const communityReferrerBindGrid = tv({
  base: 'flex gap-2',
})

const communityReferrerAddressRow = tv({
  base: 'flex w-full items-center',
})

const communityReferrerAvatar = tv({
  base: 'grid size-6 flex-none place-items-center rounded-full bg-accent text-primary',
})

const communityCopyButton = tv({
  base: 'ml-auto grid size-7.5 shrink-0 cursor-pointer place-items-center rounded-sm bg-background',
})

export function CommunityReferralLinkCard({
  copyLabel,
  disabled = false,
  linkLabel,
  onCopy,
  referralLink,
}: {
  copyLabel: string
  disabled?: boolean
  linkLabel: string
  onCopy: () => void
  referralLink: string
}) {
  return (
    <Card
      as="section"
      surface="outlined"
      className={cn(revealClass(), 'flex flex-col gap-2 rounded-2xl px-4 py-3.5')}
      data-reveal
    >
      <Text as="p" className="m-0 leading-4 text-foreground/40" variant="support">
        {linkLabel}
      </Text>
      <Text
        as="strong"
        className="block max-w-full truncate text-sm/4 font-semibold tracking-tight"
        tone="foreground"
        variant="copy"
      >
        {referralLink}
      </Text>
      <MainButton density="inverse" disabled={disabled} onClick={onCopy}>
        {copyLabel}
      </MainButton>
    </Card>
  )
}

export function CommunityReferrerBindCard({
  bindLabel,
  canBind,
  hint,
  inputLabel,
  isSubmitting,
  onBind,
  onInputChange,
  placeholder,
  referrerLabel,
  value,
}: {
  bindLabel: string
  canBind: boolean
  hint: string
  inputLabel: string
  isSubmitting: boolean
  onBind: () => void
  onInputChange: (value: string) => void
  placeholder: string
  referrerLabel: string
  value: string
}) {
  return (
    <Card
      as="section"
      surface="outlined"
      className={cn(revealClass(), 'flex flex-col gap-2')}
      data-reveal
    >
      <Text as="p" className="m-0 text-foreground/40" variant="support">
        {referrerLabel}
      </Text>
      <div className={communityReferrerBindGrid()}>
        <Input
          aria-label={inputLabel}
          className="min-w-0 flex-1"
          onChange={(event) => onInputChange(event.currentTarget.value)}
          placeholder={placeholder}
          value={value}
        />
        <FieldActionChip
          aria-busy={isSubmitting || undefined}
          disabled={!canBind || isSubmitting}
          onClick={onBind}
        >
          {isSubmitting ? (
            <Loader2 aria-hidden className="size-4 shrink-0 animate-spin" strokeWidth={2} />
          ) : null}
          {bindLabel}
        </FieldActionChip>
      </div>
      <Text as="small" className="block text-foreground/40" variant="support">
        {hint}
      </Text>
    </Card>
  )
}

export function CommunityReferrerBoundPanel({
  addressLabel,
  copyLabel,
  note,
  onCopy,
  referrer,
}: {
  addressLabel: string
  copyLabel: string
  note: string
  onCopy: () => void
  referrer: string | null
}) {
  return (
    <Card
      as="section"
      surface="outlined"
      className={cn(revealClass(), 'flex flex-col gap-2 rounded-2xl px-4 py-3.5')}
      data-reveal
    >
      <Text as="p" className="m-0 leading-4 text-foreground/40" variant="support">
        {addressLabel}
      </Text>
      <div className={communityReferrerAddressRow()} data-slot-id="community-referrer-row">
        <span aria-hidden className={communityReferrerAvatar()}>
          <Wallet className={iconVariants({ size: 'xs' })} strokeWidth={1.75} />
        </span>
        <span className="ml-2.5 min-w-0 truncate text-sm/tight font-semibold">
          {referrer ? <ExplorerLink value={referrer} /> : '—'}
        </span>
        {referrer ? (
          <button
            aria-label={copyLabel}
            className={communityCopyButton()}
            data-slot-id="community-referrer-copy"
            onClick={onCopy}
            type="button"
          >
            <Icon alt="" size="sm" src={dappAssets.copy} />
          </button>
        ) : null}
      </div>
      <Text as="p" className="m-0 leading-4 text-foreground/40" variant="support">
        {note}
      </Text>
    </Card>
  )
}

export type QuickLinkProps = {
  href: string
  icon: string
  iconTone?: 'coral' | 'dark' | 'plain'
  label: ReactNode
}

/**
 * 快捷入口链接卡：图标 + 文字，外部链接新窗口打开。
 */
export function QuickLink({ href, icon, iconTone = 'coral', label }: QuickLinkProps) {
  const isExternal = href.startsWith('http://') || href.startsWith('https://')
  const isBrandIcon = iconTone === 'plain'
  const insetIconClass = iconVariants({ size: iconTone === 'dark' ? 'md' : 'lg' })

  return (
    <a
      className={cn(
        'flex items-center gap-3 rounded-md border border-border-subtle bg-card px-3.5 py-3',
        'duration-dapp-fast transition-[border-color,transform] ease-out',
        'hover:translate-x-0.5 hover:border-coral-hover-border',
      )}
      href={href}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      target={isExternal ? '_blank' : undefined}
    >
      <span
        className={cn(
          'grid size-7.5 flex-none place-items-center rounded-full',
          iconTone === 'coral' && 'bg-primary text-white',
          iconTone === 'dark' && 'bg-foreground',
          isBrandIcon && 'bg-transparent',
        )}
      >
        <img
          alt=""
          className={cn(
            'block shrink-0 object-contain',
            isBrandIcon ? 'size-full' : insetIconClass,
          )}
          loading="lazy"
          src={icon}
        />
      </span>
      <Text as="span" variant="headline" className="text-sm/normal">
        {label}
      </Text>
    </a>
  )
}
