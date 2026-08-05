/**
 * 金额框右侧币种区（组合式）
 *
 * 图标 + 符号，可选 MAX 芯片；挂在 `AmountBox` 的 endAdornment。
 */
import { type ReactNode } from 'react'

import { Icon } from '~/shared/components/icon'
import { Text } from '~/shared/components/text'

function Root({ children }: { children: ReactNode }) {
  return <span className="flex items-center gap-2.5">{children}</span>
}

function Token({ iconSrc, symbol }: { iconSrc: string; symbol: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <Icon alt="" shape="circle" size="rail" src={iconSrc} />
      <Text as="span" className="font-semibold" variant="detail">
        {symbol}
      </Text>
    </span>
  )
}

export const AmountTokenEnd = Object.assign(Root, { Token })
