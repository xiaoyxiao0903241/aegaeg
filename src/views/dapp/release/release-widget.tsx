import { useI18n } from '~/i18n/use-i18n'
import { DappWidgetFrame } from '~/app/shell/dapp-widget-frame'
import { Text } from '~/shared/ui/text'

export function ReleaseWidget() {
  const { messages: t } = useI18n()

  return (
    <DappWidgetFrame subtitle={t.release.body} title={t.release.title}>
      <Text as="p" tone="muted-foreground" variant="copy">
        {t.release.body}
      </Text>
    </DappWidgetFrame>
  )
}
