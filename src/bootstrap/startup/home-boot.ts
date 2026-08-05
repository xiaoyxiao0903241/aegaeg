import {
  bindPageScrollPersistence,
  restorePersistedPageScroll,
} from '~/shared/lib/page-scroll-restoration'
import { suppressKnownConsoleNoise } from '~/shared/lib/suppress-known-console-noise'

const HOME_SCROLL_KEY = 'aegis.home.scroll'

/**
 * 首页 React 挂载前的启动副作用。
 *
 * 抑制已知控制台噪音；给根元素加上 `site-fluid` / `home-app` 类；
 * 绑定首页滚动位置的持久化，供刷新后恢复。
 */
export function bootHomeApp() {
  suppressKnownConsoleNoise()

  if (typeof document !== 'undefined') {
    document.documentElement.classList.add('site-fluid', 'home-app')
  }

  bindPageScrollPersistence(HOME_SCROLL_KEY)
}

/** 恢复首页上次离开时的滚动位置（带 hash 锚点优先）。 */
export function restoreHomeScroll() {
  restorePersistedPageScroll(HOME_SCROLL_KEY, { honorHashAnchor: true })
}
