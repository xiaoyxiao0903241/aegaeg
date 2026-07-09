import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { Text } from '~/shared/ui/text'
import { cn } from '~/shared/lib/utils'

export const widgetHeader = tv({
  slots: {
    root: 'mb-3.5 flex items-start justify-between gap-4 max-dapp:mb-7.5 max-dapp:mt-6',
    copy: 'flex min-w-0 flex-1 flex-col gap-1.5',
    title: 'm-0',
    subtitle: 'm-0 max-w-70 max-dapp:max-w-none',
  },
})

type WidgetHeaderProps = {
  action?: ReactNode
  className?: string
  subtitle?: ReactNode
  title: ReactNode
}

export function WidgetHeader({
  action,
  className,
  subtitle,
  title,
}: WidgetHeaderProps) {
  const styles = widgetHeader()

  return (
    <div className={cn(styles.root(), className)}>
      <div className={styles.copy()}>
        <Text as="h1" variant="panel" className={styles.title()}>
          {title}
        </Text>
        {subtitle ? (
          <Text
            as="p"
            variant="copy"
            tone="muted-foreground"
            className={cn(
              styles.subtitle(),
              'leading-[1.4] [&_strong]:font-bold [&_strong]:text-primary',
            )}
          >
            {subtitle}
          </Text>
        ) : null}
      </div>
      {action}
    </div>
  )
}

export const widgetSubpageHeader = tv({
  slots: {
    root: 'mb-3.5 grid gap-3.5 max-dapp:mb-7.5',
    navRow: 'flex items-center gap-2 max-dapp:mt-6',
    backButton:
      'inline-flex min-w-0 flex-1 cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-left',
    backLabel: '',
    copy: 'grid gap-1.5',
    title: 'm-0',
    subtitle: 'm-0 max-w-70 max-dapp:max-w-none',
  },
})

type WidgetSubpageHeaderProps = {
  action?: ReactNode
  backLabel: ReactNode
  className?: string
  onBack: () => void
  subtitle?: ReactNode
  title: ReactNode
}

export function WidgetSubpageHeader({
  action,
  backLabel,
  className,
  onBack,
  subtitle,
  title,
}: WidgetSubpageHeaderProps) {
  const styles = widgetSubpageHeader()

  return (
    <div className={cn(styles.root(), className)}>
      <div className={styles.navRow()}>
        <button
          className={styles.backButton()}
          onClick={onBack}
          type="button"
        >
          {backLabel}
        </button>
        {action}
      </div>
      <div className={styles.copy()}>
        <Text as="h1" variant="panel" className={styles.title()}>
          {title}
        </Text>
        {subtitle ? (
          <Text
            as="p"
            variant="copy"
            tone="muted-foreground"
            className={cn(
              styles.subtitle(),
              'leading-[1.4] [&_strong]:font-bold [&_strong]:text-primary',
            )}
          >
            {subtitle}
          </Text>
        ) : null}
      </div>
    </div>
  )
}
