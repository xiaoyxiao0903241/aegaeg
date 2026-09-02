import { appEnv } from '~/shared/config/env'

function readLocationHost(): Pick<Location, 'host' | 'hostname' | 'origin'> | null {
  try {
    const candidates: Array<Pick<Location, 'host' | 'hostname' | 'origin'> | undefined> = [
      typeof location !== 'undefined' ? location : undefined,
      typeof window !== 'undefined' ? window.location : undefined,
      typeof document !== 'undefined' ? document.location : undefined,
    ]

    for (const loc of candidates) {
      if (loc?.hostname?.trim() || loc?.host?.trim()) return loc
    }
  } catch {
    // 部分 WebView 读取 location 会抛错
  }

  return null
}

/** 运行时无法读取 host 时的构建期兜底（`VITE_APP_HOST`）。 */
export function getConfiguredAppHost(): string {
  return appEnv.appHost
}

/** 不带端口的主机名，用于 API 派生与 SIWE 域名。 */
export function getRuntimeHostname(): string {
  const loc = readLocationHost()
  if (loc?.hostname?.trim()) return loc.hostname.trim()
  if (loc?.host?.trim()) {
    const host = loc.host.trim()
    const colon = host.lastIndexOf(':')
    return colon > 0 && host.includes('.') ? host.slice(0, colon) : host
  }
  return getConfiguredAppHost()
}

/** 带端口的主机名（端口存在时），用于推荐链接展示。 */
export function getRuntimeHost(): string {
  const loc = readLocationHost()
  if (loc?.host?.trim()) return loc.host.trim()
  return getRuntimeHostname()
}

/** 运行时完整来源（origin），用于拼接外链地址。 */
export function getRuntimeOrigin(): string {
  const loc = readLocationHost()
  if (loc?.origin?.trim()) return loc.origin.trim()
  return `https://${getRuntimeHostname()}`
}
