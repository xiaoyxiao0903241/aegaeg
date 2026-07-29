import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { cn } from '~/shared/lib/utils'
import { useStakingViewStore, type StakingView } from '~/stores/staking-view-store'
import { StakingHubWidget } from '~/views/dapp/staking/hub/staking-hub-widget'
import { StakingHubContent } from '~/views/dapp/staking/hub/staking-hub-content'
import { StakeWidget } from '~/views/dapp/staking/stake/stake-widget'
import { StakeContent } from '~/views/dapp/staking/stake/stake-content'
import { BondWidget } from '~/views/dapp/staking/bond/bond-widget'
import { BondContent } from '~/views/dapp/staking/bond/bond-content'
import { XmineWidget } from '~/views/dapp/staking/xmine/xmine-widget'
import { XmineContent } from '~/views/dapp/staking/xmine/xmine-content'
import { CalcWidget } from '~/views/dapp/staking/calc/calc-widget'
import { CalcContent } from '~/views/dapp/staking/calc/calc-content'

const stakingTransitionStack = tv({
  base: 'grid overflow-hidden *:col-start-1 *:row-start-1 *:min-w-0',
})

function renderStakingWidget(displayView: StakingView) {
  if (displayView === 'stake') return <StakeWidget />
  if (displayView === 'lpbond') return <BondWidget kind="lp" />
  if (displayView === 'burnbond') return <BondWidget kind="burn" />
  if (displayView === 'xmine') return <XmineWidget />
  if (displayView === 'calc') return <CalcWidget />
  return <StakingHubWidget />
}

function renderStakingContent(displayView: StakingView) {
  if (displayView === 'stake') return <StakeContent />
  if (displayView === 'lpbond') return <BondContent kind="lp" />
  if (displayView === 'burnbond') return <BondContent kind="burn" />
  if (displayView === 'xmine') return <XmineContent />
  if (displayView === 'calc') return <CalcContent />
  return <StakingHubContent />
}

function StakingTransitionLayers({
  direction,
  incoming,
  outgoing,
  render,
}: {
  direction: 'forward' | 'back'
  incoming: StakingView
  outgoing: StakingView
  render: (view: StakingView) => ReactNode
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

export function StakingWidget() {
  const view = useStakingViewStore((state) => state.view)
  const motion = useStakingViewStore((state) => state.motion)
  const direction = useStakingViewStore((state) => state.direction)
  const outgoingView = useStakingViewStore((state) => state.outgoingView)
  const incomingView = useStakingViewStore((state) => state.incomingView)

  const isTransitioning = motion && outgoingView && incomingView

  return (
    <div
      className={cn(
        'flex min-h-full flex-col max-dapp:h-auto max-dapp:min-h-0',
        isTransitioning && stakingTransitionStack(),
      )}
      data-exchange-transitioning={isTransitioning ? 'true' : undefined}
      data-exchange-widget-panel
    >
      {isTransitioning ? (
        <StakingTransitionLayers
          direction={direction}
          incoming={incomingView}
          outgoing={outgoingView}
          render={renderStakingWidget}
        />
      ) : (
        renderStakingWidget(view)
      )}
    </div>
  )
}

export function StakingContent() {
  const view = useStakingViewStore((state) => state.view)
  const motion = useStakingViewStore((state) => state.motion)
  const direction = useStakingViewStore((state) => state.direction)
  const outgoingView = useStakingViewStore((state) => state.outgoingView)
  const incomingView = useStakingViewStore((state) => state.incomingView)

  const isTransitioning = motion && outgoingView && incomingView

  return (
    <div
      className={cn('min-h-0', isTransitioning && stakingTransitionStack())}
      data-exchange-detail-panel
      data-exchange-transitioning={isTransitioning ? 'true' : undefined}
    >
      {isTransitioning ? (
        <StakingTransitionLayers
          direction={direction}
          incoming={incomingView}
          outgoing={outgoingView}
          render={renderStakingContent}
        />
      ) : (
        renderStakingContent(view)
      )}
    </div>
  )
}
