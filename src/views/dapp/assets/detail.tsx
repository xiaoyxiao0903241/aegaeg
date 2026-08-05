/**
 * 资产右栏 Detail：按子视图切换 Hub / 仓位 / XMine 详情。
 */
import { useSubviewDisplayView } from '~/app/shell/subview-panel'
import { TabDetailShell } from '~/app/shell/tab-panel-shell'
import type { AssetsView } from '~/shared/config/dapp-deep-links'
import { useAssetsViewMotion } from '~/stores/assets-view-store'
import { HubDetail } from '~/views/dapp/assets/hub/detail'
import { PositionDetail } from '~/views/dapp/assets/position/detail'
import { XmineDetail } from '~/views/dapp/assets/xmine/detail'

function AssetsDetailBody() {
  const view = useSubviewDisplayView<AssetsView>()
  if (view === 'stake') return <PositionDetail product="stake" />
  if (view === 'lpbond') return <PositionDetail product="lpbond" />
  if (view === 'burnbond') return <PositionDetail product="burnbond" />
  if (view === 'xmine') return <XmineDetail />
  return <HubDetail />
}

export function AssetsDetail() {
  const subview = useAssetsViewMotion()
  return (
    <TabDetailShell subview={subview}>
      <AssetsDetailBody />
    </TabDetailShell>
  )
}
