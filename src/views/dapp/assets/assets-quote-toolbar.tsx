import { useState } from 'react'

import { dappAssets } from '~/app/assets'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuPanel,
  DropdownMenuTrigger,
} from '~/shared/components/dropdown-menu'
import { Icon } from '~/shared/components/icon'
import { Segment } from '~/shared/components/segment'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

export type AssetsQuoteCurrency = 'agx' | 'usd'

export type AssetsSortKey = 'startNear' | 'startFar' | 'endNear' | 'endFar'

export type AssetsSortOption = {
  value: AssetsSortKey
  label: string
}

/** Shared AGX/USD Segment + sort menu — 菜单 chrome 走 DropdownMenu. */
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

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <DropdownMenu onOpenChange={setOpen} open={open}>
        <DropdownMenuTrigger
          className={cn(
            // Figma `4518:7174` period：pill · px12 · gap4 · text12
            'inline-flex h-6 cursor-pointer items-center gap-1 rounded-full bg-muted px-3',
            'border-0 text-xs leading-none font-normal text-foreground',
            open && 'text-primary',
          )}
        >
          {sortLabel}
          {/* Figma `4518:7176`：ic-chevron-down 10 · 黑 40%（禁珊瑚上箭头） */}
          <Icon
            alt=""
            className={cn('size-2.5 transition-transform duration-200', open && 'rotate-180')}
            src={dappAssets.chevronDown}
          />
        </DropdownMenuTrigger>
        <DropdownMenuPanel>
          {sortOptions.map((option) => {
            const active = option.value === sortValue
            return (
              <DropdownMenuItem
                key={option.value}
                onSelect={() => onSortChange(option.value)}
                selected={active}
              >
                <span className="min-w-0 flex-1 text-xs leading-none">{option.label}</span>
                {active ? (
                  <Icon alt="" className="size-3.5" size="sm" src={dappAssets.check} />
                ) : (
                  <span className="size-3.5" />
                )}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuPanel>
      </DropdownMenu>

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
