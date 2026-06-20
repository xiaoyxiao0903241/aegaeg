import { Card } from '~/components/card'
import { RadioGroup, RadioIndicator } from '~/components/radio'
import { Text } from '~/components/text'
import { useI18n } from '~/i18n/use-i18n'
import { revealClass } from '~/lib/reveal'
import { cn } from '~/lib/utils'

function translateSeasonStatus(status: string, t: ReturnType<typeof useI18n>['messages']) {
  if (status === 'LIVE') return t.genesis.seasonLive
  if (status === 'Ended') return t.genesis.seasonEnded
  if (status === 'Upcoming') return t.genesis.seasonUpcoming
  return status
}

export type SeasonOption = {
  active?: boolean
  date: string
  desktopMeta: {
    airdrop: string
    discount: string
  }
  discount: string
  name: string
  price: string
  status: string
}

const seasonOptionClass = cn(
  'flex items-center gap-2.5 rounded-sm px-3.5 py-3',
  'data-[selected=true]:border-primary',
  'max-dapp:gap-2.5 max-dapp:px-3.5 max-dapp:py-3 max-dapp:data-[selected=true]:border-[1.5px]',
)

const seasonStatusBadgeBaseClass =
  'rounded-full px-2 py-0.5 text-xs font-semibold leading-[1.3] not-italic whitespace-nowrap'

function resolveSeasonStatusBadgeClass(status: string, selected: boolean) {
  if (status === 'LIVE' && selected) {
    return cn(seasonStatusBadgeBaseClass, 'bg-primary text-white')
  }

  return cn(seasonStatusBadgeBaseClass, 'border border-border bg-card text-faint')
}

export function SeasonSelector({ seasons }: { seasons: SeasonOption[] }) {
  const { messages: t } = useI18n()

  return (
    <RadioGroup
      aria-label={t.genesis.statsTitle}
      className={cn(revealClass(), 'grid gap-2')}
      data-reveal
    >
      {seasons.map((season) => {
        const selected = Boolean(season.active)
        return (
          <Card
            as="article"
            aria-checked={selected}
            className={seasonOptionClass}
            data-selected={selected ? 'true' : 'false'}
            key={season.name}
            role="radio"
            surface="outlined"
          >
            <RadioIndicator checked={selected} />
            <div className="min-w-0 flex-1">
              <Text as="strong" size="sm" weight="bold" className="block leading-[1.25]">
                {season.name}
              </Text>
              <Text as="small" size="xs" tone="muted" className="mt-0.5 block leading-[1.35]">
                {t.genesis.discountLabel} <b>{season.desktopMeta.discount}</b>{' '}
                <i aria-hidden="true">|</i> {t.genesis.airdropLabel}{' '}
                <b>{season.desktopMeta.airdrop}</b>
              </Text>
            </div>
            <div className="grid flex-none justify-items-end gap-1">
              <span className={resolveSeasonStatusBadgeClass(season.status, selected)}>
                {translateSeasonStatus(season.status, t)}
              </span>
              <time className="text-xs leading-[1.35] text-faint whitespace-nowrap">
                {season.date}
              </time>
            </div>
          </Card>
        )
      })}
    </RadioGroup>
  )
}
