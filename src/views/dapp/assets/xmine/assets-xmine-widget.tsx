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
import { AssetsSubpageHeader } from '~/views/dapp/assets/assets-subpage-header'
import { AssetsRedeemConfirm } from '~/views/dapp/assets/redeem/assets-redeem-confirm'
import {
  ASSETS_GATE_ERROR,
  submitXmineClaim,
  submitXmineUnstake,
} from '~/views/dapp/assets/submit-assets'
import { ExchangeWidgetBody } from '~/views/dapp/exchange/exchange-widget-composites'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'
import { presentUserFacingError } from '~/web3/present-user-facing-error'
import { readErrorText } from '~/web3/errors/error-text'
import { resolveWalletTransactionError } from '~/web3/resolve-contract-error-message'
import { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { useChainReadClient } from '~/web3/use-chain-read-client'
import { readXminePosition } from '~/web3/assets/assets-read'
import { isUnknownReceiptLocked, WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'
import type { Address } from '~/shared/config/contracts'

const X_DECIMALS = EXCHANGE_CONFIG.tokens.x.decimals
const GAGX_DECIMALS = EXCHANGE_CONFIG.tokens.gagx.decimals

export function AssetsXmineWidget() {
  const { messages: t } = useI18n()
  const { walletReady } = useDappShell()
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  const readClient = useChainReadClient()
  const isMobile = useMobileViewport()
  const address = account?.address
  const locked = isUnknownReceiptLocked(WRITE_PATH.ASSETS_CLAIM)
  const [busy, setBusy] = useState(false)
  const [confirmUnstake, setConfirmUnstake] = useState(false)

  const copy = t.assets.products.xmine

  const positionQuery = useQuery({
    queryKey: queryKeys.chain.assetsXminePosition(address ?? ''),
    queryFn: () => readXminePosition(address as Address, readClient),
    enabled: walletReady && Boolean(address),
  })

  const position = positionQuery.data
  const isEmpty = !position || (position.miningStake <= 0n && position.pending <= 0n)

  function resolveMessage(error: unknown) {
    const raw = readErrorText(error)
    if (raw === ASSETS_GATE_ERROR.warmupActive) return t.assets.gates.warmupActive
    if (raw === ASSETS_GATE_ERROR.nothingToRedeem) return t.assets.gates.nothingToRedeem
    if (raw === ASSETS_GATE_ERROR.zeroAmount) return t.assets.gates.zeroAmount
    if (raw === ASSETS_GATE_ERROR.unavailable) return t.assets.gates.unavailable
    return (
      resolveWalletTransactionError(error, t.wallet.transactionErrors) ?? t.errors.chain.fallback
    )
  }

  async function handleClaim() {
    setBusy(true)
    try {
      const result = await submitXmineClaim({ account, wallet, readClient })
      if (result.ok) {
        toast.success(t.assets.claim.xmineSuccess)
        return
      }
      if (result.error != null) presentUserFacingError(result.error, resolveMessage)
    } finally {
      setBusy(false)
    }
  }

  async function handleUnstake() {
    setBusy(true)
    try {
      const result = await submitXmineUnstake({ account, wallet, readClient })
      if (result.ok) {
        toast.success(t.assets.redeem.success)
        setConfirmUnstake(false)
        return
      }
      if (result.error != null) presentUserFacingError(result.error, resolveMessage)
    } finally {
      setBusy(false)
    }
  }

  function requestUnstake() {
    if (isMobile) {
      setConfirmUnstake(true)
      return
    }
    void handleUnstake()
  }

  return (
    <>
      <AssetsSubpageHeader subtitle={copy.intro} title={copy.title} />
      <ExchangeWidgetBody>
        {!walletReady ? (
          <DappWidgetConnectPromo />
        ) : positionQuery.isLoading ? (
          <Text as="p" tone="muted-foreground" variant="copy">
            …
          </Text>
        ) : isEmpty ? (
          <div className="grid gap-3">
            <Text as="p" tone="muted-foreground" variant="copy">
              {copy.empty}
            </Text>
            <Button onClick={() => openStakingView('xmine')} type="button">
              {copy.emptyCta}
            </Button>
          </div>
        ) : (
          <Card surface="outlined" className="grid gap-3 p-4 shadow-none">
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1">
                <Text as="span" tone="muted-foreground" variant="detail">
                  {t.assets.position.staked}
                </Text>
                <Text as="strong" variant="copy">
                  {formatTokenAmount(position.miningStake, GAGX_DECIMALS, 4)} gAGX
                </Text>
              </div>
              <div className="grid gap-1 text-right">
                <Text as="span" tone="muted-foreground" variant="detail">
                  {t.assets.position.yield}
                </Text>
                <Text as="strong" variant="copy">
                  {formatTokenAmount(position.pending, X_DECIMALS, 4)} X
                </Text>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <DappActionButton
                density="external"
                disabled={position.pending <= 0n || position.warmupGons > 0n || locked || busy}
                onClick={() => void handleClaim()}
              >
                {t.assets.position.claim}
              </DappActionButton>
              <DappActionButton
                density="external"
                disabled={position.gons <= 0n || position.warmupGons > 0n || locked || busy}
                onClick={requestUnstake}
                variant="secondary"
              >
                {t.assets.position.unstake}
              </DappActionButton>
            </div>
          </Card>
        )}
      </ExchangeWidgetBody>

      <AssetsRedeemConfirm
        busy={busy}
        onConfirm={() => void handleUnstake()}
        onOpenChange={setConfirmUnstake}
        open={confirmUnstake}
      />
    </>
  )
}
