import type { ButtonHTMLAttributes, ReactElement } from 'react'
import { tv } from 'tailwind-variants'
import { AnchoredTooltip } from '~/shared/ui/anchored-tooltip'
import { Button } from '~/shared/ui/button'
import { Card } from '~/shared/ui/card'
import { dappAssets } from '~/app/assets'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'
import { revealClass } from '~/shared/lib/reveal'
import { cn } from '~/shared/lib/utils'
import { Text } from '~/shared/ui/text'

type PromoLayout = 'desktop' | 'mobile'

const swapPromoCard = tv({
  slots: {
    bodyGrid: 'relative z-1 grid gap-2',
    titleRow: 'flex w-full min-w-0 items-center',
    titleCluster: 'flex min-w-0 items-center overflow-hidden',
    title: 'truncate leading-[1.2]',
    body: 'm-0 min-w-0 leading-[1.5] tracking-[-0.02em]',
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
        title: 'tracking-[-0.03em]',
        body: 'max-w-144',
        titleIcon: 'size-8',
      },
      mobile: {
        bodyGrid: 'px-4 py-3.5',
        titleRow: 'flex-nowrap justify-between gap-2',
        titleCluster: 'min-w-0 flex-1 gap-2',
        title: 'tracking-[-0.028em]',
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

const swapPromoPillAction = tv({
  base: 'shrink-0 whitespace-nowrap !text-xs !font-semibold !leading-[1.2] !tracking-[-0.02em]',
  variants: {
    layout: {
      desktop: [
        'absolute right-4 top-1/2 z-[2] -translate-y-1/2 !min-h-0 !px-4 !py-2.5',
        'transition-[border-color,transform] duration-180 ease-out',
        'hover:translate-x-px hover:!border-primary',
        'focus-visible:translate-x-px focus-visible:!border-primary',
        'disabled:pointer-events-none disabled:opacity-45',
      ],
      mobile: '!min-h-0 !px-3 !py-1.5',
    },
    withArrow: {
      true: '!gap-1.5',
      false: '',
    },
    fullWidth: {
      true: '!w-full justify-center',
      false: '!w-auto',
    },
    minConnectWidth: {
      true: 'min-w-[7.75rem] !text-[0.8125rem]',
      false: '',
    },
  },
  compoundVariants: [
    { layout: 'desktop', withArrow: false, class: 'justify-center' },
    { layout: 'mobile', withArrow: false, fullWidth: true, class: 'justify-center' },
  ],
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
    <Button
      className={cn(
        swapPromoPillAction({ layout, withArrow, fullWidth, minConnectWidth }),
        className,
      )}
      shape="pill"
      size="md"
      type="button"
      variant="secondary"
      {...props}
    >
      {children}
    </Button>
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
            <Text
              as="strong"
              className={styles.title()}
              tone="primary"
              variant={layout === 'desktop' ? 'body-md' : 'body'}
              weight="semibold"
            >
              {title}
            </Text>
          </div>
          {!isDesktop ? <span className={styles.mobileActionWrap()}>{actionNode}</span> : null}
        </div>
        <Text
          as="p"
          className={styles.body()}
          tone={layout === 'desktop' ? 'primary' : 'secondary'}
          variant="caption"
        >
          {body}
        </Text>
      </div>
      {isDesktop ? actionNode : null}
    </Card>
  )
}

export function swapPromoLayoutFromViewport(isDesktop: boolean): PromoLayout {
  return isDesktop ? 'desktop' : 'mobile'
}
