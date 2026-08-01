import { useRef, useState } from 'react'

import { cn } from '~/shared/lib/utils'
import { Text } from '~/shared/ui/text'
import { useDismissOnOutside } from '~/shared/ui/use-dismiss-on-outside'

export type RewardsPlanPickerOption = {
  label: string
  value: string
}

/** Period pill + listbox — Figma Lucky/Mixed dropdown chrome; options from call site. */
export function RewardsPlanPicker({
  ariaLabel,
  disabled = false,
  onSelect,
  options,
  value,
}: {
  ariaLabel: string
  disabled?: boolean
  onSelect: (value: string) => void
  options: readonly RewardsPlanPickerOption[]
  value: string
}) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLSpanElement>(null)
  const selected = options.find((option) => option.value === value) ?? options[0]

  useDismissOnOutside(open, wrapRef, () => setOpen(false))

  if (!selected) return null

  return (
    <span ref={wrapRef} className={cn('relative inline-flex', open && 'z-50')}>
      <button
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full bg-card px-3.5 py-2',
          disabled ? 'cursor-default opacity-40' : 'cursor-pointer',
        )}
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        type="button"
      >
        <Text as="span" className="font-medium" variant="caption">
          {selected.label}
        </Text>
        <svg
          aria-hidden
          className="h-1.5 w-2.5 shrink-0 text-muted-foreground"
          fill="none"
          viewBox="0 0 10 6"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1L5 5L9 1"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.2"
          />
        </svg>
      </button>

      {open ? (
        <div
          className="absolute top-[calc(100%+0.375rem)] right-0 z-50 min-w-44 overflow-clip rounded-md border border-border bg-card p-1.5 shadow-menu"
          role="listbox"
        >
          <ul className="flex flex-col gap-0.5">
            {options.map((option) => {
              const active = option.value === value
              return (
                <li key={option.value}>
                  <button
                    aria-selected={active}
                    className={cn(
                      'flex h-9 w-full cursor-pointer items-center rounded-sm px-2.5 text-left',
                      active ? 'bg-background' : 'hover:bg-background',
                    )}
                    onClick={() => {
                      onSelect(option.value)
                      setOpen(false)
                    }}
                    role="option"
                    type="button"
                  >
                    <Text as="span" className="font-medium" variant="caption">
                      {option.label}
                    </Text>
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
