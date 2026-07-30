import { useState } from 'react'
import { useReleaseViewStore } from '~/stores/release-view-store'
import { DappTabHeader } from '~/app/shell/dapp-tab-header'
import { toast } from 'sonner'
import { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { useI18n } from '~/i18n/use-i18n'
import { useDappShell } from '~/app/use-dapp-shell'
import { useChainReadClient } from '~/web3/use-chain-read-client'
import { useWriteReadiness } from '~/web3/wallet/use-write-readiness'
import { isUnknownReceiptLocked, WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'
import { tokenCarouselIcons } from '~/app/assets'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { Button } from '~/shared/ui/button'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import { useReleaseBufferSnapshot } from '~/views/dapp/release/use-release-reads'
import { formatReleaseAmount, formatReleasePct } from '~/views/dapp/release/release-display'
import { submitReleaseBufferClaim } from '~/views/dapp/release/submit-release'

const APPROX_EMPTY = '≈ —'

export function ReleaseBufferWidget() {
  const { messages: t } = useI18n()
  const setView = useReleaseViewStore((state) => state.setView)
  const { walletReady } = useDappShell()
  const { writeReady } = useWriteReadiness()
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  const readClient = useChainReadClient()
  const bufferQuery = useReleaseBufferSnapshot(walletReady)
  const [pending, setPending] = useState(false)
  const locked = isUnknownReceiptLocked(WRITE_PATH.RELEASE_CLAIM)
  const dash = t.release.dash

  const claimable = bufferQuery.data?.totalClaimable ?? 0n
  const releasing = bufferQuery.data?.totalReleasing ?? 0n
  const canClaim = walletReady && writeReady && !locked && claimable > 0n
  const pctLabel = formatReleasePct(claimable, releasing)

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
      <DappTabHeader
        backText={t.release.backToHub}
        onBack={() => setView('hub')}
        subtitle={t.release.buffer.intro}
        title={t.release.buffer.title}
      />
      <DappWidgetStack>
        <Card className="shadow-none" surface="outlined">
          <Card.Content className="grid gap-3">
            <div className="flex items-center gap-2">
              <DappIcon
                alt=""
                className="size-5 rounded-md"
                size="sm"
                src={tokenCarouselIcons.agxIcon}
              />
              <Text
                as="span"
                className="rounded-full bg-muted px-3 py-1 font-semibold"
                variant="caption"
              >
                AGX
              </Text>
            </div>
            <div className="flex justify-between gap-2">
              <Text as="span" tone="muted-foreground" variant="caption">
                {t.release.labels.released}{' '}
                <Text as="span" className="font-semibold text-primary" variant="caption">
                  {walletReady ? `${formatReleaseAmount(claimable)} AGX` : dash}
                </Text>
              </Text>
              <Text as="span" tone="muted-foreground" variant="caption">
                {t.release.labels.releasing}{' '}
                <Text as="span" className="font-semibold text-foreground" variant="caption">
                  {walletReady ? `${formatReleaseAmount(releasing)} AGX` : dash}
                </Text>
              </Text>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: walletReady ? pctLabel : '0%' }}
              />
            </div>
            <div className="flex justify-between gap-2">
              <Text as="span" tone="muted-foreground" variant="caption">
                {t.release.labels.releasedPct.replace('{pct}', pctLabel.replace('%', ''))}
              </Text>
              <Text as="span" tone="muted-foreground" variant="caption">
                {walletReady ? APPROX_EMPTY : dash}
              </Text>
            </div>
            <Button disabled={!canClaim || pending} onClick={() => void onClaim()} type="button">
              {t.release.buffer.claim}
            </Button>
          </Card.Content>
        </Card>

        <Card className="shadow-none" surface="outlined">
          <Card.Content className="grid gap-3">
            <div className="flex items-center gap-2">
              <DappIcon
                alt=""
                className="size-5 rounded-md"
                size="sm"
                src={tokenCarouselIcons.gagxIcon}
              />
              <Text
                as="span"
                className="rounded-full bg-muted px-3 py-1 font-semibold"
                variant="caption"
              >
                gAGX
              </Text>
            </div>
            <div className="flex justify-between gap-2">
              <Text as="span" tone="muted-foreground" variant="caption">
                {t.release.labels.released}{' '}
                <Text as="span" className="font-semibold text-primary" variant="caption">
                  {dash} gAGX
                </Text>
              </Text>
              <Text as="span" tone="muted-foreground" variant="caption">
                {t.release.labels.releasing}{' '}
                <Text as="span" className="font-semibold text-foreground" variant="caption">
                  {dash} gAGX
                </Text>
              </Text>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-0 rounded-full bg-primary" />
            </div>
            <div className="flex justify-between gap-2">
              <Text as="span" tone="muted-foreground" variant="caption">
                {t.release.labels.releasedPct.replace('{pct}', '0')}
              </Text>
              <Text as="span" tone="muted-foreground" variant="caption">
                {APPROX_EMPTY}
              </Text>
            </div>
            <Text as="p" tone="muted-foreground" variant="caption">
              {t.release.buffer.gagxHint}
            </Text>
            <Button disabled type="button">
              {t.release.buffer.claim}
            </Button>
          </Card.Content>
        </Card>

        {walletReady ? null : <DappWidgetConnectPromo />}
      </DappWidgetStack>
    </>
  )
}
