import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { useDappShell } from '~/app/use-dapp-shell'
import { formatTokenAmount, formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { useChainMutation } from '~/hooks/use-chain-mutation'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'
import { useI18n } from '~/i18n/use-i18n'
import { formatGroupedNumber } from '~/shared/api/format-display'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import type { AssetsSortKey } from '~/views/dapp/assets/assets-quote-toolbar'
import {
  type AssetsProduct,
  useAssetsPositionQueries,
} from '~/views/dapp/assets/position/use-assets-position-queries'
import {
  type MixedClaimTarget,
  submitBondRedeem,
  submitStakeRedeem,
} from '~/views/dapp/assets/submit-assets'
import { type AssetsBondRow, type AssetsStakeRow } from '~/web3/assets/assets-read'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'

export type { AssetsProduct }

const GAGX_DECIMALS = EXCHANGE_CONFIG.tokens.gagx.decimals

type ClaimState =
  | { open: false }
  | {
      open: true
      owner: string
      target: MixedClaimTarget
      label: string
      amountLabel: string
    }

type RedeemState =
  | { open: false }
  | {
      open: true
      owner: string
      kind: 'stake' | 'bond'
      row: AssetsStakeRow | AssetsBondRow
    }

type RedeemVars = {
  owner: string
  kind: 'stake' | 'bond'
  row: AssetsStakeRow | AssetsBondRow
}

function stakeSortKey(row: AssetsStakeRow): { start: number; end: number } {
  const end = row.expiry > 0n ? Number(row.expiry) : Number.MAX_SAFE_INTEGER
  const start = row.stakeIndex == null ? Number.MAX_SAFE_INTEGER : row.stakeIndex
  return { start, end }
}

function bondSortKey(row: AssetsBondRow): { start: number; end: number } {
  const end = row.vestingEndTime > 0n ? Number(row.vestingEndTime) : Number.MAX_SAFE_INTEGER
  return { start: row.bondIndex, end }
}

function compareBySort(
  left: { start: number; end: number },
  right: { start: number; end: number },
  sort: AssetsSortKey,
): number {
  switch (sort) {
    case 'startNear':
      return right.start - left.start
    case 'startFar':
      return left.start - right.start
    case 'endNear':
      return left.end - right.end
    case 'endFar':
      return right.end - left.end
  }
}

export function useAssetsPositionWidget(product: AssetsProduct) {
  const { messages: t } = useI18n()
  const { walletReady } = useDappShell()
  const account = useActiveAccount()
  const address = account?.address
  const isMobile = useMobileViewport()

  const [quote, setQuote] = useState<'agx' | 'usd'>('agx')
  const [sort, setSort] = useState<AssetsSortKey>('startNear')
  const [claim, setClaim] = useState<ClaimState>({ open: false })
  const [redeem, setRedeem] = useState<RedeemState>({ open: false })
  const [page, setPage] = useState(0)

  useEffect(() => {
    setClaim({ open: false })
    setRedeem({ open: false })
  }, [address])

  const copy = t.assets.products[product]
  const stakingTarget: 'stake' | 'lpbond' | 'burnbond' =
    product === 'stake' ? 'stake' : product === 'lpbond' ? 'lpbond' : 'burnbond'
  const pageSize = t.assets.position.pageSize
  const agxPriceUsd = useAgxPriceUsd()

  const sortOptions = useMemo(
    () =>
      (
        ['startNear', 'startFar', 'endNear', 'endFar'] as const satisfies readonly AssetsSortKey[]
      ).map((value) => ({
        value,
        label: t.assets.position.sortOptions[value],
      })),
    [t.assets.position.sortOptions],
  )

  const redeemWrite = useChainMutation({
    path: WRITE_PATH.ASSETS_CLAIM,
    mutation: (vars: RedeemVars, session) =>
      vars.kind === 'stake'
        ? submitStakeRedeem({
            session,
            owner: vars.owner,
            row: vars.row as AssetsStakeRow,
          })
        : submitBondRedeem({
            session,
            owner: vars.owner,
            row: vars.row as AssetsBondRow,
          }),
    onSuccess: () => {
      toast.success(t.assets.redeem.success)
      setRedeem({ open: false })
    },
  })

  function formatRewardUsd(amount: bigint): string {
    if (agxPriceUsd == null || agxPriceUsd <= 0) return '$0.00'
    return formatGroupedNumber(formatTokenAmountToNumber(amount, GAGX_DECIMALS) * agxPriceUsd, {
      digits: 2,
      prefix: '$',
    })
  }

  function formatPeriodLabel(period: string): string {
    if (period === 'liquid') return t.assets.position.liquid
    return t.assets.claim.releaseDays.replace('{days}', String(period))
  }

  const { stakeQuery, bondQuery } = useAssetsPositionQueries(product)

  const stakeRows = useMemo(() => {
    const rows = [...(stakeQuery.data ?? [])]
    rows.sort((a, b) => compareBySort(stakeSortKey(a), stakeSortKey(b), sort))
    return rows
  }, [stakeQuery.data, sort])

  const bondRows = useMemo(() => {
    const rows = [...(bondQuery.data ?? [])]
    rows.sort((a, b) => compareBySort(bondSortKey(a), bondSortKey(b), sort))
    return rows
  }, [bondQuery.data, sort])

  const isEmpty = product === 'stake' ? stakeRows.length === 0 : bondRows.length === 0
  const isLoading = product === 'stake' ? stakeQuery.isLoading : bondQuery.isLoading
  const totalRows = product === 'stake' ? stakeRows.length : bondRows.length
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize))
  const safePage = Math.min(page, pageCount - 1)
  const pageSliceStart = safePage * pageSize
  const pagedStakeRows = stakeRows.slice(pageSliceStart, pageSliceStart + pageSize)
  const pagedBondRows = bondRows.slice(pageSliceStart, pageSliceStart + pageSize)

  function runRedeem(kind: 'stake' | 'bond', row: AssetsStakeRow | AssetsBondRow, owner: string) {
    void redeemWrite.mutate({ kind, row, owner })
  }

  function requestRedeem(kind: 'stake' | 'bond', row: AssetsStakeRow | AssetsBondRow) {
    if (!address) return
    if (isMobile) {
      setRedeem({ open: true, owner: address, kind, row })
      return
    }
    runRedeem(kind, row, address)
  }

  function openStakeClaim(row: AssetsStakeRow) {
    if (!address) return
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
      owner: address,
      target,
      label: periodLabel,
      amountLabel: `${formatTokenAmount(target.amount, GAGX_DECIMALS, 4)} gAGX`,
    })
  }

  function openBondClaim(row: AssetsBondRow) {
    if (!address) return
    const periodLabel = formatPeriodLabel(String(row.period))
    setClaim({
      open: true,
      owner: address,
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
    runRedeem(redeem.kind, redeem.row, redeem.owner)
  }

  return {
    product,
    walletReady,
    locked: redeemWrite.isLocked,
    busy: redeemWrite.isPending,
    quote,
    setQuote,
    sort,
    setSort,
    sortOptions,
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
    openStakeClaim,
    openBondClaim,
    requestRedeem,
    closeClaim,
    closeRedeem,
    confirmRedeem,
  }
}
