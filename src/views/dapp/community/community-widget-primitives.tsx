import { Loader2, Wallet } from 'lucide-react'
import { tv } from 'tailwind-variants'

import { dappAssets } from '~/app/assets'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappSideCard } from '~/app/shell/dapp-card'
import { FieldActionChip } from '~/shared/components/chip'
import { Icon, iconVariants } from '~/shared/components/icon'
import { Input } from '~/shared/components/input'
import { Text } from '~/shared/components/text'

const communityReferrerBindGrid = tv({
  base: 'flex gap-2',
})

/** 已绑定行：头像 + 地址 + 复制按钮，仅按钮灰底而非整行灰条 */
const communityReferrerAddressRow = tv({
  base: 'flex w-full items-center',
})

const communityReferrerAvatar = tv({
  base: 'grid size-6 flex-none place-items-center rounded-full bg-accent text-primary',
})

const communityCopyButton = tv({
  base: 'ml-auto grid size-7.5 shrink-0 cursor-pointer place-items-center rounded-sm bg-background',
})

/** 推荐链接卡：展示分享链接并支持一键复制 */
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
    <DappSideCard className="gap-2 rounded-2xl px-4 py-3.5">
      <Text as="p" className="m-0 leading-4 text-foreground/40" variant="support">
        {linkLabel}
      </Text>
      <Text
        as="strong"
        className="block max-w-full truncate text-sm leading-4 font-semibold tracking-tight"
        tone="foreground"
        variant="copy"
      >
        {referralLink}
      </Text>
      <DappActionButton density="inverse" disabled={disabled} onClick={onCopy}>
        {copyLabel}
      </DappActionButton>
    </DappSideCard>
  )
}

/** 推荐人绑定卡：输入地址提交绑定，提交中展示加载态 */
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
      <Text as="p" className="m-0 text-foreground/40" variant="support">
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
          {isSubmitting ? (
            <Loader2 aria-hidden className="size-4 shrink-0 animate-spin" strokeWidth={2} />
          ) : null}
          {bindLabel}
        </FieldActionChip>
      </div>
      <Text as="small" className="block text-foreground/40" variant="support">
        {hint}
      </Text>
    </DappSideCard>
  )
}

/** 已绑定面板：钱包圆标 + 地址 + 复制按钮 + 永久关系注脚 */
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
    <DappSideCard className="gap-2 rounded-2xl px-4 py-3.5">
      <Text as="p" className="m-0 leading-4 text-foreground/40" variant="support">
        {addressLabel}
      </Text>
      <div className={communityReferrerAddressRow()} data-slot-id="community-referrer-row">
        <span aria-hidden className={communityReferrerAvatar()}>
          <Wallet className={iconVariants({ size: 'xs' })} strokeWidth={1.75} />
        </span>
        <Text
          as="strong"
          className="ml-2.5 truncate text-sm leading-tight font-semibold"
          tone="foreground"
          variant="copy"
        >
          {referrerLabel ?? '—'}
        </Text>
        {referrer ? (
          <button
            aria-label={copyLabel}
            className={communityCopyButton()}
            data-slot-id="community-referrer-copy"
            onClick={onCopy}
            type="button"
          >
            <Icon alt="" size="sm" src={dappAssets.copy} />
          </button>
        ) : null}
      </div>
      <Text as="p" className="m-0 leading-4 text-foreground/40" variant="support">
        {note}
      </Text>
    </DappSideCard>
  )
}
