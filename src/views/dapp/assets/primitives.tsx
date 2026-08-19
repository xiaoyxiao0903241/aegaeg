/**
 * 资产域跨 mode 零件：空态卡 / 报价工具栏 / 操作记录表（position + xmine 共用）。
 */
import type { ComponentProps, ReactNode } from 'react'
import { useState } from 'react'

import { dappAssets } from '~/shared/assets/dapp'
import { Button } from '~/shared/components/button'
import { Card } from '~/shared/components/card'
import { CollapseChevron } from '~/shared/components/collapse-chevron'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuPanel,
  DropdownMenuTrigger,
} from '~/shared/components/dropdown-menu'
import { Icon } from '~/shared/components/icon'
import { Segment } from '~/shared/components/segment'
import { Table } from '~/shared/components/table'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

/** 资产子页列表底部留白：滚出左栏渐隐，不改共享 DockPanel。 */
export function AssetsDockScrollClearance() {
  return (
    <div
      aria-hidden
      className="hidden shrink-0 dapp:block dapp:h-[calc(var(--app-scroll-fade)+0.5rem)]"
    />
  )
}

/** 仓位空态：顶上一行骨架，下面主卡 PC 吃满剩余高度，按钮贴底 */
export function AssetsPositionEmptyCard({
  title,
  body,
  ctaLabel,
  onCta,
}: {
  title: string
  body: string
  ctaLabel: string
  onCta: () => void
}) {
  return (
    <div className="flex min-h-0 flex-col gap-3 dapp:min-h-0 dapp:flex-1 max-dapp:flex-none">
      <Card
        aria-hidden
        className="flex shrink-0 items-center gap-4 rounded-2xl px-5 py-3.5"
        surface="elevated"
      >
        <span className="size-11 shrink-0 rounded-full bg-muted" />
        <span className="grid min-w-0 flex-1 justify-items-start gap-2">
          <span className="h-3.5 w-[132px] max-w-3/5 rounded-md bg-muted" />
          <span className="h-2.5 w-20 max-w-[38%] rounded-md bg-muted" />
        </span>
        <span className="size-7 shrink-0 rounded-[9px] bg-muted" />
      </Card>

      <Card
        className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl p-3.5 max-dapp:min-h-[420px]"
        surface="elevated"
      >
        <div className="flex flex-1 flex-col items-center justify-center gap-3.5 px-5 py-6">
          <img
            alt=""
            className="size-21 object-contain"
            decoding="async"
            src={dappAssets.assetsPositionEmptyArt}
          />
          <Text as="p" className="text-center font-semibold" variant="detail">
            {title}
          </Text>
          <Text
            as="p"
            className="max-w-[300px] text-center leading-relaxed text-pretty text-foreground/40"
            variant="support"
          >
            {body}
          </Text>
        </div>
        <Button
          className="h-11.5 min-h-11.5 w-full shrink-0 rounded-xl border-0 bg-dark text-sm font-semibold text-white hover:bg-dark hover:text-white hover:opacity-90"
          onClick={onCta}
          shape="rounded"
          type="button"
          variant="secondary"
        >
          {ctaLabel}
        </Button>
      </Card>
    </div>
  )
}

import type { AssetsSortKey } from '~/stores/assets-session-store'

export type { AssetsSortKey } from '~/stores/assets-session-store'

export type AssetsQuoteCurrency = 'agx' | 'usd'

export type AssetsSortOption = {
  value: AssetsSortKey
  label: string
}

/** 计价币种切换与排序菜单：报价币在 Segment 切换，排序项走下拉菜单 */
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
            // 排序按钮：胶囊样式，选中时主色高亮
            'inline-flex h-6 cursor-pointer items-center gap-1 rounded-full bg-muted px-3',
            'border-0 text-xs leading-none font-normal text-foreground',
            open && 'text-primary',
          )}
        >
          {sortLabel}
          <CollapseChevron open={open} size="sm" />
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

/** 资产操作记录表：可加载态；可选分页页脚 */
export function AssetsOpsTable({
  empty,
  headers,
  isLoading,
  rows,
  pagination,
}: {
  empty: string
  headers: ReadonlyArray<string>
  isLoading: boolean
  rows: ComponentProps<typeof Table.Body>['rows']
  pagination?: {
    page: number
    total: number
    onPageChange: (page: number) => void
    summary?: ReactNode
  }
}) {
  return (
    <Table>
      <Table.Body
        colWidths={['12.5rem', '9.375rem', '11.25rem', '1fr']}
        emphasisColumns={[1]}
        empty={empty}
        headers={[...headers]}
        isLoading={isLoading}
        mutedColumns={[0]}
        rows={rows}
      />
      {pagination ? (
        <Table.Footer>
          <Table.Pagination
            onPageChange={pagination.onPageChange}
            page={pagination.page}
            summary={pagination.summary}
            total={pagination.total}
          />
        </Table.Footer>
      ) : null}
    </Table>
  )
}
