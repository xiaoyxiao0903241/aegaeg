import { useActiveAccount } from 'thirdweb/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { REFERRAL_CONFIG, parseReferrerFromSearch } from '../config/referral'
import { formatShortAddress } from '../lib/api/format-display'
import {
  readIsBindReferral,
  readReferralCount,
  readReferrer,
} from '../web3/referral-read'
import { bindReferrer } from '../web3/referral-write'

export function useReferral(connected: boolean) {
  const account = useActiveAccount()
  const pendingReferrer = useMemo(() => {
    const fromUrl = parseReferrerFromSearch(window.location.search)
    if (fromUrl) {
      sessionStorage.setItem('aegis.pendingReferrer', fromUrl)
      return fromUrl
    }

    const stored = sessionStorage.getItem('aegis.pendingReferrer')
    return stored && /^0x[a-fA-F0-9]{40}$/.test(stored) ? (stored as `0x${string}`) : null
  }, [])
  const [isBound, setIsBound] = useState(false)
  const [referrer, setReferrer] = useState<string | null>(null)
  const [directCount, setDirectCount] = useState<bigint>(0n)
  const [referrerInput, setReferrerInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (pendingReferrer) {
      setReferrerInput(pendingReferrer)
    }
  }, [pendingReferrer])

  const refresh = useCallback(async () => {
    if (!connected || !account?.address) {
      setIsBound(false)
      setReferrer(null)
      setDirectCount(0n)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const [bound, ref, count] = await Promise.all([
        readIsBindReferral(account.address),
        readReferrer(account.address),
        readReferralCount(account.address),
      ])

      setIsBound(bound)
      setReferrer(ref)
      setDirectCount(count)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Failed to load referral data')
    } finally {
      setIsLoading(false)
    }
  }, [account?.address, connected])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const effectiveReferrer = useMemo(() => {
    if (isBound && referrer && referrer !== '0x0000000000000000000000000000000000000000') {
      return referrer
    }
    return null
  }, [isBound, referrer])

  const bind = useCallback(async () => {
    if (!account) return false

    const target = (referrerInput.trim() || pendingReferrer || REFERRAL_CONFIG.defaultReferrer) as `0x${string}`
    if (!/^0x[a-fA-F0-9]{40}$/.test(target)) {
      setError('Invalid referrer address')
      return false
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await bindReferrer({ account, referrer: target })
      await refresh()
      return true
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Bind referral failed')
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [account, pendingReferrer, referrerInput, refresh])

  return {
    isBound,
    referrer: effectiveReferrer,
    referrerLabel: effectiveReferrer ? formatShortAddress(effectiveReferrer) : null,
    directCount: directCount.toString(),
    referrerInput,
    setReferrerInput,
    isLoading,
    isSubmitting,
    error,
    bind,
    refresh,
  }
}
