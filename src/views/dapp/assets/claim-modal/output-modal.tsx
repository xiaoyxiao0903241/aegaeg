import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { type ClaimOutputKind, shouldReplaceHeldClaimOutput } from '~/core/assets/claim-output'
import { formatContributionPoints } from '~/core/exchange/format-contribution-points'
import { formatAssetsActionAmount, isAssetsActionableAmount } from '~/core/exchange/token-amount'
import { interpolate } from '~/i18n/interpolate'
import { useI18n } from '~/i18n/use-i18n'
import { CountValue } from '~/shared/components/count-value'
import { DialogClose, ResponsiveDialog, SheetHandle } from '~/shared/components/dialog'
import { iconVariants } from '~/shared/components/icon'
import { MainButton } from '~/shared/components/main-button'
import { Text } from '~/shared/components/text'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { cn } from '~/shared/lib/utils'
import type { AssetsStakeRow } from '~/web3/assets/assets-read'
import { useActiveAccount } from '~/web3/thirdweb-react'

const GAGX_DECIMALS = EXCHANGE_CONFIG.tokens.gagx.decimals
const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals

/**
 * 领取产出中间层（定期仓）
 *
 * 左：收益 → claimRewardMixed；右：加成 → claimExtraRewardMixed。
 * 单档低于 0.01 时对应按钮禁用；点可用项后进入 Mixed「领取数量」。
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

  const reward = row.blockReward
  const boost = row.extraInterest
  const canReward = isAssetsActionableAmount(reward, GAGX_DECIMALS)
  const canBoost = isAssetsActionableAmount(boost, GAGX_DECIMALS)

  const rewardAmountLabel = `${formatAssetsActionAmount(reward, GAGX_DECIMALS)} gAGX`
  const boostAmountLabel = `${formatAssetsActionAmount(boost, GAGX_DECIMALS)} gAGX`
  const rewardContribLabel = formatContributionPoints(reward, AGX_DECIMALS)
  const boostContribLabel = formatContributionPoints(boost, AGX_DECIMALS)

  return (
    <ResponsiveDialog
      onOpenChange={onOpenChange}
      open={open}
      overlayClassName="bg-modal-overlay-dim"
    >
      <SheetHandle />
      <div className="flex h-10 items-center justify-between gap-3">
        <DialogPrimitive.Title asChild>
          <Text as="h2" className="m-0 font-semibold" variant="copy">
            {t.assets.claimOutput.title}
          </Text>
        </DialogPrimitive.Title>
        <DialogClose aria-label={t.common.close}>
          <X aria-hidden className={iconVariants({ size: 'sm' })} strokeWidth={2} />
        </DialogClose>
      </div>

      <div className="grid grid-cols-2 gap-2 py-1">
        <div className="grid min-w-0 gap-1">
          <Text as="span" tone="muted-foreground" variant="detail">
            {t.assets.claimOutput.rewardLabel}
          </Text>
          <Text as="strong" className="text-lg font-semibold" variant="copy">
            <CountValue text={rewardAmountLabel} />
          </Text>
        </div>
        <div className="grid min-w-0 justify-items-end gap-1 text-right">
          <Text as="span" tone="muted-foreground" variant="detail">
            {t.assets.claimOutput.boostLabel}
          </Text>
          <Text as="strong" className="text-lg font-semibold" variant="copy">
            <CountValue text={boostAmountLabel} />
          </Text>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="grid min-w-0 content-start gap-2">
          <MainButton
            className="w-full"
            density="modal"
            disabled={!canReward}
            onClick={() => onSelectOutput('reward')}
            variant="primary"
          >
            {t.assets.claimOutput.claimReward}
          </MainButton>
          {/* 禁用时 invisible 占位，保证两列按钮底边对齐 */}
          <Text
            aria-hidden={!canReward}
            as="span"
            className={cn('text-center text-foreground/40', !canReward && 'invisible')}
            variant="detail"
          >
            {canReward
              ? interpolate(t.assets.claimOutput.contribDeduct, { amount: rewardContribLabel })
              : '\u00a0'}
          </Text>
        </div>
        <div className="grid min-w-0 content-start gap-2">
          <MainButton
            className="w-full"
            density="modal"
            disabled={!canBoost}
            onClick={() => onSelectOutput('boost')}
            variant="primary"
          >
            {t.assets.claimOutput.claimBoost}
          </MainButton>
          <Text
            aria-hidden={!canBoost}
            as="span"
            className={cn('text-center text-foreground/40', !canBoost && 'invisible')}
            variant="detail"
          >
            {canBoost
              ? interpolate(t.assets.claimOutput.contribDeduct, { amount: boostContribLabel })
              : '\u00a0'}
          </Text>
        </div>
      </div>
    </ResponsiveDialog>
  )
}
