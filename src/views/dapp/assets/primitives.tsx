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
import { shouldShowTablePagination } from '~/shared/lib/table-pagination'
import { cn } from '~/shared/lib/utils'

/** 空态卡片：顶部骨架行 + 插画空态提示 + 底部主操作按钮 */
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
    <div className="grid gap-3">
      {/* 空态顶部的骨架占位行：阴影卡，无边框 */}
      <Card surface="elevated" className="flex items-center gap-4 rounded-2xl px-5">
        <span aria-hidden className="size-11 shrink-0 rounded-full bg-muted" />
        <span aria-hidden className="grid min-w-0 flex-1 justify-items-start gap-2">
          <span className="w-32 max-w-3/5 rounded-sm bg-muted" />
          <span className="w-20 max-w-2/5 rounded-sm bg-muted" />
        </span>
        <span aria-hidden className="size-7 shrink-0 rounded-control bg-muted" />
      </Card>

      <Card surface="elevated" className="grid gap-3.5 rounded-2xl">
        <div className="grid flex-1 justify-items-center gap-3.5 px-5 py-6">
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
            className="max-w-72 text-center leading-relaxed text-pretty"
            tone="muted-foreground"
            variant="support"
          >
            {body}
          </Text>
        </div>
        <Button
          className="w-full rounded-xl border-0 bg-dark text-white hover:bg-dark hover:text-white hover:opacity-90"
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

export type AssetsQuoteCurrency = 'agx' | 'usd'

export type AssetsSortKey = 'startNear' | 'startFar' | 'endNear' | 'endFar'

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
        empty={empty}
        headers={[...headers]}
        isLoading={isLoading}
        rows={rows}
      />
      {pagination && shouldShowTablePagination(pagination.total) ? (
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
