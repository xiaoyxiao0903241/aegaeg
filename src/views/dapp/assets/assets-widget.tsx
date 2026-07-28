import { useI18n } from '~/i18n/use-i18n'
import { DappWidgetFrame } from '~/app/shell/dapp-widget-frame'
import { Text } from '~/shared/ui/text'

export function AssetsWidget() {
  const { messages: t } = useI18n()

  return (
    <DappWidgetFrame subtitle={t.assets.body} title={t.assets.title}>
      <Text as="p" tone="muted-foreground" variant="copy">
        {t.assets.body}
      </Text>
    </DappWidgetFrame>
  )
}
