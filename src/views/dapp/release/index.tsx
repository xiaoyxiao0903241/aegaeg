import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { cn } from '~/shared/lib/utils'
import { useReleaseViewStore, type ReleaseView } from '~/stores/release-view-store'
import { ReleaseHubWidget } from '~/views/dapp/release/hub/release-hub-widget'
import { ReleaseHubContent } from '~/views/dapp/release/hub/release-hub-content'
import { ReleaseQueueWidget } from '~/views/dapp/release/queue/release-queue-widget'
import { ReleaseQueueContent } from '~/views/dapp/release/queue/release-queue-content'
import { ReleaseBufferWidget } from '~/views/dapp/release/buffer/release-buffer-widget'
import { ReleaseBufferContent } from '~/views/dapp/release/buffer/release-buffer-content'

const releaseTransitionStack = tv({
  base: 'grid overflow-hidden *:col-start-1 *:row-start-1 *:min-w-0',
})

function renderReleaseWidget(displayView: ReleaseView) {
  if (displayView === 'queue') return <ReleaseQueueWidget />
  if (displayView === 'buffer') return <ReleaseBufferWidget />
  return <ReleaseHubWidget />
}

function renderReleaseContent(displayView: ReleaseView) {
  if (displayView === 'queue') return <ReleaseQueueContent />
  if (displayView === 'buffer') return <ReleaseBufferContent />
  return <ReleaseHubContent />
}

function ReleaseTransitionLayers({
  direction,
  incoming,
  outgoing,
  render,
}: {
  direction: 'forward' | 'back'
  incoming: ReleaseView
  outgoing: ReleaseView
  render: (view: ReleaseView) => ReactNode
}) {
  return (
    <>
      <div
        className="exchange-view-layer exchange-view-layer-exit"
        data-exchange-direction={direction}
      >
        <div className="exchange-view-layer-motion">{render(outgoing)}</div>
      </div>
      <div
        className="exchange-view-layer exchange-view-layer-enter"
        data-exchange-direction={direction}
      >
        <div className="exchange-view-layer-motion">{render(incoming)}</div>
      </div>
    </>
  )
}

export function ReleaseWidget() {
  const view = useReleaseViewStore((state) => state.view)
  const motion = useReleaseViewStore((state) => state.motion)
  const direction = useReleaseViewStore((state) => state.direction)
  const outgoingView = useReleaseViewStore((state) => state.outgoingView)
  const incomingView = useReleaseViewStore((state) => state.incomingView)

  const isTransitioning = motion && outgoingView && incomingView

  return (
    <div
      className={cn(
        'flex min-h-full flex-col max-dapp:h-auto max-dapp:min-h-0',
        isTransitioning && releaseTransitionStack(),
      )}
      data-exchange-transitioning={isTransitioning ? 'true' : undefined}
      data-exchange-widget-panel
      data-release-root
    >
      {isTransitioning ? (
        <ReleaseTransitionLayers
          direction={direction}
          incoming={incomingView}
          outgoing={outgoingView}
          render={renderReleaseWidget}
        />
      ) : (
        renderReleaseWidget(view)
      )}
    </div>
  )
}

export function ReleaseContent() {
  const view = useReleaseViewStore((state) => state.view)
  const motion = useReleaseViewStore((state) => state.motion)
  const direction = useReleaseViewStore((state) => state.direction)
  const outgoingView = useReleaseViewStore((state) => state.outgoingView)
  const incomingView = useReleaseViewStore((state) => state.incomingView)

  const isTransitioning = motion && outgoingView && incomingView

  return (
    <div
      className={cn('min-h-0', isTransitioning && releaseTransitionStack())}
      data-exchange-detail-panel
      data-exchange-transitioning={isTransitioning ? 'true' : undefined}
    >
      {isTransitioning ? (
        <ReleaseTransitionLayers
          direction={direction}
          incoming={incomingView}
          outgoing={outgoingView}
          render={renderReleaseContent}
        />
      ) : (
        renderReleaseContent(view)
      )}
    </div>
  )
}
