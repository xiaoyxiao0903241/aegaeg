import { useI18n } from '~/i18n/use-i18n'
import { Card } from '~/components/card'
import { Text } from '~/components/text'
import {
  applyMessageTemplate,
  type GenesisPromoSnapshot,
} from '~/lib/presale/genesis-promo'
import { revealClass } from '~/lib/reveal'
import { cn } from '~/lib/utils'
import { DappActionButton } from '~/app/components/dapp-action-button'
import {
  GenesisPromoBodySkeleton,
  GenesisPromoTitleSkeleton,
} from '~/app/components/dapp-skeleton'

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
    <Card
      as="section"
      tone="dark"
      className={cn(
        revealClass(),
        'mt-auto grid gap-[5px] px-[18px] py-4',
        'max-dapp:gap-1.5 max-dapp:rounded-2xl max-dapp:px-[18px] max-dapp:py-4',
        'max-dapp:mt-0 group-data-[tab=genesis]/shell:max-dapp:grid',
        className,
      )}
      data-reveal
    >
      {pending || !title ? (
        <GenesisPromoTitleSkeleton />
      ) : (
        <Text as="strong" size="sm" weight="semibold" tone="onDark" className="tracking-[-0.28px]">
          {title}
        </Text>
      )}
      {pending || !body ? (
        <GenesisPromoBodySkeleton />
      ) : (
        <Text as="p" size="xs" tone="onDark" className="m-0 leading-normal tracking-[-0.24px]">
          {body}
        </Text>
      )}
      <DappActionButton
        className="mt-2 min-h-[38px] text-[13px] group-data-[tab=genesis]/shell:max-dapp:min-h-[42px] group-data-[tab=genesis]/shell:max-dapp:text-sm"
        onClick={onClick}
      >
        {actionLabel ?? t.genesis.join}
      </DappActionButton>
    </Card>
  )
}
