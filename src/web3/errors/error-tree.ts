/** Nested keys commonly used by wallet / viem / RPC error wrappers. */
const NESTED_ERROR_KEYS = ['data', 'cause', 'error', 'originalError'] as const

/**
 * Depth-first walk of wallet / viem error trees with cycle protection.
 * `visit` may return `true` to stop early.
 */
export function walkErrorTree(
  error: unknown,
  visit: (node: unknown) => boolean | void,
  options?: { maxDepth?: number; seen?: WeakSet<object> },
): void {
  const maxDepth = options?.maxDepth ?? 10
  const seen = options?.seen ?? new WeakSet<object>()

  const walk = (node: unknown, depth: number): boolean => {
    if (depth > maxDepth || node == null) return false
    if (visit(node)) return true

    if (node instanceof Error) {
      return walk(node.cause, depth + 1)
    }

    if (typeof node !== 'object') return false
    if (seen.has(node)) return false
    seen.add(node)

    const record = node as Record<string, unknown>
    for (const key of NESTED_ERROR_KEYS) {
      if (key in record && walk(record[key], depth + 1)) return true
    }
    return false
  }

  walk(error, 0)
}
