/** Assets hub：隐藏零余额筛选（齿轮 + checkbox）. */
import { Check } from 'lucide-react'
import { useState } from 'react'

import { dappAssets } from '~/app/assets'
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
 * 资产 Hub 筛选：齿轮 → DropdownMenu（与兑换/排序同一套 chrome）.
 * 勾选盒对齐 HTML 原型 15×15 · r4 · #e86a43；行圆角走 Item 的 rounded-control.
 * 盒内勾用 Lucide（需白描边 currentColor；稿 `ic-check` 为珊瑚烘焙，不适合 img）.
 */
export function AssetsHubFilterMenu({
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
      <DropdownMenuPanel align={align} className="min-w-[10.5rem]">
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
          {/* 原型 checkbox：15×15 · border 1.5 · r4 · 勾选白 */}
          <span
            aria-hidden
            className={cn(
              'grid size-[0.9375rem] shrink-0 place-items-center rounded-[0.25rem] border-[1.5px] transition-colors',
              hideZero ? 'border-primary bg-primary' : 'border-black/30 bg-transparent',
            )}
          >
            <Check
              aria-hidden
              className={cn('size-[0.5625rem] text-white', hideZero ? 'opacity-100' : 'opacity-0')}
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
