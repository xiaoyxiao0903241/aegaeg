import { useEffect, useId, useRef, useState } from 'react'

import { dappAssets } from '~/app/assets'
import { DappIcon } from '~/app/shell/dapp-icon'
import { cn } from '~/shared/lib/utils'
import { Segment } from '~/shared/ui/segment'
import { Text } from '~/shared/ui/text'

export type AssetsQuoteCurrency = 'agx' | 'usd'

export type AssetsSortKey = 'startNear' | 'startFar' | 'endNear' | 'endFar'

export type AssetsSortOption = {
  value: AssetsSortKey
  label: string
}

/** Shared AGX/USD Segment + sort menu — Figma toolbar / HTML 原型. */
export function AssetsQuoteToolbar({
  quote,
  onQuoteChange,
  quoteLabel,
  sortLabel,
  sortValue,
  sortOptions,
  onSortChange,
}: {
  quote: AssetsQuoteCurrency
  onQuoteChange: (quote: AssetsQuoteCurrency) => void
  quoteLabel: string
  sortLabel: string
  sortValue: AssetsSortKey
  sortOptions: readonly AssetsSortOption[]
  onSortChange: (value: AssetsSortKey) => void
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="relative" ref={rootRef}>
        <button
          aria-controls={menuId}
          aria-expanded={open}
          aria-haspopup="listbox"
          className={cn(
            'inline-flex h-6 cursor-pointer items-center gap-1 rounded-full bg-muted px-3',
            'border-0 text-xs leading-none font-normal text-foreground',
            open && 'text-primary',
          )}
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          {sortLabel}
          <DappIcon
            alt=""
            className={cn('size-2.5 transition-transform duration-200', open && 'rotate-180')}
            size="sm"
            src={dappAssets.chevron}
          />
        </button>
        {open ? (
          <ul
            className="absolute top-[calc(100%+0.375rem)] left-0 z-20 grid min-w-44 gap-0.5 rounded-xl border border-border bg-card p-1.5 shadow-menu"
            id={menuId}
            role="listbox"
          >
            {sortOptions.map((option) => {
              const active = option.value === sortValue
              return (
                <li key={option.value} role="none">
                  <button
                    aria-selected={active}
                    className={cn(
                      'flex w-full cursor-pointer items-center justify-between gap-2.5 rounded-lg border-0 px-2.5 py-2 text-left text-xs leading-none',
                      active
                        ? 'bg-coral-wash font-semibold text-primary'
                        : 'bg-transparent font-normal text-foreground hover:bg-muted',
                    )}
                    onClick={() => {
                      onSortChange(option.value)
                      setOpen(false)
                    }}
                    role="option"
                    type="button"
                  >
                    <span>{option.label}</span>
                    {active ? (
                      <DappIcon alt="" className="size-3.5" size="sm" src={dappAssets.check} />
                    ) : (
                      <span className="size-3.5" />
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        ) : null}
      </div>

      <div className="flex items-center gap-1">
        <Text as="span" className="leading-4" tone="muted-foreground" variant="support">
          {quoteLabel}
        </Text>
        <Segment
          aria-label={quoteLabel}
          className="w-auto min-w-28"
          onChange={(value) => onQuoteChange(value as AssetsQuoteCurrency)}
          options={[
            { value: 'agx', label: 'AGX' },
            { value: 'usd', label: 'USD' },
          ]}
          size="sm"
          tone="ink"
          value={quote}
        />
      </div>
    </div>
  )
}
