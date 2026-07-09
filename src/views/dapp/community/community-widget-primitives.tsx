import { Wallet } from 'lucide-react'
import { tv } from 'tailwind-variants'
import { Text } from '~/shared/ui/text'
import { dappAssets } from '~/app/assets'
import { DappIcon } from '~/app/shell/components/dapp-icon'
import { dappIconClass } from '~/app/dapp-icon-scale'
import { DappSideCard } from '~/app/shell/components/dapp-card'
import { DappActionButton } from '~/app/shell/components/dapp-action-button'

const communityReferrerInput = tv({
  base: 'w-full rounded-sm border border-border bg-card px-3.5 py-2.5 text-xs text-muted-foreground outline-0',
})

const communityReferrerBindGrid = tv({
  base: 'grid grid-cols-[minmax(0,1fr)_max-content] items-center gap-2',
})

const communityReferrerAddressRow = tv({
  // ReferrerAddressRow: h-11 · rounded-sm · bg-background
  base: 'flex h-11 items-center justify-between rounded-sm bg-background px-3.5',
})

const communityReferrerAvatar = tv({
  base: 'grid size-6 flex-none place-items-center rounded-full bg-accent text-primary',
})

const communityCopyButton = tv({
  // size-7.5 rem — scales with site-fluid; do not lock px
  base: 'grid size-7.5 shrink-0 cursor-pointer place-items-center rounded-sm bg-transparent',
})

/** Spacing / visibility only — height from Button `sm` + `pill`. */
export const communityGenesisCta = tv({
  base: 'mt-4 hover:shadow-primary-hover-xl focus-visible:shadow-primary-hover-xl max-dapp:hidden',
})

export function CommunityReferralLinkCard({
  copyLabel,
  disabled = false,
  linkLabel,
  onCopy,
  referralLink,
}: {
  copyLabel: string
  disabled?: boolean
  linkLabel: string
  onCopy: () => void
  referralLink: string
}) {
  return (
    <DappSideCard className="gap-2">
      <Text as="p" variant="copy" tone="muted-foreground" className="m-0 text-xs leading-normal">
        {linkLabel}
      </Text>
      <Text as="strong" variant="copy" tone="foreground" className="block max-w-full truncate text-sm font-semibold tracking-tight max-dapp:text-xs">
        {referralLink}
      </Text>
      <DappActionButton disabled={disabled} onClick={onCopy}>
        {copyLabel}
      </DappActionButton>
    </DappSideCard>
  )
}

export function CommunityReferrerBindCard({
  bindLabel,
  canBind,
  hint,
  inputLabel,
  isSubmitting,
  onBind,
  onInputChange,
  placeholder,
  referrerLabel,
  value,
}: {
  bindLabel: string
  canBind: boolean
  hint: string
  inputLabel: string
  isSubmitting: boolean
  onBind: () => void
  onInputChange: (value: string) => void
  placeholder: string
  referrerLabel: string
  value: string
}) {
  return (
    <DappSideCard className="gap-2">
      <Text
        as="p"
        variant="copy"
        tone="muted-foreground"
        className="m-0 text-xs leading-normal"
      >
        {referrerLabel}
      </Text>
      <div className={communityReferrerBindGrid()}>
        <input
          aria-label={inputLabel}
          className={communityReferrerInput()}
          onChange={(event) => onInputChange(event.currentTarget.value)}
          placeholder={placeholder}
          value={value}
        />
        <DappActionButton
          disabled={!canBind}
          loading={isSubmitting}
          onClick={onBind}
          shape="inline"
          variant="secondary"
        >
          {bindLabel}
        </DappActionButton>
      </div>
      <Text
        as="small"
        variant="copy"
        tone="muted-foreground"
        className="block text-xs leading-normal"
      >
        {hint}
      </Text>
    </DappSideCard>
  )
}

export function CommunityReferrerBoundPanel({
  addressLabel,
  copyLabel,
  note,
  onCopy,
  referrer,
  referrerLabel,
}: {
  addressLabel: string
  copyLabel: string
  note: string
  onCopy: () => void
  referrer: string | null
  referrerLabel: string | null
}) {
  return (
    // Same chrome as ReferralLinkCard (DappSideCard). Figma bound gap≈10 → gap-2.5.
    <DappSideCard className="gap-2.5">
      <Text
        as="p"
        variant="copy"
        tone="muted-foreground"
        className="m-0 text-xs leading-normal"
      >
        {addressLabel}
      </Text>
      <div className={communityReferrerAddressRow()}>
        <div className="flex min-w-0 items-center gap-2.5">
          <span aria-hidden="true" className={communityReferrerAvatar()}>
            <Wallet className={dappIconClass.xs} strokeWidth={1.75} />
          </span>
          <Text
            as="strong"
            variant="copy"
            tone="foreground"
            className="truncate text-sm font-semibold leading-[1.2]"
          >
            {referrerLabel ?? '—'}
          </Text>
        </div>
        {referrer ? (
          <button
            aria-label={copyLabel}
            className={communityCopyButton()}
            onClick={onCopy}
            type="button"
          >
            <DappIcon alt="" size="base" src={dappAssets.copy} />
          </button>
        ) : null}
      </div>
      <Text
        as="p"
        variant="copy"
        tone="muted-foreground"
        className="m-0 text-xs leading-normal"
      >
        {note}
      </Text>
    </DappSideCard>
  )
}
