import { useEffect } from 'react'
import { create } from 'zustand'

type WallClockState = {
  /** 当前墙钟 unix 秒 */
  nowSec: number
}

let subscriberCount = 0
let intervalId: ReturnType<typeof setInterval> | null = null

function readNowSec(): number {
  return Math.floor(Date.now() / 1000)
}

/**
 * 全局墙钟状态。业务侧优先用 `useWallClockSec`；本 store 仅供选择器/测试。
 */
export const useWallClockStore = create<WallClockState>(() => ({
  nowSec: readNowSec(),
}))

function ensureTicking() {
  if (intervalId != null) return
  const tick = () => {
    const nowSec = readNowSec()
    if (useWallClockStore.getState().nowSec === nowSec) return
    useWallClockStore.setState({ nowSec })
  }
  tick()
  intervalId = setInterval(tick, 1000)
}

function maybeStopTicking() {
  if (subscriberCount > 0 || intervalId == null) return
  clearInterval(intervalId)
  intervalId = null
}

/**
 * 订阅全局墙钟（unix 秒）。
 *
 * 有订阅才跑 1s interval；计数归零停表。`enabled=false` 时不占订阅、不随秒重绘。
 *
 * @param enabled 是否需要滴答（无可见倒计时时传 false）
 */
export function useWallClockSec(enabled = true): number {
  useEffect(() => {
    if (!enabled) return
    subscriberCount += 1
    ensureTicking()
    return () => {
      subscriberCount -= 1
      maybeStopTicking()
    }
  }, [enabled])

  return useWallClockStore((state) => (enabled ? state.nowSec : 0))
}
