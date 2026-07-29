import type { ReactNode } from 'react'
import { flashExchangeAssets } from '~/app/assets'
import { DappIcon } from '~/app/shell/dapp-icon'
import { useI18n } from '~/i18n/use-i18n'
import { Text } from '~/shared/ui/text'
import { WidgetSubpageHeader } from '~/shared/ui/widget-header'
import { useReleaseViewStore } from '~/stores/release-view-store'
import { ExchangePanelToggle } from '~/views/dapp/exchange/exchange-widget-composites'

export function ReleaseSubpageHeader({
  subtitle,
  title,
}: {
  subtitle: ReactNode
  title: ReactNode
}) {
  const { messages: t } = useI18n()
  const setView = useReleaseViewStore((state) => state.setView)

  return (
    <WidgetSubpageHeader
      action={<ExchangePanelToggle />}
      backLabel={
        <>
          <DappIcon alt="" size="sm" src={flashExchangeAssets.backArrow} />
          <Text
            className="text-base leading-[1.4] font-medium"
            tone="muted-foreground"
            variant="headline"
          >
            {t.release.backToHub}
          </Text>
        </>
      }
      onBack={() => setView('hub')}
      subtitle={subtitle}
      title={title}
    />
  )
}
