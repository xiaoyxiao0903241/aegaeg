import { useI18n } from '../../i18n/use-i18n'
import { dappLayout } from '../../components/primitive-styles'
import { revealClass } from '~/lib/reveal'
import { cn } from '~/lib/utils'

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

export function SeasonSelector({ seasons }: { seasons: SeasonOption[] }) {
  const { messages: t } = useI18n()

  return (
    <div className={cn(revealClass(), dappLayout.seasonOptions)} data-reveal>
      {seasons.map((season) => (
        <article
          className={dappLayout.seasonOption}
          data-selected={season.active ? 'true' : 'false'}
          key={season.name}
        >
          <span
            className={dappLayout.seasonRadio}
            data-selected={season.active ? 'true' : 'false'}
          >
            {season.active ? <span className={dappLayout.seasonRadioDot} /> : null}
          </span>
          <div className={dappLayout.seasonBody}>
            <strong className={dappLayout.seasonTitle}>{season.name}</strong>
            <small className={dappLayout.seasonMeta}>
              <span className={dappLayout.seasonMetaDesktop}>
                {t.genesis.discountLabel} <b>{season.desktopMeta.discount}</b>{' '}
                <i aria-hidden="true">|</i> {t.genesis.airdropLabel}{' '}
                <b>{season.desktopMeta.airdrop}</b>
              </span>
              <span className={dappLayout.seasonMetaMobile}>
                {season.price.replace('≈ ', '')} | <b>{season.discount}</b>
              </span>
            </small>
          </div>
          <div className={dappLayout.seasonTiming}>
            <em
              className={dappLayout.seasonStatus}
              data-selected={season.active ? 'true' : 'false'}
            >
              {season.status}
            </em>
            <time className="text-[11px] leading-[1.35] text-faint whitespace-nowrap">
              {season.date}
            </time>
          </div>
        </article>
      ))}
    </div>
  )
}
