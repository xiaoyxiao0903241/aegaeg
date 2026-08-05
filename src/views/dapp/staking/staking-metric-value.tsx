/**
 * 质押详情指标主值
 *
 * 字符串走数字跳动，节点主值原样放入；外层仍用 `Tile` + `Tile.Label`。
 */
import { type ReactNode } from 'react'

import { CountValue } from '~/shared/components/count-value'
import { Text } from '~/shared/components/text'

export function StakingMetricValue({ value }: { value: ReactNode }) {
  return (
    <Text
      as="strong"
      className="block min-w-0 text-base/5 font-semibold tracking-normal"
      variant="headline"
    >
      {typeof value === 'string' ? <CountValue text={value} /> : value}
    </Text>
  )
}
