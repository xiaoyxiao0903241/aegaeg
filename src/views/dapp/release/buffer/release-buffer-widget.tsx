import { useState } from 'react'
import { toast } from 'sonner'
import { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { useI18n } from '~/i18n/use-i18n'
import { useDappShell } from '~/app/use-dapp-shell'
import { useChainReadClient } from '~/web3/use-chain-read-client'
import { useWriteReadiness } from '~/web3/wallet/use-write-readiness'
import { isUnknownReceiptLocked, WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { Button } from '~/shared/ui/button'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'
import { ExchangeWidgetBody } from '~/views/dapp/exchange/exchange-widget-composites'
import { ReleaseSubpageHeader } from '~/views/dapp/release/release-subpage-header'
import { useReleaseBufferSnapshot } from '~/views/dapp/release/use-release-reads'
import { formatReleaseAmount, formatReleasePct } from '~/views/dapp/release/release-display'
import { submitReleaseBufferClaim } from '~/views/dapp/release/submit-release'
import { cn } from '~/shared/lib/utils'
import { exchangeHubAssets } from '~/app/assets'

export function ReleaseBufferWidget() {
  const { messages: t } = useI18n()
  const { walletReady } = useDappShell()
  const { writeReady } = useWriteReadiness()
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  const readClient = useChainReadClient()
  const bufferQuery = useReleaseBufferSnapshot(walletReady)
  const [pending, setPending] = useState(false)
  const locked = isUnknownReceiptLocked(WRITE_PATH.RELEASE_CLAIM)

  const claimable = bufferQuery.data?.totalClaimable ?? 0n
  const releasing = bufferQuery.data?.totalReleasing ?? 0n
  const canClaim = walletReady && writeReady && !locked && claimable > 0n

  async function onClaim() {
    if (!canClaim) return
    setPending(true)
    try {
      const result = await submitReleaseBufferClaim({ account, wallet, readClient })
      if (!result.ok) {
        toast.error(t.release.errors.claimFailed)
        return
      }
      toast.success(t.release.buffer.claimSuccess)
      await bufferQuery.refetch()
    } finally {
      setPending(false)
    }
  }

  return (
    <>
      <ReleaseSubpageHeader subtitle={t.release.buffer.intro} title={t.release.buffer.title} />
      <ExchangeWidgetBody>
        <Card className="shadow-none" surface="outlined">
          <Card.Content className="grid gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img alt="" className="size-5" src={exchangeHubAssets.programAgx} />
                <Text
                  as="span"
                  className="rounded-full bg-muted px-3 py-1 font-medium"
                  variant="caption"
                >
                  AGX
                </Text>
              </div>
              {claimable > 0n ? (
                <span aria-hidden className="size-2 rounded-full bg-primary" />
              ) : null}
            </div>
            <div className="flex justify-between gap-2">
              <Text as="span" tone="muted-foreground" variant="caption">
                {t.release.labels.released}{' '}
                <Text as="span" className="text-foreground" variant="caption">
                  {formatReleaseAmount(claimable)} AGX
                </Text>
              </Text>
              <Text as="span" tone="muted-foreground" variant="caption">
                {t.release.labels.releasing}{' '}
                <Text as="span" className="text-foreground" variant="caption">
                  {formatReleaseAmount(releasing)} AGX
                </Text>
              </Text>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: formatReleasePct(claimable, releasing) }}
              />
            </div>
            <Text as="span" tone="muted-foreground" variant="caption">
              {t.release.labels.releasedPct.replace(
                '{pct}',
                formatReleasePct(claimable, releasing).replace('%', ''),
              )}
            </Text>
            <Button
              className={cn(!canClaim && 'opacity-50')}
              disabled={!canClaim || pending}
              onClick={() => void onClaim()}
              type="button"
            >
              {t.release.buffer.claim}
            </Button>
          </Card.Content>
        </Card>

        <Card className="shadow-none" surface="outlined">
          <Card.Content className="grid gap-3">
            <div className="flex items-center gap-2">
              <img alt="" className="size-5" src={exchangeHubAssets.programGagx} />
              <Text
                as="span"
                className="rounded-full bg-muted px-3 py-1 font-medium"
                variant="caption"
              >
                gAGX
              </Text>
            </div>
            <Text as="p" tone="muted-foreground" variant="copy">
              {t.release.buffer.gagxHint}
            </Text>
            <Button disabled type="button">
              {t.release.buffer.claim}
            </Button>
          </Card.Content>
        </Card>

        {!walletReady ? <DappWidgetConnectPromo /> : null}
      </ExchangeWidgetBody>
    </>
  )
}
