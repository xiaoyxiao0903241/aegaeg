/**
 * 资产页入口
 *
 * 根据当前子视图切换 Hub 总览、质押、LP 债券、燃烧债券、XMine 五种模式，
 * 详情区与侧栏组件分别渲染对应模式的内容。
 */
import { useSubviewDisplayView } from '~/app/shell/subview-panel'
import { TabDetailShell, TabWidgetShell } from '~/app/shell/tab-panel-shell'
import type { AssetsView } from '~/shared/config/dapp-deep-links'
import { useAssetsViewMotion } from '~/stores/assets-view-store'
import { AssetsDetail } from '~/views/dapp/assets/hub/assets-detail'
import { AssetsHubWidget } from '~/views/dapp/assets/hub/assets-hub-widget'
import { AssetsPositionDetail } from '~/views/dapp/assets/position/assets-position-detail'
import { AssetsPositionWidget } from '~/views/dapp/assets/position/assets-position-widget'
import { AssetsXmineDetail } from '~/views/dapp/assets/xmine/assets-xmine-detail'
import { AssetsXmineWidget } from '~/views/dapp/assets/xmine/assets-xmine-widget'

function AssetsWidgetBody() {
  const view = useSubviewDisplayView<AssetsView>()
  if (view === 'stake') return <AssetsPositionWidget product="stake" />
  if (view === 'lpbond') return <AssetsPositionWidget product="lpbond" />
  if (view === 'burnbond') return <AssetsPositionWidget product="burnbond" />
  if (view === 'xmine') return <AssetsXmineWidget />
  return <AssetsHubWidget />
}

function AssetsContentBody() {
  const view = useSubviewDisplayView<AssetsView>()
  if (view === 'stake') return <AssetsPositionDetail product="stake" />
  if (view === 'lpbond') return <AssetsPositionDetail product="lpbond" />
  if (view === 'burnbond') return <AssetsPositionDetail product="burnbond" />
  if (view === 'xmine') return <AssetsXmineDetail />
  return <AssetsDetail />
}

export function AssetsWidget() {
  const subview = useAssetsViewMotion()
  return (
    <TabWidgetShell subview={subview}>
      <AssetsWidgetBody />
    </TabWidgetShell>
  )
}

export function AssetsContent() {
  const subview = useAssetsViewMotion()
  return (
    <TabDetailShell subview={subview}>
      <AssetsContentBody />
    </TabDetailShell>
  )
}
