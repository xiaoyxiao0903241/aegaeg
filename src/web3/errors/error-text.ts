import { ContractRevertError, decodeContractRevert } from '~/web3/decode-contract-revert'
import { walkErrorTree } from '~/web3/errors/error-tree'

export type ErrorText = { raw: string; lower: string }

/**
 * 包装错误文本，同时保留原始文本与小写文本，供规则匹配统一读取。
 *
 * @param raw 原始错误文本
 * @returns 含原始文本与小写文本的对象
 * @see 手册 §19 常见错误与前端提示
 */
export function toErrorText(raw: string): ErrorText {
  return { raw, lower: raw.toLowerCase() }
}

/**
 * 判断小写错误文本是否包含任一 selector 片段。
 *
 * 合约 revert 的 selector 固定且不区分大小写，因此统一在小写文本上匹配。
 *
 * @param lower 小写错误文本
 * @param selectors 待匹配的 selector 片段
 * @returns 任一 selector 命中时为 true
 * @see 手册 §19 常见错误与前端提示
 */
export function hasSelector(lower: string, ...selectors: string[]): boolean {
  if (selectors.length === 0) return false
  // 多 needle 子串匹配：一次 RegExp 测试（selector 为字面片段，需转义）。
  const pattern = selectors
    .map((selector) => selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|')
  return new RegExp(pattern).test(lower)
}

/**
 * 构造错误匹配规则：错误名正则或任一 selector 命中即视为匹配。
 *
 * @param namePattern 用于匹配错误名的正则
 * @param selectors 待匹配的 selector 片段
 * @returns 接收 ErrorText 并返回是否匹配的函数
 * @see 手册 §19 常见错误与前端提示
 */
export function nameOrSelector(
  namePattern: RegExp,
  ...selectors: string[]
): (text: ErrorText) => boolean {
  return ({ raw, lower }) => namePattern.test(raw) || hasSelector(lower, ...selectors)
}

/**
 * 读取 viem / 钱包错误对象上的错误码，供拒绝与链切换判断使用。
 *
 * @param error 任意错误值
 * @returns 错误码；非对象或无 code 时为 undefined
 * @see 手册 §19 常见错误与前端提示
 */
export function readErrorCode(error: unknown): number | string | undefined {
  if (typeof error !== 'object' || error === null) return undefined
  const coded = error as { code?: number | string }
  return coded.code
}

/** 遍历钱包 / viem 错误树，收集 message 与 hex 片段供规则匹配。 */
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

/**
 * 汇总错误树中所有可读文本；合约 revert 时优先带上错误名。
 *
 * @param error 待展示或匹配的错误
 * @returns 拼接后的错误文本；无文本时为空字符串
 * @see 手册 §19 常见错误与前端提示
 */
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
