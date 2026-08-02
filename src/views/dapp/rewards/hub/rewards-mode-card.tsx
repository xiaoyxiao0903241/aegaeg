import { DappIcon } from '~/app/shell/dapp-icon'
import { cn } from '~/shared/lib/utils'
import { Card } from '~/shared/ui/card'
import { DappCountValue } from '~/shared/ui/dapp-count-value'
import { Text } from '~/shared/ui/text'

/**
 * Hub reward entry — Figma `reward/*`（p16 · gap12 · r16）.
 * 副文/≈：caption 13 + muted 40% → `copy` + `/40`；余额值 16 semibold → `headline`。
 * 图标：幸运/推荐/创世 20；参与/共建/发展 24（`size-5`/`size-6`，禁任意 px）。
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
        'grid w-full gap-3 rounded-2xl p-4 text-left shadow-sm',
        onClick &&
          'duration-dapp-fast cursor-pointer transition-[border-color,transform] ease-out hover:scale-[1.008] hover:border-primary active:scale-[0.992]',
      )}
      onClick={onClick}
      type="button"
    >
      <div className="grid gap-1.5">
        <div className="flex items-center gap-1.5">
          <DappIcon alt="" className={cn('size-5 shrink-0', iconClassName)} size="sm" src={icon} />
          <Text as="span" className="leading-4 font-semibold" variant="detail">
            {title}
          </Text>
          {badge ? (
            <span className="pointer-events-none shrink-0 rounded-full bg-primary-soft px-2 py-0.5 text-(length:--type-caption-size) leading-none font-(--type-caption-weight) text-primary">
              {badge}
            </span>
          ) : null}
        </div>
        <Text as="p" className="m-0 truncate leading-4 text-foreground/40" variant="copy">
          {body}
        </Text>
      </div>

      <div className="flex items-center justify-between gap-2">
        <Text as="span" className="leading-4" tone="muted-foreground" variant="copy">
          {balanceLabel}
        </Text>
        <div className="flex items-center gap-1.5">
          <Text as="strong" className="leading-5 font-semibold" variant="headline">
            <DappCountValue text={balanceAmount} />
          </Text>
          {approx ? (
            <Text as="span" className="leading-4 text-foreground/40" variant="copy">
              <DappCountValue text={approx} />
            </Text>
          ) : null}
          {claimCta ? (
            <span className="inline-flex items-center gap-1">
              <Text as="span" className="leading-4 font-medium" tone="primary" variant="copy">
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
