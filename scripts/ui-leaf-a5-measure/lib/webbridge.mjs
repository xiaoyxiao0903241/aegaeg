/** Kimi WebBridge HTTP client — POST http://127.0.0.1:10086/command */

const DEFAULT_BASE = 'http://127.0.0.1:10086'

/**
 * @param {string} session
 * @param {{ baseUrl?: string }} [opts]
 */
export function createWebBridge(session, opts = {}) {
  const baseUrl = opts.baseUrl ?? DEFAULT_BASE

  /**
   * @param {string} action
   * @param {Record<string, unknown>} [args]
   * @param {number} [timeoutMs]
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
