import type { ReactNode } from 'react'
import { IconButton } from '~/shared/ui/icon-button'
import { Text } from '~/shared/ui/text'
import { useI18n } from '~/i18n/use-i18n'
import { dappAssets } from '~/app/assets'
import { DappIcon } from '~/app/shell/components/dapp-icon'
import { AnchoredTooltip } from '~/shared/ui/anchored-tooltip'
import { shellMobilePageTitleClass } from '~/app/shell-layout'
import { cn } from '~/shared/lib/utils'

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
        {/* Detail title: 20px (text-xl), not hub 21px panel token. */}
        <Text
          as="h1"
          variant="panel"
          className={cn(
            'm-0 text-xl font-semibold leading-[1.3] tracking-[-0.84px]',
            // PC detail title tracking (swap/genesis/rewards share; community uses base -0.84px).
            'group-data-[tab=swap]/shell:dapp:tracking-[-0.42px] group-data-[tab=genesis]/shell:dapp:tracking-[-0.42px] group-data-[tab=rewards]/shell:dapp:tracking-[-0.42px]',
            // PC: text-xl (20px) overrides panel token. H5 4175 title = 21px / Swap lh 1.5.
            'max-dapp:text-[21px] max-dapp:leading-[1.2] max-dapp:tracking-[-0.88px]',
            'group-data-[tab=swap]/shell:max-dapp:leading-[1.5]',
          )}
        >
          {title}
        </Text>
        <Text
          as="p"
          variant="copy"
          tone="muted-foreground"
          className={cn(
            'm-0 max-w-[34ch] max-dapp:max-w-none text-xs',
            '[&_strong]:font-bold [&_strong]:text-primary',
          )}
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
