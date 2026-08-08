import { useState } from 'react'
import { toast } from 'sonner'

import { ZERO_BI } from '~/core/constants'
import { formatTokenAmount, formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { canClaimWhen } from '~/core/wallet/write-cta'
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
 * 读取分流器 + 归档 PRV 快照；AGX / gAGX 分卡、分 mutation 领取（同写路径互斥）。
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
  const [refreshing, setRefreshing] = useState(false)

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
  // 同 WRITE_PATH：任一在途/锁定时两侧都不可再点
  const pathBusy = claimAgx.isLocked || claimGagx.isLocked
  const canClaimAgx =
    migrationOk &&
    canClaimWhen({
      walletReady,
      writeReady,
      unknownReceiptLocked: pathBusy,
      claimable: agxClaimable,
    })
  const canClaimGagx =
    migrationOk &&
    canClaimWhen({
      walletReady,
      writeReady,
      unknownReceiptLocked: pathBusy,
      claimable: gagxClaimable,
    })
  const agxPctLabel = formatReleasePct(agxClaimable, agxReleasing)
  const gagxPctLabel = formatReleasePct(gagxClaimable, gagxReleasing)

  async function onClaimAgx() {
    if (!canClaimAgx) return
    await claimAgx.mutate()
  }

  async function onClaimGagx() {
    if (!canClaimGagx) return
    await claimGagx.mutate()
  }

  async function onRefresh() {
    if (refreshing) return
    setRefreshing(true)
    try {
      await bufferQuery.refetch()
    } catch (error) {
      setRefreshing(false)
      throw error
    }
    setRefreshing(false)
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
    refreshing,
  }
}
