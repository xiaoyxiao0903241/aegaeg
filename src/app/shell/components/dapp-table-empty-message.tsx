import { DappTableCardShell } from '~/app/components/dapp-table-card'
import { cn } from '~/shared/lib/utils'
import { revealClass } from '~/shared/lib/reveal'

export function DappTableEmptyMessage({
  body,
  className,
  embedded = false,
  title,
}: {
  body?: string
  className?: string
  /** Renders inside `DappTableCard` content — no outer card shell. */
  embedded?: boolean
  title: string
}) {
  const message = (
    <>
      <p className="m-0 text-sm font-medium text-foreground">{title}</p>
      {body ? (
        <p className="mb-0 mt-2 text-xs leading-normal text-muted-foreground">{body}</p>
      ) : null}
    </>
  )

  if (embedded) {
    return (
      <div className={cn('py-8 text-center max-dapp:py-6', className)}>
        {message}
      </div>
    )
  }

  return (
    <DappTableCardShell
      className={cn(
        revealClass(),
        'p-[var(--dapp-table-empty-padding)] text-center',
        'max-dapp:p-[var(--dapp-table-empty-padding-h5)]',
        className,
      )}
      data-reveal
    >
      {message}
    </DappTableCardShell>
  )
}
