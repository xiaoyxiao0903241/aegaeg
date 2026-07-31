import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { formatTokenAmount } from '~/core/exchange/token-amount'
import { useI18n } from '~/i18n/use-i18n'
import { tokenCarouselIcons } from '~/app/assets'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { DappTableEmptyMessage } from '~/app/shell/dapp-table-empty-message'
import { ResponsiveTable } from '~/app/shell/responsive-table'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'
import { FaqList } from '~/shared/ui/faq-list'
import { useDappShell } from '~/app/use-dapp-shell'
import { useReleaseQueueSnapshot } from '~/views/dapp/release/use-release-reads'

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals

export function ReleaseQueueContent() {
  const { messages: t } = useI18n()
  const { walletReady } = useDappShell()
  const queueQuery = useReleaseQueueSnapshot(walletReady)
  const releasing = queueQuery.data?.totalReleasing ?? 0n
  const claimable = queueQuery.data?.totalClaimable ?? 0n
  const unit = t.release.units.queue
  const dash = t.release.dash

  const stats = [
    {
      label: t.release.labels.releasing,
      value: walletReady ? `${formatTokenAmount(releasing, AGX_DECIMALS, 4)} ${unit}` : dash,
      approx: walletReady ? '≈ —' : dash,
    },
    {
      label: t.release.labels.released,
      value: walletReady ? `${formatTokenAmount(claimable, AGX_DECIMALS, 4)} ${unit}` : dash,
      approx: walletReady ? '≈ —' : dash,
    },
    {
      label: t.release.queue.lifetimeClaimed,
      value: dash,
      approx: walletReady ? '≈ —' : dash,
    },
  ]

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading id="release-queue-title">
          {t.release.queue.statsTitle}
        </DappContentHeading>
        <div className="grid gap-3 sm:grid-cols-3">
          {stats.map((stat) => (
            <Card
              as="div"
              surface="elevated"
              className="grid gap-1.5 rounded-2xl p-4"
              key={stat.label}
            >
              <Text as="span" className="font-medium" tone="muted-foreground" variant="detail">
                {stat.label}
              </Text>
              <div className="flex items-center gap-2">
                <DappIcon
                  alt=""
                  className="size-[18px] rounded-[10px]"
                  size="sm"
                  src={tokenCarouselIcons.gagxIcon}
                />
                <Text as="strong" className="text-base font-semibold" variant="copy">
                  {stat.value}
                </Text>
              </div>
              <Text as="span" tone="muted-foreground" variant="detail">
                {stat.approx}
              </Text>
            </Card>
          ))}
        </div>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.release.queue.recordsTitle}</DappContentHeading>
        <DappTableCard>
          <ResponsiveTable
            colWidths={['200px', '150px', '180px', '1fr']}
            headers={[...t.release.recordColumns]}
            rows={[]}
          />
          <DappTableEmptyMessage embedded title={t.release.recordsEmpty} />
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.release.faq.title}</DappContentHeading>
        <FaqList items={t.release.faq.queue} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
