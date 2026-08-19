/**
 * 资产仓位列表 UI 零件
 *
 * 支持质押 / 债券 / X 挖矿的行卡、排序工具条、骨架与空态。
 */
import type { ReactNode } from 'react'

import { ZERO_BI } from '~/core/constants'
import { isAssetsActionableAmount } from '~/core/exchange/token-amount'
import { interpolate } from '~/i18n/interpolate'
import { useI18n } from '~/i18n/use-i18n'
import { dappAssets } from '~/shared/assets/dapp'
import { Button } from '~/shared/components/button'
import { Card } from '~/shared/components/card'
import { CountValue } from '~/shared/components/count-value'
import {
  CountdownValue,
  remainingSecFromEpochs,
  useAnchoredRemainingSec,
} from '~/shared/components/countdown-value'
import { ExplorerLink } from '~/shared/components/explorer-link'
import { Icon } from '~/shared/components/icon'
import { MainButton } from '~/shared/components/main-button'
import { Skeleton } from '~/shared/components/skeleton'
import { Text } from '~/shared/components/text'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { shouldShowTablePagination } from '~/shared/lib/table-pagination'
import { cn } from '~/shared/lib/utils'
import { useWallClockSec } from '~/stores/wall-clock-store'
import type { AssetsBondRow, AssetsStakeRow } from '~/web3/assets/assets-read'

export const ASSETS_POSITION_AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals
export const ASSETS_POSITION_GAGX_DECIMALS = EXCHANGE_CONFIG.tokens.gagx.decimals

export type AssetsPositionRowFrameProps<TRow> = {
  row: TRow
  quote: 'agx' | 'usd'
  locked: boolean
  busy: boolean
  formatPeriodLabel: (period: string) => string
  /** AGX/gAGX → 文案；quote=usd 时用缓存价换 `$…` */
  formatAmount: (amount: bigint, decimals: number, unit: 'AGX' | 'gAGX') => string
  onClaim: (row: TRow) => void
  onRedeem: (row: TRow) => void
}

/** 仓位卡头部：周期胶囊 + 剩余时间，债券 / 质押 / X 挖矿卡共用 */
export function AssetsPositionRowHeader({
  periodLabel,
  remainingLabel,
  remainingAt,
  remainingValue,
  remainingAsStatus = false,
  expiredLabel,
  dayUnit,
}: {
  periodLabel: string
  remainingLabel: string
  remainingAt: bigint
  /** 自定义右侧值；时钟用组件，结束态用文案 */
  remainingValue?: ReactNode
  /** true 时藏「剩余时间」：随时可赎回 / 已完全释放等状态 */
  remainingAsStatus?: boolean
  /** unix 倒计时归零后的结束态文案（定期 / 债券） */
  expiredLabel?: string
  /** 倒计时「天」单位的本地化文案 */
  dayUnit: string
}) {
  const needsClock = remainingValue == null && remainingAt > ZERO_BI
  const nowSec = useWallClockSec(needsClock)
  const remainingSec = needsClock ? Math.max(0, Number(remainingAt) - nowSec) : 0
  const clockExpired = needsClock && remainingSec === 0
  const showRemainingLabel =
    remainingValue != null ? !remainingAsStatus : needsClock && !clockExpired
  const value =
    remainingValue != null ? (
      remainingValue
    ) : clockExpired && expiredLabel != null ? (
      expiredLabel
    ) : remainingAt > ZERO_BI ? (
      <CountdownValue
        separators={[`${dayUnit} `, ':', ':']}
        totalSec={remainingSec}
        units={['days', 'hours', 'minutes', 'seconds']}
      />
    ) : (
      '—'
    )

  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex h-6 items-center rounded-full bg-muted px-3 text-xs leading-none text-muted-foreground">
        {periodLabel}
      </span>
      <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
        {showRemainingLabel ? (
          <Text as="span" className="leading-4 text-foreground/40" variant="support">
            {remainingLabel}
          </Text>
        ) : null}
        <Text as="span" className="text-sm/4" variant="copy">
          {value}
        </Text>
      </div>
    </div>
  )
}

/** 活期预热：用 epoch + 剩余块估秒后锚定墙钟 */
function AssetsWarmupCountdown({
  remainingSec,
  dayUnit,
}: {
  remainingSec: number
  dayUnit: string
}) {
  const totalSec = useAnchoredRemainingSec(remainingSec)
  return (
    <CountdownValue
      separators={[`${dayUnit} `, ':', ':']}
      totalSec={totalSec}
      units={['days', 'hours', 'minutes', 'seconds']}
    />
  )
}

/** 本金列 + 锁定徽标；无已释放时仍占位透明，与收益列数字对齐 */
export function AssetsPositionPrincipalColumn({
  label,
  amountText,
  badgeText,
  badgeVisible,
}: {
  label: string
  amountText: string
  /** 无值仍传占位文案；由 `badgeVisible` 控制显隐 */
  badgeText: string
  badgeVisible: boolean
}) {
  return (
    <div className="grid gap-1">
      <Text as="span" className="leading-4 text-foreground/40" variant="support">
        {label}
      </Text>
      <Text as="strong" className="text-base/5 font-semibold" variant="copy">
        <CountValue text={amountText} />
      </Text>
      <span
        aria-hidden={!badgeVisible}
        className={cn(
          'inline-flex h-5.25 w-fit items-center gap-1 rounded-control bg-accent px-2',
          !badgeVisible && 'pointer-events-none opacity-0',
        )}
      >
        <Icon alt="" className="size-3" src={dappAssets.assetsPositionLock} />
        <Text as="span" className="leading-none text-primary" variant="support">
          <CountValue text={badgeText} />
        </Text>
      </span>
    </div>
  )
}

/** 收益加成徽标：双上箭头图标 + 文本 */
export function AssetsPositionBoostBadge({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex h-5.25 w-fit items-center gap-1 rounded-control bg-accent px-2',
        className,
      )}
    >
      <Icon alt="" className="size-3" src={dappAssets.assetsPositionBoost} />
      <Text as="span" className="leading-none text-primary" variant="support">
        <CountValue text={text} />
      </Text>
    </span>
  )
}

export function AssetsPositionYieldColumn({
  yieldLabel,
  amountText,
  badge,
}: {
  yieldLabel: string
  amountText: string
  badge?: ReactNode
}) {
  return (
    <div className="grid justify-items-end gap-1 text-right">
      <Text as="span" className="leading-4 text-foreground/40" variant="support">
        {yieldLabel}
      </Text>
      <Text as="strong" className="text-base/5 font-semibold text-primary" variant="copy">
        <CountValue text={amountText} />
      </Text>
      {badge}
    </div>
  )
}

/** 仓位卡的领取 + 赎回 / 解锁操作按钮组，质押与债券卡共用 */
export function AssetsPositionRowActions({
  canClaim,
  canRedeem,
  locked,
  busy,
  claimLabel,
  redeemLabel,
  onClaim,
  onRedeem,
}: {
  canClaim: boolean
  canRedeem: boolean
  locked: boolean
  busy: boolean
  claimLabel: string
  redeemLabel: string
  onClaim: () => void
  onRedeem: () => void
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <MainButton
        className="h-7 min-h-7 text-xs"
        density="inverse"
        disabled={!canClaim || locked || busy}
        onClick={onClaim}
      >
        {claimLabel}
      </MainButton>
      <MainButton
        className="h-7 min-h-7 text-xs"
        density="inverse"
        disabled={!canRedeem || locked || busy}
        onClick={onRedeem}
        variant="secondary"
      >
        {redeemLabel}
      </MainButton>
    </div>
  )
}

/** 仓位卡加载骨架（对齐描边卡：周期 · 双列 · 双操作按钮） */
export function AssetsPositionRowSkeleton() {
  return (
    <Card aria-busy aria-hidden className="grid gap-2" surface="outlined">
      <div className="flex items-center gap-2">
        <Skeleton className="w-12 rounded-full" />
        <div className="ml-auto flex items-center gap-2">
          <Skeleton className="h-3.5 w-12" />
          <Skeleton className="h-3.5 w-16" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="grid gap-1">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="w-16 rounded-control" />
        </div>
        <div className="grid justify-items-end gap-1">
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="w-full rounded-full" />
        <Skeleton className="w-full rounded-full" />
      </div>
    </Card>
  )
}

/** 左栏仓位列表加载骨架：多张骨架卡 */
export function AssetsPositionListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div aria-busy="true" aria-live="polite" className="grid gap-3">
      {Array.from({ length: count }, (_, i) => (
        <AssetsPositionRowSkeleton key={i} />
      ))}
    </div>
  )
}

/** 仓位卡「凭证」行：短地址链到 BSCScan。 */
export function AssetsPositionVoucherLink({ address, label }: { address: string; label: string }) {
  return (
    <div className="flex items-center justify-start gap-1">
      <Text as="span" className="text-xs text-foreground/40" variant="detail">
        {label}
      </Text>
      <ExplorerLink className="text-xs font-medium" value={address} />
    </div>
  )
}

/** 左栏仓位列表分页：总数始终展示；仅多页时显示翻页器 */
export function AssetsListPager({
  page,
  pageCount,
  pageSize,
  total,
  onPageChange,
}: {
  /** 0-based */
  page: number
  pageCount: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}) {
  const { messages: t } = useI18n()
  const safePage = Math.min(Math.max(page, 0), Math.max(0, pageCount - 1))
  const showPager = shouldShowTablePagination(total, pageSize)

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
      <Text as="span" className="text-xs/4" tone="muted-foreground" variant="support">
        {interpolate(t.common.paginationTotal, { total })} ·{' '}
        {interpolate(t.common.paginationPerPage, { size: pageSize })}
      </Text>
      {showPager ? (
        <div className="flex items-center gap-2">
          <Button
            className="size-auto min-h-0 px-2.5 py-1 text-xs font-medium"
            disabled={safePage <= 0}
            onClick={() => onPageChange(Math.max(0, safePage - 1))}
            shape="rounded"
            size="sm"
            type="button"
            variant="ghost"
          >
            {t.common.paginationPrev}
          </Button>
          <Text as="span" className="text-xs leading-none font-semibold" variant="support">
            {safePage + 1} / {Math.max(1, pageCount)}
          </Text>
          <Button
            className="size-auto min-h-0 px-2.5 py-1 text-xs font-medium"
            disabled={safePage >= pageCount - 1}
            onClick={() => onPageChange(Math.min(pageCount - 1, safePage + 1))}
            shape="rounded"
            size="sm"
            type="button"
            variant="ghost"
          >
            {t.common.paginationNext}
          </Button>
        </div>
      ) : null}
    </div>
  )
}

/**
 * LP / 燃烧债券仓位卡
 *
 * 展示周期与剩余时间、本金与收益、凭证链接，底部提供领取 / 赎回操作。
 */
export function AssetsPositionBondRow({
  formatPeriodLabel,
  formatAmount,
  locked,
  busy,
  onClaim,
  onRedeem,
  row,
}: AssetsPositionRowFrameProps<AssetsBondRow>) {
  const { messages: t } = useI18n()
  const canClaim = isAssetsActionableAmount(row.profit, ASSETS_POSITION_GAGX_DECIMALS)
  const canRedeem = isAssetsActionableAmount(row.pendingPayout, ASSETS_POSITION_AGX_DECIMALS)
  const periodLabel = formatPeriodLabel(String(row.period))
  const dayUnit = interpolate(t.assets.claim.releaseDays, { days: '' }).trim()

  return (
    <Card surface="outlined" className="grid gap-2">
      <AssetsPositionRowHeader
        dayUnit={dayUnit}
        expiredLabel={t.assets.position.fullyReleased}
        periodLabel={periodLabel}
        remainingAt={row.vestingEndTime}
        remainingLabel={t.assets.position.remaining}
      />
      <div className="grid grid-cols-2 gap-2">
        <AssetsPositionPrincipalColumn
          amountText={formatAmount(row.payoutRemaining, ASSETS_POSITION_AGX_DECIMALS, 'AGX')}
          badgeText={formatAmount(row.pendingPayout, ASSETS_POSITION_AGX_DECIMALS, 'AGX')}
          badgeVisible={row.pendingPayout > ZERO_BI}
          label={t.assets.position.bondPrincipal}
        />
        <AssetsPositionYieldColumn
          amountText={formatAmount(row.profit, ASSETS_POSITION_GAGX_DECIMALS, 'gAGX')}
          badge={
            // Bond 无独立加成字段；占位保持与质押卡双列数字对齐
            <AssetsPositionBoostBadge
              className="pointer-events-none opacity-0"
              text={formatAmount(ZERO_BI, ASSETS_POSITION_GAGX_DECIMALS, 'gAGX')}
            />
          }
          yieldLabel={t.assets.position.yield}
        />
      </div>
      <AssetsPositionVoucherLink address={row.depository} label={t.assets.position.voucher} />
      <AssetsPositionRowActions
        busy={busy}
        canClaim={canClaim}
        canRedeem={canRedeem}
        claimLabel={t.assets.position.claim}
        locked={locked}
        onClaim={() => onClaim(row)}
        onRedeem={() => onRedeem(row)}
        redeemLabel={t.assets.position.redeem}
      />
    </Card>
  )
}

/**
 * 质押仓位卡
 *
 * 展示周期与剩余 / warmup 状态、本金与收益、凭证链接；
 * 底部操作随状态变化：warmup 结束可激活，活期可随时赎回。
 */
export function AssetsPositionStakeRow(
  props: AssetsPositionRowFrameProps<AssetsStakeRow> & {
    /** 当前 epoch 与块窗；预热剩余时间用 epoch + 剩余块估算。 */
    epochClock?: {
      currentEpoch: bigint
      epochEndBlock: bigint
      currentBlock: bigint
      epochLengthBlocks: bigint
      secondsPerBlock: number
    } | null
    onActivate?: (row: AssetsStakeRow) => void
  },
) {
  const { formatPeriodLabel, formatAmount, locked, busy, onClaim, onRedeem, onActivate, row } =
    props
  const { messages: t } = useI18n()
  // 收益 / 加成分列展示；领取门槛：任一档 ≥ 0.01（活期仅普通收益）
  const reward = row.blockReward
  const boost = row.extraInterest
  const inWarmup = Boolean(row.inWarmup)
  const warmupExpired = Boolean(row.warmupExpired)
  const canClaim =
    !inWarmup &&
    (isAssetsActionableAmount(reward, ASSETS_POSITION_GAGX_DECIMALS) ||
      (row.kind !== 'liquid' && isAssetsActionableAmount(boost, ASSETS_POSITION_GAGX_DECIMALS)))
  const canRedeem = inWarmup
    ? warmupExpired && Boolean(onActivate)
    : isAssetsActionableAmount(
        row.kind === 'liquid' ? row.principal : row.claimableBalance,
        ASSETS_POSITION_AGX_DECIMALS,
      )
  const periodLabel = formatPeriodLabel(row.period)
  const voucherAddress = row.kind === 'locked' && row.pool ? row.pool : null
  const dayUnit = interpolate(t.assets.claim.releaseDays, { days: '' }).trim()
  const epochClock = props.epochClock

  const remainingEpochs =
    !inWarmup || warmupExpired || epochClock == null
      ? null
      : row.expiry > epochClock.currentEpoch
        ? Number(row.expiry - epochClock.currentEpoch)
        : 0
  const estimatedSec =
    remainingEpochs == null || epochClock == null
      ? null
      : remainingSecFromEpochs(
          remainingEpochs,
          epochClock.epochEndBlock,
          epochClock.currentBlock,
          epochClock.epochLengthBlocks,
          epochClock.secondsPerBlock,
        )
  const remainingAsStatus = inWarmup
    ? warmupExpired || (estimatedSec == null && !(remainingEpochs != null && remainingEpochs > 0))
    : row.kind === 'liquid'
  const remainingValue = inWarmup ? (
    warmupExpired ? (
      t.assets.position.redeemAnytime
    ) : estimatedSec != null ? (
      <AssetsWarmupCountdown dayUnit={dayUnit} remainingSec={estimatedSec} />
    ) : remainingEpochs != null && remainingEpochs > 0 ? (
      interpolate(t.assets.position.warmupRemainingEpochs, { n: remainingEpochs })
    ) : (
      t.assets.blocked.warmupActive
    )
  ) : row.kind === 'liquid' ? (
    t.assets.position.redeemAnytime
  ) : undefined
  const secondaryLabel = inWarmup ? t.assets.position.activateWarmup : t.assets.position.redeem

  return (
    <Card surface="outlined" className="grid gap-2">
      <AssetsPositionRowHeader
        dayUnit={dayUnit}
        expiredLabel={t.assets.position.fullyReleased}
        periodLabel={periodLabel}
        remainingAsStatus={remainingAsStatus}
        remainingAt={inWarmup ? ZERO_BI : row.expiry}
        remainingLabel={t.assets.position.remaining}
        remainingValue={remainingValue}
      />
      <div className="grid grid-cols-2 gap-2">
        <AssetsPositionPrincipalColumn
          amountText={formatAmount(row.principal, ASSETS_POSITION_AGX_DECIMALS, 'AGX')}
          badgeText={formatAmount(row.releasedPrincipal, ASSETS_POSITION_AGX_DECIMALS, 'AGX')}
          badgeVisible={row.releasedPrincipal > ZERO_BI}
          label={t.assets.position.staked}
        />
        <AssetsPositionYieldColumn
          amountText={formatAmount(reward, ASSETS_POSITION_GAGX_DECIMALS, 'gAGX')}
          badge={
            // 收益与加成双属性；无加成时仍占位，与左侧本金数字对齐
            <AssetsPositionBoostBadge
              className={boost > ZERO_BI ? undefined : 'pointer-events-none opacity-0'}
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
