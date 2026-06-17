import type { ReactNode } from 'react'
import { useI18n } from '../../i18n/use-i18n'
import { dappButtonClass, dappHeading, dappTextClass } from '../../components/primitive-styles'
import { dappAssets } from '../assets'
import { AnchoredTooltip } from '../../components/anchored-tooltip'
import { shellMobilePageTitleClass } from '../shell-layout'
import { cn } from '~/lib/utils'

export function dappWidgetTitleClassName(className?: string) {
  return cn(dappHeading.widgetTitle, className)
}

export function DappWidgetHeader({
  className,
  detailCollapsed,
  intro,
  introTone = 'body',
  onTogglePanel,
  showToggle = true,
  title,
}: {
  className?: string
  detailCollapsed: boolean
  intro: ReactNode
  introTone?: 'body' | 'subtle'
  onTogglePanel: () => void
  showToggle?: boolean
  title: string
}) {
  const { messages: t } = useI18n()

  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4 max-[820px]:block',
        shellMobilePageTitleClass,
        className,
      )}
    >
      <div className="min-w-0">
        <h1 className={dappWidgetTitleClassName()}>{title}</h1>
        <p
          className={cn(
            dappTextClass('widgetIntro', { tone: introTone }),
            dappHeading.widgetIntro,
          )}
        >
          {intro}
        </p>
      </div>
      {showToggle ? (
        <AnchoredTooltip content={t.topbar.toggleTooltip}>
          <button
            aria-expanded={!detailCollapsed}
            aria-label={detailCollapsed ? t.topbar.showDetails : t.topbar.hideDetails}
            className={dappButtonClass('panelToggle', 'panel')}
            onClick={onTogglePanel}
            type="button"
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
          </button>
        </AnchoredTooltip>
      ) : null}
    </div>
  )
}
