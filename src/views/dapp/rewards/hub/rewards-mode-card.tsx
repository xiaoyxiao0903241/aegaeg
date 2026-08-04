import { DappIcon } from '~/app/shell/dapp-icon'
import { Card } from '~/shared/components/card'
import { DappCountValue } from '~/shared/components/dapp-count-value'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

/**
 * Hub reward entry — Figma `reward/*`（p16 · gap12 · r16 · outlined）。
 * 与资产/释放 Hub 左卡同 chrome：`shadow-none`（禁 soft shadow）。
 * 正文完整换行；禁 overflow-hidden / truncate 裁切多语文案。
 */
export function RewardsModeCard({
  approx,
  badge,
  balanceAmount,
  balanceLabel,
  body,
  claimCta,
  claimIcon,
  icon,
  iconClassName,
  onClick,
  title,
}: {
  approx?: string
  badge?: string
  balanceAmount: string
  balanceLabel: string
  body: string
  claimCta?: string
  claimIcon?: string
  icon: string
  iconClassName?: string
  onClick?: () => void
  title: string
}) {
  return (
    <Card
      as="button"
      surface="outlined"
      className={cn(
        'grid w-full gap-3 rounded-2xl border-border p-4 text-left shadow-none',
        onClick &&
          'duration-dapp-fast cursor-pointer transition-[border-color,transform] ease-out hover:scale-[1.008] hover:border-primary active:scale-[0.992]',
      )}
      onClick={onClick}
      type="button"
    >
      <div className="grid gap-1.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <DappIcon alt="" className={cn('size-5 shrink-0', iconClassName)} size="sm" src={icon} />
          <Text as="span" className="leading-4 font-semibold wrap-break-word" variant="detail">
            {title}
          </Text>
          {badge ? (
            <span className="pointer-events-none inline-flex h-4.5 shrink-0 items-center rounded-full bg-primary-soft px-2">
              <Text
                as="span"
                className="leading-none whitespace-nowrap"
                tone="primary"
                variant="caption"
              >
                {badge}
              </Text>
            </span>
          ) : null}
        </div>
        <Text as="p" className="m-0 leading-4 wrap-break-word text-foreground/40" variant="copy">
          {body}
        </Text>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
        <Text as="span" className="leading-4 text-foreground/70" variant="copy">
          {balanceLabel}
        </Text>
        <div className="flex min-w-0 flex-wrap items-center justify-end gap-1.5">
          <Text as="strong" className="leading-5 font-semibold wrap-break-word" variant="headline">
            <DappCountValue text={balanceAmount} />
          </Text>
          {approx ? (
            <Text as="span" className="leading-4 wrap-break-word text-foreground/40" variant="copy">
              <DappCountValue text={approx} />
            </Text>
          ) : null}
          {claimCta ? (
            <span className="inline-flex items-center gap-1">
              <Text
                as="span"
                className="leading-4 font-medium whitespace-nowrap"
                tone="primary"
                variant="copy"
              >
                {claimCta}
              </Text>
              {claimIcon ? (
                <DappIcon alt="" className="size-4 shrink-0" size="sm" src={claimIcon} />
              ) : null}
            </span>
          ) : null}
        </div>
      </div>
    </Card>
  )
}
