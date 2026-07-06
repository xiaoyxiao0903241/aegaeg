import { suppressKnownConsoleNoise } from '~/shared/lib/suppress-known-console-noise'

/** Side effects that must run before DApp React mount. */
export function bootDappApp() {
  suppressKnownConsoleNoise()

  if (typeof document !== 'undefined') {
    document.documentElement.classList.add('site-fluid', 'dapp-app')
  }

  if (typeof window !== 'undefined' && 'scrollRestoration' in history) {
    history.scrollRestoration = 'manual'
  }
}
