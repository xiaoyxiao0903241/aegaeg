import type { ReactNode } from 'react'
import { FaqList } from '~/components/faq-list'

/** DApp 右侧 / 各 tab 通用 FAQ 栈 —— 样式 SSOT，禁止在 tab 内覆写 shadow / 圆角 */
export function FaqStack({
  className,
  defaultOpenFirst = true,
  items,
  listKey,
}: {
  className?: string
  defaultOpenFirst?: boolean
  /** 切换数据源时传入，保证展开动画与内容同步（如 Swap FAQ 分 tab） */
  listKey?: string
  items: Array<{ a: ReactNode; open?: boolean; q: string }>
}) {
  return (
    <FaqList
      className={className}
      defaultOpenFirst={defaultOpenFirst}
      items={items}
      key={listKey}
      variant="dapp"
    />
  )
}
