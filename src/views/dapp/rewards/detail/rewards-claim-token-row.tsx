import { dappAssets } from '~/app/assets'
import { Icon } from '~/shared/components/icon'
import { Text } from '~/shared/components/text'

/**
 * 领取界面上的代币胶囊 + 金额行
 *
 * 用于混合领取的释放 / 复投金额，以及简单领取的可领金额。
 *
 * @param tokenLabel 代币名称
 * @param amountText 金额文本
 */
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
        <Icon
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
