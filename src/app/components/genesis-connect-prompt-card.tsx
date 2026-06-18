import { useI18n } from '~/i18n/use-i18n'
import { homeAssets, dappAssets } from '~/app/assets'
import { WalletConnectChip } from '~/app/wallet-connect-chip'
import { Card } from '~/components/card'
import { revealClass } from '~/lib/reveal'
import { cn } from '~/lib/utils'

export function GenesisConnectPromptCard({ className }: { className?: string }) {
  const { messages: t } = useI18n()

  return (
    <Card
      as="section"
      tone="dark"
      className={cn(
        revealClass(),
        'grid gap-[5px] px-[18px] py-4',
        'max-dapp:rounded-2xl max-dapp:px-[18px] max-dapp:py-4',
        className,
      )}
      data-reveal
    >
      <div className="flex min-w-0 items-center gap-2">
        <img
          alt=""
          className="h-6 w-[26px] shrink-0 object-contain"
          height="24"
          src={homeAssets.logoMark}
          width="26"
        />
        <div className="grid min-w-0 gap-[5px]">
          <strong className="text-sm font-semibold leading-normal tracking-[-0.28px] text-white">
            {t.swap.connectExploreTitle}
          </strong>
          <p className="m-0 inline-flex items-center gap-1 text-xs leading-normal tracking-[-0.24px] text-primary">
            {t.genesis.connectBrandLine}
            <img
              alt=""
              className="size-[15px] shrink-0"
              height="15"
              src={dappAssets.arrowUpRight}
              width="15"
            />
          </p>
        </div>
      </div>
      <div aria-hidden="true" className="h-1.5 shrink-0" />
      <div className="[&_.aegis-thirdweb-button-primary]:!min-h-[38px] [&_.aegis-thirdweb-button-primary]:!h-[38px] [&_.aegis-thirdweb-button-primary]:!text-[13px]">
        <WalletConnectChip fullWidth variant="primary" />
      </div>
    </Card>
  )
}
