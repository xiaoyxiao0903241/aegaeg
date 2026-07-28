import { useI18n } from '~/i18n/use-i18n'
import { DappWidgetFrame } from '~/app/shell/dapp-widget-frame'
import { Text } from '~/shared/ui/text'

export function StakingWidget() {
  const { messages: t } = useI18n()

  return (
    <DappWidgetFrame subtitle={t.staking.body} title={t.staking.title}>
      <Text as="p" tone="muted-foreground" variant="copy">
        {t.staking.body}
      </Text>
    </DappWidgetFrame>
  )
}
