import { useEffect, useRef } from 'react'

/**
 * 滚动进入视口的元素显示监听器。
 *
 * 在容器内查找 `[data-reveal]` 元素，进入视口后打上 `data-visible`，
 * 只触发一次并停止观察；容器 DOM 变化（新增子元素）时重新扫描。
 *
 * @param container 监听范围，为 null 时不工作
 */
export function DappRevealObserver({ container }: { container: HTMLElement | null }) {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const observedRef = useRef(new WeakSet<Element>())

  useEffect(() => {
    if (!container) {
      return
    }

    const observed = observedRef.current
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return
          }
          entry.target.setAttribute('data-visible', 'true')
          io.unobserve(entry.target)
          observed.delete(entry.target)
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )
    observerRef.current = io

    const scan = () => {
      const elements = [
        ...(container.hasAttribute('data-reveal') ? [container] : []),
        ...container.querySelectorAll<HTMLElement>('[data-reveal]'),
      ]
      elements.forEach((element) => {
        if (observed.has(element)) {
          return
        }
        observed.add(element)
        io.observe(element)
      })
    }

    scan()

    const mutationObserver = new MutationObserver(scan)
    mutationObserver.observe(container, { childList: true, subtree: true })

    return () => {
      mutationObserver.disconnect()
      io.disconnect()
      observerRef.current = null
    }
  }, [container])

  return null
}
