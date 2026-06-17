import type { ReactNode } from 'react'
import { IconButton } from '~/components/icon-button'
import { Text } from '~/components/text'
import { useI18n } from '../../i18n/use-i18n'
import { dappAssets } from '../assets'
import { AnchoredTooltip } from '../../components/anchored-tooltip'
import { shellMobilePageTitleClass } from '../shell-layout'
import { cn } from '~/lib/utils'

export function dappWidgetTitleClassName(className?: string) {
  return cn(
    'm-0 text-[21px] font-semibold leading-[1.3] text-foreground tracking-[-0.84px]',
    'group-data-[tab=swap]/shell:min-[821px]:tracking-[-0.42px]',
    'group-data-[tab=genesis]/shell:min-[821px]:tracking-[-0.42px]',
    'group-data-[tab=rewards]/shell:min-[821px]:tracking-[-0.42px]',
    'max-[820px]:text-[22px] max-[820px]:leading-[1.2] max-[820px]:tracking-[-0.88px]',
    className,
  )
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
        <Text
          as="p"
          size="sm"
          tone={introTone === 'subtle' ? 'subtle' : 'body'}
          className={cn(
            'm-0 mt-1.5 max-w-[34ch] leading-[1.4]',
            'min-[821px]:text-[12px] min-[821px]:tracking-[-0.24px]',
            'group-data-[tab=swap]/shell:min-[821px]:text-[13px] group-data-[tab=swap]/shell:min-[821px]:tracking-[-0.26px]',
            'group-data-[tab=genesis]/shell:min-[821px]:text-[13px] group-data-[tab=genesis]/shell:min-[821px]:tracking-[-0.26px]',
            'group-data-[tab=rewards]/shell:min-[821px]:text-[13px] group-data-[tab=rewards]/shell:min-[821px]:tracking-[-0.26px]',
            'max-[820px]:mt-2.5 max-[820px]:max-w-none max-[820px]:text-[13px] max-[820px]:leading-normal max-[820px]:tracking-[-0.26px] max-[820px]:text-faint',
            '[&_strong]:font-bold [&_strong]:text-primary',
          )}
        >
          {intro}
        </Text>
      </div>
      {showToggle ? (
        <AnchoredTooltip content={t.topbar.toggleTooltip}>
          <IconButton
            aria-expanded={!detailCollapsed}
            aria-label={detailCollapsed ? t.topbar.showDetails : t.topbar.hideDetails}
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
