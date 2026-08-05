/**
 * 读取并清除推荐绑定成功标记
 *
 * 标记只在绑定写操作的成功回调里置位；
 * 不能从写操作返回值推断是否成功（void 写成功也可能是 undefined）。
 *
 * @param flag 可变成功标记
 */
export function readAndClearBindSuccess(flag: { current: boolean }): boolean {
  const ok = flag.current
  flag.current = false
  return ok
}
