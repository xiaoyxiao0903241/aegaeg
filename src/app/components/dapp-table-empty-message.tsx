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
        'rounded-[18px] bg-card p-[30px_24px] text-center shadow-card',
        'max-[820px]:border max-[820px]:border-border max-[820px]:p-[22px_16px] max-[820px]:shadow-none',
        className,
      )}
      data-reveal
    >
      <p className="m-0 text-sm font-medium text-foreground">{title}</p>
      {body ? (
        <p className="mb-0 mt-2 text-[13px] leading-normal text-muted-foreground">{body}</p>
      ) : null}
    </div>
  )
}
