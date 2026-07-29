import { useState } from 'react'
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
import { ExchangeWidgetBody } from '~/views/dapp/exchange/exchange-widget-composites'
import { ReleaseSubpageHeader } from '~/views/dapp/release/release-subpage-header'
import { useReleaseQueueSnapshot } from '~/views/dapp/release/use-release-reads'
import { formatReleaseAmount, formatReleasePct } from '~/views/dapp/release/release-display'
import { submitReleaseQueueClaim } from '~/views/dapp/release/submit-release'
import { RELEASE_DURATION_DAYS } from '~/core/assets/claim-plans'

const APPROX_EMPTY = '≈ —'

export function ReleaseQueueWidget() {
  const { messages: t } = useI18n()
  const { walletReady } = useDappShell()
  const { writeReady } = useWriteReadiness()
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  const readClient = useChainReadClient()
  const queueQuery = useReleaseQueueSnapshot(walletReady)
  const [pendingPlan, setPendingPlan] = useState<number | null>(null)
  const locked = isUnknownReceiptLocked(WRITE_PATH.RELEASE_CLAIM)
  const dash = t.release.dash

  const rows = RELEASE_DURATION_DAYS.map((days) => {
    const found = queueQuery.data?.plans.find((p) => p.durationDays === days)
    return {
      days,
      planIndex: found?.planIndex ?? -1,
      claimable: found?.claimable ?? 0n,
      releasing: found?.releasing ?? 0n,
    }
  })

  async function onClaim(planIndex: number) {
    if (!writeReady || locked || planIndex < 0) return
    setPendingPlan(planIndex)
    try {
      const result = await submitReleaseQueueClaim({
        account,
        wallet,
        readClient,
        planIndex,
      })
      if (!result.ok) {
        toast.error(t.release.errors.claimFailed)
        return
      }
      toast.success(t.release.queue.claimSuccess)
      await queueQuery.refetch()
    } finally {
      setPendingPlan(null)
    }
  }

  return (
    <>
      <ReleaseSubpageHeader subtitle={t.release.queue.intro} title={t.release.queue.title} />
      <ExchangeWidgetBody>
        {rows.map((row) => {
          const canClaim =
            walletReady && writeReady && !locked && row.claimable > 0n && row.planIndex >= 0
          const pctLabel = formatReleasePct(row.claimable, row.releasing)
          return (
            <Card className="shadow-none" key={row.days} surface="outlined">
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
                    {t.release.queue.planDays.replace('{days}', String(row.days))}
                  </Text>
                </div>
                <div className="flex justify-between gap-2">
                  <Text as="span" tone="muted-foreground" variant="caption">
                    {t.release.labels.released}{' '}
                    <Text as="span" className="font-semibold text-primary" variant="caption">
                      {walletReady
                        ? `${formatReleaseAmount(row.claimable)} ${t.release.units.queue}`
                        : dash}
                    </Text>
                  </Text>
                  <Text as="span" tone="muted-foreground" variant="caption">
                    {t.release.labels.releasing}{' '}
                    <Text as="span" className="font-semibold text-foreground" variant="caption">
                      {walletReady
                        ? `${formatReleaseAmount(row.releasing)} ${t.release.units.queue}`
                        : dash}
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
                <Button
                  disabled={!canClaim || pendingPlan === row.planIndex}
                  onClick={() => void onClaim(row.planIndex)}
                  type="button"
                >
                  {t.release.queue.claim}
                </Button>
              </Card.Content>
            </Card>
          )
        })}

        {walletReady ? null : <DappWidgetConnectPromo />}
      </ExchangeWidgetBody>
    </>
  )
}
