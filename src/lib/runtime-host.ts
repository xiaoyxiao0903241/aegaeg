import { appEnv } from '~/config/env'

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
    // Some WebViews throw when reading location.
  }

  return null
}

/** Build-time fallback when runtime host is unreadable (`VITE_APP_HOST`). */
export function getConfiguredAppHost(): string {
  return appEnv.appHost
}

/** Hostname without port — API derive, SIWE domain. */
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

/** Host with port when present — referral link display. */
export function getRuntimeHost(): string {
  const loc = readLocationHost()
  if (loc?.host?.trim()) return loc.host.trim()
  return getRuntimeHostname()
}

export function getRuntimeOrigin(): string {
  const loc = readLocationHost()
  if (loc?.origin?.trim()) return loc.origin.trim()
  return `https://${getRuntimeHostname()}`
}
