import { useI18n } from '~/i18n/use-i18n'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { Text } from '~/shared/ui/text'

export function AssetsContent() {
  const { messages: t } = useI18n()

  return (
    <DappDetailPage>
      <DappContentHeading id="assets-title">{t.assets.title}</DappContentHeading>
      <Text as="p" tone="muted-foreground" variant="copy">
        {t.assets.body}
      </Text>
    </DappDetailPage>
  )
}
