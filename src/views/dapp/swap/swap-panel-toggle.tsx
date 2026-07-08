import { IconButton } from '~/shared/ui/icon-button'
import { DappIcon } from '~/app/shell/components/dapp-icon'
import { AnchoredTooltip } from '~/shared/ui/anchored-tooltip'
import { useI18n } from '~/i18n/use-i18n'
import { dappAssets } from '~/app/assets'
import { useDappShellStore } from '~/stores/dapp-shell-store'
import { cn } from '~/shared/lib/utils'

export function SwapPanelToggle() {
  const { messages: t } = useI18n()
  const detailCollapsed = useDappShellStore((state) => state.detailCollapsed)
  const toggle = useDappShellStore((state) => state.toggleDetailCollapsed)

  return (
    <AnchoredTooltip content={t.topbar.toggleTooltip}>
      <IconButton
        aria-expanded={!detailCollapsed}
        aria-label={detailCollapsed ? t.topbar.showDetails : t.topbar.hideDetails}
        className="shrink-0"
        onClick={toggle}
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
  )
}
