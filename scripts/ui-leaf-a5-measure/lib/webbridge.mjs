/**
 * Kimi WebBridge HTTP 客户端，通过 POST http://127.0.0.1:10086/command 控制浏览器。
 */

const DEFAULT_BASE = 'http://127.0.0.1:10086'

/**
 * 创建一次浏览器会话的 WebBridge 客户端。
 *
 * @param {string} session
 * @param {{ baseUrl?: string }} [opts]
 * @returns 封装了 navigate / evaluate / cdp 的客户端对象
 */
export function createWebBridge(session, opts = {}) {
  const baseUrl = opts.baseUrl ?? DEFAULT_BASE

  /**
   * 向 WebBridge 发送单个命令。
   *
   * @param {string} action
   * @param {Record<string, unknown>} [args]
   * @param {number} [timeoutMs]
   * @returns WebBridge 返回的数据
   */
  async function command(action, args, timeoutMs = 120_000) {
    const payload = { action, session }
    if (args !== undefined) payload.args = args
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), timeoutMs)
    try {
      const res = await fetch(`${baseUrl}/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: ctrl.signal,
      })
      const data = await res.json()
      if (!data.ok) {
        const msg = data.error?.message ?? JSON.stringify(data.error ?? data)
        throw new Error(`WebBridge ${action} failed: ${msg}`)
      }
      return data.data
    } finally {
      clearTimeout(timer)
    }
  }

  return {
    command,
    navigate: (url, extra = {}) => command('navigate', { url, ...extra }),
    evaluate: async (code) => {
      const data = await command('evaluate', { code })
      return data?.value !== undefined ? data.value : data
    },
    cdp: (method, params) => command('cdp', { method, params }),
  }
}
