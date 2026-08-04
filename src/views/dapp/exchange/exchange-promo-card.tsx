import type { ButtonHTMLAttributes, ReactElement } from 'react'
import { tv } from 'tailwind-variants'

import { dappAssets } from '~/app/assets'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'
import { Card } from '~/shared/components/card'
import { Text } from '~/shared/components/text'
import { Tooltip } from '~/shared/components/tooltip'
import { revealClass } from '~/shared/lib/reveal'
import { cn } from '~/shared/lib/utils'

type PromoLayout = 'desktop' | 'mobile'

const exchangePromoCard = tv({
  slots: {
    bodyGrid: 'relative z-1 grid gap-2',
    titleRow: 'flex w-full min-w-0 items-center',
    titleCluster: 'flex min-w-0 items-center',
    title: 'wrap-break-word',
    body: 'm-0 min-w-0 wrap-break-word',
    titleIcon: 'grid shrink-0 overflow-hidden rounded-full',
    mobileActionWrap: 'inline-flex shrink-0 self-center',
    decorationMobile: 'pointer-events-none absolute top-0 right-0 w-30',
    decorationDesktop:
      'pointer-events-none absolute inset-y-0 right-0 h-full w-80 object-cover object-right',
  },
  variants: {
    layout: {
      desktop: {
        bodyGrid: 'p-4 pr-36',
        titleRow: 'gap-3',
        titleCluster: 'gap-3',
        title: 'wrap-break-word',
        body: 'max-w-xl wrap-break-word',
        titleIcon: 'size-8',
      },
      mobile: {
        bodyGrid: 'px-4 py-3.5',
        titleRow: 'flex-wrap justify-between gap-2',
        titleCluster: 'min-w-0 flex-1 gap-2',
        title: 'wrap-break-word',
        body: 'max-w-none wrap-break-word',
        titleIcon: 'size-7.5',
      },
    },
    rays: {
      usd1: {
        decorationMobile: 'opacity-95',
        decorationDesktop: 'opacity-95',
      },
      muted: {
        decorationMobile: 'opacity-[0.72]',
        decorationDesktop: 'opacity-[0.72]',
      },
    },
  },
  defaultVariants: {
    rays: 'usd1',
  },
})

export function ExchangePromoPillAction({
  children,
  className,
  layout,
  withArrow = false,
  fullWidth = false,
  minConnectWidth = false,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  layout: PromoLayout
  withArrow?: boolean
  fullWidth?: boolean
  minConnectWidth?: boolean
}) {
  return (
    <button
      className={cn(
        'inline-flex shrink-0 cursor-pointer items-center rounded-full border border-border bg-card whitespace-nowrap text-foreground',
        withArrow ? 'gap-1.5' : 'justify-center',
        layout === 'desktop'
          ? cn(
              // Figma btn-contract `4477:426`：px16 py10 · copy13 · leading 1.2 → 合成 h36
              'absolute top-1/2 right-4 z-2 -translate-y-1/2 px-4 py-2.5',
              'text-(length:--type-copy-size) leading-[1.2] font-semibold',
              !withArrow && minConnectWidth && 'min-w-31',
              'duration-dapp-fast transition-[border-color,transform] ease-out',
              'hover:translate-x-px hover:border-primary',
              'focus-visible:translate-x-px focus-visible:border-primary',
              'disabled:pointer-events-none disabled:opacity-45',
            )
          : cn(
              'px-3 py-1.5 text-xs leading-[1.2] font-semibold',
              !withArrow && fullWidth && 'w-full justify-center',
            ),
        className,
      )}
      type="button"
      {...props}
    >
      {children}
    </button>
  )
}

function CardDecoration({ layout, rays }: { layout: PromoLayout; rays: 'usd1' | 'muted' }) {
  const styles = exchangePromoCard({ layout, rays })

  if (layout === 'mobile') {
    return (
      <img
        alt=""
        aria-hidden
        className={cn(styles.decorationMobile())}
        src={dappAssets.tokenCardCorner}
      />
    )
  }

  return (
    <img
      alt=""
      aria-hidden
      className={cn(styles.decorationDesktop())}
      src={dappAssets.tokenCardRays}
    />
  )
}

function TitleIcon({ layout, src }: { layout: PromoLayout; src: string }) {
  const dimension = layout === 'desktop' ? 32 : 30
  const styles = exchangePromoCard({ layout })

  return (
    <span aria-hidden="true" className={styles.titleIcon()}>
      <img alt="" className="block size-full" height={dimension} src={src} width={dimension} />
    </span>
  )
}

export function ExchangePromoCard({
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
  const layout: PromoLayout = isDesktop ? 'desktop' : 'mobile'
  const styles = exchangePromoCard({ layout, rays })
  const actionNode = actionTooltip ? <Tooltip content={actionTooltip}>{action}</Tooltip> : action

  return (
    <Card
      as="article"
      surface="soft"
      className={cn(
        // soft owns radius + shadow-faq; body owns pad (p-0 here).
        'relative min-w-0 p-0',
        shellClassName,
        reveal && revealClass(),
        className,
      )}
      data-reveal={reveal ? '' : undefined}
    >
      <CardDecoration layout={layout} rays={rays} />
      <div className={styles.bodyGrid()}>
        <div className={styles.titleRow()}>
          <div className={styles.titleCluster()}>
            {titleIconSrc ? <TitleIcon layout={layout} src={titleIconSrc} /> : null}
            <Text
              as="strong"
              variant="headline"
              className={cn(
                styles.title(),
                layout === 'desktop' ? 'text-base/normal' : 'text-sm leading-[1.2]',
              )}
            >
              {title}
            </Text>
          </div>
          {!isDesktop ? <span className={styles.mobileActionWrap()}>{actionNode}</span> : null}
        </div>
        <Text as="p" variant="copy" tone="muted-foreground" className={styles.body()}>
          {body}
        </Text>
      </div>
      {isDesktop ? actionNode : null}
    </Card>
  )
}
