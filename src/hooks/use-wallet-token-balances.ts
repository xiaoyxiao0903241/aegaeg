import { useActiveAccount } from 'thirdweb/react'
import { useCallback, useEffect, useState } from 'react'
import { BSC_CONTRACTS } from '../config/contracts'
import { formatTokenAmount } from '../lib/swap/token-amount'
import { readErc20Balance } from '../web3/swap-read'

export interface WalletTokenBalance {
  symbol: string
  label: string
  value: string
}

export function useWalletTokenBalances(enabled = true) {
  const account = useActiveAccount()
  const [balances, setBalances] = useState<WalletTokenBalance[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!enabled || !account?.address) {
      setBalances([])
      return
    }

    setIsLoading(true)

    try {
      const [usd1, xx] = await Promise.all([
        readErc20Balance(BSC_CONTRACTS.usd1, account.address),
        readErc20Balance(BSC_CONTRACTS.xxToken, account.address),
      ])

      setBalances([
        {
          symbol: 'USD1',
          label: 'USD1',
          value: formatTokenAmount(usd1, 18, 4),
        },
        {
          symbol: 'USDT',
          label: 'XX (USDT)',
          value: formatTokenAmount(xx, 18, 4),
        },
      ])
    } catch {
      setBalances([])
    } finally {
      setIsLoading(false)
    }
  }, [account?.address, enabled])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { balances, isLoading, refresh }
}
