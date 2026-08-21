import { useState } from 'react'
import { toast } from 'sonner'

import { ZERO_BI } from '~/core/constants'
import { formatTokenAmount, formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { canClaimWhen, unknownReceiptLocksIntent } from '~/core/wallet/write-cta'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { useChainMutation } from '~/hooks/use-chain-mutation'
import { useDappHost } from '~/hooks/use-dapp-host'
import { usePrincipalReleaseDurationDays } from '~/hooks/use-principal-release-duration-days'
import { interpolate } from '~/i18n/interpolate'
import { useI18n } from '~/i18n/use-i18n'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { formatUsdApprox } from '~/shared/presenters/format'
import { useReleaseViewStore } from '~/stores/release-view-store'
import { formatReleasePct } from '~/views/dapp/release/shared'
import { submitReleaseBufferClaim } from '~/views/dapp/release/submit-release'
import { useReleaseBufferSnapshot } from '~/views/dapp/release/use-release-reads'
import { useMigrationUser } from '~/web3/migration/use-migration-queries'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'
import { useWriteReadiness } from '~/web3/wallet/use-write-readiness'

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals
const GAGX_DECIMALS = EXCHANGE_CONFIG.tokens.gagx.decimals

/**
 * 缓冲池交互面板状态
 *
 * 读取分流器 + 归档 PRV 快照；AGX / gAGX 分卡、分 mutation 领取（同写路径互斥）；
 * 刷新按币种隔离 busy，避免一点全卡转圈。
 */
export function useBuffer() {
  const { messages: t } = useI18n()
  const setView = useReleaseViewStore((state) => state.setView)
  const { walletReady } = useDappHost()
  const { writeReady } = useWriteReadiness()
  const account = useActiveAccount()
  const migration = useMigrationUser(account?.address, { enabled: walletReady })
  const migrationOk = migration.isOldAccount === false
  const priceUsd = useAgxPriceUsd()
  const bufferQuery = useReleaseBufferSnapshot(walletReady)
  const durationQuery = usePrincipalReleaseDurationDays()
  /** 只转被点卡的刷新图标；与释放池 refreshingDays 同构 */
  const [refreshingToken, setRefreshingToken] = useState<'agx' | 'gagx' | null>(null)
  const [latchedToken, setLatchedToken] = useState<'agx' | 'gagx' | null>(null)

  const claimAgx = useChainMutation({
    path: WRITE_PATH.RELEASE_CLAIM,
    mutation: (_vars, session) => submitReleaseBufferClaim({ session, token: 'agx' }),
    onSuccess: async () => {
      toast.success(t.release.buffer.claimSuccess)
      await bufferQuery.refetch()
    },
  })
  const claimGagx = useChainMutation({
    path: WRITE_PATH.RELEASE_CLAIM,
    mutation: (_vars, session) => submitReleaseBufferClaim({ session, token: 'gagx' }),
    onSuccess: async () => {
      toast.success(t.release.buffer.claimSuccess)
      await bufferQuery.refetch()
    },
  })

  const agxClaimable = bufferQuery.data?.agx.totalClaimable ?? ZERO_BI
  const agxReleasing = bufferQuery.data?.agx.totalReleasing ?? ZERO_BI
  const gagxClaimable = bufferQuery.data?.gagx.totalClaimable ?? ZERO_BI
  const gagxReleasing = bufferQuery.data?.gagx.totalReleasing ?? ZERO_BI
  const pathBusy = claimAgx.isLocked || claimGagx.isLocked
  const pathLatched = claimAgx.isLatched || claimGagx.isLatched
  const canClaimAgx =
    migrationOk &&
    canClaimWhen({
      walletReady,
      writeReady,
      unknownReceiptLocked: unknownReceiptLocksIntent({
        pathBusy,
        pathLatched,
        latchedIntent: latchedToken,
        intent: 'agx',
      }),
      claimable: agxClaimable,
    })
  const canClaimGagx =
    migrationOk &&
    canClaimWhen({
      walletReady,
      writeReady,
      unknownReceiptLocked: unknownReceiptLocksIntent({
        pathBusy,
        pathLatched,
        latchedIntent: latchedToken,
        intent: 'gagx',
      }),
      claimable: gagxClaimable,
    })
  const agxPctLabel = formatReleasePct(agxClaimable, agxReleasing)
  const gagxPctLabel = formatReleasePct(gagxClaimable, gagxReleasing)

  async function onClaimAgx() {
    if (!canClaimAgx) return
    if (latchedToken !== 'agx') {
      claimAgx.clearLock()
      setLatchedToken('agx')
    }
    await claimAgx.mutate()
  }

  async function onClaimGagx() {
    if (!canClaimGagx) return
    if (latchedToken !== 'gagx') {
      claimAgx.clearLock()
      setLatchedToken('gagx')
    }
    await claimGagx.mutate()
  }

  async function onRefresh(token: 'agx' | 'gagx') {
    if (refreshingToken != null) return
    setRefreshingToken(token)
    try {
      await bufferQuery.refetch()
    } catch (error) {
      setRefreshingToken(null)
      throw error
    }
    setRefreshingToken(null)
  }

  const blockHint = !walletReady
    ? null
    : migration.isOldAccount === true
      ? t.staking.blocked.accountMigrated
      : migration.statusKnown && !writeReady
        ? t.topbar.wrongNetworkTooltip
        : null

  return {
    t,
    onBack: () => setView('hub'),
    walletReady,
    blockHint,
    intro: interpolate(t.release.buffer.intro, { days: durationQuery.data ?? 30 }),
    claimableLabel: `${formatTokenAmount(agxClaimable, AGX_DECIMALS, 4)} AGX`,
    releasingLabel: `${formatTokenAmount(agxReleasing, AGX_DECIMALS, 4)} AGX`,
    releasedPctLabel: interpolate(t.release.labels.releasedPct, {
      pct: agxPctLabel.replace('%', ''),
    }),
    valueHint: formatUsdApprox(formatTokenAmountToNumber(agxClaimable, AGX_DECIMALS), priceUsd),
    progressWidth: agxPctLabel,
    gagxClaimableLabel: `${formatTokenAmount(gagxClaimable, GAGX_DECIMALS, 4)} gAGX`,
    gagxReleasingLabel: `${formatTokenAmount(gagxReleasing, GAGX_DECIMALS, 4)} gAGX`,
    gagxReleasedPctLabel: interpolate(t.release.labels.releasedPct, {
      pct: gagxPctLabel.replace('%', ''),
    }),
    gagxValueHint: formatUsdApprox(
      formatTokenAmountToNumber(gagxClaimable, GAGX_DECIMALS),
      priceUsd,
    ),
    gagxProgressWidth: gagxPctLabel,
    canClaimAgx,
    canClaimGagx,
    claimingAgx: claimAgx.isPending,
    claimingGagx: claimGagx.isPending,
    onClaimAgx,
    onClaimGagx,
    onRefresh,
    refreshingToken,
  }
}
