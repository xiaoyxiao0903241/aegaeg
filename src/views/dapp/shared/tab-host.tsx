import type { ReactNode } from 'react'

import type { DappSubviewMotion } from '~/stores/create-dapp-subview-store'
import { SubviewHost } from '~/views/dapp/shared/subview-panel'

const DOCK_PANEL_CLASS = 'flex min-h-full flex-col max-dapp:h-auto max-dapp:min-h-0'
const DETAIL_PANEL_CLASS = 'min-h-0'

type TabHostProps = {
  subview: DappSubviewMotion
  children: ReactNode
}

/** 跨 Tab 左栏（Dock）面板容器：固化布局类，避免五处页面各自复制。 */
export function TabDockHost({ subview, children }: TabHostProps) {
  return (
    <SubviewHost className={DOCK_PANEL_CLASS} panel="widget" subview={subview}>
      {children}
    </SubviewHost>
  )
}

/** 跨 Tab 详情面板容器：固化 min-h-0。 */
export function TabDetailHost({ subview, children }: TabHostProps) {
  return (
    <SubviewHost className={DETAIL_PANEL_CLASS} panel="detail" subview={subview}>
      {children}
    </SubviewHost>
  )
}
