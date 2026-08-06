import { useMobileViewport } from '~/hooks/use-mobile-viewport'
import { useI18n } from '~/i18n/use-i18n'
import { dappAssets } from '~/shared/assets/dapp'
import { Icon, iconVariants } from '~/shared/components/icon'
import { IconButton } from '~/shared/components/icon-button'
import { Tooltip } from '~/shared/components/tooltip'
import { cn } from '~/shared/lib/utils'
import { useDappHostStore } from '~/stores/dapp-host-store'

/** 稿 btn/menu：36×36、圆角 sm、描边。 */
const MENU_BTN =
  'grid size-9 min-h-9 shrink-0 place-items-center rounded-sm border border-border bg-card p-0 text-foreground'

/**
 * 左栏主图标（稿 btn/menu）
 *
 * PC：折叠右侧详情；H5：打开导航菜单。
 * 注意：共享 `IconButton` 默认 `max-dapp:hidden`，H5 须自绘按钮，否则菜单会消失。
 */
export function DetailToggle({ className }: { className?: string }) {
  const { messages: t } = useI18n()
  const isMobile = useMobileViewport()
  const detailCollapsed = useDappHostStore((state) => state.detailCollapsed)
  const toggleDetail = useDappHostStore((state) => state.toggleDetailCollapsed)
  const setMobileNavOpen = useDappHostStore((state) => state.setMobileNavOpen)

  const icon = (
    <Icon
      alt=""
      className={cn(
        iconVariants({ size: 'lg' }),
        'duration-dapp-base transition-transform ease-dapp',
        !isMobile && detailCollapsed && 'rotate-90',
      )}
      src={dappAssets.menu}
    />
  )

  if (isMobile) {
    return (
      <button
        aria-label={t.topbar.openMenu}
        className={cn(MENU_BTN, 'cursor-pointer', className)}
        onClick={() => setMobileNavOpen(true)}
        type="button"
      >
        {icon}
      </button>
    )
  }

  return (
    <Tooltip content={t.topbar.toggleTooltip}>
      <IconButton
        aria-expanded={!detailCollapsed}
        aria-label={detailCollapsed ? t.topbar.showDetails : t.topbar.hideDetails}
        className={cn('size-9 min-h-9 shrink-0', className)}
        onClick={toggleDetail}
      >
        {icon}
      </IconButton>
    </Tooltip>
  )
}
