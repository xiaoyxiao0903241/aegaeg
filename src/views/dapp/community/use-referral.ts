import { useQuery } from '@tanstack/react-query'
import { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { parseReferrerFromSearch, resolveDisplayReferrer } from '~/shared/config/referral'
import { formatCount, formatShortAddress } from '~/shared/api/format-display'
import { QUERY_STALE_TIME } from '~/shared/api/query/query-client'
import { queryKeys } from '~/shared/api/query/query-keys'
import { usePerformance } from '~/hooks/use-api-data'
import { useDappShell } from '~/app/use-dapp-shell'
import { readIsBindReferral, readReferralCount, readReferrer } from '~/web3/referral/referral-read'
import { bindReferrer } from '~/web3/referral/referral-write'
import { REFERRAL_BIND_ERROR, WALLET_GATE_ERROR } from '~/web3/resolve-contract-error-message'
import { invalidateAfterReferralBind } from '~/shared/api/query/invalidate'
import { useChainReadClient } from '~/web3/use-chain-read-client'

const BIND_COOLDOWN_MS = 5_000
const PENDING_REFERRER_KEY = 'aegis.pendingReferrer'

function readStoredPendingReferrer(): `0x${string}` | null {
  const stored = sessionStorage.getItem(PENDING_REFERRER_KEY)
  return stored && /^0x[a-fA-F0-9]{40}$/.test(stored) ? (stored as `0x${string}`) : null
}

function readPendingReferrerFromEnvironment(): `0x${string}` | null {
  return parseReferrerFromSearch(window.location.search) ?? readStoredPendingReferrer()
}

export function useReferral() {
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  const readClient = useChainReadClient()
  const [pendingReferrer] = useState(readPendingReferrerFromEnvironment)
  const [referrerInput, setReferrerInput] = useState(() => pendingReferrer ?? '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isBindCooldown, setIsBindCooldown] = useState(false)
  const bindCooldownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Store the raw error so resolveReferralBindError can read the revert selector.
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
    // On-chain bind status — wallet only (SIWE not required).
    enabled: walletReady,
    staleTime: QUERY_STALE_TIME.balances,
  })
  const { sessionReady } = useDappShell()
  const performanceQuery = usePerformance(sessionReady && Boolean(address))

  const isBound = referralQuery.data?.isBound ?? false
  const referrer = referralQuery.data?.referrer ?? null
  const directCount = referralQuery.data?.directCount ?? 0n

  const effectiveReferrer = useMemo(
    () =>
      resolveDisplayReferrer({
        isBound,
        inviteAddress: performanceQuery.data?.invite_address,
        chainReferrer: referrer,
      }),
    [isBound, performanceQuery.data?.invite_address, referrer],
  )

  const bind = useCallback(async () => {
    if (isBindCooldown || isSubmitting) return false

    startBindCooldown()

    if (!account || !wallet) {
      setError(WALLET_GATE_ERROR.NOT_CONNECTED)
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
      invalidateAfterReferralBind()
      return true
    } catch (caught) {
      setError(caught)
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [
    account,
    isBindCooldown,
    isSubmitting,
    pendingReferrer,
    readClient,
    referrerInput,
    startBindCooldown,
    wallet,
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
    referrerLabel: effectiveReferrer ? formatShortAddress(effectiveReferrer) : null,
    directCount: formatCount(directCount),
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
      !isBindCooldown &&
      Boolean(referrerInput.trim() || pendingReferrer),
    error,
    clearError,
    bind,
    refresh,
  }
}
