import type { ReactNode } from 'react'

import { dappAssets } from '~/app/assets'
import { DappIcon } from '~/app/shell/dapp-icon'
import { useI18n } from '~/i18n/use-i18n'
import { cn } from '~/shared/lib/utils'
import { AnchoredTooltip } from '~/shared/ui/anchored-tooltip'
import { IconButton } from '~/shared/ui/icon-button'
import { Text } from '~/shared/ui/text'

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
    <div className={cn('flex items-start justify-between gap-4 max-dapp:mt-6', className)}>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <Text as="h1" variant="panel" className="m-0">
          {title}
        </Text>
        <Text
          as="p"
          variant="support"
          tone="muted-foreground"
          className="m-0 max-dapp:max-w-none [&_strong]:font-bold [&_strong]:text-primary"
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
                'duration-dapp-base transition-transform ease-dapp',
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
