import type { ExchangeDirection } from '~/core/exchange/exchange-direction'
import type { FlashPairId } from '~/core/exchange/flash-pair'
import { evaluateFlashUsd1Swap } from '~/core/exchange/flash-usd1-swap'
import { invalidateAfterExchange } from '~/shared/api/query/invalidate'
import type { QuotedSubmitCore } from '~/views/dapp/exchange/shared'
import { FLASH_USD1_BLOCKED } from '~/web3/contract-error-message'
import { readFlashPairBalances, readUsd1SwapConfig } from '~/web3/exchange/flash-exchange-read'
import {
  approveAgxForWrapIfNeeded,
  approveUsdtForFlashExchangeIfNeeded,
  flashExchange,
  redeemGagxFlashExchange,
  wrapAgxFlashExchange,
} from '~/web3/exchange/flash-exchange-write'

/**
 * 闪电兑换提交：gAGX 赎回 / 包装或 USDT 兑换，成功后失效相关缓存
 *
 * @see docs/onchain-manual/contracts/usd1swap.md
 */
export async function submitFlashExchange(args: {
  pairId: FlashPairId
  direction: ExchangeDirection
  core: QuotedSubmitCore
}): Promise<{ ok: true } | { ok: false; error: unknown | null }> {
  const { pairId, direction, core } = args

  return core.runQuotedSubmit(async ({ session, assertStillSubmittable }) => {
    const { wallet, address } = session

    let liveConfig: Awaited<ReturnType<typeof readUsd1SwapConfig>> | undefined
    if (pairId === 'usdt') {
      liveConfig = await readUsd1SwapConfig()
      const configBlock = evaluateFlashUsd1Swap({
        amountIn: core.debouncedAmountIn,
        quotedOut: 0n,
        config: liveConfig,
      })
      // 授权前只拦零地址；上下限 / 储备等仍等 live quote 后再判
      if (configBlock === 'zeroUsdtToken') {
        throw new Error(FLASH_USD1_BLOCKED.zeroUsdtToken)
      }
      await approveUsdtForFlashExchangeIfNeeded({
        wallet,
        amountIn: core.debouncedAmountIn,
        usdtToken: liveConfig.usdtToken,
      })
    } else if (direction === 'reverse') {
      await approveAgxForWrapIfNeeded({ wallet, amountIn: core.debouncedAmountIn })
    }

    // 直接读链上余额，而非依赖展示查询的刷新结果
    const liveBalances = await readFlashPairBalances(pairId, direction, address)
    const { amountOutMin: minOut, quotedOut } = await assertStillSubmittable({
      sellBalance: liveBalances.sell,
    })

    if (pairId === 'gagx') {
      if (direction === 'reverse') {
        await wrapAgxFlashExchange({
          wallet,
          agxAmount: core.debouncedAmountIn,
        })
      } else {
        await redeemGagxFlashExchange({
          wallet,
          gagxAmount: core.debouncedAmountIn,
        })
      }
    } else {
      const config = liveConfig ?? (await readUsd1SwapConfig())
      const blockReason = evaluateFlashUsd1Swap({
        amountIn: core.debouncedAmountIn,
        quotedOut,
        config,
      })
      if (blockReason) {
        throw new Error(FLASH_USD1_BLOCKED[blockReason])
      }

      await flashExchange({
        wallet,
        usdtAmount: core.debouncedAmountIn,
        minUsd1Out: minOut,
      })
    }
    invalidateAfterExchange()
  })
}
