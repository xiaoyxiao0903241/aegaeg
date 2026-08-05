import type { ReactNode } from 'react'

import { dappAssets } from '~/app/assets'
import { Icon } from '~/shared/components/icon'
import { Text } from '~/shared/components/text'

/**
 * gAGX 图标 + 数值 / 标签行（领取控件共用）
 *
 * @param children 数值或标签内容
 * @param textVariant 文字样式
 */
export function RewardsGagxAmount({
  children,
  textVariant = 'copy',
}: {
  children: ReactNode
  textVariant?: 'copy' | 'headline'
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon
        alt=""
        className="size-(--app-icon-lg) rounded-full"
        loading="lazy"
        size="token"
        src={dappAssets.tokenGagx}
      />
      <Text as="p" className="font-semibold" variant={textVariant}>
        {children}
      </Text>
    </div>
  )
}
