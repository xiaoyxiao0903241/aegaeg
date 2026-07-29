import { useQuery } from '@tanstack/react-query'
import { formatBurnContributionRatioColon } from '~/core/exchange/burn-contribution-swap-gates'
import { useI18n } from '~/i18n/use-i18n'
import { queryKeys } from '~/shared/api/query/query-keys'
import { QUERY_STALE_TIME } from '~/shared/api/query/query-client'
import { openExchangeView } from '~/shared/config/open-exchange-view'
import type { ExchangeView } from '~/stores/exchange-view-store'
import { ExchangeProgramCard } from '~/views/dapp/exchange/hub/exchange-program-card'
import { readBurnContributionSwapConfig } from '~/web3/exchange/burn-exchange-read'
import { useChainReadClient } from '~/web3/use-chain-read-client'

/**
 * Figma hub program grid (PC `4267:212`):
 * 0 Trade gAGX → flash · 1 Turbine → turbine · 2 Get USD1 → flash
 * 3 Get AGX → trade · 4 Sell X → null (X trade not enabled) · 5 Points → burn
 */
const PROGRAM_TARGETS: Array<ExchangeView | null> = [
  'flash',
  'turbine',
  'flash',
  'trade',
  null,
  'burn',
]

/** Index of「获取贡献点数」— body ratio from on-chain `rateBps`, not static 1:6. */
const CONTRIBUTION_CARD_INDEX = 5

export function ExchangeProgramCards() {
  const { messages: t } = useI18n()
  const readClient = useChainReadClient()
  const cards = t.exchange.hub.program.cards

  const configQuery = useQuery({
    queryKey: queryKeys.chain.burnSwapConfig,
    queryFn: () => readBurnContributionSwapConfig(readClient),
    staleTime: QUERY_STALE_TIME.quote,
  })

  const contributionRatio =
    configQuery.data === undefined
      ? '—'
      : formatBurnContributionRatioColon(configQuery.data.rateBps)

  return (
    <div className="grid gap-2 dapp:grid-cols-2 dapp:gap-x-2.5">
      {cards.map((card, index) => {
        const target = PROGRAM_TARGETS[index] ?? null
        const body =
          index === CONTRIBUTION_CARD_INDEX
            ? card.body.replace('{ratio}', contributionRatio)
            : card.body

        return (
          <ExchangeProgramCard
            body={body}
            index={index}
            key={`${card.title}:${index}`}
            onClick={target ? () => openExchangeView(target) : undefined}
            title={card.title}
          />
        )
      })}
    </div>
  )
}
