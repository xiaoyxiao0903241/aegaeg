import { useState } from 'react'

import { cn } from '~/shared/lib/utils'
import { ChevronIcon } from '~/shared/ui/chevron-icon'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuPanel,
  DropdownMenuTrigger,
} from '~/shared/ui/dropdown-menu'
import { Text } from '~/shared/ui/text'

export type SelectMenuOption = {
  label: string
  value: string
}

export type SelectMenuVariant = 'pill' | 'field'

/**
 * 选项 listbox chrome — panel 走 DropdownMenu；options / 文案由 call site 传入。
 * `pill`：奖励周期等紧凑触发；`field`：领取弹窗全宽描边触发。
 */
export function SelectMenu({
  align = 'end',
  ariaLabel,
  className,
  disabled = false,
  onSelect,
  options,
  value,
  variant = 'pill',
}: {
  align?: 'start' | 'end'
  ariaLabel: string
  className?: string
  disabled?: boolean
  onSelect: (value: string) => void
  options: readonly SelectMenuOption[]
  value: string
  variant?: SelectMenuVariant
}) {
  const [open, setOpen] = useState(false)
  const selected = options.find((option) => option.value === value) ?? options[0]

  if (!selected) return null

  return (
    <DropdownMenu className={className} onOpenChange={setOpen} open={open}>
      <DropdownMenuTrigger
        aria-label={ariaLabel}
        className={cn(
          variant === 'pill' &&
            // Figma dropdown 34：h-8.5 · 描边 pill（开奖日期 / 周期）
            'inline-flex h-8.5 items-center gap-1.5 rounded-full border border-border bg-card px-3.5',
          variant === 'field' &&
            // Figma claim dd `4812:237`：radius 12 → rounded-faq（禁 rounded-xl=28px）
            'flex h-10.5 w-full cursor-pointer items-center justify-between gap-2 rounded-faq border border-border bg-card px-3.5 text-left text-sm text-foreground outline-none',
          variant === 'field' && open && 'border-primary',
          disabled ? 'cursor-default opacity-40' : variant === 'pill' && 'cursor-pointer',
        )}
        disabled={disabled}
      >
        <Text
          as="span"
          className={cn('font-medium', variant === 'field' && 'min-w-0 truncate')}
          variant="copy"
        >
          {selected.label}
        </Text>
        {variant === 'pill' ? (
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
        ) : (
          <ChevronIcon
            aria-hidden
            className={cn(
              'size-2.5 shrink-0 text-muted-foreground transition-transform duration-200',
              open ? 'rotate-[270deg]' : 'rotate-90',
            )}
            direction="right"
          />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuPanel
        align={align}
        className={variant === 'field' ? 'w-full min-w-0' : undefined}
      >
        {options.map((option) => {
          const active = option.value === value
          return (
            <DropdownMenuItem
              className="h-9 py-0"
              key={option.value}
              onSelect={() => onSelect(option.value)}
              selected={active}
              tone="accent"
            >
              <Text as="span" className="font-medium" variant="copy">
                {option.label}
              </Text>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuPanel>
    </DropdownMenu>
  )
}
