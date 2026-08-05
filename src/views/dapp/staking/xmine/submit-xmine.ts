import { evaluateXmineLive, type XmineLiveBlockReason } from '~/core/staking/staking-block-reasons'
import { invalidateAfterStaking } from '~/shared/api/query/invalidate'
import { openExchangeView } from '~/shared/config/dapp-open-views'
import { XMINE_BLOCKED } from '~/web3/errors/write-block-errors'
import { readXminePreflight } from '~/web3/staking/staking-read'
import { approveGagxForXmineIfNeeded, stakeGagxForMining } from '~/web3/staking/staking-write'
import { approveThenLiveWrite } from '~/web3/wallet/approve-then-live-write'
import type { WriteSession } from '~/web3/wallet/require-write-session'

export { XMINE_BLOCKED } from '~/web3/errors/write-block-errors'

/**
 * 提交 XMine 质押
 *
 * 先读链上预检（余额 / 授权 / 剩余挖矿额度）并判定阻塞原因；
 * 余额不足且尚未开始授权时跳转闪电兑换补齐 gAGX，
 * 授权不足时内联 approve 后继续写；完成后失效质押相关缓存。
 *
 * @param session 已就绪的写会话
 * @param amount 质押数量（gAGX 最小单位）
 * @see docs/onchain-manual/contracts/xstakingpool.md
 */
export async function submitXmineStake(args: {
  session: WriteSession
  amount: bigint
}): Promise<void> {
  const { session, amount } = args
  const { wallet, address, readClient } = session

  let pastPreflight = false
  await approveThenLiveWrite({
    readSnapshot: () => readXminePreflight({ user: address, client: readClient }),
    evaluate: (preflight): XmineLiveBlockReason | null => {
      const remaining =
        preflight.miningQuota > preflight.miningStaked
          ? preflight.miningQuota - preflight.miningStaked
          : 0n
      return evaluateXmineLive({
        amount,
        balance: preflight.balance,
        allowance: preflight.allowance,
        miningQuota: remaining,
      })
    },
    mapBlockError: (reason: XmineLiveBlockReason) => {
      if (!pastPreflight && reason === 'insufficientBalance') openExchangeView('flash')
      return XMINE_BLOCKED[reason]
    },
    softPreBlocks: ['insufficientAllowance'] satisfies ReadonlyArray<XmineLiveBlockReason>,
    approve: async () => {
      pastPreflight = true
      await approveGagxForXmineIfNeeded({ wallet, amount })
    },
    write: async () => {
      await stakeGagxForMining({ wallet, amount })
    },
  })
  invalidateAfterStaking()
}
