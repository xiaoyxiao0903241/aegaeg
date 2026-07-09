import { test, expect } from '@playwright/test'

/**
 * Money-path behavior contracts (not pixel):
 * - Swap Trade subview: sell amount is editable without a wallet (preview / draft)
 * - Genesis shares input stays disabled when disconnected (wallet / maxShares gate)
 */
test.describe('DApp money-path — behavior contracts', () => {
  test('swap trade sell amount accepts draft input when disconnected', async ({ page }) => {
    await page.goto('/en/app.html#swap', { waitUntil: 'domcontentloaded', timeout: 60_000 })
    await page.locator('[data-dapp-window]').waitFor({ state: 'visible', timeout: 60_000 })

    // Hub mode card accessible name = title + body (not exact "Trade").
    await page
      .locator('[data-swap-widget-panel]')
      .getByRole('button', { name: /Trade/i })
      .click()

    await expect(page.getByText(/PancakeSwap live rate/i).first()).toBeVisible({
      timeout: 30_000,
    })

    const sell = page.getByLabel(/sell amount/i).first()
    await expect(sell).toBeVisible({ timeout: 30_000 })
    await expect(sell).toBeEnabled()
    await sell.fill('1.25')
    await expect(sell).toHaveValue('1.25')
  })

  test('genesis shares input is disabled when disconnected', async ({ page }) => {
    await page.goto('/en/app.html#genesis', { waitUntil: 'domcontentloaded', timeout: 60_000 })
    await page.locator('[data-dapp-window]').waitFor({ state: 'visible', timeout: 60_000 })

    const shares = page.locator('input[type="number"]').first()
    await expect(shares).toBeVisible({ timeout: 60_000 })
    await expect(shares).toBeDisabled()
  })
})
