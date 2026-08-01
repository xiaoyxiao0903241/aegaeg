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
 * Genesis 倒计时叶子订阅：只订 nowSeconds，不拖 chain-reads 整袋。
 * 相位边界 elapsed 仍在此触发 invalidate。
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
