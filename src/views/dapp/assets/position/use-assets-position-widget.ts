import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'
import { useI18n } from '~/i18n/use-i18n'
import { useDappShell } from '~/app/use-dapp-shell'
import { formatTokenAmount, formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { formatUsd } from '~/shared/api/format-display'
import { queryKeys } from '~/shared/api/query/query-keys'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { hasWalletAccount } from '~/web3/wallet/wallet-connection-state'
import { usePresaleAgxPriceQuery } from '~/web3/presale/use-presale-queries'
import {
  ASSETS_GATE_ERROR,
  submitBondRedeem,
  submitStakeRedeem,
  type MixedClaimTarget,
} from '~/views/dapp/assets/submit-assets'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'
import { presentUserFacingError } from '~/web3/present-user-facing-error'
import { readErrorText } from '~/web3/errors/error-text'
import { resolveWalletTransactionError } from '~/web3/resolve-contract-error-message'
import { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { useChainReadClient } from '~/web3/use-chain-read-client'
import {
  readBurnBondPositions,
  readLpBondPositions,
  readStakePositions,
  type AssetsBondRow,
  type AssetsStakeRow,
} from '~/web3/assets/assets-read'
import { isUnknownReceiptLocked, WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'
import type { Address } from '~/shared/config/contracts'

export type AssetsProduct = 'stake' | 'lpbond' | 'burnbond'

const GAGX_DECIMALS = EXCHANGE_CONFIG.tokens.gagx.decimals
const USD1_DECIMALS = EXCHANGE_CONFIG.tokens.usd1.decimals

type ClaimState =
  { open: false } | { open: true; target: MixedClaimTarget; label: string; amountLabel: string }

type RedeemState =
  | { open: false }
  | {
      open: true
      kind: 'stake' | 'bond'
      row: AssetsStakeRow | AssetsBondRow
    }

export function useAssetsPositionWidget(product: AssetsProduct) {
  const { messages: t } = useI18n()
  const { walletReady } = useDappShell()
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  const readClient = useChainReadClient()
  const isMobile = useMobileViewport()
  const address = account?.address
  const locked = isUnknownReceiptLocked(WRITE_PATH.ASSETS_CLAIM)

  const [quote, setQuote] = useState<'agx' | 'usd'>('agx')
  const [claim, setClaim] = useState<ClaimState>({ open: false })
  const [redeem, setRedeem] = useState<RedeemState>({ open: false })
  const [busy, setBusy] = useState(false)
  const [page, setPage] = useState(0)

  const copy = t.assets.products[product]
  const stakingTarget: 'stake' | 'lpbond' | 'burnbond' =
    product === 'stake' ? 'stake' : product === 'lpbond' ? 'lpbond' : 'burnbond'
  const pageSize = t.assets.position.pageSize
  const agxPriceQuery = usePresaleAgxPriceQuery()
  const agxPriceUsd = formatTokenAmountToNumber(agxPriceQuery.data ?? 0n, USD1_DECIMALS)

  function formatRewardUsd(amount: bigint): string {
    if (agxPriceQuery.isError || agxPriceUsd <= 0) return '—'
    return formatUsd(formatTokenAmountToNumber(amount, GAGX_DECIMALS) * agxPriceUsd, 2)
  }

  function formatPeriodLabel(period: string): string {
    if (period === 'liquid') return t.assets.position.liquid
    return t.assets.claim.releaseDays.replace('{days}', String(period))
  }

  const stakeQuery = useQuery({
    queryKey: queryKeys.chain.assetsStakePositions(address ?? ''),
    queryFn: () => readStakePositions(address as Address, readClient),
    enabled: walletReady && Boolean(address) && product === 'stake',
  })

  const bondQuery = useQuery({
    queryKey: queryKeys.chain.assetsBondPositions(product, address ?? ''),
    queryFn: () =>
      product === 'lpbond'
        ? readLpBondPositions(address as Address, readClient)
        : readBurnBondPositions(address as Address, readClient),
    enabled: walletReady && Boolean(address) && product !== 'stake',
  })

  const stakeRows = stakeQuery.data ?? []
  const bondRows = bondQuery.data ?? []
  const isEmpty = product === 'stake' ? stakeRows.length === 0 : bondRows.length === 0
  const isLoading = product === 'stake' ? stakeQuery.isLoading : bondQuery.isLoading
  const totalRows = product === 'stake' ? stakeRows.length : bondRows.length
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize))
  const safePage = Math.min(page, pageCount - 1)
  const pageSliceStart = safePage * pageSize
  const pagedStakeRows = stakeRows.slice(pageSliceStart, pageSliceStart + pageSize)
  const pagedBondRows = bondRows.slice(pageSliceStart, pageSliceStart + pageSize)

  function resolveMessage(error: unknown) {
    const raw = readErrorText(error)
    if (raw === ASSETS_GATE_ERROR.insufficientContribution)
      return t.assets.gates.insufficientContribution
    if (raw === ASSETS_GATE_ERROR.releasePlanUnresolved) return t.assets.gates.planUnresolved
    if (raw === ASSETS_GATE_ERROR.restakePlanUnresolved) return t.assets.gates.planUnresolved
    if (raw === ASSETS_GATE_ERROR.nothingToRedeem) return t.assets.gates.nothingToRedeem
    if (raw === ASSETS_GATE_ERROR.unavailable) return t.assets.gates.unavailable
    if (raw === ASSETS_GATE_ERROR.zeroAmount) return t.assets.gates.zeroAmount
    if (raw === ASSETS_GATE_ERROR.insufficientReward) return t.assets.gates.insufficientReward
    return (
      resolveWalletTransactionError(error, t.wallet.transactionErrors) ?? t.errors.chain.fallback
    )
  }

  async function runRedeem(kind: 'stake' | 'bond', row: AssetsStakeRow | AssetsBondRow) {
    if (!hasWalletAccount(account) || !wallet) return
    setBusy(true)
    try {
      const result =
        kind === 'stake'
          ? await submitStakeRedeem({
              row: row as AssetsStakeRow,
              account,
              wallet,
              readClient,
            })
          : await submitBondRedeem({
              row: row as AssetsBondRow,
              account,
              wallet,
              readClient,
            })
      if (result.ok) {
        toast.success(t.assets.redeem.success)
        setRedeem({ open: false })
        return
      }
      if (result.error != null) presentUserFacingError(result.error, resolveMessage)
    } finally {
      setBusy(false)
    }
  }

  function requestRedeem(kind: 'stake' | 'bond', row: AssetsStakeRow | AssetsBondRow) {
    if (isMobile) {
      setRedeem({ open: true, kind, row })
      return
    }
    void runRedeem(kind, row)
  }

  function openStakeClaim(row: AssetsStakeRow) {
    const reward = row.blockReward + row.extraInterest
    const periodLabel = formatPeriodLabel(row.period)
    const target: MixedClaimTarget =
      row.kind === 'liquid'
        ? { source: 'liquid', amount: reward }
        : {
            source: 'locked',
            pool: row.pool,
            stakeIndex: row.stakeIndex!,
            amount: row.blockReward > 0n ? row.blockReward : row.extraInterest,
            extra: row.blockReward <= 0n && row.extraInterest > 0n,
          }
    setClaim({
      open: true,
      target,
      label: periodLabel,
      amountLabel: `${formatTokenAmount(target.amount, GAGX_DECIMALS, 4)} gAGX`,
    })
  }

  function openBondClaim(row: AssetsBondRow) {
    const periodLabel = formatPeriodLabel(String(row.period))
    setClaim({
      open: true,
      target: {
        source: 'bond',
        depository: row.depository,
        bondIndex: row.bondIndex,
        amount: row.profit,
      },
      label: periodLabel,
      amountLabel: `${formatTokenAmount(row.profit, GAGX_DECIMALS, 4)} gAGX`,
    })
  }

  function closeClaim() {
    setClaim({ open: false })
  }

  function closeRedeem() {
    setRedeem({ open: false })
  }

  function confirmRedeem() {
    if (!redeem.open) return
    void runRedeem(redeem.kind, redeem.row)
  }

  return {
    product,
    walletReady,
    locked,
    busy,
    quote,
    setQuote,
    claim,
    redeem,
    copy,
    stakingTarget,
    pageSize,
    formatRewardUsd,
    formatPeriodLabel,
    isEmpty,
    isLoading,
    totalRows,
    pageCount,
    safePage,
    setPage,
    pagedStakeRows,
    pagedBondRows,
    requestRedeem,
    openStakeClaim,
    openBondClaim,
    closeClaim,
    closeRedeem,
    confirmRedeem,
  }
}
