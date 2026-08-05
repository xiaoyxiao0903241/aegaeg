import { useState } from 'react'

import { exchangeFlipCard } from '~/views/dapp/exchange/exchange-flow-button'

// 时长需与 theme.css 中 `exchange-card-flip` / `--motion-dapp-emphasis` 保持一致
const EXCHANGE_FLIP_APPLY_MS = 160
const EXCHANGE_FLIP_SETTLE_MS = 320

/** 兑换方向翻转动画：翻转期间锁定按钮，并通知方向切换。 */

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
