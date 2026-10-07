import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { type ClaimOutputKind, shouldReplaceHeldClaimOutput } from '~/core/assets/claim-output'
import { ZERO_BI } from '~/core/constants'
import { formatContributionPoints } from '~/core/exchange/format-contribution-points'
import { formatAssetsActionAmount, isAssetsActionableAmount } from '~/core/exchange/token-amount'
import { isDecisionFresh } from '~/core/query/decision-freshness'
import { useChainQuery } from '~/hooks/use-chain-query'
import { interpolate } from '~/i18n/interpolate'
import { useI18n } from '~/i18n/use-i18n'
import { queryKeys } from '~/shared/api/query/query-keys'
import { CountValue } from '~/shared/components/count-value'
import { DialogClose, ResponsiveDialog, SheetHandle } from '~/shared/components/dialog'
import { iconVariants } from '~/shared/components/icon'
import { MainButton } from '~/shared/components/main-button'
import { Text } from '~/shared/components/text'
import type { Address } from '~/shared/config/contracts'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { cn } from '~/shared/lib/utils'
import { type AssetsStakeRow, readContributionSnapshot } from '~/web3/assets/assets-read'
import { useActiveAccount } from '~/web3/thirdweb-react'

const GAGX_DECIMALS = EXCHANGE_CONFIG.tokens.gagx.decimals
const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals

/**
 * 定期仓先选领取收益或领取加成。
 *
 * 低于 0.01 的那一项不可点。贡献点不够整笔时仍可进入，再到数量框里改小。
 */
export function AssetsClaimOutputModal({
  onOpenChange,
  onSelectOutput,
  open,
  capturedAddress,
  row,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  capturedAddress: string | null
  row: AssetsStakeRow | null
  onSelectOutput: (kind: ClaimOutputKind) => void
}) {
  const [held, setHeld] = useState<{ capturedAddress: string; row: AssetsStakeRow } | null>(null)
  // 关闭动画要留上一帧；同一仓位领完后 id 不变，必须连可领金额一起比，否则加成按钮还会亮。
  if (open && capturedAddress && row) {
    const next = { capturedAddress, row }
    if (shouldReplaceHeldClaimOutput({ held, next })) {
      setHeld(next)
    }
  }
  if (!held) return null

  return (
    <AssetsClaimOutputModalOpen
      key={`${held.capturedAddress}-${held.row.id}`}
      onOpenChange={onOpenChange}
      onSelectOutput={onSelectOutput}
      open={open}
      capturedAddress={held.capturedAddress}
      row={held.row}
    />
  )
}

function AssetsClaimOutputModalOpen({
  onOpenChange,
  onSelectOutput,
  open,
  capturedAddress,
  row,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  capturedAddress: string
  row: AssetsStakeRow
  onSelectOutput: (kind: ClaimOutputKind) => void
}) {
  const { messages: t } = useI18n()
  const account = useActiveAccount()

  useEffect(() => {
    const current = account?.address
    if (!current || current.toLowerCase() !== capturedAddress.toLowerCase()) {
      onOpenChange(false)
    }
  }, [account?.address, capturedAddress, onOpenChange])

  const contribQuery = useChainQuery({
    queryKey: queryKeys.chain.assetsContributionForAmount('0'),
    queryFn: (address) => readContributionSnapshot(address as Address, ZERO_BI, false),
    enabled: open && Boolean(account?.address),
  })
  const contribution = isDecisionFresh(contribQuery.isPlaceholderData, contribQuery.data)
    ? contribQuery.data!.contribution
    : null

  const reward = row.blockReward
  const boost = row.extraInterest

  return (
    <ResponsiveDialog
      className="dapp:max-w-100 dapp:px-7 dapp:py-6"
      onOpenChange={onOpenChange}
      open={open}
      overlayClassName="bg-modal-overlay-dim"
    >
      <SheetHandle />
      <div className="flex items-center justify-between gap-4">
        <DialogPrimitive.Title asChild>
          <Text as="h2" className="m-0 text-lg font-semibold" variant="copy">
            {t.assets.claimOutput.title}
          </Text>
        </DialogPrimitive.Title>
        <DialogClose aria-label={t.common.close}>
          <X aria-hidden className={iconVariants({ size: 'sm' })} strokeWidth={2} />
        </DialogClose>
      </div>

      <div className="grid gap-4 pt-5">
        <ClaimOutputChoice
          amountLabel={formatAssetsActionAmount(reward, GAGX_DECIMALS, { suffix: ' gAGX' })}
          disabled={!isAssetsActionableAmount(reward, GAGX_DECIMALS)}
          label={t.assets.claimOutput.claimReward}
          note={choiceNote(t, reward, contribution)}
          onClick={() => onSelectOutput('reward')}
        />
        <ClaimOutputChoice
          amountLabel={formatAssetsActionAmount(boost, GAGX_DECIMALS, { suffix: ' gAGX' })}
          disabled={!isAssetsActionableAmount(boost, GAGX_DECIMALS)}
          label={t.assets.claimOutput.claimBoost}
          note={choiceNote(t, boost, contribution)}
          onClick={() => onSelectOutput('boost')}
        />
      </div>
    </ResponsiveDialog>
  )
}

function choiceNote(
  t: ReturnType<typeof useI18n>['messages'],
  amount: bigint,
  contribution: bigint | null,
): { text: string; short: boolean } | null {
  if (!isAssetsActionableAmount(amount, GAGX_DECIMALS)) return null
  if (contribution != null && contribution < amount) {
    return { text: t.assets.claim.contribShort, short: true }
  }
  return {
    text: interpolate(t.assets.claim.contribNeed, {
      amount: formatContributionPoints(amount, AGX_DECIMALS),
    }),
    short: false,
  }
}

function ClaimOutputChoice({
  amountLabel,
  disabled,
  label,
  note,
  onClick,
}: {
  amountLabel: string
  disabled: boolean
  label: string
  note: { text: string; short: boolean } | null
  onClick: () => void
}) {
  return (
    <div className="grid gap-2">
      <MainButton
        className="min-h-13 w-full rounded-sm whitespace-normal"
        density="modal"
        disabled={disabled}
        onClick={onClick}
        variant="primary"
      >
        <span className="inline-flex max-w-full flex-wrap items-baseline justify-center gap-x-1">
          {label} <CountValue text={amountLabel} />
        </span>
      </MainButton>
      {note ? (
        <Text
          as="span"
          className={cn('text-center', note.short && 'text-destructive')}
          tone={note.short ? undefined : 'muted-foreground'}
          variant="detail"
        >
          {note.text}
        </Text>
      ) : null}
    </div>
  )
}
