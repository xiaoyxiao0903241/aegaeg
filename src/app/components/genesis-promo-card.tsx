import { useI18n } from '../../i18n/use-i18n'
import { dappCardClass } from '../../components/primitive-styles'
import {
  applyMessageTemplate,
  type GenesisPromoSnapshot,
} from '../../lib/presale/genesis-promo'
import { revealClass } from '~/lib/reveal'
import { cn } from '~/lib/utils'
import { DappActionButton } from './dapp-action-button'
import { GenesisPromoBodySkeleton } from './dapp-skeleton'

function resolveStatusLabel(
  status: GenesisPromoSnapshot['status'],
  labels: {
    seasonLive: string
    seasonEnded: string
    seasonUpcoming: string
  },
) {
  if (status === 'LIVE') return labels.seasonLive
  if (status === 'Ended') return labels.seasonEnded
  return labels.seasonUpcoming
}

export function GenesisPromoCard({
  actionLabel,
  className,
  isLoading = false,
  onClick,
  promo,
}: {
  actionLabel?: string
  className?: string
  isLoading?: boolean
  onClick: () => void
  promo?: GenesisPromoSnapshot | null
}) {
  const { messages: t } = useI18n()

  const title = promo
    ? applyMessageTemplate(t.genesis.promoTitleTemplate, {
        season: String(promo.season),
        discount: promo.discount,
      })
    : t.genesis.promoTitle

  const body = (() => {
    if (isLoading) {
      return t.genesis.promoLoading
    }

    if (!promo) {
      return t.genesis.promoBody
    }

    const status = resolveStatusLabel(promo.status, {
      seasonLive: t.genesis.seasonLive,
      seasonEnded: t.genesis.seasonEnded,
      seasonUpcoming: t.genesis.seasonUpcoming,
    })

    if (promo.status === 'Ended') {
      return applyMessageTemplate(t.genesis.promoEnded, {
        status,
        date: promo.dateRange,
      })
    }

    if (promo.status === 'Upcoming') {
      return applyMessageTemplate(t.genesis.promoUpcoming, {
        startDate: promo.startDate,
      })
    }

    return applyMessageTemplate(t.genesis.promoLive, {
      endDate: promo.endDate,
    })
  })()

  return (
    <section
      className={cn(
        dappCardClass('promo'),
        revealClass(),
        'max-[820px]:mt-3.5 group-data-[tab=genesis]/shell:max-[820px]:grid',
        className,
      )}
      data-reveal
    >
      <strong className="text-sm font-semibold leading-[1.2] text-white">{title}</strong>
      {isLoading ? (
        <GenesisPromoBodySkeleton />
      ) : (
        <p className="m-0 text-xs leading-normal text-on-dark">{body}</p>
      )}
      <DappActionButton
        className="mt-2 min-h-[38px] text-[13px] group-data-[tab=genesis]/shell:max-[820px]:min-h-[42px] group-data-[tab=genesis]/shell:max-[820px]:text-sm"
        onClick={onClick}
      >
        {actionLabel ?? t.genesis.join}
      </DappActionButton>
    </section>
  )
}
