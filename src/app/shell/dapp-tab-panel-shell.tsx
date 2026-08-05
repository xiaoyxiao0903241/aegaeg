import type { ReactNode } from 'react'

import { DappSubviewShell } from '~/app/shell/dapp-subview-panel'
import type { DappSubviewMotion } from '~/stores/create-dapp-subview-store'

const WIDGET_PANEL_CLASS = 'flex min-h-full flex-col max-dapp:h-auto max-dapp:min-h-0'
const DETAIL_PANEL_CLASS = 'min-h-0'

type DappTabPanelShellProps = {
  subview: DappSubviewMotion
  children: ReactNode
}

/** 跨 Tab 操作区面板容器：固化布局类，避免五处页面各自复制。 */
export function DappTabWidgetShell({ subview, children }: DappTabPanelShellProps) {
  return (
    <DappSubviewShell className={WIDGET_PANEL_CLASS} panel="widget" subview={subview}>
      {children}
    </DappSubviewShell>
  )
}

/** 跨 Tab 详情面板容器：固化 min-h-0。 */
export function DappTabDetailShell({ subview, children }: DappTabPanelShellProps) {
  return (
    <DappSubviewShell className={DETAIL_PANEL_CLASS} panel="detail" subview={subview}>
      {children}
    </DappSubviewShell>
  )
}
