/**
 * 创世荣誉顶部横幅
 *
 * 深色背景展示当前股东等级与超级社区说明，右侧为荣誉装饰图。
 */
import type { ReactNode } from 'react'

import { dappAssets } from '~/app/assets'
import { darkBanner } from '~/shared/components/dark-banner'

export function RewardsGenesisBanner({ children }: { children: ReactNode }) {
  const banner = darkBanner()

  return (
    <div
      className={banner.root({
        className: 'mt-4 overflow-visible p-6 max-dapp:p-4.5',
      })}
    >
      <div className={banner.content({ className: 'min-w-0 flex-1 pr-36 max-dapp:pr-0' })}>
        {children}
      </div>
      {/* 荣誉头图：吉祥物动作素材，不做镜像 */}
      <img
        alt=""
        className="pointer-events-none absolute top-1.5 right-6.5 z-0 hidden w-25.75 object-contain select-none md:block"
        height="155"
        loading="lazy"
        src={dappAssets.rewardsCharacter}
        width="103"
      />
    </div>
  )
}
