import { Check } from 'lucide-react'
import { useState } from 'react'

import { dappAssets } from '~/shared/assets/dapp'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuPanel,
  DropdownMenuTrigger,
} from '~/shared/components/dropdown-menu'
import { Icon } from '~/shared/components/icon'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

/**
 * Hub 筛选菜单：齿轮弹出「隐藏 0」选项（资产 / 奖励等跨 tab 共用）。
 *
 * 勾选框尺寸与配色按设计稿；勾选图标用 Lucide 白描边。
 */
export function HubFilterMenu({
  align = 'end',
  ariaLabel,
  className,
  hideZero,
  hideZeroLabel,
  onHideZeroChange,
}: {
  align?: 'start' | 'end'
  ariaLabel: string
  className?: string
  hideZero: boolean
  hideZeroLabel: string
  onHideZeroChange: (next: boolean) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenu onOpenChange={setOpen} open={open}>
      <DropdownMenuTrigger
        aria-label={ariaLabel}
        className={cn(
          'grid size-9 min-h-9 shrink-0 place-items-center rounded-control border bg-card p-0',
          'cursor-pointer text-foreground transition-colors',
          open ? 'border-primary/50' : 'border-border hover:border-primary/50',
          className,
        )}
        type="button"
      >
        <Icon alt="" size="lg" src={dappAssets.setting} />
      </DropdownMenuTrigger>
      <DropdownMenuPanel align={align} className="min-w-42">
        <DropdownMenuItem
          aria-checked={hideZero}
          onClick={(event) => {
            // 勾选不关菜单（与 listbox 点选关盘不同）
            event.preventDefault()
            onHideZeroChange(!hideZero)
          }}
          role="menuitemcheckbox"
          selected={hideZero}
        >
          <span
            aria-hidden
            className={cn(
              'grid size-3.75 shrink-0 place-items-center rounded-[0.25rem] border-[1.5px] transition-colors',
              hideZero ? 'border-primary bg-primary' : 'border-black/30 bg-transparent',
            )}
          >
            <Check
              aria-hidden
              className={cn('size-2.25 text-white', hideZero ? 'opacity-100' : 'opacity-0')}
              strokeWidth={3}
            />
          </span>
          <Text as="span" className="tracking-[-0.02em]" variant="copy">
            {hideZeroLabel}
          </Text>
        </DropdownMenuItem>
      </DropdownMenuPanel>
    </DropdownMenu>
  )
}
