import type { HTMLAttributes, ReactNode } from 'react'

import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

/**
 * DApp 键值列表（数据驱动，不含卡片）
 *
 * 组合组件：`List` · `Label` · `Value`。用法：
 * 外层套 `<Card surface="outlined">`，`items` 传入条目数组。
 * 数值默认原样渲染；需要数字滚动时由调用方显式塞 `<CountValue>`。
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

/** 左侧标签（次要文字色，区别于弱化文字） */
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

/** 右侧数值：内容原样渲染，不做隐式数字滚动 */
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
