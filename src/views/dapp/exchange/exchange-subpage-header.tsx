import type { ReactNode } from 'react'
import { flashExchangeAssets } from '~/app/assets'
import { DappIcon } from '~/app/shell/dapp-icon'
import { useI18n } from '~/i18n/use-i18n'
import { Text } from '~/shared/ui/text'
import { WidgetSubpageHeader } from '~/shared/ui/widget-header'
import { useExchangeViewStore } from '~/stores/exchange-view-store'
import { ExchangePanelToggle } from '~/views/dapp/exchange/exchange-panel-toggle'

export function ExchangeSubpageHeader({
  className,
  subtitle,
  title,
}: {
  className?: string
  subtitle: ReactNode
  title: ReactNode
}) {
  const { messages: t } = useI18n()
  const setView = useExchangeViewStore((state) => state.setView)

  return (
    <WidgetSubpageHeader
      action={<ExchangePanelToggle />}
      backLabel={
        <>
          <DappIcon alt="" size="sm" src={flashExchangeAssets.backArrow} />
          <Text
            tone="muted-foreground"
            variant="headline"
            className="text-base leading-[1.4] font-medium"
          >
            {t.exchange.backToHub}
          </Text>
        </>
      }
      className={className}
      onBack={() => setView('hub')}
      subtitle={subtitle}
      title={title}
    />
  )
}
