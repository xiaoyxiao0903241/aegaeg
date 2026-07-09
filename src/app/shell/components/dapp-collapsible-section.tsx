import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { cn } from '~/shared/lib/utils'
import { dappAssets } from '~/app/assets'
import { DappIcon } from '~/app/shell/components/dapp-icon'
import { DappSection } from '~/app/shell/components/dapp-section'

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
  /** Overflow (e.g. table menus) only after height settle — visible overflow kills 0fr→1fr clip. */
  const [overflowSettled, setOverflowSettled] = useState(defaultOpen)
  const settleTimerRef = useRef<number | null>(null)
  const bodyId = useId()

  useEffect(() => {
    return () => {
      if (settleTimerRef.current != null) {
        window.clearTimeout(settleTimerRef.current)
      }
    }
  }, [])

  const handleToggle = () => {
    if (settleTimerRef.current != null) {
      window.clearTimeout(settleTimerRef.current)
      settleTimerRef.current = null
    }

    if (open) {
      setOpen(false)
      setOverflowSettled(false)
      return
    }

    setOpen(true)
    settleTimerRef.current = window.setTimeout(() => {
      setOverflowSettled(true)
      settleTimerRef.current = null
    }, COLLAPSE_MS)
  }

  return (
    <DappSection
      className={className}
      titleClassName="pb-0"
      title={
        <button
          aria-controls={bodyId}
          aria-expanded={open}
          className="flex w-full cursor-pointer appearance-none items-center justify-between gap-3 border-0 bg-transparent p-0 pb-4 text-left text-inherit hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 active:bg-transparent"
          onClick={handleToggle}
          type="button"
        >
          <span className="min-w-0 flex-1">{title}</span>
          <DappIcon
            alt=""
            aria-hidden
            className={cn(
              'transition-transform duration-[320ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]',
              open ? 'rotate-0' : 'rotate-180',
            )}
            size="base"
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
        <div className={cn('dapp-collapsible-inner', overflowSettled ? bodyClassName : undefined)}>
          {children}
        </div>
      </div>
    </DappSection>
  )
}
