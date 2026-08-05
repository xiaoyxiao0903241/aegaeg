import { useI18n } from '~/i18n/use-i18n'
import { Card } from '~/shared/components/card'
import { AssetsPositionRowActions } from '~/views/dapp/assets/position/assets-position-row-actions'
import {
  ASSETS_POSITION_AGX_DECIMALS,
  ASSETS_POSITION_GAGX_DECIMALS,
  AssetsPositionBoostBadge,
  AssetsPositionPrincipalColumn,
  AssetsPositionRowHeader,
  type AssetsPositionRowShellProps,
  AssetsPositionYieldColumn,
} from '~/views/dapp/assets/position/assets-position-row-chrome'
import { AssetsPositionVoucherLink } from '~/views/dapp/assets/position/assets-position-voucher-link'
import type { AssetsStakeRow } from '~/web3/assets/assets-read'

/**
 * 质押仓位卡
 *
 * 展示周期与剩余 / warmup 状态、本金与收益、凭证链接；
 * 底部操作随状态变化：warmup 结束可激活，活期可随时赎回。
 */
export function AssetsPositionStakeRow(
  props: AssetsPositionRowShellProps<AssetsStakeRow> & {
    /** 当前 staking epoch；warmup 剩余 epoch 倒计时用。 */
    currentEpoch?: bigint | null
    onActivate?: (row: AssetsStakeRow) => void
  },
) {
  const { formatPeriodLabel, formatAmount, locked, busy, onClaim, onRedeem, onActivate, row } =
    props
  const { messages: t } = useI18n()
  const reward = row.blockReward + row.extraInterest
  const boost = row.extraInterest
  const inWarmup = Boolean(row.inWarmup)
  const warmupExpired = Boolean(row.warmupExpired)
  // 测试期放开领取入口：warmup 外可点开弹窗；金额=0 / 贡献不足由写链校验拦截
  const canClaim = !inWarmup
  const canRedeem = inWarmup
    ? warmupExpired && Boolean(onActivate)
    : row.kind === 'liquid'
      ? row.principal > 0n
      : row.claimableBalance > 0n
  const periodLabel = formatPeriodLabel(row.period)
  const voucherAddress = row.kind === 'locked' && row.pool ? row.pool : null

  const remainingEpochs =
    inWarmup && props.currentEpoch != null && row.expiry > props.currentEpoch
      ? Number(row.expiry - props.currentEpoch)
      : inWarmup && !warmupExpired
        ? null
        : 0
  const remainingValue = inWarmup
    ? warmupExpired
      ? t.assets.position.activateWarmup
      : remainingEpochs != null && remainingEpochs > 0
        ? t.assets.position.warmupRemainingEpochs.replace('{n}', String(remainingEpochs))
        : t.assets.blocked.warmupActive
    : row.kind === 'liquid'
      ? t.assets.position.redeemAnytime
      : undefined
  const dayUnit = t.assets.claim.releaseDays.replace('{days}', '').trim()
  const secondaryLabel = inWarmup
    ? t.assets.position.activateWarmup
    : row.kind === 'liquid'
      ? t.assets.position.unlock
      : t.assets.position.redeem

  return (
    <Card surface="outlined" className="grid gap-2">
      <AssetsPositionRowHeader
        dayUnit={dayUnit}
        periodLabel={periodLabel}
        remainingAt={inWarmup ? 0n : row.expiry}
        remainingLabel={t.assets.position.remaining}
        remainingValue={remainingValue}
      />
      <div className="grid grid-cols-2 gap-2">
        <AssetsPositionPrincipalColumn
          amountText={formatAmount(row.principal, ASSETS_POSITION_AGX_DECIMALS, 'AGX')}
          badgeText={formatAmount(row.releasedPrincipal, ASSETS_POSITION_AGX_DECIMALS, 'AGX')}
          badgeVisible={row.releasedPrincipal > 0n}
          label={t.assets.position.staked}
        />
        <AssetsPositionYieldColumn
          amountText={formatAmount(reward, ASSETS_POSITION_GAGX_DECIMALS, 'gAGX')}
          badge={
            // 收益与加成双属性；无加成时仍占位，与左侧本金数字对齐
            <AssetsPositionBoostBadge
              className={boost > 0n ? undefined : 'pointer-events-none opacity-0'}
              text={formatAmount(boost, ASSETS_POSITION_GAGX_DECIMALS, 'gAGX')}
            />
          }
          yieldLabel={t.assets.position.yield}
        />
      </div>
      {voucherAddress ? (
        <AssetsPositionVoucherLink address={voucherAddress} label={t.assets.position.voucher} />
      ) : null}
      <AssetsPositionRowActions
        busy={busy}
        canClaim={canClaim}
        canRedeem={canRedeem}
        claimLabel={t.assets.position.claim}
        locked={locked}
        onClaim={() => onClaim(row)}
        onRedeem={() => {
          if (inWarmup) onActivate?.(row)
          else onRedeem(row)
        }}
        redeemLabel={secondaryLabel}
      />
    </Card>
  )
}
