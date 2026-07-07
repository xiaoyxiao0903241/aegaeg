import { useEffect, useState } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { LogOut, Wallet, X } from 'lucide-react'
import { useActiveAccount, useActiveWallet, useDisconnect } from '~/views/dapp/web3/thirdweb-react'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { formatTokenAmount } from '~/core/swap/token-amount'
import { createWalletReadClient } from '~/views/dapp/web3/chain-read-client'
import { readErc20Balance } from '~/views/dapp/web3/swap-read'
import { useI18n } from '~/i18n/use-i18n'
import { useAuth } from '~/app/bootstrap/auth-provider'
import { hasWalletAccount } from '~/views/dapp/web3/wallet-connection-state'
import { dappAssets } from '~/app/assets'
import { DappIcon } from '~/app/shell/components/dapp-icon'
import { dappIconClass } from '~/app/dapp-icon-scale'
import { formatAddress } from '~/app/utils'
import { Button } from '~/shared/ui/button'
import { Text } from '~/shared/ui/text'
import { toast } from 'sonner'
import { copyTextToClipboard } from '~/shared/lib/copy-to-clipboard'
import { cn } from '~/shared/lib/utils'
import {
  AegisResponsiveDialog,
  AegisSheetHandle,
} from '~/shared/ui/aegis-responsive-dialog'
import { WalletConnectModal } from '~/app/shell/components/wallet-connect-modal'

interface WalletTokenBalanceRow {
  symbol: string
  label: string
  value: string
}

const WALLET_TOKEN_DEFINITIONS = [
  { symbol: 'USD1', label: 'USD1' },
  { symbol: 'USDT', label: 'USDT' },
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
  const [nativeBalance, setNativeBalance] = useState<{
    displayValue: string
    symbol: string
  } | null>(null)
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
    if (!open || !walletAddress || !wallet) {
      setNativeBalance(null)
      setNativeBalanceLoading(false)
      return
    }

    let cancelled = false
    setNativeBalanceLoading(true)

    const readClient = createWalletReadClient(wallet)
    void readClient
      .getBalance({ address: walletAddress as `0x${string}` })
      .then((wei) => {
        if (!cancelled) {
          setNativeBalance({
            displayValue: formatTokenAmount(wei, 18, 4),
            symbol: 'BNB',
          })
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
  }, [open, wallet, walletAddress])

  useEffect(() => {
    if (!open || !walletAddress || !wallet) {
      setTokenBalances([])
      setTokensFetched(false)
      return
    }

    let cancelled = false
    setTokensFetched(false)

    const readClient = createWalletReadClient(wallet)
    void Promise.all([
      readErc20Balance(BSC_CONTRACTS.usd1, walletAddress, readClient),
      readErc20Balance(BSC_CONTRACTS.usdt, walletAddress, readClient),
    ])
      .then(([usd1, usdt]) => {
        if (cancelled) return

        setTokenBalances(
          WALLET_TOKEN_DEFINITIONS.map((token, index) => {
            const raw = index === 0 ? usd1 : usdt
            return {
              symbol: token.symbol,
              label: token.label,
              value: formatTokenAmount(raw, 18, 4),
            }
          }),
        )
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
  }, [open, wallet, walletAddress])

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
  const balanceSymbol = nativeBalance?.symbol ?? 'BNB'
  const displayTokenRows = WALLET_TOKEN_DEFINITIONS.map((definition) => {
    const loaded = tokenBalances.find((token) => token.symbol === definition.symbol)
    return {
      ...definition,
      value: !tokensFetched ? '…' : loaded?.value ?? '—',
    }
  })

  async function handleCopy() {
    if (!walletAddress) return
    const result = await copyTextToClipboard(walletAddress)
    if (result === 'skipped') return
    if (result === 'failed') {
      toast.error(t.wallet.copyFailed)
      return
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
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

      <DialogPrimitive.Title asChild>
        <Text
          as="h2"
          variant="panel-title"
          weight="bold"
          tabular
          className="m-0"
        >
          {addressLabel}
        </Text>
      </DialogPrimitive.Title>

      {!walletReady ? (
        <Text as="p" variant="label" tone="accent" weight="medium" className="m-0 mt-3">
          {t.wallet.reconnectHint}
        </Text>
      ) : null}

      <Text
        as="p"
        variant="body"
        tone="subtle"
        weight="semibold"
        className="m-0 mt-3"
      >
        <Text as="span" variant="body-md" tone="accent" weight="bold" tabular className="mr-1.5">
          {balanceValue}
        </Text>
        {balanceSymbol}
      </Text>

      <div className="mt-4 grid gap-2 text-left">
        {displayTokenRows.map((token) => (
          <div
            className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-card/60 px-3.5 py-2.5"
            key={token.symbol}
          >
            <Text as="span" variant="label" tone="subtle" weight="semibold">
              {token.label}
            </Text>
            <Text as="strong" variant="body" weight="bold" tabular>
              {token.value}
            </Text>
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
              <Text as="span" variant="body">{t.wallet.reconnectWallet}</Text>
            </Button>
            <Button
              className="h-11 gap-2 px-3 text-sm"
              onClick={() => void handleDisconnect()}
              size="md"
              type="button"
              variant="secondary"
            >
              <LogOut aria-hidden className={dappIconClass.sm} strokeWidth={2} />
              <Text as="span" variant="body">{t.wallet.disconnect}</Text>
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
              <Text as="span" variant="body">
                {copied ? t.wallet.copied : t.wallet.copyAddress}
              </Text>
            </Button>
            <Button
              className="h-11 gap-2 px-3 text-sm"
              onClick={() => void handleDisconnect()}
              size="md"
              type="button"
              variant="secondary"
            >
              <LogOut aria-hidden className={dappIconClass.sm} strokeWidth={2} />
              <Text as="span" variant="body">{t.wallet.disconnect}</Text>
            </Button>
          </div>
        )}
      </div>
      <WalletConnectModal onOpenChange={setConnectOpen} open={connectOpen} />
    </AegisResponsiveDialog>
  )
}
