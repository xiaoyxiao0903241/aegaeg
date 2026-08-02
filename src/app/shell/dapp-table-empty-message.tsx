import { DappTableCardShell } from '~/app/shell/dapp-table-card'
import { revealClass } from '~/shared/lib/reveal'
import { cn } from '~/shared/lib/utils'
import { Text } from '~/shared/ui/text'

/** 表/列表空态文案色：稿 muted 40% → `text-foreground/40`（禁 `muted-foreground` 70%）。 */
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
      <Text as="p" className="m-0 text-foreground/40" variant="copy">
        {title}
      </Text>
      {body ? (
        <Text as="p" className="mt-2 mb-0 text-foreground/40" variant="support">
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
