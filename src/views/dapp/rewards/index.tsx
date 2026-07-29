import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { cn } from '~/shared/lib/utils'
import { useRewardsViewStore, type RewardsView } from '~/stores/rewards-view-store'
import { RewardsHubWidget } from '~/views/dapp/rewards/hub/rewards-hub-widget'
import { RewardsHubContent } from '~/views/dapp/rewards/hub/rewards-hub-content'
import { RewardsSimpleClaimWidget } from '~/views/dapp/rewards/detail/rewards-simple-claim-widget'
import { RewardsMixedClaimWidget } from '~/views/dapp/rewards/detail/rewards-mixed-claim-widget'
import { RewardsDetailContent } from '~/views/dapp/rewards/detail/rewards-detail-content'

const rewardsTransitionStack = tv({
  base: 'grid overflow-hidden *:col-start-1 *:row-start-1 *:min-w-0',
})

function renderRewardsWidget(displayView: RewardsView) {
  if (displayView === 'lucky') return <RewardsMixedClaimWidget view="lucky" />
  if (displayView === 'cobuild') return <RewardsMixedClaimWidget view="cobuild" />
  if (displayView === 'referral') return <RewardsSimpleClaimWidget view="referral" />
  if (displayView === 'participate') return <RewardsSimpleClaimWidget view="participate" />
  if (displayView === 'grant') return <RewardsSimpleClaimWidget view="grant" />
  if (displayView === 'genesis') return <RewardsSimpleClaimWidget view="genesis" />
  return <RewardsHubWidget />
}

function renderRewardsContent(displayView: RewardsView) {
  if (displayView === 'hub') return <RewardsHubContent />
  return <RewardsDetailContent view={displayView} />
}

function RewardsTransitionLayers({
  direction,
  incoming,
  outgoing,
  render,
}: {
  direction: 'forward' | 'back'
  incoming: RewardsView
  outgoing: RewardsView
  render: (view: RewardsView) => ReactNode
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

export function RewardsWidget() {
  const view = useRewardsViewStore((state) => state.view)
  const motion = useRewardsViewStore((state) => state.motion)
  const direction = useRewardsViewStore((state) => state.direction)
  const outgoingView = useRewardsViewStore((state) => state.outgoingView)
  const incomingView = useRewardsViewStore((state) => state.incomingView)

  const isTransitioning = motion && outgoingView && incomingView

  return (
    <div
      className={cn(
        'flex min-h-full flex-col max-dapp:h-auto max-dapp:min-h-0',
        isTransitioning && rewardsTransitionStack(),
      )}
      data-exchange-transitioning={isTransitioning ? 'true' : undefined}
      data-exchange-widget-panel
    >
      {isTransitioning ? (
        <RewardsTransitionLayers
          direction={direction}
          incoming={incomingView}
          outgoing={outgoingView}
          render={renderRewardsWidget}
        />
      ) : (
        renderRewardsWidget(view)
      )}
    </div>
  )
}

export function RewardsContent() {
  const view = useRewardsViewStore((state) => state.view)
  const motion = useRewardsViewStore((state) => state.motion)
  const direction = useRewardsViewStore((state) => state.direction)
  const outgoingView = useRewardsViewStore((state) => state.outgoingView)
  const incomingView = useRewardsViewStore((state) => state.incomingView)

  const isTransitioning = motion && outgoingView && incomingView

  return (
    <div
      className={cn('min-h-0', isTransitioning && rewardsTransitionStack())}
      data-exchange-detail-panel
      data-exchange-transitioning={isTransitioning ? 'true' : undefined}
    >
      {isTransitioning ? (
        <RewardsTransitionLayers
          direction={direction}
          incoming={incomingView}
          outgoing={outgoingView}
          render={renderRewardsContent}
        />
      ) : (
        renderRewardsContent(view)
      )}
    </div>
  )
}
