import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'

import { DappPanelToggle } from '~/app/shell/dapp-panel-toggle'
import { iconVariants } from '~/shared/components/icon'
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
          <ArrowLeft aria-hidden className={iconVariants({ size: 'sm' })} strokeWidth={1.5} />
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
