import { useEffect, useState } from 'react'

import type { DappTab } from '~/shared/config/dapp-tabs'

/** 与 theme.css 中 `--motion-dapp-fade-out` / `--motion-dapp-fade-in` 保持一致。 */
export const DAPP_CONTENT_FADE_OUT_MS = 160
export const DAPP_CONTENT_FADE_IN_MS = 220

export type DappContentFadePhase = 'idle' | 'out' | 'in'

/**
 * 延迟 Tab 内容切换，直到淡出动画播完。
 *
 * 这样会话组件可以在透明度为 0 时重挂载，不打断退场动画；
 * 入场沿用上浮 + 淡入。
 * 导航条应继续使用实时的 `activeTab`，两个内容面板用返回的 `displayTab`。
 *
 * @param activeTab 当前选中的 Tab
 * @returns displayTab 当前实际展示的 Tab；phase 淡出 / 淡入 / 静止三态
 */
export function useDappTabContentFade(activeTab: DappTab): {
  displayTab: DappTab
  phase: DappContentFadePhase
} {
  const [displayTab, setDisplayTab] = useState(activeTab)
  const [phase, setPhase] = useState<DappContentFadePhase>('idle')

  useEffect(() => {
    if (activeTab === displayTab) return

    setPhase('out')
    const outTimer = window.setTimeout(() => {
      setDisplayTab(activeTab)
      setPhase('in')
    }, DAPP_CONTENT_FADE_OUT_MS)

    return () => window.clearTimeout(outTimer)
  }, [activeTab, displayTab])

  useEffect(() => {
    if (phase !== 'in') return
    const inTimer = window.setTimeout(() => setPhase('idle'), DAPP_CONTENT_FADE_IN_MS)
    return () => window.clearTimeout(inTimer)
  }, [phase])

  return { displayTab, phase }
}
