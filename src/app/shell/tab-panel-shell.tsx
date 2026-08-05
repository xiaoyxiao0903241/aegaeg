import type { ReactNode } from 'react'

import { SubviewShell } from '~/app/shell/subview-panel'
import type { DappSubviewMotion } from '~/stores/create-dapp-subview-store'

const WIDGET_PANEL_CLASS = 'flex min-h-full flex-col max-dapp:h-auto max-dapp:min-h-0'
const DETAIL_PANEL_CLASS = 'min-h-0'

type TabPanelShellProps = {
  subview: DappSubviewMotion
  children: ReactNode
}

/** 跨 Tab 操作区面板容器：固化布局类，避免五处页面各自复制。 */
export function TabWidgetShell({ subview, children }: TabPanelShellProps) {
  return (
    <SubviewShell className={WIDGET_PANEL_CLASS} panel="widget" subview={subview}>
      {children}
    </SubviewShell>
  )
}

/** 跨 Tab 详情面板容器：固化 min-h-0。 */
export function TabDetailShell({ subview, children }: TabPanelShellProps) {
  return (
    <SubviewShell className={DETAIL_PANEL_CLASS} panel="detail" subview={subview}>
      {children}
    </SubviewShell>
  )
}
