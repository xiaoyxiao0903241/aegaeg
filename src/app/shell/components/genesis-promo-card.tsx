import { useI18n } from '~/i18n/use-i18n'
import { WidgetPromoCard } from '~/shared/ui/widget-promo-card'
import { Text } from '~/shared/ui/text'
import {
  applyMessageTemplate,
  type GenesisPromoSnapshot,
} from '~/views/dapp/genesis/genesis-promo'
import { cn } from '~/shared/lib/utils'
import { DappActionButton } from '~/app/shell/components/dapp-action-button'
import {
  GenesisPromoBodySkeleton,
  GenesisPromoTitleSkeleton,
} from '~/app/shell/components/dapp-skeleton'

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

function resolvePromoBody(
  promo: GenesisPromoSnapshot,
  labels: {
    promoEnded: string
    promoLive: string
    promoUpcoming: string
    seasonEnded: string
    seasonLive: string
    seasonUpcoming: string
  },
) {
  const status = resolveStatusLabel(promo.status, {
    seasonLive: labels.seasonLive,
    seasonEnded: labels.seasonEnded,
    seasonUpcoming: labels.seasonUpcoming,
  })

  if (promo.status === 'Ended') {
    return applyMessageTemplate(labels.promoEnded, {
      status,
      date: promo.dateRange,
    })
  }

  if (promo.status === 'Upcoming') {
    return applyMessageTemplate(labels.promoUpcoming, {
      startDate: promo.startDate,
    })
  }

  return applyMessageTemplate(labels.promoLive, {
    endDate: promo.endDate,
  })
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

  if (!isLoading && !promo) {
    return null
  }

  const pending = isLoading || !promo
  const title = promo
    ? applyMessageTemplate(t.genesis.promoTitleTemplate, {
        season: String(promo.season),
        discount: promo.discount,
      })
    : null
  const body = promo
    ? resolvePromoBody(promo, {
        promoEnded: t.genesis.promoEnded,
        promoLive: t.genesis.promoLive,
        promoUpcoming: t.genesis.promoUpcoming,
        seasonEnded: t.genesis.seasonEnded,
        seasonLive: t.genesis.seasonLive,
        seasonUpcoming: t.genesis.seasonUpcoming,
      })
    : null

  return (
    <WidgetPromoCard
      className={cn(
        'mt-auto max-dapp:mt-0 group-data-[tab=genesis]/shell:max-dapp:grid',
        className,
      )}
    >
      {pending || !title ? (
        <GenesisPromoTitleSkeleton />
      ) : (
        // 4175/dev: text-sm / semibold / text-on-dark (#b8c0ce) — tone inverse-muted
        <Text
          as="strong"
          variant="detail"
          tone="inverse-muted"
          className="block text-sm font-semibold leading-normal"
        >
          {title}
        </Text>
      )}
      {pending || !body ? (
        <GenesisPromoBodySkeleton />
      ) : (
        // 4175/dev: text-xs / normal / on-dark — caption token is 10px; lock 12px
        <Text
          as="p"
          variant="copy"
          tone="inverse-muted"
          className="m-0 text-xs font-normal leading-normal"
        >
          {body}
        </Text>
      )}
      <DappActionButton
        className="mt-2 min-h-9.5 text-xs group-data-[tab=genesis]/shell:max-dapp:min-h-10 group-data-[tab=genesis]/shell:max-dapp:text-sm"
        onClick={onClick}
      >
        {actionLabel ?? t.genesis.join}
      </DappActionButton>
    </WidgetPromoCard>
  )
}
