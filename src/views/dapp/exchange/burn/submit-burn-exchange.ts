import { evaluateBurnContributionSwap } from '~/core/exchange/burn-contribution-swap'
import { invalidateAfterExchange } from '~/shared/api/query/invalidate'
import type { QuotedSubmitCore } from '~/views/dapp/exchange/shared'
import { BURN_BLOCKED } from '~/web3/errors/write-block-errors'
import {
  readBurnContributionSwapConfig,
  readBurnExchangeBalances,
} from '~/web3/exchange/burn-exchange-read'
import {
  approveAgxForBurnExchangeIfNeeded,
  burnExchangeConvert,
} from '~/web3/exchange/burn-exchange-write'

/**
 * 销毁 AGX 换贡献点：授权 + 转换 + 成功后失效相关缓存
 *
 * @see docs/onchain-manual/contracts/agxcontributionswap.md
 */
export async function submitBurnExchange(args: {
  core: QuotedSubmitCore
}): Promise<{ ok: true } | { ok: false; error: unknown | null }> {
  const { core } = args

  return core.runQuotedSubmit(async ({ session, assertStillSubmittable }) => {
    const { wallet, address } = session

    await approveAgxForBurnExchangeIfNeeded({ wallet, amountIn: core.debouncedAmountIn })

    // 直接读链上余额与配置，而非依赖展示查询的刷新结果
    const liveBalances = await readBurnExchangeBalances(address)
    await assertStillSubmittable({ sellBalance: liveBalances.sell })

    const liveConfig = await readBurnContributionSwapConfig()
    const blockReason = evaluateBurnContributionSwap({
      amountIn: core.debouncedAmountIn,
      config: liveConfig,
    })
    if (blockReason) {
      throw new Error(BURN_BLOCKED[blockReason])
    }

    await burnExchangeConvert({
      wallet,
      agxAmount: core.debouncedAmountIn,
    })
    invalidateAfterExchange()
  })
}
