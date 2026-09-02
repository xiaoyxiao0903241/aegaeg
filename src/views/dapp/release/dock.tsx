/**
 * 释放左栏 Dock。
 */
import type { ReleaseView } from '~/shared/config/dapp-deep-links'
import { useReleaseViewMotion } from '~/stores/release-view-store'
import { BufferDock } from '~/views/dapp/release/buffer/dock'
import { ReleaseHubDock } from '~/views/dapp/release/hub/dock'
import { QueueDock } from '~/views/dapp/release/queue/dock'
import { useSubviewView } from '~/views/dapp/shared/subview-panel'
import { TabDockHost } from '~/views/dapp/shared/tab-host'

function ReleaseDockBody() {
  const view = useSubviewView<ReleaseView>()
  if (view === 'queue') return <QueueDock />
  if (view === 'buffer') return <BufferDock />
  return <ReleaseHubDock />
}

export function ReleaseDock() {
  const subview = useReleaseViewMotion()
  return (
    <TabDockHost subview={subview}>
      <ReleaseDockBody />
    </TabDockHost>
  )
}
