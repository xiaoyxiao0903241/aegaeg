import { dappAssets } from '~/app/assets'
import { DappIcon } from '~/app/shell/dapp-icon'
import { useI18n } from '~/i18n/use-i18n'
import { AnchoredTooltip } from '~/shared/components/anchored-tooltip'
import { IconButton } from '~/shared/components/icon-button'
import { cn } from '~/shared/lib/utils'
import { useDappShellStore } from '~/stores/dapp-shell-store'

export function DappPanelToggle({ className }: { className?: string }) {
  const { messages: t } = useI18n()
  const detailCollapsed = useDappShellStore((state) => state.detailCollapsed)
  const toggle = useDappShellStore((state) => state.toggleDetailCollapsed)

  return (
    <AnchoredTooltip content={t.topbar.toggleTooltip}>
      <IconButton
        aria-expanded={!detailCollapsed}
        aria-label={detailCollapsed ? t.topbar.showDetails : t.topbar.hideDetails}
        className={cn('size-9 min-h-9 shrink-0', className)}
        onClick={toggle}
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
  )
}
