/**
 * 资产页入口
 *
 * 根据当前子视图切换 Hub 总览、质押、LP 债券、燃烧债券、XMine 五种模式，
 * 详情区与侧栏组件分别渲染对应模式的内容。
 */
import { useDappSubviewDisplayView } from '~/app/shell/dapp-subview-panel'
import { DappTabDetailShell, DappTabWidgetShell } from '~/app/shell/dapp-tab-panel-shell'
import type { AssetsView } from '~/shared/config/dapp-deep-links'
import { useAssetsViewMotion } from '~/stores/assets-view-store'
import { AssetsHubContent } from '~/views/dapp/assets/hub/assets-hub-content'
import { AssetsHubWidget } from '~/views/dapp/assets/hub/assets-hub-widget'
import { AssetsPositionContent } from '~/views/dapp/assets/position/assets-position-content'
import { AssetsPositionWidget } from '~/views/dapp/assets/position/assets-position-widget'
import { AssetsXmineContent } from '~/views/dapp/assets/xmine/assets-xmine-content'
import { AssetsXmineWidget } from '~/views/dapp/assets/xmine/assets-xmine-widget'

function AssetsWidgetBody() {
  const view = useDappSubviewDisplayView<AssetsView>()
  if (view === 'stake') return <AssetsPositionWidget product="stake" />
  if (view === 'lpbond') return <AssetsPositionWidget product="lpbond" />
  if (view === 'burnbond') return <AssetsPositionWidget product="burnbond" />
  if (view === 'xmine') return <AssetsXmineWidget />
  return <AssetsHubWidget />
}

function AssetsContentBody() {
  const view = useDappSubviewDisplayView<AssetsView>()
  if (view === 'stake') return <AssetsPositionContent product="stake" />
  if (view === 'lpbond') return <AssetsPositionContent product="lpbond" />
  if (view === 'burnbond') return <AssetsPositionContent product="burnbond" />
  if (view === 'xmine') return <AssetsXmineContent />
  return <AssetsHubContent />
}

export function AssetsWidget() {
  const subview = useAssetsViewMotion()
  return (
    <DappTabWidgetShell subview={subview}>
      <AssetsWidgetBody />
    </DappTabWidgetShell>
  )
}

export function AssetsContent() {
  const subview = useAssetsViewMotion()
  return (
    <DappTabDetailShell subview={subview}>
      <AssetsContentBody />
    </DappTabDetailShell>
  )
}
