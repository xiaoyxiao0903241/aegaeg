/** 浏览器钱包扩展（MetaMask 等）注入脚本的已知噪音，与应用逻辑无关。 */
const SUPPRESSED_WARN_PATTERNS = [
  /^ObjectMultiplex - orphaned data for stream/,
  /^ObjectMultiplex - malformed chunk/,
  /^MaxListenersExceededWarning:/,
] as const

function shouldSuppressWarn(args: unknown[]) {
  const head = args[0]
  const message = typeof head === 'string' ? head : head != null ? String(head) : ''
  return SUPPRESSED_WARN_PATTERNS.some((pattern) => pattern.test(message))
}

/** 在应用入口最早调用，过滤不可操作的第三方扩展 warn。 */
export function suppressKnownConsoleNoise() {
  if (typeof console === 'undefined') {
    return
  }

  const patched = console.warn as typeof console.warn & { __aegisPatched?: boolean }
  if (patched.__aegisPatched) {
    return
  }

  const originalWarn = console.warn.bind(console)
  console.warn = ((...args: unknown[]) => {
    if (shouldSuppressWarn(args)) {
      return
    }
    originalWarn(...args)
  }) as typeof console.warn

  ;(console.warn as typeof console.warn & { __aegisPatched?: boolean }).__aegisPatched =
    true
}
