import { dappAssets } from '~/app/assets'
import { DappIcon } from '~/app/shell/dapp-icon'
import { Text } from '~/shared/ui/text'

/** Token pill + amount on claim surfaces (mixed release/restake + simple claimable). */
export function RewardsClaimTokenRow({
  tokenLabel,
  amountText,
}: {
  tokenLabel: string
  amountText: string
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="inline-flex h-8.5 items-center gap-2 rounded-full bg-card pr-3.5 pl-2">
        <DappIcon
          alt=""
          className="size-6 rounded-2xl"
          loading="lazy"
          size="token"
          src={dappAssets.tokenGagx}
        />
        <Text as="span" className="leading-4 font-semibold" variant="detail">
          {tokenLabel}
        </Text>
      </span>
      <Text as="span" className="text-2xl leading-none font-semibold" variant="headline">
        {amountText}
      </Text>
    </div>
  )
}
