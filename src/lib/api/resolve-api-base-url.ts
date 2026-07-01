import { appEnv } from '~/config/env'

function isLocalHostname(hostname: string): boolean {
  const host = hostname.toLowerCase()
  return host === 'localhost' || host === '127.0.0.1' || host === '[::1]' || host === '::1'
}

/** e.g. app.x-123.io → x-123.io; x-123.io stays x-123.io */
export function extractRootDomain(hostname: string): string {
  const host = hostname.toLowerCase().trim()
  if (!host || isLocalHostname(host) || /^\d+\.\d+\.\d+\.\d+$/.test(host)) {
    return host
  }

  const parts = host.split('.').filter(Boolean)
  if (parts.length <= 2) return host
  return parts.slice(-2).join('.')
}

export function resolveApiBaseUrl(options: {
  hostname?: string
  isDev?: boolean
  envBaseUrl?: string
  deriveFromDomain?: boolean
} = {}): string {
  const hostname =
    options.hostname ??
    (typeof window !== 'undefined' ? window.location.hostname : '')
  const isDev = options.isDev ?? import.meta.env.DEV
  const envBaseUrl = (options.envBaseUrl ?? appEnv.apiBaseUrl)?.trim()
  const deriveFromDomain = options.deriveFromDomain ?? appEnv.apiDeriveFromDomain

  if (isDev || isLocalHostname(hostname)) {
    return (envBaseUrl || appEnv.apiBaseUrl).replace(/\/$/, '')
  }

  if (!deriveFromDomain && envBaseUrl) {
    return envBaseUrl.replace(/\/$/, '')
  }

  const root = extractRootDomain(hostname)
  if (!root || isLocalHostname(root)) {
    return (envBaseUrl || appEnv.apiBaseUrl).replace(/\/$/, '')
  }

  return `https://api.${root}/api`
}
