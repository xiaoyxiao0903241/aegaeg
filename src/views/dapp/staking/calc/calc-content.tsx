import { useI18n } from '~/i18n/use-i18n'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { Text } from '~/shared/ui/text'

export function CalcContent() {
  const { messages: t } = useI18n()
  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading>{t.staking.calc.aside.result}</DappContentHeading>
        <Text as="p" className="m-0" tone="muted-foreground" variant="copy">
          {t.staking.calc.aside.resultHint}
        </Text>
      </DappDetailBlock>
      <DappDetailBlock>
        <DappContentHeading>{t.staking.calc.aside.curve}</DappContentHeading>
        <div className="flex min-h-32 items-center justify-center rounded-lg border border-dashed border-border">
          <Text as="span" tone="muted-foreground" variant="copy">
            —
          </Text>
        </div>
      </DappDetailBlock>
      <DappDetailBlock>
        <DappContentHeading>{t.staking.calc.aside.notes}</DappContentHeading>
        <Text as="p" className="m-0" tone="muted-foreground" variant="copy">
          {t.staking.calc.aside.notesBody}
        </Text>
      </DappDetailBlock>
    </DappDetailPage>
  )
}
