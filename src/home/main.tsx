import { suppressKnownConsoleNoise } from '~/lib/suppress-known-console-noise'

suppressKnownConsoleNoise()

if (typeof document !== 'undefined') {
  document.documentElement.classList.add('site-fluid', 'home-app')
}

import { useLayoutEffect } from 'react'
import { createRoot } from 'react-dom/client'
import '~/styles/home.css'
import { I18nProvider } from '~/i18n/i18n-provider'
import { WebRootProviders } from '~/providers/web-root-providers'
import { HomePage } from '~/home/home-page'
import { bootWalletLoader } from '~/wallet-loader'

const HOME_SCROLL_KEY = 'aegis.home.scroll'

type SavedHomeScroll = {
  hash: string
  y: number
}

function readSavedHomeScroll(): SavedHomeScroll | null {
  try {
    const raw = sessionStorage.getItem(HOME_SCROLL_KEY)
    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw) as Partial<SavedHomeScroll>
    if (typeof parsed.y !== 'number' || !Number.isFinite(parsed.y)) {
      return null
    }

    return {
      hash: typeof parsed.hash === 'string' ? parsed.hash : '',
      y: Math.max(0, parsed.y),
    }
  } catch {
    return null
  }
}

function writeSavedHomeScroll() {
  try {
    const payload: SavedHomeScroll = {
      hash: window.location.hash,
      y: window.scrollY,
    }
    sessionStorage.setItem(HOME_SCROLL_KEY, JSON.stringify(payload))
  } catch {
    // sessionStorage may be unavailable in private mode
  }
}

function restoreHomeScrollPosition() {
  const hash = window.location.hash
  if (hash.length > 1) {
    const target = document.querySelector(hash)
    if (target instanceof HTMLElement) {
      target.scrollIntoView({ block: 'start' })
      return
    }
  }

  const saved = readSavedHomeScroll()
  if (saved && saved.y > 0) {
    window.scrollTo(0, saved.y)
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', writeSavedHomeScroll)
}

function HomeApp() {
  useLayoutEffect(() => {
    restoreHomeScrollPosition()
    bootWalletLoader()
  }, [])

  return <HomePage />
}

createRoot(document.getElementById('root')!).render(
  <I18nProvider>
    <WebRootProviders>
      <HomeApp />
    </WebRootProviders>
  </I18nProvider>,
)
