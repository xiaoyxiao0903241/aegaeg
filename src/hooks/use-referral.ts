import { useQuery } from '@tanstack/react-query'
import { useActiveAccount, useActiveWallet } from 'thirdweb/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { parseReferrerFromSearch } from '~/config/referral'
import { formatCount, formatShortAddress } from '~/lib/api/format-display'
import { QUERY_STALE_TIME } from '~/lib/query/query-client'
import { queryKeys } from '~/lib/query/query-keys'
import {
  readIsBindReferral,
  readReferralCount,
  readReferrer,
} from '~/web3/referral-read'
import { bindReferrer } from '~/web3/referral-write'
import { GENESIS_PURCHASE_ERROR, REFERRAL_BIND_ERROR } from '~/lib/web3/resolve-contract-error-message'
import { useDappActions } from '~/stores/dapp-actions'
import { useChainReadClient } from '~/hooks/use-chain-read-client'

const BIND_COOLDOWN_MS = 5_000

export function useReferral(sessionReady: boolean) {
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  const afterReferralBind = useDappActions((state) => state.afterReferralBind)
  const readClient = useChainReadClient()
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
  const [isBindCooldown, setIsBindCooldown] = useState(false)
  const bindCooldownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Store the raw error so resolveReferralBindError can read the revert selector.
  const [error, setError] = useState<unknown>(null)

  const address = account?.address
  const walletReady = Boolean(address)

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

  useEffect(() => {
    setReferrerInput(pendingReferrer ?? '')
    setError(null)
    setIsBindCooldown(false)
    if (bindCooldownTimerRef.current) {
      clearTimeout(bindCooldownTimerRef.current)
      bindCooldownTimerRef.current = null
    }
  }, [address, pendingReferrer])

  const referralQuery = useQuery({
    queryKey: queryKeys.chain.referral(address ?? ''),
    queryFn: async () => {
      const [isBound, referrer, directCount] = await Promise.all([
        readIsBindReferral(address!, readClient),
        readReferrer(address!, readClient),
        readReferralCount(address!, readClient),
      ])
      return { isBound, referrer, directCount }
    },
    enabled: sessionReady && Boolean(address),
    staleTime: QUERY_STALE_TIME.balances,
  })

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
    if (isBindCooldown || isSubmitting) return false

    startBindCooldown()

    if (!account || !wallet) {
      setError(GENESIS_PURCHASE_ERROR.WALLET_NOT_CONNECTED)
      return false
    }

    const target = (referrerInput.trim() || pendingReferrer) as `0x${string}` | null
    if (!target || !/^0x[a-fA-F0-9]{40}$/.test(target)) {
      setError(REFERRAL_BIND_ERROR.INVALID_PARENT)
      return false
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const parentBound = await readIsBindReferral(target, readClient)
      if (!parentBound) {
        setError(REFERRAL_BIND_ERROR.PARENT_NOT_BOUND)
        return false
      }

      await bindReferrer({ wallet, referrer: target })
      afterReferralBind()
      return true
    } catch (caught) {
      setError(caught)
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [
    account,
    afterReferralBind,
    isBindCooldown,
    isSubmitting,
    pendingReferrer,
    readClient,
    referrerInput,
    startBindCooldown,
    wallet,
  ])

  const refresh = useCallback(async () => {
    await referralQuery.refetch()
  }, [referralQuery])

  return {
    isBound,
    referrer: effectiveReferrer,
    referrerLabel: effectiveReferrer ? formatShortAddress(effectiveReferrer) : null,
    directCount: formatCount(directCount),
    referrerInput,
    setReferrerInput,
    isLoading: referralQuery.isLoading,
    isSubmitting,
    isBindCooldown,
    walletReady,
    canBind:
      sessionReady &&
      walletReady &&
      !isBound &&
      !isSubmitting &&
      !isBindCooldown &&
      Boolean(referrerInput.trim() || pendingReferrer),
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
