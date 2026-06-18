import { useQuery } from '@tanstack/react-query'
import { useActiveAccount } from 'thirdweb/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { REFERRAL_CONFIG, parseReferrerFromSearch } from '~/config/referral'
import { formatShortAddress } from '~/lib/api/format-display'
import { QUERY_STALE_TIME } from '~/lib/query/query-client'
import { queryKeys } from '~/lib/query/query-keys'
import {
  readIsBindReferral,
  readReferralCount,
  readReferrer,
} from '~/web3/referral-read'
import { bindReferrer } from '~/web3/referral-write'
import { GENESIS_PURCHASE_ERROR } from '~/lib/web3/resolve-contract-error-message'
import { useDappActions } from '~/stores/dapp-actions'

export function useReferral(sessionReady: boolean) {
  const account = useActiveAccount()
  const afterReferralBind = useDappActions((state) => state.afterReferralBind)
  const pendingReferrer = useMemo(() => {
    const fromUrl = parseReferrerFromSearch(window.location.search)
    if (fromUrl) {
      sessionStorage.setItem('aegis.pendingReferrer', fromUrl)
      return fromUrl
    }

    const stored = sessionStorage.getItem('aegis.pendingReferrer')
    return stored && /^0x[a-fA-F0-9]{40}$/.test(stored) ? (stored as `0x${string}`) : null
  }, [])
  const [referrerInput, setReferrerInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const address = account?.address
  const walletReady = Boolean(address)

  const referralQuery = useQuery({
    queryKey: queryKeys.chain.referral(address ?? ''),
    queryFn: async () => {
      const [isBound, referrer, directCount] = await Promise.all([
        readIsBindReferral(address!),
        readReferrer(address!),
        readReferralCount(address!),
      ])
      return { isBound, referrer, directCount }
    },
    enabled: sessionReady && Boolean(address),
    staleTime: QUERY_STALE_TIME.balances,
  })

  useEffect(() => {
    if (pendingReferrer) {
      setReferrerInput(pendingReferrer)
    }
  }, [pendingReferrer])

  const isBound = referralQuery.data?.isBound ?? false
  const referrer = referralQuery.data?.referrer ?? null
  const directCount = referralQuery.data?.directCount ?? 0n

  const effectiveReferrer = useMemo(() => {
    if (isBound && referrer && referrer !== '0x0000000000000000000000000000000000000000') {
      return referrer
    }
    return null
  }, [isBound, referrer])

  const bind = useCallback(async () => {
    if (!account) {
      setError(GENESIS_PURCHASE_ERROR.WALLET_NOT_CONNECTED)
      return false
    }

    const target = (referrerInput.trim() || pendingReferrer || REFERRAL_CONFIG.defaultReferrer) as `0x${string}`
    if (!/^0x[a-fA-F0-9]{40}$/.test(target)) {
      setError('Invalid referrer address')
      return false
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await bindReferrer({ account, referrer: target })
      afterReferralBind(account.address)
      return true
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Bind referral failed')
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [account, afterReferralBind, pendingReferrer, referrerInput])

  const refresh = useCallback(async () => {
    await referralQuery.refetch()
  }, [referralQuery])

  return {
    isBound,
    referrer: effectiveReferrer,
    referrerLabel: effectiveReferrer ? formatShortAddress(effectiveReferrer) : null,
    directCount: directCount.toString(),
    referrerInput,
    setReferrerInput,
    isLoading: referralQuery.isLoading,
    isSubmitting,
    walletReady,
    canBind: sessionReady && walletReady && !isBound && !isSubmitting,
    error:
      error ??
      (referralQuery.error instanceof Error
        ? referralQuery.error.message
        : referralQuery.error
          ? 'Failed to load referral data'
          : null),
    bind,
    refresh,
  }
}
