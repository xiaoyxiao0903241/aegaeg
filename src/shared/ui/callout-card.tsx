import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'
import { cn } from '~/shared/lib/utils'

/**
 * Composite：深色 CTA / 提示卡。
 *
 * 结构：标题 + 描述 + action（可选）。
 * 内部用 Card surface="inverse" + Text tone="inverse"/primary。
 */
export const calloutCard = tv({
  slots: {
    root: 'relative isolate grid gap-2',
    titleRow: 'flex items-center gap-2',
    title: 'm-0',
    body: 'm-0 min-w-0',
  },
})

export type CalloutCardProps = {
  action?: ReactNode
  body: ReactNode
  className?: string
  title: ReactNode
  titleIcon?: ReactNode
}

export function CalloutCard({
  action,
  body,
  className,
  title,
  titleIcon,
}: CalloutCardProps) {
  const styles = calloutCard()

  return (
    <Card as="article" surface="inverse" className={cn(styles.root(), className)}>
      <div className={styles.titleRow()}>
        {titleIcon}
        <Text as="strong" variant="brand" tone="inverse" className={styles.title()}>
          {title}
        </Text>
      </div>
      <Text as="p" variant="copy" tone="inverse" className={styles.body()}>
        {body}
      </Text>
      {action}
    </Card>
  )
}
