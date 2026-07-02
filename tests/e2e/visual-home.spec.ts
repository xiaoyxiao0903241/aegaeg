import { test, expect } from '@playwright/test'

async function settleHome(page: import('@playwright/test').Page) {
  await page.goto('/en/', { waitUntil: 'domcontentloaded', timeout: 60_000 })
  await page.locator('#root *').first().waitFor({ state: 'attached', timeout: 60_000 })
  await page.locator('#hero-title').waitFor({ state: 'visible', timeout: 60_000 })
  await page.evaluate(() => {
    document.querySelectorAll('[data-reveal]').forEach((node) => {
      node.setAttribute('data-visible', 'true')
    })
    document.querySelectorAll('.hero-video').forEach((node) => {
      const video = node as HTMLVideoElement
      const poster = video.getAttribute('poster')
      if (!poster) {
        video.pause()
        video.currentTime = 0
        return
      }
      const image = document.createElement('img')
      image.src = poster
      image.className = video.className
      image.alt = ''
      video.replaceWith(image)
    })
    document.querySelectorAll('img[data-src]').forEach((node) => {
      const image = node as HTMLImageElement
      if (!image.src) {
        image.src = image.dataset.src ?? ''
      }
    })
  })
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
      }
    `,
  })
  await page.waitForLoadState('networkidle')
}

test.describe('Home — visual regression', () => {
  test('full page', async ({ page }) => {
    await settleHome(page)
    await expect(page).toHaveScreenshot('home-full.png', { fullPage: true })
  })

  test('hero section', async ({ page }) => {
    await settleHome(page)
    await expect(page.locator('.hero')).toHaveScreenshot('home-hero.png')
  })

  test('protocol section', async ({ page }) => {
    await settleHome(page)
    await expect(page.locator('#protocol')).toHaveScreenshot('home-protocol.png')
  })

  test('metrics panel', async ({ page }) => {
    await settleHome(page)
    await expect(page.locator('[data-metrics-panel]')).toHaveScreenshot('home-metrics.png')
  })
})
