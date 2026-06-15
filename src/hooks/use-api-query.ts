import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../lib/api/client'
import { isUnauthorizedError } from '../lib/api/auth/login-with-wallet'
import { useAuth } from '../providers/auth-provider'

interface UseApiQueryState<T> {
  data: T | null
  error: string | null
  isLoading: boolean
  refresh: () => Promise<void>
}

export function useApiQuery<T>(
  fetcher: (token: string) => Promise<T>,
  enabled = true,
): UseApiQueryState<T> {
  const { token, logout } = useAuth()
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!enabled || !token) {
      setData(null)
      setError(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await fetcher(token)
      setData(result)
    } catch (caught) {
      if (isUnauthorizedError(caught)) {
        logout()
      }

      if (caught instanceof ApiError) {
        setError(caught.message)
      } else if (caught instanceof Error) {
        setError(caught.message)
      } else {
        setError('Request failed')
      }

      setData(null)
    } finally {
      setIsLoading(false)
    }
  }, [enabled, fetcher, logout, token])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { data, error, isLoading, refresh }
}
