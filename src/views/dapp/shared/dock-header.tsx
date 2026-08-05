import type { ReactNode } from 'react'

import { useI18n } from '~/i18n/use-i18n'
import { Icon } from '~/shared/components/icon'
import { IconButton } from '~/shared/components/icon-button'
import { Text } from '~/shared/components/text'
import { Tooltip } from '~/shared/components/tooltip'
import { dappAssets } from '~/shared/config/assets'
import { cn } from '~/shared/lib/utils'

/**
 * 内容面板顶部标题区。
 *
 * 左侧展示面板标题与副标题，右侧为折叠详情面板的开关按钮。
 */
export function DockHeader({
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
        <Tooltip content={t.topbar.toggleTooltip}>
          <IconButton
            aria-expanded={!detailCollapsed}
            aria-label={detailCollapsed ? t.topbar.showDetails : t.topbar.hideDetails}
            className="shrink-0"
            onClick={onTogglePanel}
          >
            <Icon
              className={cn(
                'duration-dapp-base transition-transform ease-dapp',
                detailCollapsed && 'rotate-90',
              )}
              size="lg"
              src={dappAssets.menu}
              alt=""
            />
          </IconButton>
        </Tooltip>
      ) : null}
    </div>
  )
}
