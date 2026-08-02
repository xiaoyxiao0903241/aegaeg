import { useState } from 'react'

import { cn } from '~/shared/lib/utils'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuPanel,
  DropdownMenuTrigger,
} from '~/shared/ui/dropdown-menu'
import { Text } from '~/shared/ui/text'

export type RewardsPlanPickerOption = {
  label: string
  value: string
}

/** Period pill + listbox — panel chrome 走 DropdownMenu；行高/字阶本 leaf. */
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
  const selected = options.find((option) => option.value === value) ?? options[0]

  if (!selected) return null

  return (
    <DropdownMenu onOpenChange={setOpen} open={open}>
      <DropdownMenuTrigger
        aria-label={ariaLabel}
        className={cn(
          // Figma dropdown 34：h-8.5
          'inline-flex h-8.5 items-center gap-1.5 rounded-full bg-card px-3.5',
          disabled ? 'cursor-default opacity-40' : 'cursor-pointer',
        )}
        disabled={disabled}
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
      </DropdownMenuTrigger>

      <DropdownMenuPanel align="end">
        {options.map((option) => {
          const active = option.value === value
          return (
            <DropdownMenuItem
              className="h-9 rounded-sm py-0"
              key={option.value}
              onSelect={() => onSelect(option.value)}
              selected={active}
              tone="muted"
            >
              <Text as="span" className="font-medium" variant="caption">
                {option.label}
              </Text>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuPanel>
    </DropdownMenu>
  )
}
