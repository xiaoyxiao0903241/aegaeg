import { DappTableCardShell } from '~/app/shell/dapp-table-card'
import { Text } from '~/shared/ui/text'
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
      <Text as="p" variant="copy" className="m-0 text-black/40">
        {title}
      </Text>
      {body ? (
        <Text as="p" variant="support" className="mt-2 mb-0 text-black/40">
          {body}
        </Text>
      ) : null}
    </>
  )

  if (embedded) {
    return <div className={cn('px-5 py-11 text-center max-dapp:py-8', className)}>{message}</div>
  }

  return (
    <DappTableCardShell
      className={cn(
        revealClass(),
        'p-(--dapp-table-empty-padding) text-center',
        'max-dapp:p-(--dapp-table-empty-padding-h5)',
        className,
      )}
      data-reveal
    >
      {message}
    </DappTableCardShell>
  )
}
