/**
 * 资产右栏 Detail：按子视图切换 Hub / 仓位 / XMine 详情。
 */
import type { AssetsView } from '~/shared/config/dapp-deep-links'
import { useAssetsViewMotion } from '~/stores/assets-view-store'
import { HubDetail } from '~/views/dapp/assets/hub/detail'
import { PositionDetail } from '~/views/dapp/assets/position/detail'
import { XmineDetail } from '~/views/dapp/assets/xmine/detail'
import { useSubviewDisplayView } from '~/views/dapp/shared/subview-panel'
import { TabDetailShell } from '~/views/dapp/shared/tab-shell'

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
