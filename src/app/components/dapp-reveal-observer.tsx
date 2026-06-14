import { useEffect, useRef } from 'react'

export function DappRevealObserver({
  container,
}: {
  container: HTMLElement | null
}) {
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
