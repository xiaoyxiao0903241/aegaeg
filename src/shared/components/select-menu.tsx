import { useState } from 'react'

import { CollapseChevron } from '~/shared/components/collapse-chevron'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuPanel,
  DropdownMenuTrigger,
} from '~/shared/components/dropdown-menu'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

export type SelectMenuOption = {
  label: string
  value: string
}

export type SelectMenuVariant = 'pill' | 'field'

/**
 * 选项选择菜单
 *
 * 面板走 DropdownMenu；选项 / 文案由调用方传入。
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
            // 紧凑描边胶囊触发（开奖日期 / 周期）
            'inline-flex h-8.5 items-center gap-1.5 rounded-full border border-border bg-card px-3.5',
          variant === 'field' &&
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
        <CollapseChevron open={open} size="sm" />
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
