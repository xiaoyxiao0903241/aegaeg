import type { ReactNode } from 'react'

import { flashExchangeAssets } from '~/app/assets'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappPanelToggle } from '~/app/shell/dapp-panel-toggle'
import { Text } from '~/shared/components/text'
import { WidgetSubpageHeader } from '~/shared/components/widget-header'

export function DappTabHeader({
  backText,
  className,
  onBack,
  subtitle,
  title,
}: {
  backText: string
  className?: string
  onBack: () => void
  subtitle: ReactNode
  title: ReactNode
}) {
  return (
    <WidgetSubpageHeader
      action={<DappPanelToggle />}
      backLabel={
        <>
          <DappIcon alt="" size="sm" src={flashExchangeAssets.backArrow} />
          <Text className="text-base font-medium" tone="muted-foreground" variant="headline">
            {backText}
          </Text>
        </>
      }
      className={className}
      onBack={onBack}
      subtitle={subtitle}
      title={title}
    />
  )
}
