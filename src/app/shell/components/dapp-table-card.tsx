import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { Card, cardVariants } from '~/shared/ui/card'
import { cn } from '~/shared/lib/utils'

/**
 * Table shell chrome on Card `elevated` (E2).
 * INTENTIONAL vs MetricCard: `rounded-2xl` + `border` + `p-0` (header/body/footer own pad).
 * Not Card `soft` (E1 / FAQ) — table elevation stays shadow-card.
 */
const dappTableCard = tv({
  slots: {
    shell: 'overflow-hidden rounded-2xl border border-border p-0',
    header:
      'dapp:px-4 dapp:pt-3.5 dapp:pb-2.5 max-dapp:px-3.5 max-dapp:pt-3.5 max-dapp:pb-2.5 border-b border-border/50',
    content: 'dapp:px-4 dapp:py-1.5 max-dapp:px-3.5 max-dapp:py-1.5',
    contentBelowHeader:
      'dapp:px-4 dapp:pb-1.5 dapp:pt-0 max-dapp:px-3.5 max-dapp:pb-1.5 max-dapp:pt-0',
    footer:
      'dapp:px-4 dapp:py-3 max-dapp:px-3.5 max-dapp:py-2.5 relative z-10 overflow-visible rounded-b-2xl border-t border-border/50 bg-card',
  },
})

export const dappTableCell = tv({
  slots: {
    border: 'border-b-[0.5px] border-border',
    minWidth: 'min-w-[var(--dapp-table-cell-min-width)]',
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

export const DappTableCard = forwardRef<HTMLDivElement, DappTableCardProps>(
  function DappTableCard(
    {
      children,
      className,
      contentClassName,
      footer,
      footerClassName,
      header,
      headerClassName,
    },
    ref,
  ) {
    const styles = dappTableCard()

    return (
      <Card
        as="article"
        surface="elevated"
        className={cn(styles.shell(), 'flex min-w-0 max-w-full flex-col', className)}
      >
        {header ? (
          <div className={cn(styles.header(), headerClassName)}>{header}</div>
        ) : null}

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

        {footer ? (
          <div className={cn(styles.footer(), footerClassName)}>{footer}</div>
        ) : null}
      </Card>
    )
  },
)

export function DappTableCardShell({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  const styles = dappTableCard()
  return (
    <div
      className={cn(cardVariants({ surface: 'elevated' }), styles.shell(), className)}
      {...props}
    />
  )
}
