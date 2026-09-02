/**
 * 容器内 `[data-reveal]` 进入视口后打 `data-visible`（一次性）。
 * DOM 增删时重新扫描；返回统一 teardown。
 */
export function subscribeReveal(container: HTMLElement): () => void {
  const observed = new WeakSet<Element>()
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.setAttribute('data-visible', 'true')
        io.unobserve(entry.target)
        observed.delete(entry.target)
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  )

  const scan = () => {
    const elements = [
      ...(container.hasAttribute('data-reveal') ? [container] : []),
      ...container.querySelectorAll<HTMLElement>('[data-reveal]'),
    ]
    for (const element of elements) {
      if (observed.has(element)) continue
      observed.add(element)
      io.observe(element)
    }
  }

  scan()
  const mutationObserver = new MutationObserver(scan)
  mutationObserver.observe(container, { childList: true, subtree: true })

  return () => {
    mutationObserver.disconnect()
    io.disconnect()
  }
}
