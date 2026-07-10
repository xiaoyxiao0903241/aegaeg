import { test, expect } from '@playwright/test'

/**
 * Money-path behavior contracts (not pixel). Keep optional — not in `pnpm check`.
 * - Swap Trade: sell amount editable without wallet
 * - Flash hub entry exists when disconnected
 * - Genesis shares disabled when disconnected
 * - Rewards claim CTAs disabled / gated when disconnected
 * - Shell exposes Connect when disconnected
 */
test.describe('DApp money-path — behavior contracts', () => {
  test('disconnected shell shows connect affordance', async ({ page }) => {
    await page.goto('/en/app.html#swap', { waitUntil: 'domcontentloaded', timeout: 60_000 })
    await page.locator('[data-dapp-window]').waitFor({ state: 'visible', timeout: 60_000 })

    const connect = page.getByRole('button', { name: /connect/i }).first()
    await expect(connect).toBeVisible({ timeout: 60_000 })
  })

  test('swap hub exposes Flash mode card when disconnected', async ({ page }) => {
    await page.goto('/en/app.html#swap', { waitUntil: 'domcontentloaded', timeout: 60_000 })
    await page.locator('[data-dapp-window]').waitFor({ state: 'visible', timeout: 60_000 })

    await expect(
      page.locator('[data-swap-widget-panel]').getByRole('button', { name: /Flash/i }),
    ).toBeVisible({ timeout: 30_000 })
  })

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

  test('rewards claim buttons stay disabled when disconnected', async ({ page }) => {
    await page.goto('/en/app.html#rewards', { waitUntil: 'domcontentloaded', timeout: 60_000 })
    await page.locator('[data-dapp-window]').waitFor({ state: 'visible', timeout: 60_000 })

    const claimButtons = page.getByRole('button', { name: /claim/i })
    const count = await claimButtons.count()
    if (count === 0) {
      // Promo / connect gate may hide claim row entirely — still a valid disconnected gate.
      await expect(page.getByRole('button', { name: /connect/i }).first()).toBeVisible()
      return
    }
    for (let i = 0; i < count; i += 1) {
      await expect(claimButtons.nth(i)).toBeDisabled()
    }
  })
})
