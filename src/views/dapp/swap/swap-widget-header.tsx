import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { IconButton } from '~/shared/ui/icon-button'
import { useI18n } from '~/i18n/use-i18n'
import { dappAssets, flashSwapAssets } from '~/app/assets'
import { DappIcon } from '~/app/shell/components/dapp-icon'
import { AnchoredTooltip } from '~/shared/ui/anchored-tooltip'
import { dappWidgetHeaderSpacingClass } from '~/app/shell/components/dapp-widget-frame'
import { shellMobilePageTitleClass } from '~/app/shell-layout'
import { useDappShellStore } from '~/stores/dapp-shell-store'
import { useSwapViewStore } from '~/stores/swap-view-store'
import { cn } from '~/shared/lib/utils'
import { Text } from '~/shared/ui/text'

const swapWidgetHeader = tv({
  slots: {
    hubRoot: [
      'flex items-start justify-between gap-4',
      shellMobilePageTitleClass,
      dappWidgetHeaderSpacingClass,
    ],
    hubCopy: 'flex min-w-0 flex-1 flex-col gap-1.5',
    pageTitle: 'm-0',
    pageSubtitle: 'm-0 max-w-[17.5rem] max-dapp:max-w-none',
    subpageRoot: [dappWidgetHeaderSpacingClass, 'grid gap-3.5'],
    subpageNavRow: ['flex items-center gap-2', shellMobilePageTitleClass],
    subpageBackButton:
      'inline-flex min-w-0 flex-1 cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-left',
    subpageBackLabel: '',
    subpageCopy: 'grid gap-1.5',
    panelToggleIcon:
      'transition-transform duration-[260ms] ease-[cubic-bezier(.2,.8,.2,1)]',
    body: 'flex min-h-0 flex-1 flex-col',
    footer: 'mt-auto w-full shrink-0',
  },
  variants: {
    detailCollapsed: {
      true: { panelToggleIcon: 'rotate-90' },
      false: {},
    },
  },
})

function SwapPanelToggle() {
  const { messages: t } = useI18n()
  const detailCollapsed = useDappShellStore((state) => state.detailCollapsed)
  const onToggle = useDappShellStore((state) => state.toggleDetailCollapsed)
  const styles = swapWidgetHeader({ detailCollapsed })

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
          className={styles.panelToggleIcon()}
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
  const styles = swapWidgetHeader()

  return (
    <div className={styles.hubRoot()}>
      <div className={styles.hubCopy()}>
        <Text
          as="h1"
          className={styles.pageTitle()}
          tone="foreground"
          variant="swap-hub-title"
        >
          {title}
        </Text>
        <Text
          as="p"
          className={styles.pageSubtitle()}
          tone="strong"
          variant="compact-body"
        >
          {subtitle}
        </Text>
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
  const setView = useSwapViewStore((state) => state.setView)
  const styles = swapWidgetHeader()

  return (
    <div className={styles.subpageRoot()}>
      <div className={styles.subpageNavRow()}>
        <button
          className={styles.subpageBackButton()}
          onClick={() => setView('hub')}
          type="button"
        >
          <DappIcon alt="" size="sm" src={flashSwapAssets.backArrow} />
          <Text
            className={styles.subpageBackLabel()}
            tone="strong"
            variant="body-md"
            weight="medium"
          >
            {t.swap.backToHub}
          </Text>
        </button>
        <SwapPanelToggle />
      </div>
      <div className={styles.subpageCopy()}>
        <Text
          as="h1"
          className={styles.pageTitle()}
          tone="foreground"
          variant="swap-hub-title"
        >
          {title}
        </Text>
        <Text
          as="p"
          className={styles.pageSubtitle()}
          tone="strong"
          variant="compact-body"
        >
          {subtitle}
        </Text>
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
  const styles = swapWidgetHeader()

  return (
    <div className={cn(styles.body(), bodyClassName)}>
      {children}
      {footer ? <div className={styles.footer()}>{footer}</div> : null}
    </div>
  )
}
