import { useI18n } from '../../i18n/use-i18n'
import { dappCardClass } from '../../components/primitive-styles'
import { revealClass } from '~/lib/reveal'
import { cn } from '~/lib/utils'
import { DappActionButton } from './dapp-action-button'

export function GenesisPromoCard({
  actionLabel,
  className,
  onClick,
  showProgress = false,
}: {
  actionLabel?: string
  className?: string
  onClick: () => void
  showProgress?: boolean
}) {
  const { messages: t } = useI18n()

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
      <strong className="text-sm font-semibold leading-[1.2] text-white">{t.genesis.promoTitle}</strong>
      <p className="m-0 text-xs leading-normal text-on-dark">{t.genesis.promoBody}</p>
      {showProgress ? (
        <span className="h-1.5 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
          <span className="block h-full w-[64%] rounded-full bg-coral-bright" />
        </span>
      ) : null}
      <DappActionButton
        className="mt-2 min-h-[38px] text-[13px] group-data-[tab=genesis]/shell:max-[820px]:min-h-[42px] group-data-[tab=genesis]/shell:max-[820px]:text-sm"
        onClick={onClick}
      >
        {actionLabel ?? t.genesis.join}
      </DappActionButton>
    </section>
  )
}
