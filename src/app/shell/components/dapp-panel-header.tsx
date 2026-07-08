import type { ReactNode } from 'react'
import { IconButton } from '~/shared/ui/icon-button'
import { Text } from '~/shared/ui/text'
import { useI18n } from '~/i18n/use-i18n'
import { dappAssets } from '~/app/assets'
import { DappIcon } from '~/app/shell/components/dapp-icon'
import { AnchoredTooltip } from '~/shared/ui/anchored-tooltip'
import { shellMobilePageTitleClass } from '~/app/shell-layout'
import { cn } from '~/shared/lib/utils'

const dappPanelSubtitleClassName = 'm-0 max-w-[34ch] max-dapp:max-w-none'

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
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <Text as="h1" variant="panel-title" className="m-0">
          {title}
        </Text>
        <Text
          as="p"
          variant="meta"
          tone="muted-foreground"
          className={dappPanelSubtitleClassName}
        >
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
            <DappIcon
              className={cn(
                'transition-transform duration-[260ms] ease-[cubic-bezier(.2,.8,.2,1)]',
                detailCollapsed && 'rotate-90',
              )}
              size="lg"
              src={dappAssets.menu}
              alt=""
            />
          </IconButton>
        </AnchoredTooltip>
      ) : null}
    </div>
  )
}
