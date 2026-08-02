import { DappActionButton } from '~/app/shell/dapp-action-button'
import { cn } from '~/shared/lib/utils'

/** Claim + redeem/unlock pair shared by stake/bond position cards. */
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
      <DappActionButton
        className="h-7 min-h-7 text-xs"
        density="inverse"
        disabled={!canClaim || locked || busy}
        onClick={onClaim}
      >
        {claimLabel}
      </DappActionButton>
      <DappActionButton
        className={cn(
          'h-7 min-h-7',
          // 稿：禁用次按钮 page 底 #f5f6f8 + muted 40%；可点赎回 14 Medium ink
          redeemEnabled ? 'text-sm' : 'text-xs disabled:bg-muted disabled:text-foreground/40',
        )}
        density="inverse"
        disabled={!redeemEnabled}
        onClick={onRedeem}
        variant="secondary"
      >
        {redeemLabel}
      </DappActionButton>
    </div>
  )
}
