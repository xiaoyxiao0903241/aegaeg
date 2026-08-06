import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'

/**
 * 右栏指标卡网格：列数与间距只在此处定义。
 * 同行等高由 grid 默认拉伸保证，子项无需写 h-full / min-h。
 * H5 下 3/4 列收成每行两卡；stackOnDapp 时收成单列。
 * 6 / upper3-lower2 是按列跨度的容器，子项自写 col-span-*。
 * className 只加外边距，勿再覆盖 gap 或列数。
 */
const grid = tv({
  base: ['grid items-stretch gap-3', 'max-dapp:min-w-0 max-dapp:gap-2.5 max-dapp:*:min-w-0'],
  variants: {
    columns: {
      2: 'grid-cols-2',
      3: 'grid-cols-3 max-dapp:grid-cols-2',
      4: [
        'grid-cols-4',
        'max-tablet:grid-cols-[repeat(auto-fit,minmax(min(100%,9.5rem),1fr))]',
        'max-dapp:grid-cols-2',
      ],
      /** 按列跨度的容器：PC 6 列；子项 `col-span-*`（质押 aside triple/pair-plus） */
      6: 'grid-cols-6',
      /** 资产 LP/Burn：H5 两列；PC 上三(span2)下二(span3) */
      'upper3-lower2': [
        'grid-cols-2',
        'dapp:grid-cols-6',
        'dapp:*:col-span-2',
        'dapp:[&>*:nth-child(n+4)]:col-span-3',
      ],
    },
    stackOnDapp: {
      true: 'max-dapp:grid-cols-1!',
      false: '',
    },
  },
  defaultVariants: {
    columns: 4,
    stackOnDapp: false,
  },
})

export type GridColumns = 2 | 3 | 4 | 6 | 'upper3-lower2'

/**
 * 指标卡网格容器。
 *
 * @param columns 列布局，见 {@link GridColumns}
 * @param stackOnDapp H5 下强制单列（覆盖 3/4 列默认的两卡收拢）
 */
export function Grid({
  children,
  className,
  columns = 4,
  stackOnDapp = false,
}: {
  children: ReactNode
  className?: string
  columns?: GridColumns
  /** H5 强制单列（覆盖 3/4 列默认的两卡收拢） */
  stackOnDapp?: boolean
}) {
  return <div className={grid({ columns, stackOnDapp, class: className })}>{children}</div>
}
