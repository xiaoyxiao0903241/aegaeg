import { DappActionButton } from '~/app/shell/dapp-action-button'

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
        className="h-7 min-h-7 text-xs"
        density="inverse"
        disabled={!canRedeem || locked || busy}
        onClick={onRedeem}
        variant="secondary"
      >
        {redeemLabel}
      </DappActionButton>
    </div>
  )
}
