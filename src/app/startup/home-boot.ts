import { suppressKnownConsoleNoise } from '~/shared/lib/suppress-known-console-noise'
import {
  bindPageScrollPersistence,
  restorePersistedPageScroll,
} from '~/shared/lib/page-scroll-restoration'

const HOME_SCROLL_KEY = 'aegis.home.scroll'

/** Side effects that must run before Home React mount. */
export function bootHomeApp() {
  suppressKnownConsoleNoise()

  if (typeof document !== 'undefined') {
    document.documentElement.classList.add('site-fluid', 'home-app')
  }

  bindPageScrollPersistence(HOME_SCROLL_KEY)
}

export function restoreHomeScroll() {
  restorePersistedPageScroll(HOME_SCROLL_KEY, { honorHashAnchor: true })
}
