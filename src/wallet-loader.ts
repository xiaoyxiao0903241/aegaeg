type WalletIsland = {
  openWalletModal: () => Promise<void>
}

const triggers = document.querySelectorAll<HTMLElement>('[data-wallet-trigger]')
const deferredImages = document.querySelectorAll<HTMLImageElement>('img[data-src]')
const revealElements = document.querySelectorAll<HTMLElement>('[data-reveal]')
const countElements = document.querySelectorAll<HTMLElement>('[data-count-target]')
const countPanels = document.querySelectorAll<HTMLElement>('[data-count-panel]')
let walletIslandPromise: Promise<WalletIsland> | undefined

function loadWalletIsland() {
  walletIslandPromise ??= import('./wallet-island')
  return walletIslandPromise
}

function setBusy(trigger: HTMLElement, busy: boolean) {
  const label = trigger.querySelector<HTMLElement>('.wallet-label')
  const labelTarget = label ?? trigger

  if (busy) {
    trigger.setAttribute('aria-busy', 'true')
    trigger.dataset.previousLabel = labelTarget.textContent ?? ''
    labelTarget.textContent = trigger.dataset.walletBusyLabel ?? 'Opening wallet...'
    return
  }

  trigger.removeAttribute('aria-busy')
  if (trigger.dataset.previousLabel) {
    labelTarget.textContent = trigger.dataset.previousLabel
    delete trigger.dataset.previousLabel
  }
}

triggers.forEach((trigger) => {
  trigger.addEventListener('pointerenter', loadWalletIsland, { passive: true })
  trigger.addEventListener('focus', loadWalletIsland, { passive: true })
  trigger.addEventListener('touchstart', loadWalletIsland, { passive: true })
  trigger.addEventListener('click', async (event) => {
    event.preventDefault()
    setBusy(trigger, true)

    try {
      const walletIsland = await loadWalletIsland()
      void walletIsland.openWalletModal().catch((error) => {
        if (import.meta.env.DEV) {
          console.error('Failed to open wallet modal', error)
        }
      })
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to open wallet modal', error)
      }
    } finally {
      setBusy(trigger, false)
    }
  })
})

document.documentElement.dataset.walletLoaderReady = 'true'

// Language switchers are self-contained components. The static homepage uses a
// native `<details>` disclosure handled by the browser and project CSS; the DApp
// uses a React-controlled menu. No global wiring is required here.

function loadDeferredImage(image: HTMLImageElement) {
  const src = image.dataset.src
  if (!src) {
    return
  }

  image.src = src
  delete image.dataset.src
}

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

function showRevealElement(element: HTMLElement) {
  element.setAttribute('data-visible', 'true')
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
    if (!element.hasAttribute('data-reveal-manual')) {
      revealObserver.observe(element)
    }
  })
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


