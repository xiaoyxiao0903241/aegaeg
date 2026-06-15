import { BSC_CONTRACTS } from './contracts'

export const REFERRAL_CONFIG = {
  defaultReferrer: BSC_CONTRACTS.defaultReferrer,
  refQueryKey: 'ref',
} as const

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
