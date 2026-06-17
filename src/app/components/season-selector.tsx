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
  'flex items-center gap-[11px] rounded-[13px] px-3.5 py-3',
  'data-[selected=true]:border-primary',
  'max-[820px]:gap-2.5 max-[820px]:px-3.5 max-[820px]:py-3 max-[820px]:data-[selected=true]:border-[1.5px]',
)

const seasonStatusClass = cn(
  'rounded-full bg-pill-muted-bg px-2 py-[3px] not-italic whitespace-nowrap',
  'data-[selected=true]:bg-primary data-[selected=true]:text-white',
  'max-[820px]:px-[9px]',
)

export function SeasonSelector({ seasons }: { seasons: SeasonOption[] }) {
  const { messages: t } = useI18n()

  return (
    <RadioGroup
      aria-label={t.genesis.statsTitle}
      className={cn(revealClass(), 'mt-3.5 grid gap-2 max-[820px]:mt-0')}
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
              <Text as="small" size="xs" tone="muted" className="mt-[3px] block leading-[1.35]">
                {t.genesis.discountLabel} <b>{season.desktopMeta.discount}</b>{' '}
                <i aria-hidden="true">|</i> {t.genesis.airdropLabel}{' '}
                <b>{season.desktopMeta.airdrop}</b>
              </Text>
            </div>
            <div className="grid flex-none justify-items-end gap-1">
              <Text
                as="em"
                size="xs"
                weight="bold"
                tone="muted"
                className={cn(seasonStatusClass, 'text-[10px] leading-[1.2] max-[820px]:text-[11px]')}
                data-selected={selected ? 'true' : 'false'}
              >
                {translateSeasonStatus(season.status, t)}
              </Text>
              <time className="text-[11px] leading-[1.35] text-faint whitespace-nowrap">
                {season.date}
              </time>
            </div>
          </Card>
        )
      })}
    </RadioGroup>
  )
}
