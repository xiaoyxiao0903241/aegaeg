import { useCallback, useEffect, useState } from 'react'
import { SWAP_CONFIG } from '../config/swap'
import { readPairSpotRate } from '../web3/swap-read'
import { useVisibilityAwareInterval } from './use-visibility-aware-interval'

function formatPoolRateLabel(rate: { usd1PerXx: number }) {
  return `1 USDT ≈ ${rate.usd1PerXx.toFixed(2)} USD1`
}

export function usePairSpotRate(
  enabled = true,
  intervalMs = SWAP_CONFIG.spotRateRefreshIntervalMs,
) {
  const [rateLabel, setRateLabel] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const refresh = useCallback(async (showLoading = false) => {
    if (!enabled) {
      return
    }

    if (showLoading) {
      setIsLoading(true)
    }

    try {
      const rate = await readPairSpotRate()
      if (rate) {
        setRateLabel(formatPoolRateLabel(rate))
      }
    } catch {
      setRateLabel(null)
    } finally {
      if (showLoading) {
        setIsLoading(false)
      }
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled) {
      setRateLabel(null)
      setIsLoading(false)
      return
    }

    void refresh(true)
  }, [enabled, refresh])

  useVisibilityAwareInterval(() => refresh(false), intervalMs, enabled)

  return { rateLabel, isLoading }
}
