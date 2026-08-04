import type { ReactNode } from 'react'

import { dappAssets } from '~/app/assets'
import { Icon } from '~/shared/components/icon'
import { Text } from '~/shared/components/text'

/** gAGX icon + amount/label row used on claim widgets. */
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
