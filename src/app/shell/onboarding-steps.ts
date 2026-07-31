import type { DappTab } from '~/shared/config/dapp-tabs'
import { useDappShellStore } from '~/stores/dapp-shell-store'
import { useAssetsViewStore } from '~/stores/assets-view-store'
import { useExchangeViewStore } from '~/stores/exchange-view-store'
import { useReleaseViewStore } from '~/stores/release-view-store'
import { useRewardsViewStore } from '~/stores/rewards-view-store'
import { useStakingViewStore } from '~/stores/staking-view-store'
import {
  isOnboardingNavStep,
  ONBOARDING_STEP_IDS,
  tourSelector,
  type OnboardingStepId,
} from '~/app/shell/onboarding-step-ids'

export {
  isOnboardingNavStep,
  ONBOARDING_STEP_COUNT,
  ONBOARDING_STEP_IDS,
  tourSelector,
  type OnboardingStepId,
} from '~/app/shell/onboarding-step-ids'

type StepGo = {
  tab: DappTab
  /** When set, force that rail's hub (mode cards live on hub). */
  hub?: 'exchange' | 'staking' | 'assets' | 'release' | 'rewards'
}

const STEP_GO: Record<OnboardingStepId, StepGo> = {
  'nav-swap': { tab: 'exchange', hub: 'exchange' },
  'swap-trade': { tab: 'exchange', hub: 'exchange' },
  'nav-staking': { tab: 'staking', hub: 'staking' },
  'stake-mode-stake': { tab: 'staking', hub: 'staking' },
  'nav-assets': { tab: 'assets', hub: 'assets' },
  'asset-mode-stake': { tab: 'assets', hub: 'assets' },
  'nav-release': { tab: 'release', hub: 'release' },
  'release-pool-card': { tab: 'release', hub: 'release' },
  'buffer-pool-card': { tab: 'release', hub: 'release' },
  'swap-turbine': { tab: 'exchange', hub: 'exchange' },
  'nav-rewards': { tab: 'rewards', hub: 'rewards' },
  'nav-community': { tab: 'community' },
}

/** Align with `--breakpoint-dapp` / `@custom-variant max-dapp` (820px). */
function isMaxDappViewport(): boolean {
  return window.matchMedia('(max-width: 820px)').matches
}

function ensureHub(hub: StepGo['hub']) {
  if (hub === 'exchange') useExchangeViewStore.getState().backToHub()
  if (hub === 'staking') useStakingViewStore.getState().backToHub()
  if (hub === 'assets') useAssetsViewStore.getState().backToHub()
  if (hub === 'release') useReleaseViewStore.getState().backToHub()
  if (hub === 'rewards') useRewardsViewStore.getState().backToHub()
}

/** Navigate shell so the step's anchor can mount, then resolve a visible target. */
export async function prepareOnboardingStep(
  stepIndex: number,
  signal?: AbortSignal,
): Promise<Element | null> {
  const id = ONBOARDING_STEP_IDS[stepIndex]
  if (!id) return null
  if (signal?.aborted) return null

  const go = STEP_GO[id]
  const shell = useDappShellStore.getState()
  shell.selectTab(go.tab)
  ensureHub(go.hub)

  if (isOnboardingNavStep(id) && isMaxDappViewport()) {
    shell.setMobileNavOpen(true)
  } else {
    shell.setMobileNavOpen(false)
  }

  return waitForVisibleTourTarget(id, signal)
}

export function visibleTourTarget(id: OnboardingStepId): Element | null {
  const nodes = document.querySelectorAll(tourSelector(id))
  for (const node of nodes) {
    if (node.getClientRects().length > 0) return node
  }
  return nodes.item(0)
}

function waitForVisibleTourTarget(
  id: OnboardingStepId,
  signal?: AbortSignal,
  tries = 8,
  delayMs = 80,
): Promise<Element | null> {
  return new Promise((resolve) => {
    const attempt = (left: number) => {
      if (signal?.aborted) {
        resolve(null)
        return
      }
      const el = visibleTourTarget(id)
      if (el && el.getClientRects().length > 0) {
        resolve(el)
        return
      }
      if (left <= 0) {
        resolve(el)
        return
      }
      window.setTimeout(() => attempt(left - 1), delayMs)
    }
    attempt(tries)
  })
}
