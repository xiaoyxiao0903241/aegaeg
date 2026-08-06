import { ZERO_ADDRESS } from '~/core/constants'

export const REFERRAL_CONFIG = {
  refQueryKey: 'ref',
} as const

/**
 * 校验并规范化推荐人地址。
 *
 * 零地址不能代表真实推荐人，提前拒绝可避免把空地址写入分享链接或绑定流程。
 *
 * @param value 待校验的未知值
 * @returns 合法的 40 位十六进制地址；非法或零地址返回 null
 * @see docs/backend-api/api.md #一期接口/performance
 */
export function parseReferrerAddress(value: unknown): `0x${string}` | null {
  if (typeof value !== 'string') return null

  const trimmed = value.trim()
  if (!/^0x[a-fA-F0-9]{40}$/.test(trimmed)) return null
  if (trimmed.toLowerCase() === ZERO_ADDRESS) return null

  return trimmed as `0x${string}`
}

/** 已绑定用户：优先取 /performance 返回的 invite_address，缺失时回退到链上推荐人。 */
export function displayReferrer(params: {
  isBound: boolean
  inviteAddress?: string | null
  chainReferrer?: string | null
}): `0x${string}` | null {
  if (!params.isBound) return null

  const fromApi = parseReferrerAddress(params.inviteAddress)
  if (fromApi) return fromApi

  return parseReferrerAddress(params.chainReferrer)
}

/**
 * 从 URL 查询串读取 `?ref=` 推荐地址。
 *
 * @param search 查询串（可带或不带 `?`）
 * @returns 合法的推荐地址；缺失或非法返回 null
 */
export function parseReferrerFromSearch(search: string): `0x${string}` | null {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
  const ref = params.get(REFERRAL_CONFIG.refQueryKey)?.trim()

  if (!ref || !/^0x[a-fA-F0-9]{40}$/.test(ref)) {
    return null
  }

  return ref as `0x${string}`
}

/** 生成带推荐地址的分享查询串。 */
export function referralSharePath(address: string): string {
  return `?${REFERRAL_CONFIG.refQueryKey}=${address}`
}
