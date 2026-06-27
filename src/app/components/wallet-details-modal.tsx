import { useEffect, useState } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { LogOut, Wallet, X } from 'lucide-react'
import { useActiveAccount, useActiveWallet, useDisconnect } from 'thirdweb/react'
import { getWalletBalance } from 'thirdweb/wallets'
import { BSC_CONTRACTS } from '~/config/contracts'
import { formatTokenAmount } from '~/lib/swap/token-amount'
import { readErc20Balance } from '~/web3/swap-read'
import { useI18n } from '~/i18n/use-i18n'
import { useAuth } from '~/providers/auth-provider'
import { hasWalletAccount } from '~/lib/web3/wallet-connection-state'
import { dappAssets } from '~/app/assets'
import { DappIcon } from '~/app/components/dapp-icon'
import { dappIconClass } from '~/app/dapp-icon-scale'
import { formatAddress } from '~/app/utils'
import { defaultChain, thirdwebClient } from '~/web3/thirdweb'
import { Button } from '~/components/button'
import { cn } from '~/lib/utils'
import {
  AegisResponsiveDialog,
  AegisSheetHandle,
} from '~/components/aegis-responsive-dialog'
import { WalletConnectModal } from '~/app/components/wallet-connect-modal'

interface WalletTokenBalanceRow {
  symbol: string
  label: string
  value: string
}

const WALLET_TOKEN_DEFINITIONS = [
  { symbol: 'USD1', label: 'USD1' },
  { symbol: 'USDT', label: 'XX (USDT)' },
] as const

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
  const { clearAuthOnDisconnect } = useAuth()
  const { messages: t } = useI18n()
  const [copied, setCopied] = useState(false)
  const [connectOpen, setConnectOpen] = useState(false)
  const [nativeBalance, setNativeBalance] = useState<Awaited<
    ReturnType<typeof getWalletBalance>
  > | null>(null)
  const [nativeBalanceLoading, setNativeBalanceLoading] = useState(false)
  const [tokenBalances, setTokenBalances] = useState<WalletTokenBalanceRow[]>([])
  const [tokensFetched, setTokensFetched] = useState(false)
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
      setTokensFetched(false)
      return
    }

    let cancelled = false
    setTokensFetched(false)

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
          setTokensFetched(true)
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
  const balanceValue = nativeBalanceLoading
    ? '…'
    : nativeBalance
      ? new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 }).format(
          Number(nativeBalance.displayValue),
        )
      : '—'
  const balanceSymbol = nativeBalance?.symbol ?? defaultChain.nativeCurrency?.symbol ?? 'BNB'
  const displayTokenRows = WALLET_TOKEN_DEFINITIONS.map((definition) => {
    const loaded = tokenBalances.find((token) => token.symbol === definition.symbol)
    return {
      ...definition,
      value: !tokensFetched ? '…' : loaded?.value ?? '—',
    }
  })

  async function handleCopy() {
    if (!walletAddress) return
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
    clearAuthOnDisconnect()
    onOpenChange(false)
  }

  return (
    <AegisResponsiveDialog
      onOpenChange={onOpenChange}
      open={open}
      overlayClassName="bg-[oklch(13%_0.02_264/45%)] backdrop-blur-sm"
      className={cn(
        'w-full max-w-md max-dapp:w-full',
        'max-dapp:rounded-t-lg max-dapp:border-x-0 max-dapp:border-b-0 max-dapp:border-t',
        'max-dapp:px-6 max-dapp:pb-[max(24px,env(safe-area-inset-bottom))] max-dapp:pt-3',
        'dapp:rounded-lg dapp:border dapp:border-border/80 dapp:px-7 dapp:pb-7 dapp:pt-8',
        'text-center',
        'bg-[linear-gradient(165deg,oklch(100%_0_0/96%),oklch(100%_0_0/86%))] backdrop-blur-xl',
        'dapp:shadow-[0_1.875rem_5rem_oklch(15%_0.02_270/35%)]',
      )}
    >
      <AegisSheetHandle />

      <DialogPrimitive.Close
        aria-label={t.common.close}
        className={cn(
          'absolute right-4 top-4 grid size-8 cursor-pointer place-items-center rounded-full',
          'border border-border bg-card text-foreground transition-[border-color,transform] duration-180 ease-out',
          'hover:-translate-y-px hover:border-foreground focus-visible:border-foreground focus-visible:outline-none',
          'max-dapp:top-5',
        )}
        type="button"
      >
        <X aria-hidden className={dappIconClass.sm} strokeWidth={2} />
      </DialogPrimitive.Close>

      <div
        aria-hidden="true"
        className="mx-auto mb-5 mt-2 grid size-20 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_0.875rem_2.125rem_oklch(66.83%_0.1625_36.6/40%),inset_0_1px_0_oklch(100%_0_0/50%)] dapp:mt-0"
      >
        <Wallet className="size-8" strokeWidth={1.75} />
      </div>

      <DialogPrimitive.Title className="m-0 text-xl font-extrabold leading-[1.2] tracking-[0.01em] text-foreground tabular-nums">
        {addressLabel}
      </DialogPrimitive.Title>

      {!walletReady ? (
        <p className="m-0 mt-3 text-xs font-medium leading-[1.45] text-primary">
          {t.wallet.reconnectHint}
        </p>
      ) : null}

      <p className="m-0 mt-3 text-sm font-semibold leading-none text-muted-foreground">
        <span className="mr-1.5 text-base font-bold text-primary tabular-nums">
          {balanceValue}
        </span>
        {balanceSymbol}
      </p>

      <div className="mt-4 grid gap-2 text-left">
        {displayTokenRows.map((token) => (
          <div
            className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-card/60 px-3.5 py-2.5"
            key={token.symbol}
          >
            <span className="text-xs font-semibold text-muted-foreground">{token.label}</span>
            <strong className="text-sm font-bold tabular-nums text-foreground">{token.value}</strong>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-2.5">
        {!walletReady ? (
          <>
            <Button
              className="h-11 gap-2 px-3 text-sm"
              onClick={() => setConnectOpen(true)}
              size="md"
              type="button"
              variant="primary"
            >
              {t.wallet.reconnectWallet}
            </Button>
            <Button
              className="h-11 gap-2 px-3 text-sm"
              onClick={() => void handleDisconnect()}
              size="md"
              type="button"
              variant="secondary"
            >
              <LogOut aria-hidden className={dappIconClass.sm} strokeWidth={2} />
              {t.wallet.disconnect}
            </Button>
          </>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            <Button
              className="h-11 gap-2 px-3 text-sm"
              onClick={() => void handleCopy()}
              size="md"
              type="button"
              variant="primary"
            >
              <DappIcon
                alt=""
                aria-hidden="true"
                size="action"
                src={copied ? dappAssets.check : dappAssets.copyWhite}
              />
              {copied ? t.wallet.copied : t.wallet.copyAddress}
            </Button>
            <Button
              className="h-11 gap-2 px-3 text-sm"
              onClick={() => void handleDisconnect()}
              size="md"
              type="button"
              variant="secondary"
            >
              <LogOut aria-hidden className={dappIconClass.sm} strokeWidth={2} />
              {t.wallet.disconnect}
            </Button>
          </div>
        )}
      </div>
      <WalletConnectModal onOpenChange={setConnectOpen} open={connectOpen} />
    </AegisResponsiveDialog>
  )
}
