/** Promise 延时；钱包等待 / 领取重试 / 缓存失效退避共用的唯一实现。 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
