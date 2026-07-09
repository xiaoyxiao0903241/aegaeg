import { Wallet } from 'lucide-react'
import { tv } from 'tailwind-variants'
import { ButtonLoadingIcon } from '~/shared/ui/button-loading-icon'
import { FieldActionChip } from '~/shared/ui/chip'
import { Input } from '~/shared/ui/input'
import { Text } from '~/shared/ui/text'
import { dappAssets } from '~/app/assets'
import { DappIcon } from '~/app/shell/dapp-icon'
import { dappIcon } from '~/shared/ui/dapp-icon-scale'
import { DappSideCard } from '~/app/shell/dapp-card'
import { DappActionButton } from '~/app/shell/dapp-action-button'

const communityReferrerBindGrid = tv({
  base: 'flex gap-2',
})

const communityReferrerAddressRow = tv({
  base: 'flex h-11 items-center justify-between rounded-sm bg-background px-3.5',
})

const communityReferrerAvatar = tv({
  base: 'grid size-6 flex-none place-items-center rounded-full bg-accent text-primary',
})

const communityCopyButton = tv({
  base: 'grid size-7.5 shrink-0 cursor-pointer place-items-center rounded-sm bg-transparent',
})

/** Spacing / visibility only. */
export const communityGenesisCta = tv({
  base: 'mt-4 max-dapp:hidden',
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
      <Text as="p" variant="support" tone="muted-foreground" className="m-0">
        {linkLabel}
      </Text>
      <Text as="strong" variant="copy" tone="foreground" className="block max-w-full truncate text-sm font-semibold tracking-tight">
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
        variant="support"
        tone="muted-foreground"
        className="m-0"
      >
        {referrerLabel}
      </Text>
      <div className={communityReferrerBindGrid()}>
        <Input
          aria-label={inputLabel}
          className="min-w-0 flex-1"
          onChange={(event) => onInputChange(event.currentTarget.value)}
          placeholder={placeholder}
          value={value}
        />
        <FieldActionChip
          aria-busy={isSubmitting || undefined}
          disabled={!canBind || isSubmitting}
          onClick={onBind}
        >
          {isSubmitting ? <ButtonLoadingIcon /> : null}
          {bindLabel}
        </FieldActionChip>
      </div>
      <Text
        as="small"
        variant="support"
        tone="muted-foreground"
        className="block"
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
    <DappSideCard className="gap-2.5">
      <Text
        as="p"
        variant="support"
        tone="muted-foreground"
        className="m-0"
      >
        {addressLabel}
      </Text>
      <div className={communityReferrerAddressRow()}>
        <div className="flex min-w-0 items-center gap-2.5">
          <span aria-hidden="true" className={communityReferrerAvatar()}>
            <Wallet className={dappIcon({ size: 'xs' })} strokeWidth={1.75} />
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
        variant="support"
        tone="muted-foreground"
        className="m-0"
      >
        {note}
      </Text>
    </DappSideCard>
  )
}
