import type { HTMLAttributes, ReactNode } from 'react'

import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

/**
 * DApp 键值列表（Figma `infoBox` 行轨）— 数据驱动 · **不含 Card**：
 * `List` · `Label` · `Value`
 *
 * Call site：`items` map；卡壳外提 `<Card surface="outlined"><List items={…} /></Card>`。
 * 行距 SSOT：`gap-2.5`（稿 10；禁 call site 再盖）。
 * Value：string / ReactNode 一律按内容渲染；数字 reel 由 call site 显式塞 `<CountValue>`。
 *
 * @see docs/foundation/component-usage.md
 */

export type ListItem = {
  label: ReactNode
  value: ReactNode
  valueClassName?: string
}

type ListProps = Omit<HTMLAttributes<HTMLDListElement>, 'children'> & {
  items: ListItem[]
}

function ListRoot({ items, className, ...props }: ListProps) {
  return (
    <dl className={cn('m-0 grid w-full gap-2.5', className)} {...props}>
      {items.map((item, index) => (
        <div className="flex items-center justify-between gap-3" key={index}>
          <dt className="m-0 min-w-0">
            <Label>{item.label}</Label>
          </dt>
          <dd className="m-0 min-w-0">
            <Value className={item.valueClassName}>{item.value}</Value>
          </dd>
        </div>
      ))}
    </dl>
  )
}

/** 左标：detail · Figma text/muted ≡ foreground@40%（≠ muted-foreground≈70%） */
function Label({ className, children, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <Text
      as="span"
      className={cn('leading-4 text-foreground/40', className)}
      variant="detail"
      {...props}
    >
      {children}
    </Text>
  )
}

/** 右值：detail semibold；内容原样（含 string）；禁隐式 CountValue */
function Value({ className, children, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <Text
      as="strong"
      className={cn(
        'mt-0 text-right leading-4 font-semibold [&_a]:text-inherit [&_a]:no-underline [&_a]:hover:underline',
        className,
      )}
      variant="detail"
      {...props}
    >
      {children}
    </Text>
  )
}

export const List = Object.assign(ListRoot, {
  Label,
  Value,
})
