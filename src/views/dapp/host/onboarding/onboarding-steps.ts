/**
 * 引导步骤导航与目标可见等待
 *
 * 负责步骤间的 Tab / 中心页跳转，并在进入下一步前等待目标元素出现。
 */
import { MOBILE_MAX_WIDTH_QUERY } from '~/shared/config/breakpoints'
import type { DappTab } from '~/shared/config/dapp-tabs'
import { sleep } from '~/shared/lib/utils'
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
} from '~/views/dapp/host/onboarding/shared'

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

/** 与 `--breakpoint-dapp` / `@custom-variant max-dapp` 保持一致。 */
function isMaxDappViewport(): boolean {
  return window.matchMedia(MOBILE_MAX_WIDTH_QUERY).matches
}

/**
 * H5 抽屉入场时长；须与 `mobile-nav.tsx` 的 `NAV_MOTION_MS` /
 * `dapp-mobile-nav-in`（`--motion-dapp-emphasis`）一致，否则高亮会量到侧拉中的坐标。
 */
export const MOBILE_NAV_ENTER_MS = 300

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
 * 让锚点元素得以挂载；H5 导航步须等抽屉 translate 入场结束再量坐标。
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
    await sleep(MOBILE_NAV_ENTER_MS)
    if (signal?.aborted) return null
  } else {
    host.setMobileNavOpen(false)
  }

  return waitForVisibleTourTarget(id, signal)
}

export function visibleTourTarget(id: OnboardingStepId): Element | null {
  const nodes = document.querySelectorAll(tourSelector(id))
  let best: Element | null = null
  let bestArea = 0
  for (const node of nodes) {
    const rects = node.getClientRects()
    if (rects.length === 0) continue
    const r = rects[0]
    if (!r) continue
    const area = r.width * r.height
    if (area > bestArea) {
      bestArea = area
      best = node
    }
  }
  return best
}

function waitForVisibleTourTarget(
  id: OnboardingStepId,
  signal?: AbortSignal,
  tries = 24,
  delayMs = 100,
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
    // H5 抽屉入场约 300ms，先短等一帧再开始轮询
    window.requestAnimationFrame(() => attempt(tries))
  })
}
