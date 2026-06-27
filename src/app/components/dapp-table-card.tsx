import { forwardRef, type ReactNode } from 'react'
import {
  dappTableCardShellClass,
  dappTableContentPaddingClass,
  dappTableFooterPaddingClass,
  dappTableHeaderPaddingClass,
  dappTableSectionDividerClass,
} from '~/app/components/dapp-table-shell'
import { cn } from '~/lib/utils'

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
    return (
      <div
        className={cn(
          dappTableCardShellClass,
          'flex min-w-0 max-w-full flex-col',
          className,
        )}
      >
        {header ? (
          <div
            className={cn(
              dappTableHeaderPaddingClass,
              'border-b',
              dappTableSectionDividerClass,
              headerClassName,
            )}
          >
            {header}
          </div>
        ) : null}

        <div
          ref={ref}
          className={cn(
            'min-w-0 overflow-x-auto max-dapp:scrollbar-x-track',
            dappTableContentPaddingClass,
            footer && 'pb-0',
            contentClassName,
          )}
        >
          {children}
        </div>

        {footer ? (
          <div
            className={cn(
              dappTableFooterPaddingClass,
              'relative z-10 overflow-visible rounded-b-2xl border-t bg-card',
              dappTableSectionDividerClass,
              footerClassName,
            )}
          >
            {footer}
          </div>
        ) : null}
      </div>
    )
  },
)
