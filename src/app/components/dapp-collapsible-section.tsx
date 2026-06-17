import { useId, useState, type ReactNode } from 'react'
import { cn } from '~/lib/utils'
import { dappAssets } from '~/app/assets'
import { DappSection } from '~/app/components/dapp-section'

const COLLAPSE_MS = 320

type DappCollapsibleSectionProps = {
  bodyClassName?: string
  children: ReactNode
  className?: string
  defaultOpen?: boolean
  title: ReactNode
}

export function DappCollapsibleSection({
  bodyClassName,
  children,
  className,
  defaultOpen = true,
  title,
}: DappCollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  const bodyId = useId()

  return (
    <DappSection
      className={className}
      title={
        <button
          aria-controls={bodyId}
          aria-expanded={open}
          className="flex w-full cursor-pointer appearance-none items-center justify-between gap-3 border-0 bg-transparent p-0 text-left hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 active:bg-transparent"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          <span>{title}</span>
          <img
            alt=""
            aria-hidden
            className={cn(
              'size-4 shrink-0 transition-transform duration-[320ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none',
              open ? 'rotate-0' : 'rotate-180',
            )}
            src={dappAssets.chevronUp}
            style={{ transitionDuration: `${COLLAPSE_MS}ms` }}
          />
        </button>
      }
    >
      <div
        className="dapp-collapsible-body"
        data-open={open ? 'true' : 'false'}
        id={bodyId}
        style={{ transitionDuration: `${COLLAPSE_MS}ms` }}
      >
        <div className={cn('dapp-collapsible-inner', bodyClassName)}>{children}</div>
      </div>
    </DappSection>
  )
}
