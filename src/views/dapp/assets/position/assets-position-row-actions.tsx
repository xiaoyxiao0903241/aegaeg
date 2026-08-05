import { CtaButton } from '~/app/shell/cta-button'
import { cn } from '~/shared/lib/utils'

/** 仓位卡的领取 + 赎回 / 解锁操作按钮组，质押与债券卡共用 */
export function AssetsPositionRowActions({
  canClaim,
  canRedeem,
  locked,
  busy,
  claimLabel,
  redeemLabel,
  onClaim,
  onRedeem,
}: {
  canClaim: boolean
  canRedeem: boolean
  locked: boolean
  busy: boolean
  claimLabel: string
  redeemLabel: string
  onClaim: () => void
  onRedeem: () => void
}) {
  const redeemEnabled = canRedeem && !locked && !busy

  return (
    <div className="grid grid-cols-2 gap-3">
      <CtaButton
        className="h-7 min-h-7 text-xs"
        density="inverse"
        disabled={!canClaim || locked || busy}
        onClick={onClaim}
      >
        {claimLabel}
      </CtaButton>
      <CtaButton
        className={cn(
          'h-7 min-h-7',
          redeemEnabled ? 'text-sm' : 'text-xs disabled:bg-muted disabled:text-foreground/40',
        )}
        density="inverse"
        disabled={!redeemEnabled}
        onClick={onRedeem}
        variant="secondary"
      >
        {redeemLabel}
      </CtaButton>
    </div>
  )
}
