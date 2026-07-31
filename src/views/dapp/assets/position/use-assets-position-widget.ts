import { useState } from 'react'
import { toast } from 'sonner'
import { useI18n } from '~/i18n/use-i18n'
import { useDappShell } from '~/app/use-dapp-shell'
import { formatTokenAmount, formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { formatGroupedNumber } from '~/shared/api/format-display'
import { queryKeys } from '~/shared/api/query/query-keys'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { useChainMutation } from '~/hooks/use-chain-mutation'
import { useChainQuery } from '~/hooks/use-chain-query'
import { usePresaleAgxPriceQuery } from '~/web3/presale/use-presale-queries'
import {
  submitBondRedeem,
  submitStakeRedeem,
  type MixedClaimTarget,
} from '~/views/dapp/assets/submit-assets'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'
import { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { useChainReadClient } from '~/web3/use-chain-read-client'
import {
  readBurnBondPositions,
  readLpBondPositions,
  readStakePositions,
  type AssetsBondRow,
  type AssetsStakeRow,
} from '~/web3/assets/assets-read'
import { WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'
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

type RedeemVars = {
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

  const [quote, setQuote] = useState<'agx' | 'usd'>('agx')
  const [claim, setClaim] = useState<ClaimState>({ open: false })
  const [redeem, setRedeem] = useState<RedeemState>({ open: false })
  const [page, setPage] = useState(0)

  const copy = t.assets.products[product]
  const stakingTarget: 'stake' | 'lpbond' | 'burnbond' =
    product === 'stake' ? 'stake' : product === 'lpbond' ? 'lpbond' : 'burnbond'
  const pageSize = t.assets.position.pageSize
  const agxPriceQuery = usePresaleAgxPriceQuery()
  const agxPriceUsd = formatTokenAmountToNumber(agxPriceQuery.data ?? 0n, USD1_DECIMALS)

  const redeemWrite = useChainMutation({
    path: WRITE_PATH.ASSETS_CLAIM,
    mutation: (vars: RedeemVars) =>
      vars.kind === 'stake'
        ? submitStakeRedeem({
            row: vars.row as AssetsStakeRow,
            account,
            wallet,
            readClient,
          })
        : submitBondRedeem({
            row: vars.row as AssetsBondRow,
            account,
            wallet,
            readClient,
          }),
    onSuccess: () => {
      toast.success(t.assets.redeem.success)
      setRedeem({ open: false })
    },
  })

  function formatRewardUsd(amount: bigint): string {
    if (agxPriceQuery.isError || agxPriceUsd <= 0) return '—'
    return formatGroupedNumber(formatTokenAmountToNumber(amount, GAGX_DECIMALS) * agxPriceUsd, {
      digits: 2,
      prefix: '$',
    })
  }

  function formatPeriodLabel(period: string): string {
    if (period === 'liquid') return t.assets.position.liquid
    return t.assets.claim.releaseDays.replace('{days}', String(period))
  }

  const stakeQuery = useChainQuery({
    queryKey: queryKeys.chain.assetsStakePositions,
    queryFn: (addr) => readStakePositions(addr as Address),
    enabled: product === 'stake',
  })

  const bondQuery = useChainQuery({
    queryKey: queryKeys.chain.assetsBondPositions(product),
    queryFn: (addr) =>
      product === 'lpbond'
        ? readLpBondPositions(addr as Address)
        : readBurnBondPositions(addr as Address),
    enabled: product !== 'stake',
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

  function runRedeem(kind: 'stake' | 'bond', row: AssetsStakeRow | AssetsBondRow) {
    void redeemWrite.mutate({ kind, row })
  }

  function requestRedeem(kind: 'stake' | 'bond', row: AssetsStakeRow | AssetsBondRow) {
    if (isMobile) {
      setRedeem({ open: true, kind, row })
      return
    }
    runRedeem(kind, row)
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
    runRedeem(redeem.kind, redeem.row)
  }

  return {
    product,
    walletReady,
    locked: redeemWrite.isLocked,
    busy: redeemWrite.isPending,
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
