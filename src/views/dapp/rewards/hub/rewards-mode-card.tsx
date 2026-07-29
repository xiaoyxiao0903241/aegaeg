import { DappIcon } from '~/app/shell/dapp-icon'
import { Card } from '~/shared/ui/card'
import { chipVariants } from '~/shared/ui/chip'
import { Text } from '~/shared/ui/text'
import { cn } from '~/shared/lib/utils'

/** Hub reward entry — Figma `reward/*` leaf (not ExchangeModeCard chrome). */
export function RewardsModeCard({
  approx,
  badge,
  balanceAmount,
  balanceLabel,
  body,
  claimCta,
  icon,
  onClick,
  title,
}: {
  approx?: string
  badge?: string
  balanceAmount: string
  balanceLabel: string
  body: string
  claimCta?: string
  icon: string
  onClick?: () => void
  title: string
}) {
  return (
    <Card
      as="button"
      surface="outlined"
      className={cn(
        'grid w-full gap-3 p-4 text-left shadow-none',
        onClick &&
          'duration-dapp-fast cursor-pointer transition-[border-color,transform] ease-out hover:scale-[1.008] hover:border-primary active:scale-[0.992]',
      )}
      onClick={onClick}
      type="button"
    >
      <div className="grid gap-1.5">
        <div className="flex items-center gap-1.5">
          <DappIcon alt="" className="size-5 shrink-0" size="sm" src={icon} />
          <Text as="span" className="text-sm font-semibold" variant="copy">
            {title}
          </Text>
          {badge ? (
            <span
              className={cn(
                chipVariants({
                  variant: 'solid',
                  tone: 'primary',
                  size: 'sm',
                  shape: 'pill',
                }),
                'pointer-events-none shrink-0 bg-warning text-white',
              )}
            >
              {badge}
            </span>
          ) : null}
        </div>
        <Text as="p" className="m-0 text-[13px]" tone="muted-foreground" variant="detail">
          {body}
        </Text>
      </div>

      <div className="flex items-center justify-between gap-2">
        <Text as="span" className="text-[13px]" tone="muted-foreground" variant="detail">
          {balanceLabel}
        </Text>
        <div className="flex items-center gap-1.5">
          <Text as="strong" className="text-base font-semibold" variant="copy">
            {balanceAmount}
          </Text>
          {approx ? (
            <Text as="span" className="text-[13px]" tone="muted-foreground" variant="detail">
              {approx}
            </Text>
          ) : null}
          {claimCta ? (
            <Text as="span" className="text-[13px] font-medium text-primary" variant="detail">
              {claimCta}
            </Text>
          ) : null}
        </div>
      </div>
    </Card>
  )
}
