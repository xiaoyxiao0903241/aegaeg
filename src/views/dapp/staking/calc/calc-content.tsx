import { useI18n } from '~/i18n/use-i18n'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { Text } from '~/shared/ui/text'
import { useCalcEstimateStore } from '~/stores/calc-estimate-store'

const PLACEHOLDER = '—'

function formatUsd(value: number) {
  if (!Number.isFinite(value)) return PLACEHOLDER
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`
}

function formatPct(value: number) {
  if (!Number.isFinite(value)) return PLACEHOLDER
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

export function CalcContent() {
  const { messages: t } = useI18n()
  const aside = t.staking.calc.aside
  const result = useCalcEstimateStore((state) => state.result)

  const productLabel = result ? t.staking.calc.products[result.product] : null
  const periodLabel = result
    ? result.period === 'liquid'
      ? t.staking.stake.periods.liquid
      : result.period === '180'
        ? t.staking.stake.periods.d180
        : result.period === '360'
          ? t.staking.stake.periods.d360
          : result.period === '540'
            ? t.staking.stake.periods.d540
            : result.period
    : null

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <DappContentHeading className="m-0">{aside.result}</DappContentHeading>
          {result ? (
            <div className="flex flex-wrap gap-1.5">
              <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[12px] font-semibold text-primary">
                {productLabel}
              </span>
              <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[12px] font-semibold text-primary">
                {periodLabel}
              </span>
              <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[12px] font-semibold text-primary">
                {aside.tags.day.replace('{day}', String(result.days))}
              </span>
            </div>
          ) : null}
        </div>
        {result ? (
          <div className="grid gap-3">
            <div className="grid gap-1">
              <Text as="span" tone="muted-foreground" variant="detail">
                {t.staking.calc.result.total}
              </Text>
              <div className="flex flex-wrap items-center gap-2">
                <Text as="strong" className="text-[28px] font-bold text-success" variant="copy">
                  {formatUsd(result.totalUsd)}
                </Text>
                <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-[12px] font-semibold text-success">
                  {formatPct(result.ratePct)}
                </span>
              </div>
            </div>
            <Text as="p" className="m-0" tone="muted-foreground" variant="detail">
              {t.staking.calc.result.interest}: {formatUsd(result.interestUsd)}
            </Text>
          </div>
        ) : (
          <Text as="p" className="m-0" tone="muted-foreground" variant="copy">
            {aside.resultHint}
          </Text>
        )}
      </DappDetailBlock>
      <DappDetailBlock>
        <DappContentHeading>{aside.curve}</DappContentHeading>
        <Text as="p" className="mb-3" tone="muted-foreground" variant="detail">
          {aside.curveHint}
        </Text>
        <div className="flex min-h-32 items-center justify-center rounded-lg border border-dashed border-border">
          <Text as="span" tone="muted-foreground" variant="copy">
            {PLACEHOLDER}
          </Text>
        </div>
      </DappDetailBlock>
      <DappDetailBlock>
        <DappContentHeading>{aside.nodes}</DappContentHeading>
        <div className="grid gap-3 sm:grid-cols-3">
          {aside.nodeCards.map((card) => (
            <div
              className="grid gap-1.5 rounded-2xl border border-border bg-card p-4 shadow-sm"
              key={card.label}
            >
              <Text as="span" tone="muted-foreground" variant="detail">
                {card.label}
              </Text>
              <Text as="strong" className="font-semibold text-primary" variant="copy">
                {PLACEHOLDER}
              </Text>
              {card.hint ? (
                <Text as="span" tone="muted-foreground" variant="detail">
                  {card.hint}
                </Text>
              ) : null}
            </div>
          ))}
        </div>
      </DappDetailBlock>
      <DappDetailBlock>
        <DappContentHeading>{aside.notes}</DappContentHeading>
        <ul className="m-0 grid list-none gap-2 p-0">
          {aside.notesItems.map((item) => (
            <li className="flex gap-2.5" key={item}>
              <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
              <Text as="p" className="m-0" tone="muted-foreground" variant="detail">
                {item}
              </Text>
            </li>
          ))}
        </ul>
      </DappDetailBlock>
    </DappDetailPage>
  )
}
