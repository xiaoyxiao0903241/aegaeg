let booted = false

function loadDeferredImage(image: HTMLImageElement) {
  const src = image.dataset.src
  if (!src) {
    return
  }

  image.src = src
  delete image.dataset.src
}

function showRevealElement(element: HTMLElement, instant = false) {
  element.setAttribute('data-visible', 'true')
  if (instant) {
    element.setAttribute('data-reveal-instant', 'true')
  } else {
    element.removeAttribute('data-reveal-instant')
  }
}

function isRevealCandidateInView(element: HTMLElement) {
  const rect = element.getBoundingClientRect()
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight
  return rect.bottom > 0 && rect.top < viewportHeight * 0.96
}

function formatCount(value: number) {
  return value >= 1000 ? value.toLocaleString('en-US') : String(value)
}

function setCountValue(element: HTMLElement, value: number) {
  const suffix = element.dataset.countSuffix ?? ''
  element.textContent = `${formatCount(value)}${suffix}`
}

function resetCountValue(element: HTMLElement) {
  const target = Number(element.dataset.countTarget)
  if (Number.isFinite(target)) {
    setCountValue(element, 0)
  }
}

function animateCount(element: HTMLElement) {
  const target = Number(element.dataset.countTarget)
  if (!Number.isFinite(target)) {
    return
  }

  element.setAttribute('data-metric-count-pop', '')
  const start = performance.now()
  const duration = 1300

  const tick = (now: number) => {
    const rawProgress = Math.min((now - start) / duration, 1)
    const easedProgress = 1 - Math.pow(1 - rawProgress, 3)
    setCountValue(element, Math.round(target * easedProgress))

    if (rawProgress < 1) {
      requestAnimationFrame(tick)
    }
  }

  requestAnimationFrame(tick)
}

function getViewportVisibleRatio(element: HTMLElement) {
  const rect = element.getBoundingClientRect()
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth
  const visibleWidth = Math.min(rect.right, viewportWidth) - Math.max(rect.left, 0)
  const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0)

  if (visibleWidth <= 0 || visibleHeight <= 0 || rect.width <= 0 || rect.height <= 0) {
    return 0
  }

  return (visibleWidth * visibleHeight) / (rect.width * rect.height)
}

function startCountPanel(panel: HTMLElement) {
  if (panel.dataset.countStarted === 'true') {
    return
  }

  panel.dataset.countStarted = 'true'
  showRevealElement(panel)

  const values = panel.querySelectorAll<HTMLElement>('[data-count-target]')
  window.setTimeout(() => {
    values.forEach(animateCount)
  }, 520)
}

/** Home motion boot — call after React mount (useLayoutEffect) so [data-reveal] exists. */
export function bootWalletLoader() {
  if (booted) {
    return
  }
  booted = true

  const deferredImages = document.querySelectorAll<HTMLImageElement>('img[data-src]')
  const revealElements = document.querySelectorAll<HTMLElement>('[data-reveal]')
  const countElements = document.querySelectorAll<HTMLElement>('[data-count-target]')
  const countPanels = document.querySelectorAll<HTMLElement>('[data-count-panel]')

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const image = entry.target as HTMLImageElement
            loadDeferredImage(image)
            observer.unobserve(image)
          }
        })
      },
      { rootMargin: '320px 0px' },
    )

    deferredImages.forEach((image) => imageObserver.observe(image))
  } else {
    deferredImages.forEach(loadDeferredImage)
  }

  if (!('IntersectionObserver' in window)) {
    revealElements.forEach((element) => {
      if (!element.hasAttribute('data-reveal-manual')) {
        showRevealElement(element)
      }
    })
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return
          }

          showRevealElement(entry.target as HTMLElement)
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )

    revealElements.forEach((element) => {
      if (element.hasAttribute('data-reveal-manual')) {
        return
      }

      if (isRevealCandidateInView(element)) {
        showRevealElement(element, true)
      }

      revealObserver.observe(element)
    })
  }

  countElements.forEach(resetCountValue)

  if ('IntersectionObserver' in window && countPanels.length > 0) {
    const pendingCountPanels = new Set(countPanels)
    let fallbackFrame = 0

    const checkCountPanels = () => {
      fallbackFrame = 0
      pendingCountPanels.forEach((panel) => {
        if (getViewportVisibleRatio(panel) >= 0.45) {
          pendingCountPanels.delete(panel)
          startCountPanel(panel)
        }
      })

      if (pendingCountPanels.size === 0) {
        window.removeEventListener('scroll', scheduleCountPanelCheck)
        window.removeEventListener('resize', scheduleCountPanelCheck)
      }
    }

    const scheduleCountPanelCheck = () => {
      if (fallbackFrame) {
        return
      }

      fallbackFrame = window.requestAnimationFrame(checkCountPanels)
    }

    const countPanelObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return
          }

          const panel = entry.target as HTMLElement
          pendingCountPanels.delete(panel)
          startCountPanel(panel)
          observer.unobserve(panel)
        })
      },
      { threshold: 0.45 },
    )

    countPanels.forEach((panel) => countPanelObserver.observe(panel))
    window.addEventListener('scroll', scheduleCountPanelCheck, { passive: true })
    window.addEventListener('resize', scheduleCountPanelCheck, { passive: true })
  } else if ('IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return
          }

          animateCount(entry.target as HTMLElement)
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.45 },
    )

    countElements.forEach((element) => countObserver.observe(element))
  } else {
    countElements.forEach(animateCount)
  }

  document.documentElement.dataset.walletLoaderReady = 'true'
}
