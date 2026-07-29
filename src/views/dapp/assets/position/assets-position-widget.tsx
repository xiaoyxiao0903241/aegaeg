import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'
import { useI18n } from '~/i18n/use-i18n'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { useDappShell } from '~/app/use-dapp-shell'
import { formatTokenAmount } from '~/core/exchange/token-amount'
import { queryKeys } from '~/shared/api/query/query-keys'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { openStakingView } from '~/shared/config/open-staking-view'
import { Button } from '~/shared/ui/button'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'
import { hasWalletAccount } from '~/web3/wallet/wallet-connection-state'
import { AssetsSubpageHeader } from '~/views/dapp/assets/assets-subpage-header'
import { AssetsClaimModal } from '~/views/dapp/assets/claim-modal/assets-claim-modal'
import { AssetsRedeemConfirm } from '~/views/dapp/assets/redeem/assets-redeem-confirm'
import {
  ASSETS_GATE_ERROR,
  submitBondRedeem,
  submitStakeRedeem,
  type MixedClaimTarget,
} from '~/views/dapp/assets/submit-assets'
import { ExchangeWidgetBody } from '~/views/dapp/exchange/exchange-widget-composites'
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

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals
const GAGX_DECIMALS = EXCHANGE_CONFIG.tokens.gagx.decimals

export type AssetsProduct = 'stake' | 'lpbond' | 'burnbond'

type ClaimState =
  { open: false } | { open: true; target: MixedClaimTarget; label: string; amountLabel: string }

type RedeemState =
  | { open: false }
  | {
      open: true
      kind: 'stake' | 'bond'
      row: AssetsStakeRow | AssetsBondRow
    }

export function AssetsPositionWidget({ product }: { product: AssetsProduct }) {
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
  const stakingTarget = product === 'stake' ? 'stake' : product === 'lpbond' ? 'lpbond' : 'burnbond'
  const pageSize = t.assets.position.pageSize

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

  return (
    <>
      <AssetsSubpageHeader subtitle={copy.intro} title={copy.title} />
      <ExchangeWidgetBody>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button
            className="inline-flex h-6 items-center gap-1 rounded-full bg-muted px-3 text-xs text-foreground"
            type="button"
          >
            {t.assets.position.sort}
          </button>
          <div className="flex items-center gap-1">
            <Text as="span" tone="muted-foreground" variant="detail">
              {t.assets.position.quoteCurrency}
            </Text>
            <div className="flex rounded-full bg-muted p-0.5">
              <button
                className={`rounded-full px-3 py-1 text-xs ${quote === 'agx' ? 'bg-card font-semibold text-foreground' : 'text-muted-foreground'}`}
                onClick={() => setQuote('agx')}
                type="button"
              >
                AGX
              </button>
              <button
                className={`rounded-full px-3 py-1 text-xs ${quote === 'usd' ? 'bg-card font-semibold text-foreground' : 'text-muted-foreground'}`}
                onClick={() => setQuote('usd')}
                type="button"
              >
                USD
              </button>
            </div>
          </div>
        </div>

        {!walletReady ? (
          <DappWidgetConnectPromo />
        ) : isLoading ? (
          <Text as="p" tone="muted-foreground" variant="copy">
            …
          </Text>
        ) : isEmpty ? (
          <div className="grid gap-3">
            <Text as="p" tone="muted-foreground" variant="copy">
              {copy.empty}
            </Text>
            <Button onClick={() => openStakingView(stakingTarget)} type="button">
              {copy.emptyCta}
            </Button>
          </div>
        ) : product === 'stake' ? (
          pagedStakeRows.map((row) => {
            const reward = row.blockReward + row.extraInterest
            const canClaim = reward > 0n
            const canRedeem = row.kind === 'liquid' ? row.principal > 0n : row.claimableBalance > 0n
            const periodLabel =
              row.period === 'liquid' ? t.assets.position.liquid : `${row.period}d`
            return (
              <Card key={row.id} surface="outlined" className="grid gap-3 p-4 shadow-none">
                <div className="flex items-center justify-between gap-2">
                  <Text as="span" className="font-semibold" variant="copy">
                    {periodLabel}
                  </Text>
                  <Text as="span" tone="muted-foreground" variant="detail">
                    {t.assets.position.remaining}: —
                  </Text>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1">
                    <Text as="span" tone="muted-foreground" variant="detail">
                      {t.assets.position.staked}
                    </Text>
                    <Text as="strong" variant="copy">
                      {formatTokenAmount(row.principal, AGX_DECIMALS, 4)} AGX
                    </Text>
                    {row.releasedPrincipal > 0n ? (
                      <Text as="span" tone="muted-foreground" variant="detail">
                        {formatTokenAmount(row.releasedPrincipal, AGX_DECIMALS, 4)} AGX
                      </Text>
                    ) : null}
                  </div>
                  <div className="grid gap-1 text-right">
                    <Text as="span" tone="muted-foreground" variant="detail">
                      {t.assets.position.yield}
                    </Text>
                    <Text as="strong" variant="copy">
                      {formatTokenAmount(reward, GAGX_DECIMALS, 4)} gAGX
                    </Text>
                    {quote === 'usd' ? (
                      <Text as="span" tone="muted-foreground" variant="detail">
                        —
                      </Text>
                    ) : null}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <DappActionButton
                    density="external"
                    disabled={!canClaim || locked || busy}
                    onClick={() => {
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
                    }}
                  >
                    {t.assets.position.claim}
                  </DappActionButton>
                  <DappActionButton
                    density="external"
                    disabled={!canRedeem || locked || busy}
                    onClick={() => requestRedeem('stake', row)}
                    variant="secondary"
                  >
                    {row.kind === 'liquid' ? t.assets.position.unlock : t.assets.position.redeem}
                  </DappActionButton>
                </div>
              </Card>
            )
          })
        ) : (
          pagedBondRows.map((row) => {
            const canClaim = row.profit > 0n
            const canRedeem = row.pendingPayout > 0n
            const periodLabel = `${row.period}d`
            return (
              <Card key={row.id} surface="outlined" className="grid gap-3 p-4 shadow-none">
                <div className="flex items-center justify-between gap-2">
                  <Text as="span" className="font-semibold" variant="copy">
                    {periodLabel}
                  </Text>
                  <Text as="span" tone="muted-foreground" variant="detail">
                    {t.assets.position.remaining}: —
                  </Text>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1">
                    <Text as="span" tone="muted-foreground" variant="detail">
                      {t.assets.position.payout}
                    </Text>
                    <Text as="strong" variant="copy">
                      {formatTokenAmount(row.payoutRemaining, AGX_DECIMALS, 4)} AGX
                    </Text>
                  </div>
                  <div className="grid gap-1 text-right">
                    <Text as="span" tone="muted-foreground" variant="detail">
                      {t.assets.position.yield}
                    </Text>
                    <Text as="strong" variant="copy">
                      {formatTokenAmount(row.profit, GAGX_DECIMALS, 4)} gAGX
                    </Text>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <DappActionButton
                    density="external"
                    disabled={!canClaim || locked || busy}
                    onClick={() =>
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
                  >
                    {t.assets.position.claim}
                  </DappActionButton>
                  <DappActionButton
                    density="external"
                    disabled={!canRedeem || locked || busy}
                    onClick={() => requestRedeem('bond', row)}
                    variant="secondary"
                  >
                    {t.assets.position.redeem}
                  </DappActionButton>
                </div>
              </Card>
            )
          })
        )}

        {!isEmpty && walletReady ? (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <Text as="span" tone="muted-foreground" variant="detail">
              {t.common.paginationTotal.replace('{total}', String(totalRows))} ·{' '}
              {t.common.paginationPerPage.replace('{size}', String(pageSize))}
            </Text>
            <div className="flex gap-2">
              <button
                className="rounded-full bg-muted px-3 py-1 text-xs disabled:opacity-40"
                disabled={safePage <= 0}
                onClick={() => setPage((value) => Math.max(0, value - 1))}
                type="button"
              >
                {t.common.paginationPrev}
              </button>
              <button
                className="rounded-full bg-muted px-3 py-1 text-xs disabled:opacity-40"
                disabled={safePage >= pageCount - 1}
                onClick={() => setPage((value) => Math.min(pageCount - 1, value + 1))}
                type="button"
              >
                {t.common.paginationNext}
              </button>
            </div>
          </div>
        ) : null}
      </ExchangeWidgetBody>

      <AssetsClaimModal
        amountLabel={claim.open ? claim.amountLabel : ''}
        onOpenChange={(open) => {
          if (!open) setClaim({ open: false })
        }}
        open={claim.open}
        positionLabel={claim.open ? claim.label : ''}
        target={claim.open ? claim.target : null}
      />

      <AssetsRedeemConfirm
        busy={busy}
        onConfirm={() => {
          if (!redeem.open) return
          void runRedeem(redeem.kind, redeem.row)
        }}
        onOpenChange={(open) => {
          if (!open) setRedeem({ open: false })
        }}
        open={redeem.open}
      />
    </>
  )
}
