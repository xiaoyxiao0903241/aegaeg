import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { goBindReferral } from '~/app/shell/go-bind-referral'
import { useAppShell } from '~/app/use-app-shell'
import { isGenesisProgramEnded } from '~/core/presale/is-genesis-program-ended'
import { clampGenesisShares, formatGenesisSharesText } from '~/core/presale/presale-math'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'
import { usePresentUserFacingError } from '~/hooks/use-present-user-facing-error'
import { useI18n } from '~/i18n/use-i18n'
import { apiUserFacingError } from '~/shared/api/api-user-facing-error'
import { formatGroupedNumber } from '~/shared/api/format-display'
import { invalidateGenesisPage } from '~/shared/api/query/invalidate'
import { applyMessageTemplate } from '~/shared/lib/apply-message-template'
import type { GenesisWidgetState } from '~/views/dapp/genesis/genesis-session-host'

/**
 * 创世购买表单状态
 *
 * 管理份额草稿、输入框焦点与提交/错误呈现；
 * 钱包切换时由父级以 key={address} 重建以清空草稿。
 */
export function useGenesisPurchaseView(genesis: GenesisWidgetState) {
  const { messages: t } = useI18n()
  const { walletReady } = useAppShell()
  const setShares = genesis.setShares

  const [sharesText, setSharesText] = useState('')

  // 当 maxShares 降到已输入草稿以下时按上限派生展示值（避免在副作用里 setState）
  const sharesTextDisplay =
    sharesText === ''
      ? ''
      : formatGenesisSharesText(
          clampGenesisShares(Number.parseInt(sharesText, 10) || 0, genesis.maxShares),
        )

  const isMobileViewport = useMobileViewport()
  const sharesInputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (isMobileViewport) return
    sharesInputRef.current?.focus()
  }, [isMobileViewport])

  const xTokenAirdropHint = applyMessageTemplate(t.genesis.xTokenAirdropHint, {
    threshold: formatGroupedNumber(genesis.airdropThresholdUsd, { suffix: ' USD' }),
  })

  function handleSharesChange(value: string) {
    if (value === '') {
      setSharesText('')
      setShares(0)
      return
    }
    if (genesis.maxShares <= 0) {
      setSharesText('')
      setShares(0)
      return
    }
    const parsed = Number.parseInt(value, 10)
    if (Number.isNaN(parsed)) return
    const clamped = clampGenesisShares(parsed, genesis.maxShares)
    setSharesText(formatGenesisSharesText(clamped))
    setShares(clamped)
  }

  function handleSharesBlur() {
    if (sharesTextDisplay === '' || Number.parseInt(sharesTextDisplay, 10) < 1) {
      setShares(0)
      setSharesText('')
      return
    }
    if (sharesTextDisplay !== sharesText) {
      setSharesText(sharesTextDisplay)
      setShares(Number.parseInt(sharesTextDisplay, 10))
    }
  }

  function handleSharesMax() {
    if (genesis.maxShares <= 0) {
      setShares(0)
      setSharesText('')
      return
    }
    setShares(genesis.maxShares)
    setSharesText(String(genesis.maxShares))
  }

  function goBindReferrer() {
    goBindReferral()
  }

  async function handlePurchase() {
    const ok = await genesis.submitPurchase()
    if (ok !== true) return
    toast.success(t.genesis.joinSuccess)
    window.setTimeout(() => {
      invalidateGenesisPage()
    }, 2000)
  }

  usePresentUserFacingError(genesis.error, {
    id: 'genesis-query-error',
    messageFor: (err) => apiUserFacingError(err, t.errors.api) ?? t.errors.loadFailed,
  })

  const programEnded = isGenesisProgramEnded({
    isLoading: genesis.isLoading,
    activePhase: genesis.activePhase,
    seasonOptions: genesis.seasonOptions,
  })
  const hasUpcomingSeason = genesis.seasonOptions.some((season) => season.status === 'Upcoming')
  const purchaseCtaLabel =
    genesis.activePhase === null && hasUpcomingSeason ? t.genesis.seasonUpcoming : t.genesis.join

  return {
    t,
    walletReady,
    sharesTextDisplay,
    sharesInputRef,
    xTokenAirdropHint,
    handleSharesChange,
    handleSharesBlur,
    handleSharesMax,
    handlePurchase,
    goBindReferrer,
    programEnded,
    purchaseCtaLabel,
  }
}
