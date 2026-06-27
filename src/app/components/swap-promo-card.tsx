import type { ReactElement } from 'react'
import { AnchoredTooltip } from '~/components/anchored-tooltip'
import { cn } from '~/lib/utils'
import { dappAssets } from '~/app/assets'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'
import { revealClass } from '~/lib/reveal'

const CARD_ROOT = 'relative min-w-0 overflow-hidden rounded-2xl bg-card shadow-subtle'
const BODY_GRID = 'relative z-1 grid gap-2'

const DESKTOP_BODY_MAX = 'max-w-144'
const MOBILE_BODY_MAX = 'max-w-60'

function bodyPadClass(variant: 'desktop' | 'mobile') {
  return variant === 'desktop' ? 'p-4 pr-36' : 'px-4 py-3.5'
}

function titleClass(variant: 'desktop' | 'mobile') {
  return cn(
    'truncate font-semibold leading-[1.2] text-foreground',
    variant === 'desktop' ? 'text-base tracking-[-0.03em]' : 'text-sm tracking-[-0.028em]',
  )
}

function bodyClass(variant: 'desktop' | 'mobile') {
  return cn(
    'm-0 min-w-0 text-xs font-normal leading-[1.5] tracking-[-0.02em]',
    variant === 'desktop' ? cn('text-ink-strong', DESKTOP_BODY_MAX) : cn('text-faq-text', MOBILE_BODY_MAX),
  )
}

export function swapPromoCardPillActionClass(variant: 'desktop' | 'mobile', withArrow = false) {
  return cn(
    'inline-flex shrink-0 cursor-pointer items-center rounded-full border border-border bg-card whitespace-nowrap text-foreground',
    withArrow ? 'gap-1.5' : 'justify-center',
    variant === 'desktop'
      ? cn(
          'absolute right-4 top-1/2 z-[2] -translate-y-1/2 px-4 py-2.5',
          'text-xs font-semibold leading-[1.2] tracking-[-0.02em]',
          !withArrow && 'min-w-[7.75rem] text-[0.8125rem]',
          'transition-[border-color,transform] duration-180 ease-out',
          'hover:translate-x-px hover:border-primary',
          'focus-visible:translate-x-px focus-visible:border-primary',
          'disabled:pointer-events-none disabled:opacity-45',
        )
      : cn(
          'px-3 py-1.5 text-xs font-semibold leading-[1.2] tracking-[-0.02em]',
          !withArrow && 'w-full justify-center',
        ),
  )
}

function CardDecoration({
  rays = 'usd1',
  variant,
}: {
  rays?: 'usd1' | 'muted'
  variant: 'desktop' | 'mobile'
}) {
  if (variant === 'mobile') {
    return (
      <img
        alt=""
        aria-hidden
        className={cn(
          'pointer-events-none absolute top-0 right-0 h-18 w-30',
          rays === 'usd1' ? 'opacity-95' : 'opacity-[0.72]',
        )}
        src={dappAssets.tokenCardCorner}
      />
    )
  }

  return (
    <img
      alt=""
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-y-0 right-0 h-full w-80 object-cover object-right',
        rays === 'usd1' ? 'opacity-95' : 'opacity-[0.72]',
      )}
      src={dappAssets.tokenCardRays}
    />
  )
}

function TitleIcon({ size, src }: { size: 'desktop' | 'mobile'; src: string }) {
  const dimension = size === 'desktop' ? 32 : 30

  return (
    <span
      aria-hidden="true"
      className={cn('grid shrink-0 overflow-hidden rounded-full', size === 'desktop' ? 'size-8' : 'size-7.5')}
    >
      <img alt="" className="block size-full" height={dimension} src={src} width={dimension} />
    </span>
  )
}

export function SwapPromoCard({
  action,
  actionTooltip,
  body,
  className,
  rays = 'usd1',
  reveal = true,
  shellClassName,
  title,
  titleIconSrc,
}: {
  action: ReactElement
  actionTooltip?: string
  body: string
  className?: string
  rays?: 'usd1' | 'muted'
  reveal?: boolean
  shellClassName?: string
  title: string
  titleIconSrc?: string
}) {
  const isDesktop = !useMobileViewport()
  const variant = isDesktop ? 'desktop' : 'mobile'
  const actionNode = actionTooltip ? (
    <AnchoredTooltip content={actionTooltip}>{action}</AnchoredTooltip>
  ) : (
    action
  )

  return (
    <article
      className={cn(CARD_ROOT, shellClassName, reveal && revealClass(), className)}
      data-reveal={reveal ? '' : undefined}
    >
      <CardDecoration rays={rays} variant={variant} />
      <div className={cn(BODY_GRID, bodyPadClass(variant))}>
        <div
          className={cn(
            'flex min-w-0 items-center',
            isDesktop ? 'gap-3' : 'justify-between gap-2',
          )}
        >
          <div className={cn('flex min-w-0 items-center', isDesktop ? 'gap-3' : 'gap-2')}>
            {titleIconSrc ? <TitleIcon size={variant} src={titleIconSrc} /> : null}
            <strong className={titleClass(variant)}>{title}</strong>
          </div>
          {!isDesktop ? actionNode : null}
        </div>
        <p className={bodyClass(variant)}>{body}</p>
      </div>
      {isDesktop ? actionNode : null}
    </article>
  )
}
