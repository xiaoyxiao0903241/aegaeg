import { useEffect, useState } from 'react'

import {
  formatRebaseCountdownParts,
  remainingSecFromBlocks,
} from '~/core/staking/format-rebase-countdown'
import { CountValue } from '~/shared/components/count-value'
import { Text } from '~/shared/components/text'

/** 链读与墙钟偏差超过此值才重锚定（避免 refetch 抖动）。 */
const RESYNC_DRIFT_SEC = 3

function anchorEndAtMs(chainRemainingSec: number, now = Date.now()): number {
  return now + chainRemainingSec * 1000
}

/**
 * 下一次 Rebase 发放 — 链上块差锚定墙钟，每秒滴答；时/分/秒各走 CountValue DigitReel。
 */
export function RebaseCountdownValue({
  epochEndBlock,
  currentBlock,
}: {
  epochEndBlock: bigint | undefined
  currentBlock: bigint | undefined
}) {
  const chainRemainingSec = remainingSecFromBlocks(epochEndBlock, currentBlock)

  const [endAtMs, setEndAtMs] = useState(() => anchorEndAtMs(chainRemainingSec))
  const [nowMs, setNowMs] = useState(() => Date.now())

  useEffect(() => {
    const now = Date.now()
    setEndAtMs((prev) => {
      const wallRemaining = Math.max(0, Math.ceil((prev - now) / 1000))
      if (Math.abs(wallRemaining - chainRemainingSec) <= RESYNC_DRIFT_SEC) return prev
      return anchorEndAtMs(chainRemainingSec, now)
    })
    setNowMs(now)
  }, [chainRemainingSec, epochEndBlock, currentBlock])

  useEffect(() => {
    if (endAtMs <= Date.now()) return
    const id = window.setInterval(() => {
      const now = Date.now()
      setNowMs(now)
      if (now >= endAtMs) window.clearInterval(id)
    }, 1000)
    return () => window.clearInterval(id)
  }, [endAtMs])

  const remainingSec = Math.max(0, Math.ceil((endAtMs - nowMs) / 1000))
  const parts = formatRebaseCountdownParts(remainingSec)

  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-1 tabular-nums">
      <CountValue text={parts.hours} />
      <Text as="span" variant="detail">
        小时
      </Text>
      <CountValue text={parts.minutes} />
      <Text as="span" variant="detail">
        分钟
      </Text>
      <CountValue text={parts.seconds} />
      <Text as="span" variant="detail">
        秒
      </Text>
    </span>
  )
}
