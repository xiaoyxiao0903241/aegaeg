import { useI18n } from '~/i18n/use-i18n'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { DappTableEmptyMessage } from '~/app/shell/dapp-table-empty-message'
import { ResponsiveTable } from '~/app/shell/responsive-table'
import { Text } from '~/shared/ui/text'
import { FaqList } from '~/shared/ui/faq-list'
import { useDappShell } from '~/app/use-dapp-shell'
import { useReleaseBufferSnapshot } from '~/views/dapp/release/use-release-reads'
import { formatReleaseAmount } from '~/views/dapp/release/release-display'

export function ReleaseBufferContent() {
  const { messages: t } = useI18n()
  const { walletReady } = useDappShell()
  const bufferQuery = useReleaseBufferSnapshot(walletReady)
  const amount = bufferQuery.data?.totalAmount ?? 0n
  const claimed = bufferQuery.data?.totalClaimed ?? 0n
  const releasing = bufferQuery.data?.totalReleasing ?? 0n
  const dash = t.release.dash

  return (
    <DappDetailPage>
      <DappContentHeading id="release-buffer-title">
        {t.release.buffer.statsTitle}
      </DappContentHeading>
      <div className="mb-6 rounded-2xl border border-border bg-card p-4">
        <Text as="p" className="mb-3 font-semibold" variant="copy">
          AGX
        </Text>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <Text as="p" tone="muted-foreground" variant="caption">
              {t.release.buffer.entered}
            </Text>
            <Text as="p" className="mt-1 font-semibold" variant="copy">
              {walletReady ? `${formatReleaseAmount(amount)} AGX` : dash}
            </Text>
          </div>
          <div>
            <Text as="p" tone="muted-foreground" variant="caption">
              {t.release.buffer.extracted}
            </Text>
            <Text as="p" className="mt-1 font-semibold" variant="copy">
              {walletReady ? `${formatReleaseAmount(claimed)} AGX` : dash}
            </Text>
          </div>
          <div>
            <Text as="p" tone="muted-foreground" variant="caption">
              {t.release.labels.releasing}
            </Text>
            <Text as="p" className="mt-1 font-semibold" variant="copy">
              {walletReady ? `${formatReleaseAmount(releasing)} AGX` : dash}
            </Text>
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-border bg-card p-4">
        <Text as="p" className="mb-2 font-semibold" variant="copy">
          gAGX
        </Text>
        <Text as="p" tone="muted-foreground" variant="copy">
          {t.release.buffer.gagxHint}
        </Text>
      </div>

      <section className="mb-6">
        <Text as="h3" className="mb-3 font-semibold" variant="headline">
          {t.release.buffer.recordsTitle}
        </Text>
        <DappTableCard>
          <ResponsiveTable
            colWidths={['200px', '150px', '180px', '1fr']}
            headers={[...t.release.recordColumns]}
            rows={[]}
          />
          <DappTableEmptyMessage embedded title={t.release.recordsEmpty} />
        </DappTableCard>
      </section>

      <section className="mb-6">
        <Text as="h3" className="mb-1 font-semibold" variant="headline">
          {t.release.buffer.mechanismTitle}
        </Text>
        <Text as="p" className="mb-4" tone="muted-foreground" variant="caption">
          {t.release.buffer.mechanismSubtitle}
        </Text>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {t.release.buffer.mechanismSteps.map((step) => (
            <li className="rounded-2xl border border-border bg-card p-3" key={step.title}>
              <Text as="p" className="font-semibold" variant="copy">
                {step.title}
              </Text>
              <Text as="p" className="mt-1" tone="muted-foreground" variant="caption">
                {step.body}
              </Text>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <Text as="h3" className="mb-3 font-semibold" variant="headline">
          {t.release.faq.title}
        </Text>
        <FaqList items={t.release.faq.buffer} variant="dapp" />
      </section>
    </DappDetailPage>
  )
}
