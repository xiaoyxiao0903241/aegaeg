/**
 * 资产左栏 Dock：按子视图切换 Hub / 仓位 / XMine。
 */
import type { AssetsView } from '~/shared/config/dapp-deep-links'
import { useAssetsViewMotion } from '~/stores/assets-view-store'
import { AssetsHubDock } from '~/views/dapp/assets/hub/dock'
import { PositionDock } from '~/views/dapp/assets/position/dock'
import { XmineDock } from '~/views/dapp/assets/xmine/dock'
import { useSubviewView } from '~/views/dapp/shared/subview-panel'
import { TabDockHost } from '~/views/dapp/shared/tab-host'

function AssetsDockBody() {
  const view = useSubviewView<AssetsView>()
  if (view === 'stake') return <PositionDock product="stake" />
  if (view === 'lpbond') return <PositionDock product="lpbond" />
  if (view === 'burnbond') return <PositionDock product="burnbond" />
  if (view === 'xmine') return <XmineDock />
  return <AssetsHubDock />
}

export function AssetsDock() {
  const subview = useAssetsViewMotion()
  return (
    <TabDockHost subview={subview}>
      <AssetsDockBody />
    </TabDockHost>
  )
}
