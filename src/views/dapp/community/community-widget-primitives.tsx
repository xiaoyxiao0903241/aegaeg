import type { ReactNode } from 'react'
import { Wallet } from 'lucide-react'
import { tv } from 'tailwind-variants'
import { dappAssets } from '~/app/assets'
import { DappIcon } from '~/app/components/dapp-icon'
import { dappIconClass } from '~/app/dapp-icon-scale'
import {
  DappReferrerBoundCard,
  DappSideCard,
  SideHint,
  SideLabel,
  SideValue,
} from '~/app/components/dapp-card'
import { DappActionButton } from '~/app/components/dapp-action-button'
import { ReferrerAddressRow } from '~/app/components/referrer-address-row'
import { cn } from '~/shared/lib/utils'

const communitySideCard = tv({
  base: cn(
    '[&_strong]:block [&_strong]:max-w-full [&_strong]:truncate',
    'flex flex-col gap-2 rounded-md px-4 py-3.5',
    '[&_label]:text-xs [&_label]:leading-[1.5] [&_label]:tracking-[-0.24px] [&_label]:text-faint',
  ),
})

const communityReferralValue = tv({
  base: 'text-sm max-dapp:text-xs tracking-tight',
})

const communityShareButton = tv({
  base: 'max-dapp:min-h-11 max-dapp:text-sm',
})

const communityReferrerInput = tv({
  base: 'w-full rounded-sm border border-border bg-card px-3.5 py-2.5 text-xs tracking-[-0.26px] text-muted-foreground outline-0',
})

const communityReferrerBindGrid = tv({
  base: 'grid grid-cols-[minmax(0,1fr)_max-content] items-center gap-2',
})

const communityReferrerBoundCard = tv({
  base: 'grid gap-2 rounded-md px-4 py-3.5',
})

const communityReferrerMeta = tv({
  base: 'text-xs leading-normal tracking-[-0.24px] text-muted-foreground',
})

const communityReferrerAvatar = tv({
  base: 'grid size-6 flex-none place-items-center rounded-full bg-accent text-primary',
})

const communityReferrerAddress = tv({
  base: 'truncate text-sm font-semibold leading-[1.2] tracking-[-0.28px] text-foreground',
})

const communityCopyButton = tv({
  base: 'grid size-7.5 shrink-0 cursor-pointer place-items-center rounded-sm bg-transparent',
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
    <DappSideCard className={communitySideCard()}>
      <SideLabel>{linkLabel}</SideLabel>
      <SideValue className={communityReferralValue()}>{referralLink}</SideValue>
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
    <DappSideCard className={communitySideCard()}>
      <SideLabel tone="muted">{referrerLabel}</SideLabel>
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
      <SideHint>{hint}</SideHint>
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
    <DappReferrerBoundCard className={communityReferrerBoundCard()}>
      <p className={communityReferrerMeta()}>{addressLabel}</p>
      <ReferrerAddressRow>
        <div className="flex min-w-0 items-center gap-2.5">
          <span aria-hidden="true" className={communityReferrerAvatar()}>
            <Wallet className={dappIconClass.xs} strokeWidth={1.75} />
          </span>
          <strong className={communityReferrerAddress()}>{referrerLabel ?? '—'}</strong>
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
      </ReferrerAddressRow>
      <p className={communityReferrerMeta()}>{note}</p>
    </DappReferrerBoundCard>
  )
}
