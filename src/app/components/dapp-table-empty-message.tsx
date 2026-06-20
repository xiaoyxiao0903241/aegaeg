import { dappTableCardShellClass } from '~/app/components/dapp-table-shell'
import { cn } from '~/lib/utils'
import { revealClass } from '~/lib/reveal'

export function DappTableEmptyMessage({
  body,
  className,
  title,
}: {
  body?: string
  className?: string
  title: string
}) {
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
      <p className="m-0 text-sm font-medium text-foreground">{title}</p>
      {body ? (
        <p className="mb-0 mt-2 text-xs leading-normal text-muted-foreground">{body}</p>
      ) : null}
    </div>
  )
}
