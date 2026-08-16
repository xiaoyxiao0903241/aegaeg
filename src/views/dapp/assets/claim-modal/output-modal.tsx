import * as DialogPrimitive from '@radix-ui/react-dialog'
import { keepPreviousData } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

import {
  canSelectClaimOutput,
  claimContribRequiredOrZero,
  type ClaimOutputKind,
} from '~/core/assets/claim-output'
import { formatTokenAmount } from '~/core/exchange/token-amount'
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
import type { AssetsStakeRow } from '~/web3/assets/assets-read'
import { readContributionSnapshot } from '~/web3/assets/assets-read'
import { useActiveAccount } from '~/web3/thirdweb-react'

const GAGX_DECIMALS = EXCHANGE_CONFIG.tokens.gagx.decimals

/**
 * 领取产出中间层（定期仓）
 *
 * 左：收益 → claimRewardMixed；右：加成 → claimExtraRewardMixed。
 * 金额为 0 时对应按钮禁用；点可用项后进入 Mixed「领取数量」。
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
  if (open && capturedAddress && row) {
    const next = { capturedAddress, row }
    if (held?.capturedAddress !== next.capturedAddress || held?.row.id !== next.row.id) {
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
  const canReward = canSelectClaimOutput(reward)
  const canBoost = canSelectClaimOutput(boost)

  const rewardContrib = useChainQuery({
    queryKey: queryKeys.chain.assetsContributionForAmount(`claim-out-reward:${String(reward)}`),
    queryFn: (address) => readContributionSnapshot(address as Address, reward),
    enabled: open && canReward && Boolean(account?.address),
    placeholderData: keepPreviousData,
  })
  const boostContrib = useChainQuery({
    queryKey: queryKeys.chain.assetsContributionForAmount(`claim-out-boost:${String(boost)}`),
    queryFn: (address) => readContributionSnapshot(address as Address, boost),
    enabled: open && canBoost && Boolean(account?.address),
    placeholderData: keepPreviousData,
  })

  const rewardAmountLabel = `${formatTokenAmount(reward, GAGX_DECIMALS, 2)} gAGX`
  const boostAmountLabel = `${formatTokenAmount(boost, GAGX_DECIMALS, 2)} gAGX`
  // 缺数显 0（覆盖矩阵）
  const rewardContribLabel = formatTokenAmount(
    claimContribRequiredOrZero(rewardContrib.data?.requiredContribution),
    GAGX_DECIMALS,
    2,
  )
  const boostContribLabel = formatTokenAmount(
    claimContribRequiredOrZero(boostContrib.data?.requiredContribution),
    GAGX_DECIMALS,
    2,
  )

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
