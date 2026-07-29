import { useI18n } from '~/i18n/use-i18n'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { Text } from '~/shared/ui/text'
import { FaqList } from '~/shared/ui/faq-list'
import { useDappShell } from '~/app/use-dapp-shell'
import { useReleaseQueueSnapshot } from '~/views/dapp/release/use-release-reads'
import { formatReleaseAmount } from '~/views/dapp/release/release-display'

export function ReleaseQueueContent() {
  const { messages: t } = useI18n()
  const { walletReady } = useDappShell()
  const queueQuery = useReleaseQueueSnapshot(walletReady)
  const releasing = queueQuery.data?.totalReleasing ?? 0n
  const claimable = queueQuery.data?.totalClaimable ?? 0n
  const unit = t.release.units.queue
  const dash = t.release.dash

  return (
    <DappDetailPage>
      <DappContentHeading id="release-queue-title">{t.release.queue.statsTitle}</DappContentHeading>
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-4">
          <Text as="p" tone="muted-foreground" variant="caption">
            {t.release.labels.releasing}
          </Text>
          <Text as="p" className="mt-1 font-semibold" variant="copy">
            {walletReady ? `${formatReleaseAmount(releasing)} ${unit}` : dash}
          </Text>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <Text as="p" tone="muted-foreground" variant="caption">
            {t.release.labels.released}
          </Text>
          <Text as="p" className="mt-1 font-semibold" variant="copy">
            {walletReady ? `${formatReleaseAmount(claimable)} ${unit}` : dash}
          </Text>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <Text as="p" tone="muted-foreground" variant="caption">
            {t.release.queue.lifetimeClaimed}
          </Text>
          <Text as="p" className="mt-1 font-semibold" variant="copy">
            {dash}
          </Text>
        </div>
      </div>

      <section className="mb-6">
        <Text as="h3" className="mb-3 font-semibold" variant="headline">
          {t.release.queue.recordsTitle}
        </Text>
        <div className="rounded-2xl border border-border bg-card p-4">
          <Text as="p" tone="muted-foreground" variant="copy">
            {t.release.recordsEmpty}
          </Text>
        </div>
      </section>

      <section>
        <Text as="h3" className="mb-3 font-semibold" variant="headline">
          {t.release.faq.title}
        </Text>
        <FaqList items={t.release.faq.queue} variant="dapp" />
      </section>
    </DappDetailPage>
  )
}
