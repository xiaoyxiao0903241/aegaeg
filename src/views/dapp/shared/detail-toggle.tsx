import { useI18n } from '~/i18n/use-i18n'
import { Icon, iconVariants } from '~/shared/components/icon'
import { IconButton } from '~/shared/components/icon-button'
import { Tooltip } from '~/shared/components/tooltip'
import { dappAssets } from '~/shared/config/assets'
import { cn } from '~/shared/lib/utils'
import { useDappHostStore } from '~/stores/dapp-host-store'

/**
 * 折叠右侧详情面板的开关按钮。
 *
 * 展开时图标竖排，折叠后横排；状态读写 dapp-host-store。
 */
export function DetailToggle({ className }: { className?: string }) {
  const { messages: t } = useI18n()
  const detailCollapsed = useDappHostStore((state) => state.detailCollapsed)
  const toggle = useDappHostStore((state) => state.toggleDetailCollapsed)

  return (
    <Tooltip content={t.topbar.toggleTooltip}>
      <IconButton
        aria-expanded={!detailCollapsed}
        aria-label={detailCollapsed ? t.topbar.showDetails : t.topbar.hideDetails}
        className={cn('size-9 min-h-9 shrink-0', className)}
        onClick={toggle}
      >
        <Icon
          alt=""
          className={cn(
            iconVariants({ size: 'lg' }),
            'duration-dapp-base transition-transform ease-dapp',
            detailCollapsed && 'rotate-90',
          )}
          src={dappAssets.menu}
        />
      </IconButton>
    </Tooltip>
  )
}
