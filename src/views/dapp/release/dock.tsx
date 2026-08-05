/**
 * 释放左栏 Dock。
 */
import { useSubviewDisplayView } from '~/app/shell/subview-panel'
import { TabWidgetShell } from '~/app/shell/tab-panel-shell'
import type { ReleaseView } from '~/shared/config/dapp-deep-links'
import { useReleaseViewMotion } from '~/stores/release-view-store'
import { BufferDock } from '~/views/dapp/release/buffer/dock'
import { HubDock } from '~/views/dapp/release/hub/dock'
import { QueueDock } from '~/views/dapp/release/queue/dock'

function ReleaseDockBody() {
  const view = useSubviewDisplayView<ReleaseView>()
  if (view === 'queue') return <QueueDock />
  if (view === 'buffer') return <BufferDock />
  return <HubDock />
}

export function ReleaseDock() {
  const subview = useReleaseViewMotion()
  return (
    <TabWidgetShell subview={subview}>
      <ReleaseDockBody />
    </TabWidgetShell>
  )
}
