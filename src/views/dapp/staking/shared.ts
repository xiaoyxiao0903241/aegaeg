import { formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { epochRebasePctFrom1e18 } from '~/core/staking/staking-yield'
import { evaluateWriteButtonPhase } from '~/core/wallet/write-button-phase'
import { writeCtaDisabled } from '~/core/wallet/write-cta'
import { formatDecimal, toUsd } from '~/shared/presenters/format'

type StakingMoneyBlock = Parameters<typeof evaluateWriteButtonPhase>[0]['moneyBlock']

/** rebaseRate1e18 → `x.xx%`；缺数 `--`。 */
export function formatRebasePct(rate1e18: bigint | null | undefined): string {
  return formatYieldPct(epochRebasePctFrom1e18(rate1e18))
}

/** 收益率百分比文案；缺数 `--`。 */
export function formatYieldPct(pct: number | null | undefined): string {
  return formatDecimal(pct, { digits: 2, suffix: '%' })
}

/** 锁定加成 BPS → `x%`；缺数 `--`。 */
export function formatBonusPct(bps: number | null | undefined): string {
  return formatDecimal(bps == null ? null : bps / 100, {
    digits: 0,
    fraction: 'natural',
    suffix: '%',
  })
}

/** wei × 现价 → `≈ $…`；缺 wei 或缺价 → `--`。 */
export function formatWeiUsdApprox(
  wei: bigint | null | undefined,
  decimals: number,
  priceUsd: number | null,
): string {
  return formatDecimal(
    toUsd(wei == null ? null : formatTokenAmountToNumber(wei, decimals), priceUsd),
    { digits: 2, prefix: '≈ $' },
  )
}

/**
 * 质押 / 债券写入按钮是否可点、处于哪一阶段
 *
 * 授权不足时按钮仍可点，点下去会先补授权再提交。
 * 正在估算到账金额、或还在用上一笔金额的旧结果时，按钮不可点。
 *
 * @param args 写入状态、金额、阻塞原因等输入
 * @returns canSubmit / writePhase
 */
export function evaluateStakingAmountWrite(args: {
  isSubmitting: boolean
  writeReady: boolean
  walletReady: boolean
  amountIn: bigint
  blockReason: StakingMoneyBlock
  preflightReady: boolean
  needReferral: boolean
  accountMigrated: boolean
  /** 到账金额还在算，或仍是上一笔金额的旧结果。 */
  isQuoting?: boolean
}) {
  const moneyOk = args.blockReason == null || args.blockReason === 'insufficientAllowance'
  const canSubmit =
    !writeCtaDisabled({
      isSubmitting: args.isSubmitting,
      writeReady: args.writeReady,
      walletReady: args.walletReady,
    }) &&
    args.amountIn > 0n &&
    moneyOk &&
    args.preflightReady &&
    !args.isQuoting

  const writePhase = evaluateWriteButtonPhase({
    walletReady: args.walletReady,
    writeReady: args.writeReady,
    needReferral: args.needReferral,
    accountMigrated: args.accountMigrated,
    moneyBlock: args.blockReason,
    isQuoting: args.isQuoting,
    isSubmitting: args.isSubmitting,
  })

  return { canSubmit, writePhase }
}
