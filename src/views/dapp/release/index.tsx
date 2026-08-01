import { DappSubviewShell, useDappSubviewDisplayView } from '~/app/shell/dapp-subview-panel'
import { useReleaseViewMotion } from '~/stores/release-view-store'
import type { ReleaseView } from '~/shared/config/dapp-deep-links'
import { ReleaseHubWidget } from '~/views/dapp/release/hub/release-hub-widget'
import { ReleaseHubContent } from '~/views/dapp/release/hub/release-hub-content'
import { ReleaseQueueWidget } from '~/views/dapp/release/queue/release-queue-widget'
import { ReleaseQueueContent } from '~/views/dapp/release/queue/release-queue-content'
import { ReleaseBufferWidget } from '~/views/dapp/release/buffer/release-buffer-widget'
import { ReleaseBufferContent } from '~/views/dapp/release/buffer/release-buffer-content'

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

export function ReleaseWidget() {
  const subview = useReleaseViewMotion()
  return (
    <DappSubviewShell
      className="flex min-h-full flex-col max-dapp:h-auto max-dapp:min-h-0"
      panel="widget"
      subview={subview}
    >
      <ReleaseWidgetBody />
    </DappSubviewShell>
  )
}

export function ReleaseContent() {
  const subview = useReleaseViewMotion()
  return (
    <DappSubviewShell className="min-h-0" panel="detail" subview={subview}>
      <ReleaseContentBody />
    </DappSubviewShell>
  )
}
