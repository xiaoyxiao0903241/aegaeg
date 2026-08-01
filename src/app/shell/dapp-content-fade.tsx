import { useEffect, useState } from 'react'

import type { DappTab } from '~/shared/config/dapp-tabs'

/** Keep in sync with `--motion-dapp-fade-out` / `--motion-dapp-fade-in` in theme.css. */
export const DAPP_CONTENT_FADE_OUT_MS = 160
export const DAPP_CONTENT_FADE_IN_MS = 220

export type DappContentFadePhase = 'idle' | 'out' | 'in'

/**
 * Delays tab content swap until fade-out finishes so session hosts can remount
 * under opacity 0 without killing the outgoing animation.
 * Enter uses rise + fade (same language as former `dapp-panel-enter`).
 * Rail should keep using the live `activeTab`; panels use `displayTab`.
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
