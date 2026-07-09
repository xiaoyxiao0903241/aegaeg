import { DappTableCardShell } from '~/app/shell/components/dapp-table-card'
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
      <Text as="p" variant="copy" className="m-0 font-medium">
        {title}
      </Text>
      {body ? (
        <Text as="p" variant="support" tone="muted-foreground" className="mb-0 mt-2">
          {body}
        </Text>
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
