import { suppressKnownConsoleNoise } from '~/shared/lib/suppress-known-console-noise'

/**
 * DApp React 挂载前的启动副作用。
 *
 * 抑制已知控制台噪音；给根元素加上 `site-fluid` / `dapp-app` 类以启用流体布局；
 * 关闭浏览器默认的滚动恢复，避免刷新后滚动位置错乱。
 */
export function bootDappApp() {
  suppressKnownConsoleNoise()

  if (typeof document !== 'undefined') {
    document.documentElement.classList.add('site-fluid', 'dapp-app')
  }

  if (typeof window !== 'undefined' && 'scrollRestoration' in history) {
    history.scrollRestoration = 'manual'
  }
}
