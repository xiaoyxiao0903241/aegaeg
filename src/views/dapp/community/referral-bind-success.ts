/**
 * Community 绑定成功标记：仅信封 onSuccess 置位。
 * 禁从 mutate 返回值推断（void 写成功也可能是 undefined）。
 */
export function readAndClearBindSuccess(flag: { current: boolean }): boolean {
  const ok = flag.current
  flag.current = false
  return ok
}
