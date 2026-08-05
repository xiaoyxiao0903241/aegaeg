import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'

import { iconVariants } from '~/shared/components/icon'
import { Text } from '~/shared/components/text'
import { WidgetSubpageHeader } from '~/shared/components/widget-header'
import { DetailToggle } from '~/views/dapp/shared/detail-toggle'

/**
 * 子页面顶部标题栏：返回按钮 + 标题 + 折叠开关。
 */
export function TabHeader({
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
      action={<DetailToggle />}
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
