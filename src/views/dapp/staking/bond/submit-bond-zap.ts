import { evaluateBondZapLive } from '~/core/staking/staking-block-reasons'
import type { BondKind, BondPeriod } from '~/core/staking/staking-period'
import { invalidateAfterStaking } from '~/shared/api/query/invalidate'
import { BOND_ZAP_BLOCKED } from '~/web3/errors/write-block-errors'
import { readMigrationStatus } from '~/web3/migration/migration-read'
import { readBondZapAgxPreview } from '~/web3/staking/bond-zap-quote-read'
import {
  burnBondDepositoryAddress,
  lpBondDepositoryAddress,
} from '~/web3/staking/staking-addresses'
import { readBondMarketMeta, readBondZapPreflight } from '~/web3/staking/staking-read'
import {
  approveUsd1ForBondHelperIfNeeded,
  zapIntoBurnBond,
  zapIntoLiquidityBond,
} from '~/web3/staking/staking-write'
import { approveThenLiveWrite } from '~/web3/wallet/approve-then-live-write'
import type { WriteSession } from '~/web3/wallet/require-write-session'

export { BOND_ZAP_BLOCKED } from '~/web3/errors/write-block-errors'

/**
 * 提交债券买入（zap）
 *
 * 先读链上预检（余额 / 授权 / 仓库授权 / 老账户迁移状态）并判定阻塞原因，
 * 授权不足时内联 approve 后继续写；写入完成后失效质押相关缓存。
 *
 * @param session 已就绪的写会话
 * @param kind 债券类型：lp 流动性质押债券 / burn 燃烧债券
 * @param period 锁定期（180 / 360 / 540 天）
 * @param amount 买入数量（USD1 最小单位）
 * @see docs/onchain-manual/contracts/bonddepository.md
 * @see docs/onchain-manual/contracts/burnbonddepository.md
 */
export async function submitBondZap(args: {
  session: WriteSession
  kind: BondKind
  period: BondPeriod
  amount: bigint
}): Promise<void> {
  const { session, kind, period, amount } = args
  const { wallet, address, readClient } = session

  const depository =
    kind === 'lp' ? lpBondDepositoryAddress(period) : burnBondDepositoryAddress(period)

  await approveThenLiveWrite({
    readSnapshot: async () => {
      const [preflight, migration, market] = await Promise.all([
        readBondZapPreflight({
          depository,
          user: address,
          client: readClient,
        }),
        readMigrationStatus(address, readClient),
        readBondMarketMeta(depository, readClient),
      ])
      const payout = await readBondZapAgxPreview({
        kind,
        depository,
        depositUsd1: amount,
        client: readClient,
        market,
      })
      return {
        preflight,
        isOldAccount: migration.isOldAccount,
        maxDebt: market.maxDebt,
        totalDeposit: market.totalDeposit,
        maxPayout: market.maxPayoutAmount,
        netPayout: payout.netPayout,
        grossPayout: payout.grossPayout,
      }
    },
    evaluate: ({
      preflight,
      isOldAccount,
      maxDebt,
      totalDeposit,
      maxPayout,
      netPayout,
      grossPayout,
    }) =>
      evaluateBondZapLive({
        amount,
        isBound: preflight.isBound,
        balance: preflight.balance,
        allowance: preflight.allowance,
        depositoryAuthorized: preflight.depositoryAuthorized,
        isOldAccount,
        maxDebt,
        totalDeposit,
        maxPayout,
        netPayout,
        grossPayout,
      }),
    mapBlockError: (reason: NonNullable<ReturnType<typeof evaluateBondZapLive>>) =>
      BOND_ZAP_BLOCKED[reason],
    softPreBlocks: ['insufficientAllowance'] as const,
    approve: async () => {
      await approveUsd1ForBondHelperIfNeeded({ wallet, amount })
    },
    write: async () => {
      if (kind === 'lp') {
        await zapIntoLiquidityBond({ wallet, depository, amount })
      } else {
        await zapIntoBurnBond({ wallet, depository, amount })
      }
    },
  })
  invalidateAfterStaking()
}
