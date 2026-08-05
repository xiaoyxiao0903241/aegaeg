/**
 * 表单信息卡（组合式）
 *
 * 描边卡包裹 `List`；质押 / 兑换左栏交易信息区共用。
 */
import { type ComponentProps, type ReactNode } from 'react'

import { Card } from '~/shared/components/card'
import { List } from '~/shared/components/list'
import { cn } from '~/shared/lib/utils'

function Root({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Card as="div" className={cn(className)} surface="outlined">
      {children}
    </Card>
  )
}

function Rows(props: ComponentProps<typeof List>) {
  return <List {...props} />
}

export const MetaListCard = Object.assign(Root, { Rows })
