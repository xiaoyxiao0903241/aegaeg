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
import { useReleaseBufferSnapshot } from '~/views/dapp/release/use-release-reads'

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals

export function ReleaseBufferContent() {
  const { messages: t } = useI18n()
  const { walletReady } = useDappShell()
  const bufferQuery = useReleaseBufferSnapshot(walletReady)
  const amount = bufferQuery.data?.totalAmount ?? 0n
  const claimed = bufferQuery.data?.totalClaimed ?? 0n
  const releasing = bufferQuery.data?.totalReleasing ?? 0n
  const dash = t.release.dash

  const agxStats = [
    {
      label: t.release.buffer.entered,
      value: walletReady ? `${formatTokenAmount(amount, AGX_DECIMALS, 4)} AGX` : dash,
    },
    {
      label: t.release.buffer.extracted,
      value: walletReady ? `${formatTokenAmount(claimed, AGX_DECIMALS, 4)} AGX` : dash,
    },
    {
      label: t.release.labels.releasing,
      value: walletReady ? `${formatTokenAmount(releasing, AGX_DECIMALS, 4)} AGX` : dash,
    },
  ]

  const gagxStats = [
    { label: t.release.buffer.entered, value: dash },
    { label: t.release.buffer.extracted, value: dash },
    { label: t.release.labels.releasing, value: dash },
  ]

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading id="release-buffer-title">
          {t.release.buffer.statsTitle}
        </DappContentHeading>
        <Card as="div" className="mb-3 grid gap-1.5 rounded-2xl p-4" surface="elevated">
          <div className="mb-1 flex items-center gap-2">
            <DappIcon
              alt=""
              className="size-[18px] rounded-[10px]"
              size="sm"
              src={tokenCarouselIcons.agxIcon}
            />
            <Text as="strong" className="font-semibold" variant="copy">
              AGX
            </Text>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {agxStats.map((stat) => (
              <div className="grid gap-1" key={stat.label}>
                <Text as="span" tone="muted-foreground" variant="detail">
                  {stat.label}
                </Text>
                <Text as="strong" className="text-sm font-semibold" variant="copy">
                  {stat.value}
                </Text>
                <Text as="span" tone="muted-foreground" variant="detail">
                  {walletReady ? '≈ —' : dash}
                </Text>
              </div>
            ))}
          </div>
        </Card>
        <Card as="div" className="grid gap-1.5 rounded-2xl p-4" surface="elevated">
          <div className="mb-1 flex items-center gap-2">
            <DappIcon
              alt=""
              className="size-[18px] rounded-[10px]"
              size="sm"
              src={tokenCarouselIcons.gagxIcon}
            />
            <Text as="strong" className="font-semibold" variant="copy">
              gAGX
            </Text>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {gagxStats.map((stat) => (
              <div className="grid gap-1" key={stat.label}>
                <Text as="span" tone="muted-foreground" variant="detail">
                  {stat.label}
                </Text>
                <Text as="strong" className="text-sm font-semibold" variant="copy">
                  {stat.value}
                </Text>
                <Text as="span" tone="muted-foreground" variant="detail">
                  {'≈ —'}
                </Text>
              </div>
            ))}
          </div>
          <Text as="p" className="mt-2" tone="muted-foreground" variant="caption">
            {t.release.buffer.gagxHint}
          </Text>
        </Card>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.release.buffer.recordsTitle}</DappContentHeading>
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
        <DappContentHeading>{t.release.buffer.mechanismTitle}</DappContentHeading>
        <Text as="p" className="mb-4" tone="muted-foreground" variant="caption">
          {t.release.buffer.mechanismSubtitle}
        </Text>
        <Card as="div" className="rounded-2xl p-4" surface="elevated">
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {t.release.buffer.mechanismSteps.map((step) => (
              <li className="rounded-2xl bg-muted p-3 text-center" key={step.title}>
                <Text as="p" className="font-semibold" variant="copy">
                  {step.title}
                </Text>
                <Text as="p" className="mt-1" tone="muted-foreground" variant="caption">
                  {step.body}
                </Text>
              </li>
            ))}
          </ol>
          <ul className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1">
            {t.release.buffer.mechanismBenefits.map((item) => (
              <li className="flex items-center gap-1.5" key={item}>
                <span aria-hidden className="size-1.5 rounded-full bg-primary" />
                <Text as="span" tone="muted-foreground" variant="caption">
                  {item}
                </Text>
              </li>
            ))}
          </ul>
        </Card>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.release.faq.title}</DappContentHeading>
        <FaqList items={t.release.faq.buffer} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
