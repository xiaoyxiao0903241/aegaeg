import { useEffect, useState } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { LogOut, Wallet, X } from 'lucide-react'
import { useActiveAccount, useActiveWallet, useDisconnect } from 'thirdweb/react'
import { getWalletBalance, type GetWalletBalanceResult } from 'thirdweb/wallets'
import { BSC_CONTRACTS } from '../../config/contracts'
import { formatTokenAmount } from '../../lib/swap/token-amount'
import { readErc20Balance } from '../../web3/swap-read'
import { useI18n } from '../../i18n/use-i18n'
import { useAuth } from '../../providers/auth-provider'
import { hasWalletAccount } from '../../lib/web3/wallet-connection-state'
import { dappAssets } from '../assets'
import { formatAddress } from '../utils'
import { defaultChain, thirdwebClient } from '../../web3/thirdweb'
import { cn } from '~/lib/utils'
import { dappButtonClass } from '~/lib/dapp-styles'
import {
  AegisResponsiveDialog,
  AegisSheetHandle,
} from '../../components/aegis-responsive-dialog'
import { WalletConnectModal } from './wallet-connect-modal'

interface WalletTokenBalanceRow {
  symbol: string
  label: string
  value: string
}

export function WalletDetailsModal({
  onOpenChange,
  open,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  const { disconnect } = useDisconnect()
  const { logout } = useAuth()
  const { messages: t } = useI18n()
  const [copied, setCopied] = useState(false)
  const [connectOpen, setConnectOpen] = useState(false)
  const [nativeBalance, setNativeBalance] = useState<GetWalletBalanceResult | null>(null)
  const [nativeBalanceLoading, setNativeBalanceLoading] = useState(false)
  const [tokenBalances, setTokenBalances] = useState<WalletTokenBalanceRow[]>([])
  const [tokensLoading, setTokensLoading] = useState(false)
  const walletAddress = account?.address
  const walletReady = hasWalletAccount(account)

  useEffect(() => {
    if (!open) {
      setCopied(false)
    }
  }, [open])

  useEffect(() => {
    if (!open || !walletAddress) {
      setNativeBalance(null)
      setNativeBalanceLoading(false)
      return
    }

    let cancelled = false
    setNativeBalanceLoading(true)

    void getWalletBalance({
      address: walletAddress,
      chain: defaultChain,
      client: thirdwebClient,
    })
      .then((result) => {
        if (!cancelled) {
          setNativeBalance(result)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setNativeBalance(null)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setNativeBalanceLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [open, walletAddress])

  useEffect(() => {
    if (!open || !walletAddress) {
      setTokenBalances([])
      setTokensLoading(false)
      return
    }

    let cancelled = false
    setTokensLoading(true)

    void Promise.all([
      readErc20Balance(BSC_CONTRACTS.usd1, walletAddress),
      readErc20Balance(BSC_CONTRACTS.xxToken, walletAddress),
    ])
      .then(([usd1, xx]) => {
        if (cancelled) return

        setTokenBalances([
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
      })
      .catch(() => {
        if (!cancelled) {
          setTokenBalances([])
        }
      })
      .finally(() => {
        if (!cancelled) {
          setTokensLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [open, walletAddress])

  if (!walletAddress) {
    return null
  }

  const addressLabel = formatAddress(walletAddress)
  const balanceValue = nativeBalanceLoading ? '…' : nativeBalance ? nativeBalance.displayValue : '—'
  const balanceSymbol = nativeBalance?.symbol ?? ''

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(walletAddress)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      setCopied(false)
    }
  }

  async function handleDisconnect() {
    if (wallet) {
      await disconnect(wallet)
    }
    logout()
    onOpenChange(false)
  }

  return (
    <AegisResponsiveDialog
      onOpenChange={onOpenChange}
      open={open}
      overlayClassName="bg-[oklch(13%_0.02_264/45%)] backdrop-blur-sm"
      className={cn(
        'w-[min(calc(100%-40px),380px)] max-[820px]:w-full',
        'max-[820px]:rounded-t-[24px] max-[820px]:border-x-0 max-[820px]:border-b-0 max-[820px]:border-t',
        'max-[820px]:px-6 max-[820px]:pb-[max(24px,env(safe-area-inset-bottom))] max-[820px]:pt-3',
        'min-[821px]:rounded-[24px] min-[821px]:border min-[821px]:border-border/80 min-[821px]:px-7 min-[821px]:pb-7 min-[821px]:pt-[34px]',
        'text-center',
        'bg-[linear-gradient(165deg,oklch(100%_0_0/96%),oklch(100%_0_0/86%))] backdrop-blur-xl',
        'min-[821px]:shadow-[0_30px_80px_oklch(15%_0.02_270/35%)]',
      )}
    >
      <AegisSheetHandle />

      <DialogPrimitive.Close
        aria-label={t.common.close}
        className={cn(
          'absolute right-4 top-4 grid size-[34px] cursor-pointer place-items-center rounded-full',
          'border border-border bg-card text-foreground transition-[border-color,transform] duration-180 ease-out',
          'hover:-translate-y-px hover:border-foreground focus-visible:border-foreground focus-visible:outline-none',
          'max-[820px]:top-5',
        )}
        type="button"
      >
        <X aria-hidden className="size-3.5" strokeWidth={2} />
      </DialogPrimitive.Close>

      <div
        aria-hidden="true"
        className="mx-auto mb-5 mt-2 grid size-[78px] place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_14px_34px_oklch(66.83%_0.1625_36.6/40%),inset_0_1px_0_oklch(100%_0_0/50%)] min-[821px]:mt-0"
      >
        <Wallet className="size-[34px]" strokeWidth={1.75} />
      </div>

      <DialogPrimitive.Title className="m-0 text-[21px] font-extrabold leading-[1.2] tracking-[0.01em] text-foreground tabular-nums">
        {addressLabel}
      </DialogPrimitive.Title>

      {!walletReady ? (
        <p className="m-0 mt-3 text-[13px] font-medium leading-[1.45] text-primary">
          {t.wallet.reconnectHint}
        </p>
      ) : null}

      <p className="m-0 mt-3 text-[15px] font-semibold leading-none text-muted-foreground">
        <span className="mr-1.5 text-[17px] font-bold text-primary tabular-nums">
          {balanceValue}
        </span>
        {balanceSymbol}
      </p>

      {tokenBalances.length > 0 ? (
        <div className="mt-4 grid gap-2 text-left">
          {tokenBalances.map((token) => (
            <div
              className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-card/60 px-3.5 py-2.5"
              key={token.symbol}
            >
              <span className="text-xs font-semibold text-muted-foreground">{token.label}</span>
              <strong className="text-sm font-bold tabular-nums text-foreground">
                {tokensLoading ? '…' : token.value}
              </strong>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-6 grid gap-2.5">
        {!walletReady ? (
          <>
            <button
              className={cn(
                dappButtonClass('capsule', 'primary'),
                'h-[46px] gap-2 px-3 text-sm',
              )}
              onClick={() => setConnectOpen(true)}
              type="button"
            >
              {t.wallet.reconnectWallet}
            </button>
            <button
              className={cn(
                dappButtonClass('capsule', 'secondary'),
                'h-[46px] gap-2 px-3 text-sm',
              )}
              onClick={() => void handleDisconnect()}
              type="button"
            >
              <LogOut aria-hidden className="size-[15px]" strokeWidth={2} />
              {t.wallet.disconnect}
            </button>
          </>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            <button
              className={cn(
                dappButtonClass('capsule', 'primary'),
                'h-[46px] gap-2 px-3 text-sm',
              )}
              onClick={() => void handleCopy()}
              type="button"
            >
              <img
                alt=""
                aria-hidden="true"
                className="size-[15px]"
                height="15"
                src={copied ? dappAssets.check : dappAssets.copyWhite}
                width="15"
              />
              {copied ? t.wallet.copied : t.wallet.copyAddress}
            </button>
            <button
              className={cn(
                dappButtonClass('capsule', 'secondary'),
                'h-[46px] gap-2 px-3 text-sm',
              )}
              onClick={() => void handleDisconnect()}
              type="button"
            >
              <LogOut aria-hidden className="size-[15px]" strokeWidth={2} />
              {t.wallet.disconnect}
            </button>
          </div>
        )}
      </div>
      <WalletConnectModal onOpenChange={setConnectOpen} open={connectOpen} />
    </AegisResponsiveDialog>
  )
}
