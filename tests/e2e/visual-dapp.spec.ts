import { test, expect } from '@playwright/test'

async function settleDappSwap(page: import('@playwright/test').Page) {
  await page.goto('/en/app.html')
  await page.locator('[data-dapp-window]').waitFor({ state: 'visible', timeout: 30_000 })
  await page.waitForLoadState('networkidle')
}

test.describe('DApp Swap — visual regression', () => {
  test('swap tab shell', async ({ page }) => {
    await settleDappSwap(page)
    await expect(page.locator('[data-dapp-window]')).toHaveScreenshot('dapp-swap-shell.png')
  })

  test('swap widget column', async ({ page }) => {
    await settleDappSwap(page)
    await expect(page.locator('[data-dapp-window] aside').first()).toHaveScreenshot(
      'dapp-swap-widget.png',
    )
  })
})
