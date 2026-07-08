import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { dappWidgetHeaderSpacingClass } from '~/app/shell/components/dapp-widget-frame'
import { shellMobilePageTitleClass } from '~/app/shell-layout'
import { Text } from '~/shared/ui/text'
import { cn } from '~/shared/lib/utils'

/**
 * Composite：Figma `wh` 层 — Widget / Panel / Page 标题区。
 *
 * 结构：标题 + 副标题 + 右侧 action。
 * 内部消化 typography 与间距；call site 只负责布局和传入 action。
 */
export const widgetHeader = tv({
  slots: {
    root: cn(
      'flex items-start justify-between gap-4',
      shellMobilePageTitleClass,
      dappWidgetHeaderSpacingClass,
    ),
    copy: 'flex min-w-0 flex-1 flex-col gap-1.5',
    // Size/weight from Text panel token (21/600). Do NOT use text-xl (20px) — strips panel size.
    // leading-normal + hub tracking match 4175 SwapHubHeader (21 / 31.5 / -0.55125).
    title: 'm-0 leading-normal tracking-[-0.02625em]',
    subtitle: 'm-0 max-w-[17.5rem] max-dapp:max-w-none',
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
              // copy token = 13px; leading 1.4 matches 4175 hub subtitle (not text-xs 12px).
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

/**
 * Composite：Figma `wh` subpage 模式 — 返回 + 标题 + 副标题。
 */
export const widgetSubpageHeader = tv({
  slots: {
    root: cn(dappWidgetHeaderSpacingClass, 'grid gap-3.5'),
    navRow: cn('flex items-center gap-2', shellMobilePageTitleClass),
    backButton:
      'inline-flex min-w-0 flex-1 cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-left',
    backLabel: '',
    copy: 'grid gap-1.5',
    title: 'm-0 leading-normal tracking-[-0.02625em]',
    subtitle: 'm-0 max-w-[17.5rem] max-dapp:max-w-none',
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
