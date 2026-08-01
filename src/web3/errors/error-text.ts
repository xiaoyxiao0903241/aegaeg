import { ContractRevertError, decodeContractRevert } from '~/web3/decode-contract-revert'
import { walkErrorTree } from '~/web3/errors/error-tree'

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

/** Walk wallet / viem error trees and collect message / hex fragments for rule matching. */
export function collectErrorFragments(error: unknown): string[] {
  const parts: string[] = []

  walkErrorTree(
    error,
    (node) => {
      if (typeof node === 'string') {
        parts.push(node)
        return
      }

      if (node instanceof Error) {
        if (node.message) parts.push(node.message)
        return
      }

      if (typeof node !== 'object' || node === null) {
        parts.push(String(node))
        return
      }

      const record = node as Record<string, unknown>
      for (const key of ['message', 'shortMessage', 'reason', 'details'] as const) {
        const value = record[key]
        if (typeof value === 'string') parts.push(value)
      }

      if (typeof record.data === 'string' && record.data.startsWith('0x')) {
        parts.push(record.data)
      }
    },
    { maxDepth: 8 },
  )

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
