import type { ReactNode } from 'react'
import { flashSwapAssets } from '~/app/assets'
import { DappIcon } from '~/app/shell/dapp-icon'
import { useI18n } from '~/i18n/use-i18n'
import { Text } from '~/shared/ui/text'
import { WidgetSubpageHeader } from '~/shared/ui/widget-header'
import { useSwapViewStore } from '~/stores/swap-view-store'
import { SwapPanelToggle } from '~/views/dapp/swap/swap-panel-toggle'

export function SwapSubpageHeader({
  subtitle,
  title,
}: {
  subtitle: ReactNode
  title: ReactNode
}) {
  const { messages: t } = useI18n()
  const setView = useSwapViewStore((state) => state.setView)

  return (
    <WidgetSubpageHeader
      action={<SwapPanelToggle />}
      backLabel={
        <>
          <DappIcon alt="" size="sm" src={flashSwapAssets.backArrow} />
          <Text
            tone="muted-foreground"
            variant="headline"
            className="text-base font-medium leading-[1.4]"
          >
            {t.swap.backToHub}
          </Text>
        </>
      }
      onBack={() => setView('hub')}
      subtitle={subtitle}
      title={title}
    />
  )
}
