import type { ReactNode } from 'react'
import { IconButton } from '~/components/icon-button'
import { useI18n } from '~/i18n/use-i18n'
import { dappAssets, flashSwapAssets } from '~/app/assets'
import { DappIcon } from '~/app/components/dapp-icon'
import { AnchoredTooltip } from '~/components/anchored-tooltip'
import { dappWidgetHeaderSpacingClass } from '~/app/components/dapp-widget-frame'
import { shellMobilePageTitleClass } from '~/app/shell-layout'
import { useDappShellStore } from '~/stores/dapp-shell-store'
import { useSwapViewStore } from '~/stores/swap-view-store'
import { swapWidgetSubtitleClass, swapWidgetTitleClass } from '~/app/tabs/swap/swap-layout-tokens'
import { cn } from '~/lib/utils'

function SwapPanelToggle() {
  const { messages: t } = useI18n()
  const detailCollapsed = useDappShellStore((state) => state.detailCollapsed)
  const onToggle = useDappShellStore((state) => state.toggleDetailCollapsed)

  return (
    <AnchoredTooltip content={t.topbar.toggleTooltip}>
      <IconButton
        aria-expanded={!detailCollapsed}
        aria-label={detailCollapsed ? t.topbar.showDetails : t.topbar.hideDetails}
        className="shrink-0"
        onClick={onToggle}
      >
        <DappIcon
          alt=""
          className={cn(
            'transition-transform duration-[260ms] ease-[cubic-bezier(.2,.8,.2,1)]',
            detailCollapsed && 'rotate-90',
          )}
          size="lg"
          src={dappAssets.menu}
        />
      </IconButton>
    </AnchoredTooltip>
  )
}

export function SwapHubHeader({
  subtitle,
  title,
}: {
  subtitle: string
  title: string
}) {
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4',
        shellMobilePageTitleClass,
        dappWidgetHeaderSpacingClass,
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <h1 className={swapWidgetTitleClass}>{title}</h1>
        <p className={swapWidgetSubtitleClass}>{subtitle}</p>
      </div>
      <SwapPanelToggle />
    </div>
  )
}

export function SwapSubpageHeader({
  subtitle,
  title,
}: {
  subtitle: string
  title: string
}) {
  const { messages: t } = useI18n()
  const backToHub = useSwapViewStore((state) => state.backToHub)

  return (
    <div className={cn(dappWidgetHeaderSpacingClass, 'grid gap-3.5')}>
      <div className={cn('flex items-center gap-2', shellMobilePageTitleClass)}>
        <button
          className="inline-flex min-w-0 flex-1 cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-left"
          onClick={backToHub}
          type="button"
        >
          <DappIcon alt="" size="sm" src={flashSwapAssets.backArrow} />
          <span className="text-base font-medium leading-[1.4] tracking-[-0.02em] text-ink-strong">
            {t.swap.backToHub}
          </span>
        </button>
        <SwapPanelToggle />
      </div>
      <div className="grid gap-1.5">
        <h1 className={swapWidgetTitleClass}>{title}</h1>
        <p className={swapWidgetSubtitleClass}>{subtitle}</p>
      </div>
    </div>
  )
}

export function SwapWidgetBody({
  bodyClassName,
  children,
  footer,
}: {
  bodyClassName?: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <div className={cn('flex min-h-0 flex-1 flex-col', bodyClassName)}>
      {children}
      {footer ? <div className="mt-auto w-full shrink-0">{footer}</div> : null}
    </div>
  )
}
