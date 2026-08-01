import { useState } from 'react'

import { exchangeFlipCard } from '~/views/dapp/exchange/exchange-flow-button'

/**
 * Keep in sync with `exchange-card-flip` / `--motion-dapp-emphasis` in theme.css.
 * Apply direction change mid-animation; settle after the flip completes.
 */
const EXCHANGE_FLIP_APPLY_MS = 160
const EXCHANGE_FLIP_SETTLE_MS = 320

export function useExchangeFlip({
  flipDirection,
  disabled = false,
}: {
  flipDirection: () => void
  disabled?: boolean
}) {
  const [isFlipping, setIsFlipping] = useState(false)
  const [rotation, setRotation] = useState(0)

  function onFlip() {
    if (disabled || isFlipping) return
    setIsFlipping(true)
    setRotation((prev) => prev + 180)
    window.setTimeout(() => {
      flipDirection()
    }, EXCHANGE_FLIP_APPLY_MS)
    window.setTimeout(() => {
      setIsFlipping(false)
    }, EXCHANGE_FLIP_SETTLE_MS)
  }

  return {
    isFlipping,
    rotation,
    flipCardClass: exchangeFlipCard({ flipping: isFlipping }),
    onFlip,
  }
}
