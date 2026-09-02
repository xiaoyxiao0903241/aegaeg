/**
 * DApp 表容器 — Root / Header / Footer / Frame
 * @see docs/foundation/component-usage.md
 */

import {
  Children,
  type HTMLAttributes,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react'
import { tv } from 'tailwind-variants'

import { Card, cardVariants } from '~/shared/components/card'
import { cn } from '~/shared/lib/utils'

const tableFrame = tv({
  slots: {
    root: 'overflow-hidden rounded-2xl border-0 p-0',
    header: 'border-b border-border/50 px-4 pt-3.5 pb-2.5 max-dapp:px-3.5',
    content: 'px-4 py-1.5 max-dapp:px-3.5',
    contentBelowHeader: 'px-4 pt-0 pb-1.5 max-dapp:px-3.5',
    footer:
      'relative z-10 overflow-visible rounded-b-2xl border-t border-border/50 bg-card dapp:px-4 dapp:py-3 max-dapp:px-3.5 max-dapp:py-2.5',
  },
})

type TableRootProps = {
  children: ReactNode
  className?: string
  contentClassName?: string
}

function isSlot(child: ReactNode, slot: unknown): child is ReactElement {
  return isValidElement(child) && child.type === slot
}

/** 表容器：识别 Header / Footer 子件，其余内容放入可横向滚动的表区 */
function TableRoot({ children, className, contentClassName }: TableRootProps) {
  const styles = tableFrame()
  const list = Children.toArray(children)
  let header: ReactNode = null
  let footer: ReactNode = null
  const body: ReactNode[] = []

  for (const child of list) {
    if (isSlot(child, Header)) header = child
    else if (isSlot(child, Footer)) footer = child
    else body.push(child)
  }

  return (
    <Card
      as="article"
      surface="elevated"
      className={cn(styles.root(), 'flex max-w-full min-w-0 flex-col', className)}
    >
      {header}
      <div
        className={cn(
          'min-w-0 overflow-x-auto max-dapp:scrollbar-x-track',
          header ? styles.contentBelowHeader() : styles.content(),
          footer && 'pb-0',
          contentClassName,
        )}
      >
        {body}
      </div>
      {footer}
    </Card>
  )
}

/** 卡内顶槽（pill / 进度等）；≠ 列名 thead。 */
function Header({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn(tableFrame().header(), className)}>{children}</div>
}

/** 卡内底槽（分页 / 脚注）。 */
function Footer({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn(tableFrame().footer(), className)}>{children}</div>
}

/** 空态 / Auth 自建容器（与 Card elevated 平行） */
function Frame({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(cardVariants({ surface: 'elevated' }), tableFrame().root(), className)}
      {...props}
    />
  )
}

export { Footer, Frame, Header, TableRoot }
