/** 钱包 / viem / RPC 错误包装常用的嵌套键。 */
const NESTED_ERROR_KEYS = ['data', 'cause', 'error', 'originalError'] as const

/**
 * 深度优先遍历钱包 / viem 错误树（带循环保护）
 *
 * `visit` 返回 true 可提前终止遍历。
 *
 * @param error 待遍历的错误
 * @param visit 每个节点回调
 * @param options.maxDepth 最大深度，默认 10
 * @param options.seen 循环保护用的已见对象集合
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
