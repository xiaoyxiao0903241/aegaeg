/**
 * 资产左栏 Dock：按子视图切换 Hub / 仓位 / XMine。
 * `key` 含地址，使弹层 / 确认用 `useState` 在换钱包时随 remount 复位（禁 effect 跟 prop 清状态）。
 */
import type { AssetsView } from '~/shared/config/dapp-deep-links'
import { walletRemountKey } from '~/shared/lib/utils'
import { useAssetsViewMotion } from '~/stores/assets-view-store'
import { AssetsHubDock } from '~/views/dapp/assets/hub/dock'
import { PositionDock } from '~/views/dapp/assets/position/dock'
import { XmineDock } from '~/views/dapp/assets/xmine/dock'
import { useSubviewView } from '~/views/dapp/shared/subview-panel'
import { TabDockHost } from '~/views/dapp/shared/tab-host'
import { useActiveAccount } from '~/web3/thirdweb-react'

function AssetsDockBody() {
  const view = useSubviewView<AssetsView>()
  const walletKey = walletRemountKey(useActiveAccount()?.address)
  if (view === 'stake') return <PositionDock key={`stake:${walletKey}`} product="stake" />
  if (view === 'lpbond') return <PositionDock key={`lpbond:${walletKey}`} product="lpbond" />
  if (view === 'burnbond') return <PositionDock key={`burnbond:${walletKey}`} product="burnbond" />
  if (view === 'xmine') return <XmineDock key={`xmine:${walletKey}`} />
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
