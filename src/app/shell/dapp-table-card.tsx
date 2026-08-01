import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { tv } from 'tailwind-variants'

import { cn } from '~/shared/lib/utils'
import { Card } from '~/shared/ui/card'
import { cardVariants } from '~/shared/ui/card-variants'

/**
 * Table shell chrome on Card `elevated` (E2).
 * INTENTIONAL vs MetricCard: `rounded-2xl` + `p-0` (header/body/footer own pad).
 * No outer border — elevation only (`shadow-card`); row/header dividers stay inside.
 * Not Card `soft` (E1 / FAQ).
 */
const dappTableCard = tv({
  slots: {
    shell: 'overflow-hidden rounded-2xl border-0 p-0',
    header: 'border-b border-border/50 px-4 pt-3.5 pb-2.5 max-dapp:px-3.5',
    content: 'px-4 py-1.5 max-dapp:px-3.5',
    contentBelowHeader: 'px-4 pt-0 pb-1.5 max-dapp:px-3.5',
    footer:
      'relative z-10 overflow-visible rounded-b-2xl border-t border-border/50 bg-card dapp:px-4 dapp:py-3 max-dapp:px-3.5 max-dapp:py-2.5',
  },
})

export const dappTableCell = tv({
  slots: {
    border: 'border-b-[0.03125rem] border-border',
    minWidth: 'min-w-(--dapp-table-cell-min-width)',
  },
})

type DappTableCardProps = {
  children: ReactNode
  className?: string
  contentClassName?: string
  footer?: ReactNode
  footerClassName?: string
  header?: ReactNode
  headerClassName?: string
}

export const DappTableCard = forwardRef<HTMLDivElement, DappTableCardProps>(function DappTableCard(
  { children, className, contentClassName, footer, footerClassName, header, headerClassName },
  ref,
) {
  const styles = dappTableCard()

  return (
    <Card
      as="article"
      surface="elevated"
      className={cn(styles.shell(), 'flex max-w-full min-w-0 flex-col', className)}
    >
      {header ? <div className={cn(styles.header(), headerClassName)}>{header}</div> : null}

      <div
        ref={ref}
        className={cn(
          'min-w-0 overflow-x-auto max-dapp:scrollbar-x-track',
          header ? styles.contentBelowHeader() : styles.content(),
          footer && 'pb-0',
          contentClassName,
        )}
      >
        {children}
      </div>

      {footer ? <div className={cn(styles.footer(), footerClassName)}>{footer}</div> : null}
    </Card>
  )
})

export function DappTableCardShell({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  const styles = dappTableCard()
  return (
    <div
      className={cn(cardVariants({ surface: 'elevated' }), styles.shell(), className)}
      {...props}
    />
  )
}
