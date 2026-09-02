import { appEnv } from '~/shared/config/env'
import { getRuntimeHostname } from '~/shared/lib/runtime-host'

/** 本地 / 开发态浏览器同源前缀（由 Vite `server.proxy` 转到上游）。 */
const LOCAL_API_BASE_PATH = '/api'

function isLocalHostname(hostname: string): boolean {
  const host = hostname.toLowerCase()
  return host === 'localhost' || host === '127.0.0.1' || host === '[::1]' || host === '::1'
}

/**
 * 提取主机名的根域名（保留最后两级）。
 *
 * 本地 / IP 主机名原样返回；例：app.x-123.io → x-123.io。
 *
 * @param hostname 完整主机名
 * @returns 根域名；本地或 IP 主机名原样返回
 */
export function extractRootDomain(hostname: string): string {
  const host = hostname.toLowerCase().trim()
  if (!host || isLocalHostname(host) || /^\d+\.\d+\.\d+\.\d+$/.test(host)) {
    return host
  }

  const parts = host.split('.').filter(Boolean)
  if (parts.length <= 2) return host
  return parts.slice(-2).join('.')
}

/**
 * 计算后端 API 基础地址
 *
 * 开发环境或本地主机名走同源 `/api`（Vite/preview 代理到 `VITE_API_BASE_URL`），
 * 避免浏览器直连跨域被 CORS 拦截。生产非本机按域名派生 `https://api.<根域名>/api`。
 *
 * @param options.hostname 覆盖运行时主机名（测试注入）
 * @param options.isDev 覆盖开发态判断
 * @param options.envBaseUrl 覆盖环境变量中的 API 地址
 * @param options.deriveFromDomain 覆盖是否按域名派生
 * @returns 去掉末尾斜杠的 API 基础地址
 */
export function apiBaseUrl(
  options: {
    hostname?: string
    isDev?: boolean
    envBaseUrl?: string
    deriveFromDomain?: boolean
  } = {},
): string {
  const hostname = options.hostname ?? getRuntimeHostname()
  const isDev = options.isDev ?? import.meta.env.DEV
  const envBaseUrl = (options.envBaseUrl ?? appEnv.apiBaseUrl)?.trim()
  const deriveFromDomain = options.deriveFromDomain ?? appEnv.apiDeriveFromDomain

  if (isDev || isLocalHostname(hostname)) {
    const base = (envBaseUrl || '').replace(/\/$/, '')
    if (base.startsWith('/')) return base || LOCAL_API_BASE_PATH
    return LOCAL_API_BASE_PATH
  }

  if (!deriveFromDomain && envBaseUrl) {
    return envBaseUrl.replace(/\/$/, '')
  }

  const root = extractRootDomain(hostname)
  if (!root || isLocalHostname(root)) {
    return LOCAL_API_BASE_PATH
  }

  return `https://api.${root}/api`
}
