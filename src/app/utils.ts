import { tabOrder, type DappTab } from '~/app/types'

export function formatAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

export function isDappTab(value: string): value is DappTab {
  return tabOrder.includes(value as DappTab)
}

export function getInitialTab(): DappTab {
  const hash = window.location.hash.slice(1)
  return isDappTab(hash) ? hash : 'swap'
}

/** Scroll detail column / page to Genesis top after promo navigation. */
export function scrollToGenesisPageTop() {
  requestAnimationFrame(() => {
    const detail = document.querySelector('[data-dapp-detail]')
    if (detail instanceof HTMLElement) {
      detail.scrollTop = 0
    }

    document.getElementById('genesis-title')?.scrollIntoView({ block: 'start' })
    window.scrollTo({ top: 0, behavior: 'auto' })
  })
}

