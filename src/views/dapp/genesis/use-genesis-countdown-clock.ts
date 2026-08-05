import { useEffect, useRef } from 'react'

import {
  formatPhaseCountdown,
  hasPhaseCountdownElapsed,
  phaseCountdownKey,
  phaseCountdownTarget,
  type PresalePhaseOnChain,
} from '~/core/presale/presale-math'
import { invalidateAfterGenesisPhaseTransition } from '~/shared/api/query/invalidate'
import { useGenesisPromoStore } from '~/stores/genesis-promo-store'

type CountdownUnits = Parameters<typeof formatPhaseCountdown>[2]

/**
 * 创世倒计时订阅
 *
 * 只订阅时钟秒数，不随 chain-reads 整包重渲染；
 * 阶段切换越过时间边界时在此触发相关缓存失效。
 */
export function useGenesisCountdownClock(
  phases: readonly PresalePhaseOnChain[],
  address: string | undefined,
  countdownUnits: CountdownUnits,
) {
  const nowSeconds = useGenesisPromoStore((state) => state.nowSeconds)
  const countdownRefreshRef = useRef<string | null>(null)
  const countdownTarget = phaseCountdownTarget(phases, nowSeconds)

  useEffect(() => {
    if (!countdownTarget || !hasPhaseCountdownElapsed(countdownTarget.targetTime, nowSeconds)) {
      return
    }

    const countdownKey = phaseCountdownKey(countdownTarget)
    if (!countdownKey || countdownRefreshRef.current === countdownKey) {
      return
    }

    countdownRefreshRef.current = countdownKey
    invalidateAfterGenesisPhaseTransition(address)
  }, [address, countdownTarget, nowSeconds])

  return {
    countdown: countdownTarget
      ? formatPhaseCountdown(countdownTarget.targetTime, nowSeconds, countdownUnits)
      : '—',
    countdownMode: countdownTarget?.mode ?? null,
  }
}
