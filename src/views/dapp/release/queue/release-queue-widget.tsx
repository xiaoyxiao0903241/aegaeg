import { useState } from 'react'
import { toast } from 'sonner'
import { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { useI18n } from '~/i18n/use-i18n'
import { useDappShell } from '~/app/use-dapp-shell'
import { useChainReadClient } from '~/web3/use-chain-read-client'
import { useWriteReadiness } from '~/web3/wallet/use-write-readiness'
import { isUnknownReceiptLocked, WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'
import { openExchangeView } from '~/shared/config/open-exchange-view'
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
import { cn } from '~/shared/lib/utils'

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
          return (
            <Card className="shadow-none" key={row.days} surface="outlined">
              <Card.Content className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Text
                    as="span"
                    className="rounded-full bg-muted px-3 py-1 font-medium"
                    variant="caption"
                  >
                    {t.release.queue.planDays.replace('{days}', String(row.days))}
                  </Text>
                  {row.claimable > 0n ? (
                    <span aria-hidden className="size-2 rounded-full bg-primary" />
                  ) : null}
                </div>
                <div className="flex justify-between gap-2">
                  <Text as="span" tone="muted-foreground" variant="caption">
                    {t.release.labels.released}{' '}
                    <Text as="span" className="text-foreground" variant="caption">
                      {formatReleaseAmount(row.claimable)} {t.release.units.queue}
                    </Text>
                  </Text>
                  <Text as="span" tone="muted-foreground" variant="caption">
                    {t.release.labels.releasing}{' '}
                    <Text as="span" className="text-foreground" variant="caption">
                      {formatReleaseAmount(row.releasing)} {t.release.units.queue}
                    </Text>
                  </Text>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: formatReleasePct(row.claimable, row.releasing),
                    }}
                  />
                </div>
                <div className="flex justify-between">
                  <Text as="span" tone="muted-foreground" variant="caption">
                    {t.release.labels.releasedPct.replace(
                      '{pct}',
                      formatReleasePct(row.claimable, row.releasing).replace('%', ''),
                    )}
                  </Text>
                </div>
                <Button
                  className={cn(!canClaim && 'opacity-50')}
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

        {walletReady ? (
          <Button onClick={() => openExchangeView('turbine')} type="button" variant="secondary">
            {t.release.queue.goTurbine}
          </Button>
        ) : (
          <DappWidgetConnectPromo />
        )}
      </ExchangeWidgetBody>
    </>
  )
}
