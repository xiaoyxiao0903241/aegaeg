import { useQueries } from '@tanstack/react-query'
import { useState } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { stakingHubAssets } from '~/app/assets'
import { openAssetsView } from '~/shared/config/open-assets-view'
import { queryKeys } from '~/shared/api/query/query-keys'
import {
  ExchangePanelToggle,
  ExchangeWidgetBody,
} from '~/views/dapp/exchange/exchange-widget-composites'
import { WidgetHeader } from '~/shared/ui/widget-header'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { useDappShell } from '~/app/use-dapp-shell'
import { Text } from '~/shared/ui/text'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { useChainReadClient } from '~/web3/use-chain-read-client'
import {
  readBurnBondPositions,
  readLpBondPositions,
  readStakePositions,
  readXminePosition,
} from '~/web3/assets/assets-read'
import type { Address } from '~/shared/config/contracts'
import type { AssetsView } from '~/stores/assets-view-store'
import { cn } from '~/shared/lib/utils'
import { AssetsModeCard } from '~/views/dapp/assets/hub/assets-mode-card'
import { useAssetsHubOverviewStats } from '~/views/dapp/assets/hub/use-assets-hub-overview-stats'

const MODE_KEYS = ['stake', 'lpbond', 'burnbond', 'xmine'] as const satisfies readonly AssetsView[]

export function AssetsHubWidget() {
  const { messages: t } = useI18n()
  const { walletReady } = useDappShell()
  const account = useActiveAccount()
  const readClient = useChainReadClient()
  const address = account?.address
  const [hideZero, setHideZero] = useState(true)
  const overview = useAssetsHubOverviewStats()

  const holdings = useQueries({
    queries: [
      {
        queryKey: queryKeys.chain.assetsStakePositions(address ?? ''),
        queryFn: () => readStakePositions(address as Address, readClient),
        enabled: walletReady && Boolean(address) && hideZero,
      },
      {
        queryKey: queryKeys.chain.assetsBondPositions('lpbond', address ?? ''),
        queryFn: () => readLpBondPositions(address as Address, readClient),
        enabled: walletReady && Boolean(address) && hideZero,
      },
      {
        queryKey: queryKeys.chain.assetsBondPositions('burnbond', address ?? ''),
        queryFn: () => readBurnBondPositions(address as Address, readClient),
        enabled: walletReady && Boolean(address) && hideZero,
      },
      {
        queryKey: queryKeys.chain.assetsXminePosition(address ?? ''),
        queryFn: () => readXminePosition(address as Address, readClient),
        enabled: walletReady && Boolean(address) && hideZero,
      },
    ],
  })

  const hasHolding: Record<(typeof MODE_KEYS)[number], boolean> = {
    stake: (holdings[0].data?.length ?? 0) > 0,
    lpbond: (holdings[1].data?.length ?? 0) > 0,
    burnbond: (holdings[2].data?.length ?? 0) > 0,
    xmine: Boolean(
      holdings[3].data && (holdings[3].data.miningStake > 0n || holdings[3].data.pending > 0n),
    ),
  }

  const holdingsReady = !hideZero || !walletReady || !address || holdings.every((q) => !q.isLoading)

  const modes = MODE_KEYS.filter((key) => {
    if (!hideZero || !walletReady || !address || !holdingsReady) return true
    return hasHolding[key]
  })

  const icons = {
    stake: stakingHubAssets.modeStake,
    lpbond: stakingHubAssets.modeLpBond,
    burnbond: stakingHubAssets.modeBurnBond,
    xmine: stakingHubAssets.modeXmine,
  } as const

  return (
    <>
      <WidgetHeader
        action={<ExchangePanelToggle />}
        subtitle={t.assets.intro}
        title={t.assets.title}
      />
      <ExchangeWidgetBody>
        <button
          aria-checked={hideZero}
          className="flex items-center gap-2 self-start rounded-lg px-2.5 py-2 text-left text-[13px] tracking-[-0.26px] text-foreground transition-colors hover:bg-muted"
          onClick={() => setHideZero((value) => !value)}
          role="checkbox"
          type="button"
        >
          <span
            aria-hidden
            className={cn(
              'grid size-[15px] shrink-0 place-items-center rounded-[4px] border-[1.5px]',
              hideZero ? 'border-primary bg-primary' : 'border-foreground/30 bg-transparent',
            )}
          >
            <svg
              className={cn('size-[9px]', hideZero ? 'opacity-100' : 'opacity-0')}
              fill="none"
              viewBox="0 0 10 10"
            >
              <path
                d="M1.5 5.5L4 8L8.5 2.5"
                stroke="#ffffff"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
              />
            </svg>
          </span>
          {t.assets.hub.hideZero}
        </button>

        {modes.map((key) => {
          const stats = overview.modes[key]
          return (
            <AssetsModeCard
              aprLabel={stats.aprLabel}
              icon={icons[key]}
              key={key}
              onClick={() => openAssetsView(key)}
              positionApprox={stats.positionApprox}
              positionLabel={t.assets.hub.card.position}
              positionValue={stats.positionValue}
              title={t.assets.hub.modes[key].title}
              tourId={key === 'stake' ? 'asset-mode-stake' : undefined}
              yieldApprox={stats.yieldApprox}
              yieldLabel={t.assets.hub.card.yield}
              yieldValue={stats.yieldValue}
            />
          )
        })}

        {walletReady && hideZero && holdingsReady && modes.length === 0 ? (
          <Text as="p" tone="muted-foreground" variant="copy">
            {t.assets.hub.hideZeroEmpty}
          </Text>
        ) : null}

        {!walletReady ? <DappWidgetConnectPromo /> : null}
      </ExchangeWidgetBody>
    </>
  )
}
