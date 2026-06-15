import type { ReactNode } from 'react'
import { useI18n } from '../../i18n/use-i18n'
import { dappButtonClass, dappTextClass } from '../../components/primitive-styles'
import { dappAssets } from '../assets'
import { AnchoredTooltip } from '../../components/anchored-tooltip'
import { cn } from '~/lib/utils'

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
    <div className={cn('flex items-start justify-between gap-4 max-[820px]:block', className)}>
      <div className="min-w-0">
        <h1
          className={cn(
          dappTextClass('titleWidget', { tone: 'ink' }),
            'group-data-[tab=swap]/shell:tracking-[-0.42px]',
            'group-data-[tab=genesis]/shell:tracking-[-0.84px] group-data-[tab=rewards]/shell:tracking-[-0.84px] group-data-[tab=community]/shell:tracking-[-0.84px]',
            'max-[820px]:text-[22px] max-[820px]:leading-[1.2] group-data-[tab=rewards]/shell:max-[820px]:tracking-[-0.88px]',
          )}
        >
          {title}
        </h1>
        <p
          className={cn(
            dappTextClass('widgetIntro', { tone: introTone }),
            'group-data-[tab=genesis]/shell:text-[12px] group-data-[tab=genesis]/shell:tracking-[-0.24px]',
            'group-data-[tab=rewards]/shell:text-[12px] group-data-[tab=rewards]/shell:tracking-[-0.24px]',
            'group-data-[tab=community]/shell:text-[12px] group-data-[tab=community]/shell:tracking-[-0.24px]',
            'max-[820px]:mt-2.5 max-[820px]:max-w-none max-[820px]:text-[13px] max-[820px]:leading-normal max-[820px]:text-faint',
            'group-data-[tab=rewards]/shell:max-[820px]:mt-3 group-data-[tab=rewards]/shell:max-[820px]:tracking-[-0.26px]',
            '[&_strong]:font-bold [&_strong]:text-primary',
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
