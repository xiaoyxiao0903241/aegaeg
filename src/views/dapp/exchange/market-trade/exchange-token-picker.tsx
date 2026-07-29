import { useEffect, useRef, useState } from 'react'
import { DappIcon } from '~/app/shell/dapp-icon'
import { Text } from '~/shared/ui/text'
import { cn } from '~/shared/lib/utils'

export type ExchangeTokenPickerOption = {
  key: string
  symbol: string
  icon?: string
  balanceLabel: string
}

/**
 * Sell/Buy token pill + open list (Figma chevron · proto dropdown).
 * Options are call-site data (Trade: USD1/AGX); chrome only — no domain presets.
 */
export function ExchangeTokenPicker({
  ariaLabel,
  checkIcon,
  disabled = false,
  onSelect,
  options,
  value,
}: {
  ariaLabel: string
  checkIcon?: string
  disabled?: boolean
  onSelect: (key: string) => void
  options: ExchangeTokenPickerOption[]
  value: string
}) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLSpanElement>(null)
  const selected = options.find((option) => option.key === value) ?? options[0]

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: PointerEvent) {
      const target = event.target
      if (!(target instanceof Node)) return
      if (wrapRef.current && !wrapRef.current.contains(target)) {
        setOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown, { passive: true })
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  if (!selected) return null

  return (
    <span
      ref={wrapRef}
      className={cn('relative inline-flex', open && 'z-50')}
      data-open={open ? '' : undefined}
    >
      <button
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        className={cn(
          'inline-flex items-center gap-2 rounded-full bg-background px-[10px] py-1.5',
          disabled ? 'cursor-default opacity-40' : 'cursor-pointer',
        )}
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        type="button"
      >
        {selected.icon ? (
          <DappIcon alt="" className="rounded-md" loading="lazy" size="token" src={selected.icon} />
        ) : null}
        <Text as="span" className="leading-[1.2] font-semibold" variant="detail">
          {selected.symbol}
        </Text>
        <svg
          aria-hidden
          className="size-2.5 shrink-0 text-muted-foreground"
          fill="none"
          viewBox="0 0 9 5"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1L4.5 4L8 1"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.2"
          />
        </svg>
      </button>

      {open ? (
        <div
          className="absolute top-[calc(100%+0.375rem)] left-0 z-50 min-w-[11.5rem] overflow-clip rounded-md border border-border bg-card p-1.5 shadow-menu"
          role="listbox"
        >
          <ul className="flex flex-col gap-0.5">
            {options.map((option) => {
              const active = option.key === value
              return (
                <li key={option.key}>
                  <button
                    aria-selected={active}
                    className={cn(
                      'flex h-10 w-full cursor-pointer items-center gap-2 rounded-sm bg-transparent px-2.5 text-left',
                      'transition-colors duration-150 ease-out focus-visible:outline-none',
                      active ? 'bg-background' : 'hover:bg-background focus-visible:bg-background',
                    )}
                    onClick={() => {
                      onSelect(option.key)
                      setOpen(false)
                    }}
                    role="option"
                    type="button"
                  >
                    {option.icon ? (
                      <DappIcon
                        alt=""
                        className="rounded-md"
                        loading="lazy"
                        size="token"
                        src={option.icon}
                      />
                    ) : null}
                    <Text as="span" className="min-w-0 flex-1 font-semibold" variant="detail">
                      {option.symbol}
                    </Text>
                    <Text
                      as="span"
                      className="shrink-0 tabular-nums"
                      tone="muted-foreground"
                      variant="caption"
                    >
                      {option.balanceLabel}
                    </Text>
                    {active ? (
                      checkIcon ? (
                        <img alt="" aria-hidden className="size-4 shrink-0" src={checkIcon} />
                      ) : (
                        <Text
                          aria-hidden
                          as="span"
                          className="shrink-0 text-xs font-bold"
                          tone="primary"
                          variant="caption"
                        >
                          ✓
                        </Text>
                      )
                    ) : (
                      <span aria-hidden className="size-4 shrink-0" />
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}
    </span>
  )
}
