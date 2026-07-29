import { useI18n } from '~/i18n/use-i18n'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { Text } from '~/shared/ui/text'

const PLACEHOLDER = '—'

export function CalcContent() {
  const { messages: t } = useI18n()
  const aside = t.staking.calc.aside
  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading>{aside.result}</DappContentHeading>
        <Text as="p" className="m-0" tone="muted-foreground" variant="copy">
          {aside.resultHint}
        </Text>
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
