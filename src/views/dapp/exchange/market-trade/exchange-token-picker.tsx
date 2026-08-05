import { useState } from 'react'

import { CollapseChevron } from '~/shared/components/collapse-chevron'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuPanel,
  DropdownMenuTrigger,
} from '~/shared/components/dropdown-menu'
import { Icon } from '~/shared/components/icon'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

export type ExchangeTokenPickerOption = {
  key: string
  symbol: string
  icon?: string
  balanceLabel: string
  /** Shown in list but not selectable (handbook-silent / DEFER tokens). */
  disabled?: boolean
}

/**
 * Sell/Buy token pill + open list — panel/item chrome 走 DropdownMenu；
 * 行内 icon / symbol / balance 由本 leaf 组；开合箭头 ≡ CollapseChevron。
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
  const selected = options.find((option) => option.key === value) ?? options[0]

  if (!selected) return null

  return (
    <DropdownMenu className="shrink-0 items-center" onOpenChange={setOpen} open={open}>
      <DropdownMenuTrigger
        aria-label={ariaLabel}
        className={cn(
          // Figma tk `4433:415`：icon24 + py-1.5 → pill h36
          'inline-flex items-center gap-2 rounded-full border-0 bg-background px-2.5 py-1.5',
          'transition-colors duration-150 ease-out hover:bg-muted',
          disabled ? 'cursor-default opacity-40' : 'cursor-pointer',
        )}
        disabled={disabled}
      >
        {selected.icon ? (
          <Icon alt="" className="rounded-full" loading="lazy" size="token" src={selected.icon} />
        ) : null}
        <Text as="span" className="leading-none font-semibold" variant="copy">
          {selected.symbol}
        </Text>
        <CollapseChevron open={open} size="md" />
      </DropdownMenuTrigger>

      <DropdownMenuPanel className="min-w-52">
        {options.map((option) => {
          const active = option.key === value
          const optionDisabled = Boolean(option.disabled)
          return (
            <DropdownMenuItem
              disabled={optionDisabled}
              key={option.key}
              onSelect={() => onSelect(option.key)}
              selected={active}
            >
              {option.icon ? (
                <img
                  alt=""
                  className="size-(--app-icon-rail) shrink-0 rounded-full object-contain"
                  loading="lazy"
                  src={option.icon}
                />
              ) : null}
              <Text as="span" className="min-w-0 flex-1 font-semibold" variant="detail">
                {option.symbol}
              </Text>
              <Text
                as="span"
                className="shrink-0 whitespace-nowrap tabular-nums"
                tone="muted-foreground"
                variant="caption"
              >
                {option.balanceLabel}
              </Text>
              <span
                aria-hidden
                className="flex w-3 shrink-0 items-center justify-end text-xs font-bold text-primary"
              >
                {active ? (
                  checkIcon ? (
                    <img alt="" className="size-3" src={checkIcon} />
                  ) : (
                    '✓'
                  )
                ) : null}
              </span>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuPanel>
    </DropdownMenu>
  )
}
