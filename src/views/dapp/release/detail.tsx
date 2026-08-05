/**
 * 释放右栏 Detail。
 */
import type { ReleaseView } from '~/shared/config/dapp-deep-links'
import { useReleaseViewMotion } from '~/stores/release-view-store'
import { BufferDetail } from '~/views/dapp/release/buffer/detail'
import { HubDetail } from '~/views/dapp/release/hub/detail'
import { QueueDetail } from '~/views/dapp/release/queue/detail'
import { useSubviewDisplayView } from '~/views/dapp/shared/subview-panel'
import { TabDetailHost } from '~/views/dapp/shared/tab-host'

function ReleaseDetailBody() {
  const view = useSubviewDisplayView<ReleaseView>()
  if (view === 'queue') return <QueueDetail />
  if (view === 'buffer') return <BufferDetail />
  return <HubDetail />
}

export function ReleaseDetail() {
  const subview = useReleaseViewMotion()
  return (
    <TabDetailHost subview={subview}>
      <ReleaseDetailBody />
    </TabDetailHost>
  )
}
