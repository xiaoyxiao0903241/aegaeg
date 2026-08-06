import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { usePerformance } from '~/hooks/use-api-data'
import { useChainMutation } from '~/hooks/use-chain-mutation'
import { useChainQuery } from '~/hooks/use-chain-query'
import { useDappHost } from '~/hooks/use-dapp-host'
import { invalidateAfterReferralBind } from '~/shared/api/query/invalidate'
import { queryKeys } from '~/shared/api/query/query-keys'
import type { Address } from '~/shared/config/contracts'
import {
  displayReferrer,
  parseReferrerAddress,
  parseReferrerFromSearch,
} from '~/shared/config/referral'
import { formatNumber } from '~/shared/presenters/format'
import { readAndClearBindSuccess } from '~/views/dapp/community/shared'
import { REFERRAL_BIND_ERROR } from '~/web3/contract-error-message'
import { readIsBindReferral, readReferralCount, readReferrer } from '~/web3/referral/referral-read'
import { bindReferrer } from '~/web3/referral/referral-write'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'

const BIND_COOLDOWN_MS = 5_000
const PENDING_REFERRER_KEY = 'aegis.pendingReferrer'

function readStoredPendingReferrer(): Address | null {
  return parseReferrerAddress(sessionStorage.getItem(PENDING_REFERRER_KEY))
}

function readPendingReferrerFromEnvironment(): Address | null {
  return parseReferrerFromSearch(window.location.search) ?? readStoredPendingReferrer()
}

/**
 * 推荐关系状态与绑定操作
 *
 * 链上读取是否已绑定、推荐人与直邀数；绑定前校验目标推荐人已绑定，
 * 成功后失效相关查询缓存。绑定有 5 秒冷却，防止重复提交。
 *
 * @see docs/onchain-manual/contracts/referral.md
 */
export function useCommunityReferral() {
  const account = useActiveAccount()
  const [pendingReferrer] = useState(readPendingReferrerFromEnvironment)
  const [referrerInput, setReferrerInput] = useState(() => pendingReferrer ?? '')
  const [isBindCooldown, setIsBindCooldown] = useState(false)
  const bindCooldownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const bindSucceededRef = useRef(false)
  // 这里只存软预检错误；链上错误与未知结果由统一提示展示
  const [error, setError] = useState<unknown>(null)

  const address = account?.address
  const walletReady = Boolean(address)

  useEffect(() => {
    const fromUrl = parseReferrerFromSearch(window.location.search)
    if (fromUrl) {
      sessionStorage.setItem(PENDING_REFERRER_KEY, fromUrl)
    }
  }, [])

  const startBindCooldown = useCallback(() => {
    setIsBindCooldown(true)
    if (bindCooldownTimerRef.current) clearTimeout(bindCooldownTimerRef.current)
    bindCooldownTimerRef.current = setTimeout(() => {
      setIsBindCooldown(false)
      setError(null)
      bindCooldownTimerRef.current = null
    }, BIND_COOLDOWN_MS)
  }, [])

  useEffect(() => {
    return () => {
      if (bindCooldownTimerRef.current) clearTimeout(bindCooldownTimerRef.current)
    }
  }, [])

  const referralQuery = useChainQuery({
    queryKey: queryKeys.chain.referral,
    queryFn: async (addr) => {
      const [isBound, referrer, directCount] = await Promise.all([
        readIsBindReferral(addr),
        readReferrer(addr),
        readReferralCount(addr),
      ])
      return { isBound, referrer, directCount }
    },
    // 链上绑定态：仅需钱包（不要求 SIWE）。
  })
  const { sessionReady } = useDappHost()
  const performanceQuery = usePerformance(sessionReady && Boolean(address))

  const bindMutation = useChainMutation({
    path: WRITE_PATH.REFERRAL_BIND,
    mutation: async (target: Address, session) => {
      const parentBound = await readIsBindReferral(target, session.readClient)
      if (!parentBound) throw REFERRAL_BIND_ERROR.PARENT_NOT_BOUND
      await bindReferrer({ wallet: session.wallet, referrer: target })
    },
    onSuccess: () => {
      bindSucceededRef.current = true
      invalidateAfterReferralBind()
    },
  })

  const isBound = referralQuery.data?.isBound ?? false
  const referrer = referralQuery.data?.referrer ?? null
  const directCount = referralQuery.data?.directCount ?? 0n

  const effectiveReferrer = useMemo(
    () =>
      displayReferrer({
        isBound,
        inviteAddress: performanceQuery.data?.invite_address,
        chainReferrer: referrer,
      }),
    [isBound, performanceQuery.data?.invite_address, referrer],
  )

  const isSubmitting = bindMutation.isPending
  const isLocked = bindMutation.isLocked

  const bind = useCallback(async () => {
    if (isBindCooldown || isSubmitting || isLocked) return false

    startBindCooldown()

    const target = parseReferrerAddress(referrerInput.trim() || pendingReferrer)
    if (!target) {
      setError(REFERRAL_BIND_ERROR.INVALID_PARENT)
      return false
    }

    if (address && target.toLowerCase() === address.toLowerCase()) {
      setError(REFERRAL_BIND_ERROR.SELF_REFERRAL)
      return false
    }

    setError(null)
    bindSucceededRef.current = false
    await bindMutation.mutate(target)
    return readAndClearBindSuccess(bindSucceededRef)
  }, [
    address,
    bindMutation,
    isBindCooldown,
    isLocked,
    isSubmitting,
    pendingReferrer,
    referrerInput,
    startBindCooldown,
  ])

  const refresh = useCallback(async () => {
    await Promise.all([referralQuery.refetch(), performanceQuery.refresh()])
  }, [performanceQuery, referralQuery])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    isBound,
    referrer: effectiveReferrer,
    directCount: formatNumber(directCount, { digits: 0, trimZeros: true }),
    referrerInput,
    setReferrerInput,
    isLoading: referralQuery.isLoading,
    isSubmitting,
    isBindCooldown,
    walletReady,
    canBind:
      walletReady &&
      !isBound &&
      !isSubmitting &&
      !isLocked &&
      !isBindCooldown &&
      Boolean(referrerInput.trim() || pendingReferrer),
    error,
    clearError,
    bind,
    refresh,
  }
}
