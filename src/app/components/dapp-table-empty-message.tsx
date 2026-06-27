import { dappTableCardShellClass } from '~/app/components/dapp-table-shell'
import { cn } from '~/lib/utils'
import { revealClass } from '~/lib/reveal'

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
    <div
      className={cn(
        revealClass(),
        dappTableCardShellClass,
        'p-[30px_24px] text-center',
        'max-dapp:p-[22px_16px]',
        className,
      )}
      data-reveal
    >
      {message}
    </div>
  )
}
