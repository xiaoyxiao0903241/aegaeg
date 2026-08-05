import type { DappTab } from '~/shared/config/dapp-tabs'
import { useAssetsViewStore } from '~/stores/assets-view-store'
import { useDappHostStore } from '~/stores/dapp-host-store'
import { useExchangeViewStore } from '~/stores/exchange-view-store'
import { useReleaseViewStore } from '~/stores/release-view-store'
import { useRewardsViewStore } from '~/stores/rewards-view-store'
import { useStakingViewStore } from '~/stores/staking-view-store'
import {
  isOnboardingNavStep,
  ONBOARDING_STEP_IDS,
  type OnboardingStepId,
  tourSelector,
} from '~/views/dapp/host/onboarding/onboarding-step-ids'

export {
  isOnboardingNavStep,
  ONBOARDING_STEP_COUNT,
  ONBOARDING_STEP_IDS,
  type OnboardingStepId,
  tourSelector,
} from '~/views/dapp/host/onboarding/onboarding-step-ids'

type StepGo = {
  tab: DappTab
  /** 非空时强制回到该中心页（模式卡片位于中心页）。 */
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

/** 与 `--breakpoint-dapp` / `@custom-variant max-dapp`（820px）保持一致。 */
function isMaxDappViewport(): boolean {
  return window.matchMedia('(max-width: 820px)').matches
}

/** 回到指定中心页，保证模式卡片挂载。 */
function ensureHub(hub: StepGo['hub']) {
  if (hub === 'exchange') useExchangeViewStore.getState().backToHub()
  if (hub === 'staking') useStakingViewStore.getState().backToHub()
  if (hub === 'assets') useAssetsViewStore.getState().backToHub()
  if (hub === 'release') useReleaseViewStore.getState().backToHub()
  if (hub === 'rewards') useRewardsViewStore.getState().backToHub()
}

/**
 * 把宿主导航到该步骤锚点所在的页面，并等待锚点可见后返回。
 *
 * 每个步骤先切换到对应 Tab（必要时回到中心页、H5 下打开抽屉），
 * 让锚点元素得以挂载；随后轮询等待其出现在视口。
 *
 * @param stepIndex 步骤下标
 * @param signal 中止信号
 * @returns 步骤锚点元素
 */
export async function prepareOnboardingStep(
  stepIndex: number,
  signal?: AbortSignal,
): Promise<Element | null> {
  const id = ONBOARDING_STEP_IDS[stepIndex]
  if (!id) return null
  if (signal?.aborted) return null

  const go = STEP_GO[id]
  const host = useDappHostStore.getState()
  host.selectTab(go.tab)
  ensureHub(go.hub)

  if (isOnboardingNavStep(id) && isMaxDappViewport()) {
    host.setMobileNavOpen(true)
  } else {
    host.setMobileNavOpen(false)
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
