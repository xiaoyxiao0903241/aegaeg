import { useDappSubviewDisplayView } from '~/app/shell/dapp-subview-panel'
import { DappTabDetailShell, DappTabWidgetShell } from '~/app/shell/dapp-tab-panel-shell'
import type { ReleaseView } from '~/shared/config/dapp-deep-links'
import { useReleaseViewMotion } from '~/stores/release-view-store'
import { ReleaseBufferContent } from '~/views/dapp/release/buffer/release-buffer-content'
import { ReleaseBufferWidget } from '~/views/dapp/release/buffer/release-buffer-widget'
import { ReleaseHubContent } from '~/views/dapp/release/hub/release-hub-content'
import { ReleaseHubWidget } from '~/views/dapp/release/hub/release-hub-widget'
import { ReleaseQueueContent } from '~/views/dapp/release/queue/release-queue-content'
import { ReleaseQueueWidget } from '~/views/dapp/release/queue/release-queue-widget'

function ReleaseWidgetBody() {
  const view = useDappSubviewDisplayView<ReleaseView>()
  if (view === 'queue') return <ReleaseQueueWidget />
  if (view === 'buffer') return <ReleaseBufferWidget />
  return <ReleaseHubWidget />
}

function ReleaseContentBody() {
  const view = useDappSubviewDisplayView<ReleaseView>()
  if (view === 'queue') return <ReleaseQueueContent />
  if (view === 'buffer') return <ReleaseBufferContent />
  return <ReleaseHubContent />
}

/** 释放侧栏面板：按当前子视图渲染对应 Widget，并带切换动画 */
export function ReleaseWidget() {
  const subview = useReleaseViewMotion()
  return (
    <DappTabWidgetShell subview={subview}>
      <ReleaseWidgetBody />
    </DappTabWidgetShell>
  )
}

/** 释放详情容器：按当前子视图渲染对应 Content，并带切换动画 */
export function ReleaseContent() {
  const subview = useReleaseViewMotion()
  return (
    <DappTabDetailShell subview={subview}>
      <ReleaseContentBody />
    </DappTabDetailShell>
  )
}
