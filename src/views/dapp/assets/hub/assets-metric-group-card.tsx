/**
 * 资产持仓或缓冲数据卡
 *
 * 上方标题，下方两列数字；缓冲卡可在标题旁切换币种。
 */
import type { ReactNode } from 'react'

import { Card } from '~/shared/components/card'
import { Text } from '~/shared/components/text'

export function AssetsMetricGroupCard({
  children,
  title,
  titleAction,
}: {
  children: ReactNode
  title: string
  titleAction?: ReactNode
}) {
  return (
    <Card surface="elevated" className="grid gap-1.5">
      {titleAction != null ? (
        <div className="flex items-center justify-between gap-2">
          <Text as="span" className="leading-4 font-medium" variant="copy">
            {title}
          </Text>
          {titleAction}
        </div>
      ) : (
        <Text as="span" className="leading-4 font-medium" variant="copy">
          {title}
        </Text>
      )}
      <div className="grid grid-cols-2 gap-2">{children}</div>
    </Card>
  )
}
