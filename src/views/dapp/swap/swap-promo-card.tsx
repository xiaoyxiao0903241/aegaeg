import type { ButtonHTMLAttributes, ReactElement } from 'react'
import { tv } from 'tailwind-variants'
import { AnchoredTooltip } from '~/shared/ui/anchored-tooltip'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'
import { dappAssets } from '~/app/assets'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'
import { revealClass } from '~/shared/lib/reveal'
import { cn } from '~/shared/lib/utils'
import { useI18n } from '~/i18n/use-i18n'
import { GenesisPromoCard } from '~/app/shell/components/genesis-promo-card'
import { useGenesisWidgetContext } from '~/app/genesis-widget-context'
import { dappWidgetFooterTopGapClass } from '~/app/dapp-detail-layout'

type PromoLayout = 'desktop' | 'mobile'

const swapPromoCard = tv({
  slots: {
    bodyGrid: 'relative z-1 grid gap-2',
    titleRow: 'flex w-full min-w-0 items-center',
    titleCluster: 'flex min-w-0 items-center overflow-hidden',
    title: 'truncate',
    body: 'm-0 min-w-0',
    titleIcon: 'grid shrink-0 overflow-hidden rounded-full',
    mobileActionWrap: 'inline-flex shrink-0 self-center',
    decorationMobile: 'pointer-events-none absolute top-0 right-0 h-18 w-30',
    decorationDesktop:
      'pointer-events-none absolute inset-y-0 right-0 h-full w-80 object-cover object-right',
  },
  variants: {
    layout: {
      desktop: {
        bodyGrid: 'p-4 pr-36',
        titleRow: 'gap-3',
        titleCluster: 'gap-3',
        body: 'max-w-144',
        titleIcon: 'size-8',
      },
      mobile: {
        bodyGrid: 'px-4 py-3.5',
        titleRow: 'flex-nowrap justify-between gap-2',
        titleCluster: 'min-w-0 flex-1 gap-2',
        body: 'max-w-60',
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

export function SwapPromoPillAction({
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
              'absolute right-4 top-1/2 z-[2] -translate-y-1/2 px-4 py-2.5',
              'text-xs font-semibold leading-[1.2] tracking-[-0.02em]',
              !withArrow && minConnectWidth && 'min-w-[7.75rem] text-[0.8125rem]',
              'transition-[border-color,transform] duration-180 ease-out',
              'hover:translate-x-px hover:border-primary',
              'focus-visible:translate-x-px focus-visible:border-primary',
              'disabled:pointer-events-none disabled:opacity-45',
            )
          : cn(
              'px-3 py-1.5 text-xs font-semibold leading-[1.2] tracking-[-0.02em]',
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
  const styles = swapPromoCard({ layout, rays })

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
  const styles = swapPromoCard({ layout })

  return (
    <span aria-hidden="true" className={styles.titleIcon()}>
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
  const layout: PromoLayout = isDesktop ? 'desktop' : 'mobile'
  const styles = swapPromoCard({ layout, rays })
  const actionNode = actionTooltip ? (
    <AnchoredTooltip content={actionTooltip}>{action}</AnchoredTooltip>
  ) : (
    action
  )

  return (
    <Card
      as="article"
      surface="soft"
      className={cn(
        'relative min-w-0',
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
            <strong
              className={cn(
                'truncate font-semibold leading-[1.2] text-foreground',
                styles.title(),
                layout === 'desktop'
                  ? 'text-base tracking-[-0.03em]'
                  : 'text-sm tracking-[-0.028em]',
              )}
            >
              {title}
            </strong>
          </div>
          {!isDesktop ? <span className={styles.mobileActionWrap()}>{actionNode}</span> : null}
        </div>
        <p
          className={cn(
            'm-0 min-w-0 text-xs font-normal leading-[1.5] tracking-[-0.02em]',
            styles.body(),
            layout === 'desktop' ? 'text-foreground/80' : 'text-foreground/60',
          )}
        >
          {body}
        </p>
      </div>
      {isDesktop ? actionNode : null}
    </Card>
  )
}

export function swapPromoLayoutFromViewport(isDesktop: boolean): PromoLayout {
  return isDesktop ? 'desktop' : 'mobile'
}

export const swapFlipCard = tv({
  variants: {
    flipping: {
      true: '[animation:swap-card-flip_320ms_cubic-bezier(.2,.8,.2,1)_both]',
      false: '',
    },
  },
  defaultVariants: {
    flipping: false,
  },
})

export function SwapGenesisFooter({ onSelectGenesis }: { onSelectGenesis: () => void }) {
  const { messages: t } = useI18n()
  const genesis = useGenesisWidgetContext()

  return (
    <GenesisPromoCard
      actionLabel={t.genesis.joinGenesis}
      className="mt-auto max-dapp:mt-0"
      isLoading={genesis.isLoading}
      onClick={onSelectGenesis}
      promo={genesis.promoSnapshot}
    />
  )
}

export function SwapMetaPanel({
  className,
  sessionReady = true,
  items,
}: {
  className?: string
  sessionReady?: boolean
  items: Array<{
    label: React.ReactNode
    value: React.ReactNode
    valueClassName?: string
  }>}) {
  return (
    <Card
      as="div"
      surface="outlined"
      className={cn(
        'grid shrink-0 gap-2 rounded-sm px-3.5 py-3 tracking-[-0.26px]',
        dappWidgetFooterTopGapClass,
        className,
      )}
    >
      {items.map((item, index) => (
        <p className="m-0 flex items-center justify-between gap-3" key={index}>
          <Text
            as="span"
            variant="copy"
            tone={sessionReady ? 'foreground' : 'muted-foreground'}
          >
            {item.label}
          </Text>
          <Text
            as="strong"
            variant="figure"
            className={cn('mt-0 text-right', item.valueClassName)}
          >
            {item.value}
          </Text>
        </p>
      ))}
    </Card>
  )
}
