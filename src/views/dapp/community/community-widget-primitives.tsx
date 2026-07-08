import { Wallet } from 'lucide-react'
import { tv } from 'tailwind-variants'
import { Text } from '~/shared/ui/text'
import { dappAssets } from '~/app/assets'
import { DappIcon } from '~/app/shell/components/dapp-icon'
import { dappIconClass } from '~/app/dapp-icon-scale'
import { DappSideCard } from '~/app/shell/components/dapp-card'
import { DappActionButton } from '~/app/shell/components/dapp-action-button'
import { cn } from '~/shared/lib/utils'

/** Aligns with dev community widget side cards (`rounded-md px-4 py-3.5`). */
const communityWidgetCard = tv({
  base: 'flex flex-col rounded-md px-4 py-3.5',
})

const communityShareButton = tv({
  base: 'min-h-[42px] max-dapp:min-h-11 max-dapp:text-sm',
})

const communityReferrerInput = tv({
  base: 'w-full rounded-sm border border-border bg-card px-3.5 py-2.5 text-xs tracking-[-0.26px] text-muted-foreground outline-0',
})

const communityReferrerBindGrid = tv({
  base: 'grid grid-cols-[minmax(0,1fr)_max-content] items-center gap-2',
})

const communityReferrerAddressRow = tv({
  base: 'flex h-[46px] items-center justify-between rounded-[11px] bg-[#f5f6f8] px-3.5',
})

const communityReferrerAvatar = tv({
  base: 'grid size-6 flex-none place-items-center rounded-full bg-accent text-primary',
})

const communityCopyButton = tv({
  base: 'grid size-[30px] shrink-0 cursor-pointer place-items-center rounded-lg bg-transparent',
})

export const communityGenesisCta = tv({
  base: 'mt-4 min-h-10 hover:shadow-primary-hover-xl focus-visible:shadow-primary-hover-xl max-dapp:hidden',
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
    <DappSideCard className={cn(communityWidgetCard(), 'gap-2')}>
      <Text as="p" variant="copy" tone="muted-foreground" className="m-0 text-xs">
        {linkLabel}
      </Text>
      <Text as="strong" variant="copy" tone="foreground" className="block max-w-full truncate text-sm font-semibold max-dapp:text-xs">
        {referralLink}
      </Text>
      <DappActionButton className={communityShareButton()} disabled={disabled} onClick={onCopy}>
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
    <DappSideCard className={cn(communityWidgetCard(), 'gap-2')}>
      <Text as="p" variant="copy" tone="muted-foreground" className="m-0 text-xs">
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
      <Text as="small" variant="copy" tone="muted-foreground" className="block text-xs">
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
    <DappSideCard className={cn(communityWidgetCard(), 'gap-2.5')}>
      <Text as="p" variant="copy" tone="muted-foreground" className="m-0 text-xs">
        {addressLabel}
      </Text>
      <div className={communityReferrerAddressRow()}>
        <div className="flex min-w-0 items-center gap-2.5">
          <span aria-hidden="true" className={communityReferrerAvatar()}>
            <Wallet className={dappIconClass.xs} strokeWidth={1.75} />
          </span>
          <Text as="strong" variant="copy" tone="foreground" className="truncate text-sm font-semibold">
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
      <Text as="p" variant="copy" tone="muted-foreground" className="m-0 text-xs">
        {note}
      </Text>
    </DappSideCard>
  )
}
