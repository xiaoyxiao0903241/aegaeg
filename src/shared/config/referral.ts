export const REFERRAL_CONFIG = {
  refQueryKey: 'ref',
} as const

const ZERO_REFERRER_ADDRESS = '0x0000000000000000000000000000000000000000'

export function parseReferrerAddress(value: unknown): `0x${string}` | null {
  if (typeof value !== 'string') return null

  const trimmed = value.trim()
  if (!/^0x[a-fA-F0-9]{40}$/.test(trimmed)) return null
  if (trimmed.toLowerCase() === ZERO_REFERRER_ADDRESS) return null

  return trimmed as `0x${string}`
}

/** Bound users: prefer /performance invite_address, fall back to on-chain referrer. */
export function resolveDisplayReferrer(params: {
  isBound: boolean
  inviteAddress?: string | null
  chainReferrer?: string | null
}): `0x${string}` | null {
  if (!params.isBound) return null

  const fromApi = parseReferrerAddress(params.inviteAddress)
  if (fromApi) return fromApi

  return parseReferrerAddress(params.chainReferrer)
}

export function parseReferrerFromSearch(search: string): `0x${string}` | null {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
  const ref = params.get(REFERRAL_CONFIG.refQueryKey)?.trim()

  if (!ref || !/^0x[a-fA-F0-9]{40}$/.test(ref)) {
    return null
  }

  return ref as `0x${string}`
}

export function buildReferralSharePath(address: string): string {
  return `?${REFERRAL_CONFIG.refQueryKey}=${address}`
}
