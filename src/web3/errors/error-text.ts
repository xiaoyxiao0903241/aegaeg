import { ContractRevertError, decodeContractRevert } from '~/web3/decode-contract-revert'

export type ErrorText = { raw: string; lower: string }

export function toErrorText(raw: string): ErrorText {
  return { raw, lower: raw.toLowerCase() }
}

export function hasSelector(lower: string, ...selectors: string[]): boolean {
  return selectors.some((selector) => lower.includes(selector))
}

export function nameOrSelector(
  namePattern: RegExp,
  ...selectors: string[]
): (text: ErrorText) => boolean {
  return ({ raw, lower }) => namePattern.test(raw) || hasSelector(lower, ...selectors)
}

export function readErrorCode(error: unknown): number | string | undefined {
  if (typeof error !== 'object' || error === null) return undefined
  const coded = error as { code?: number | string }
  return coded.code
}

/** Walk wallet / viem error trees and collect revert selectors from nested `data` hex. */
export function collectErrorFragments(
  error: unknown,
  depth = 0,
  seen = new WeakSet<object>(),
): string[] {
  if (depth > 8) return []
  if (error instanceof Error) {
    return [error.message, ...collectErrorFragments(error.cause, depth + 1, seen)]
  }
  if (typeof error === 'string') return [error]
  if (error == null) return []
  if (typeof error !== 'object') return [String(error)]
  if (seen.has(error)) return []
  seen.add(error)

  const record = error as Record<string, unknown>
  const parts: string[] = []

  for (const key of ['message', 'shortMessage', 'reason', 'details']) {
    const value = record[key]
    if (typeof value === 'string') parts.push(value)
  }

  if ('data' in record) {
    const data = record.data
    if (typeof data === 'string' && data.startsWith('0x')) {
      parts.push(data)
    } else if (typeof data === 'object' && data !== null) {
      parts.push(...collectErrorFragments(data, depth + 1, seen))
    }
  }

  if ('cause' in record) {
    parts.push(...collectErrorFragments(record.cause, depth + 1, seen))
  }

  return parts
}

export function readErrorText(error: unknown): string {
  if (error instanceof ContractRevertError) {
    return [error.errorName, ...collectErrorFragments(error.cause)].filter(Boolean).join(' ')
  }

  const decoded = decodeContractRevert(error)
  const fragments = collectErrorFragments(error).filter(Boolean)
  if (decoded) {
    fragments.unshift(decoded.errorName)
  }
  return fragments.join(' ')
}
