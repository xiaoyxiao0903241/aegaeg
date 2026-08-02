import { DappIcon } from '~/app/shell/dapp-icon'
import { cn } from '~/shared/lib/utils'
import { Card } from '~/shared/ui/card'
import { DappCountValue } from '~/shared/ui/dapp-count-value'
import { Text } from '~/shared/ui/text'

/** Hub reward entry — Figma `reward/*` 106/110：p-4 + leading-4 合成（禁任意 h-[Npx]）。 */
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
          <Text as="span" className="text-sm leading-5 font-semibold" variant="copy">
            {title}
          </Text>
          {badge ? (
            <span className="pointer-events-none shrink-0 rounded-full bg-warning px-2 py-0.5 text-(length:--type-caption-size) leading-none font-(--type-caption-weight) text-white">
              {badge}
            </span>
          ) : null}
        </div>
        <Text as="p" className="m-0 truncate leading-4" tone="muted-foreground" variant="support">
          {body}
        </Text>
      </div>

      <div className="flex items-center justify-between gap-2">
        <Text as="span" className="leading-4" tone="muted-foreground" variant="support">
          {balanceLabel}
        </Text>
        <div className="flex items-center gap-1.5">
          <Text as="strong" className="text-sm leading-5 font-semibold" variant="copy">
            <DappCountValue text={balanceAmount} />
          </Text>
          {approx ? (
            <Text as="span" className="leading-4" tone="muted-foreground" variant="support">
              <DappCountValue text={approx} />
            </Text>
          ) : null}
          {claimCta ? (
            <Text as="span" className="leading-4 font-medium text-primary" variant="support">
              {claimCta}
            </Text>
          ) : null}
        </div>
      </div>
    </Card>
  )
}
