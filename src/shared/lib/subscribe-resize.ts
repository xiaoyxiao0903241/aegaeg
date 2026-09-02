/**
 * ResizeObserver 订阅：observe 列表元素，返回统一 disconnect。
 * 把订阅/退订收成一对函数，避免 effect 内散落 observe 难对照 cleanup。
 */
export function subscribeResize(elements: Iterable<Element>, onResize: () => void): () => void {
  const observer = new ResizeObserver(onResize)
  const watched: Element[] = []
  for (const el of elements) {
    observer.observe(el)
    watched.push(el)
  }
  return () => {
    for (const el of watched) {
      observer.unobserve(el)
    }
    observer.disconnect()
  }
}
