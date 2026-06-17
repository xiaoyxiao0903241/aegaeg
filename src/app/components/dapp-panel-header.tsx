import type { ReactNode } from 'react'
import { IconButton } from '~/components/icon-button'
import { Text } from '~/components/text'
import { useI18n } from '~/i18n/use-i18n'
import { dappAssets } from '~/app/assets'
import { AnchoredTooltip } from '~/components/anchored-tooltip'
import { shellMobilePageTitleClass } from '~/app/shell-layout'
import { cn } from '~/lib/utils'

export function dappPanelTitleClassName(className?: string) {
  return cn(
    'm-0 text-[21px] font-semibold leading-[1.3] text-foreground tracking-[-0.84px]',
    'group-data-[tab=swap]/shell:min-[821px]:tracking-[-0.42px]',
    'group-data-[tab=genesis]/shell:min-[821px]:tracking-[-0.42px]',
    'group-data-[tab=rewards]/shell:min-[821px]:tracking-[-0.42px]',
    'max-[820px]:text-[22px] max-[820px]:leading-[1.2] max-[820px]:tracking-[-0.88px]',
    className,
  )
}

const dappPanelSubtitleClassName = cn(
  'm-0 mt-1.5 max-w-[34ch] text-[13px] leading-[1.4] tracking-[-0.26px] text-ink-strong',
  'max-[820px]:mt-2.5 max-[820px]:max-w-none max-[820px]:leading-normal',
  '[&_strong]:font-bold [&_strong]:text-primary',
)

export function DappPanelHeader({
  className,
  detailCollapsed,
  onTogglePanel,
  showToggle = true,
  subtitle,
  title,
}: {
  className?: string
  detailCollapsed: boolean
  onTogglePanel: () => void
  showToggle?: boolean
  subtitle: ReactNode
  title: string
}) {
  const { messages: t } = useI18n()

  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4',
        shellMobilePageTitleClass,
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <h1 className={dappPanelTitleClassName()}>{title}</h1>
        <Text as="p" size="sm" tone="body" className={dappPanelSubtitleClassName}>
          {subtitle}
        </Text>
      </div>
      {showToggle ? (
        <AnchoredTooltip content={t.topbar.toggleTooltip}>
          <IconButton
            aria-expanded={!detailCollapsed}
            aria-label={detailCollapsed ? t.topbar.showDetails : t.topbar.hideDetails}
            className="shrink-0"
            onClick={onTogglePanel}
          >
            <img
              className={cn(
                'transition-transform duration-[260ms] ease-[cubic-bezier(.2,.8,.2,1)]',
                detailCollapsed && 'rotate-90',
              )}
              src={dappAssets.menu}
              alt=""
              width="18"
              height="18"
            />
          </IconButton>
        </AnchoredTooltip>
      ) : null}
    </div>
  )
}

/** @deprecated Use `DappPanelHeader` */
export const DappWidgetHeader = DappPanelHeader

/** @deprecated Use `dappPanelTitleClassName` */
export const dappWidgetTitleClassName = dappPanelTitleClassName
