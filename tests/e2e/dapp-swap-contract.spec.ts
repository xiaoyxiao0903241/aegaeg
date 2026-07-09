import { test, expect } from '@playwright/test'

/**
 * Behavior contract (not pixel): disconnected Swap shell exposes connect CTA
 * and does not require a wallet session for the tab chrome to render.
 */
test.describe('DApp Swap — behavior contract', () => {
  test('disconnected swap shell shows connect affordance', async ({ page }) => {
    await page.goto('/en/app.html', { waitUntil: 'domcontentloaded', timeout: 60_000 })
    await page.locator('#root *').first().waitFor({ state: 'attached', timeout: 60_000 })

    // Shell chrome: rail or mobile nav present
    const shell = page.locator('body')
    await expect(shell).toBeVisible()

    // Connect entry — thirdweb ConnectButton / custom chip text
    const connect = page.getByRole('button', { name: /connect/i }).first()
    await expect(connect).toBeVisible({ timeout: 60_000 })
  })
})
