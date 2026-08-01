import { tv } from 'tailwind-variants'
import { DappSubviewShell, useDappSubviewDisplayView } from '~/app/shell/dapp-subview-panel'
import { useAssetsViewMotion } from '~/stores/assets-view-store'
import type { AssetsView } from '~/shared/config/dapp-deep-links'
import { AssetsHubWidget } from '~/views/dapp/assets/hub/assets-hub-widget'
import { AssetsHubContent } from '~/views/dapp/assets/hub/assets-hub-content'
import { AssetsPositionWidget } from '~/views/dapp/assets/position/assets-position-widget'
import { AssetsPositionContent } from '~/views/dapp/assets/position/assets-position-content'
import { AssetsXmineWidget } from '~/views/dapp/assets/xmine/assets-xmine-widget'
import { AssetsXmineContent } from '~/views/dapp/assets/xmine/assets-xmine-content'

const assetsTransitionStack = tv({
  base: 'grid overflow-hidden *:col-start-1 *:row-start-1 *:min-w-0',
})

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
    <DappSubviewShell
      className="flex min-h-full flex-col max-dapp:h-auto max-dapp:min-h-0"
      panel="widget"
      subview={subview}
      transitionClassName={assetsTransitionStack()}
    >
      <AssetsWidgetBody />
    </DappSubviewShell>
  )
}

export function AssetsContent() {
  const subview = useAssetsViewMotion()
  return (
    <DappSubviewShell
      className="min-h-0"
      panel="detail"
      subview={subview}
      transitionClassName={assetsTransitionStack()}
    >
      <AssetsContentBody />
    </DappSubviewShell>
  )
}
