import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Wallet, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { formatTokenAmount } from '~/core/exchange/token-amount'
import { USD1_DECIMALS } from '~/core/presale/presale-math'
import { useAuth } from '~/hooks/use-auth'
import { useI18n } from '~/i18n/use-i18n'
import { formatShortAddress } from '~/shared/api/format-display'
import { Button } from '~/shared/components/button'
import { DialogClose, ResponsiveDialog, SheetHandle } from '~/shared/components/dialog'
import { Icon } from '~/shared/components/icon'
import { Text } from '~/shared/components/text'
import { dappAssets } from '~/shared/config/assets'
import { copyTextToClipboard } from '~/shared/lib/copy-to-clipboard'
import { cn } from '~/shared/lib/utils'
import { WalletConnectModal } from '~/views/dapp/host/wallet/wallet-connect-modal'
import { useUsd1PresaleWalletQuery } from '~/web3/presale/use-presale-queries'
import { useActiveAccount, useActiveWallet, useDisconnect } from '~/web3/thirdweb-react'
import { hasWalletAccount } from '~/web3/wallet/wallet-connection-state'

/**
 * 钱包详情 / 断开连接弹窗（H5 下为底部抽屉）。
 *
 * 展示地址、USD1 余额与复制 / 断开操作，不含代币列表；
 * 未连接时展示重新连接入口。
 */
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
  const { clearLoginErrorOnDisconnect } = useAuth()
  const { messages: t } = useI18n()
  const [copied, setCopied] = useState(false)
  const [connectOpen, setConnectOpen] = useState(false)
  const walletAddress = account?.address
  const walletReady = hasWalletAccount(account)
  const { balanceQuery, usd1Balance } = useUsd1PresaleWalletQuery(open ? walletAddress : undefined)

  const handleOpenChange = (next: boolean) => {
    if (!next) setCopied(false)
    onOpenChange(next)
  }

  if (!walletAddress) {
    return null
  }

  const addressLabel = formatShortAddress(walletAddress)
  const balanceValue = balanceQuery.isPending
    ? '…'
    : balanceQuery.isError
      ? '—'
      : formatTokenAmount(usd1Balance, USD1_DECIMALS, 2)

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
    // 先关闭，让 Radix 播放 data-state=closed 的退场动画（与连接弹窗一致）。
    // 拆除动作延后到 animations.css 中最长的抽屉/弹窗退场时长之后。
    onOpenChange(false)
    window.setTimeout(() => {
      void (async () => {
        if (wallet) {
          await disconnect(wallet)
        }
        clearLoginErrorOnDisconnect()
      })()
    }, 280)
  }

  return (
    <ResponsiveDialog
      onOpenChange={handleOpenChange}
      open={open}
      overlayClassName="bg-modal-overlay backdrop-blur-sm"
      className={cn(
        // PC 居中卡片（与滑点 / 连接弹窗同一套响应式外壳）
        'border-0 bg-card text-center shadow-modal-panel',
        'w-full max-w-(--dapp-wallet-modal-max-width) p-6',
        'dapp:rounded-2xl',
        // H5 底部抽屉：通栏，仅顶部圆角
        'max-dapp:w-full max-dapp:max-w-none',
        'max-dapp:rounded-t-2xl max-dapp:rounded-b-none',
        'max-dapp:border-x-0 max-dapp:border-t max-dapp:border-b-0 max-dapp:border-border',
        'max-dapp:px-6 max-dapp:pt-3 max-dapp:pb-[max(1.5rem,env(safe-area-inset-bottom))]',
      )}
    >
      <SheetHandle />

      <div className="relative flex w-full shrink-0 items-start justify-end">
        <DialogClose aria-label={t.common.close}>
          <X aria-hidden className="size-3.5 shrink-0" strokeWidth={2} />
        </DialogClose>
      </div>

      <div
        aria-hidden="true"
        className="mx-auto mt-1.5 mb-5 grid size-(--dapp-wallet-modal-orb-size) shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-primary-orb"
      >
        <Wallet className="size-(--dapp-wallet-modal-orb-icon) shrink-0" strokeWidth={1.75} />
      </div>

      <DialogPrimitive.Title asChild>
        <Text as="h2" variant="panel" className="m-0 tracking-[0.01em]">
          {addressLabel}
        </Text>
      </DialogPrimitive.Title>

      {!walletReady ? (
        <Text as="p" variant="copy" tone="primary" className="m-0 mt-3">
          {t.wallet.reconnectHint}
        </Text>
      ) : (
        <div className="mt-3 mb-6 flex items-baseline justify-center gap-1">
          <Text
            as="span"
            variant="figure"
            className="text-(length:--dapp-wallet-modal-balance-size) leading-none tracking-[-0.02em] text-coral"
          >
            {balanceValue}
          </Text>
          <Text
            as="span"
            variant="copy"
            className="text-(length:--dapp-wallet-modal-unit-size) leading-none font-semibold tracking-[-0.02em] text-black/40"
          >
            USD1
          </Text>
        </div>
      )}

      <div className={cn('grid gap-2.5', walletReady && 'mt-0', !walletReady && 'mt-6')}>
        {!walletReady ? (
          <>
            <Button
              className="min-h-11.5"
              onClick={() => setConnectOpen(true)}
              size="md"
              type="button"
              variant="primary"
            >
              {t.wallet.reconnectWallet}
            </Button>
            <Button
              className="min-h-11.5"
              onClick={() => void handleDisconnect()}
              size="md"
              type="button"
              variant="secondary"
            >
              {t.wallet.disconnect}
            </Button>
          </>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            <Button
              className="min-h-11.5 gap-2"
              onClick={() => void handleCopy()}
              size="md"
              type="button"
              variant="primary"
            >
              <Icon
                alt=""
                aria-hidden="true"
                size="action"
                src={copied ? dappAssets.check : dappAssets.copyWhite}
              />
              {copied ? t.wallet.copied : t.wallet.copyAddress}
            </Button>
            <Button
              className="min-h-11.5"
              onClick={() => void handleDisconnect()}
              size="md"
              type="button"
              variant="secondary"
            >
              {t.wallet.disconnect}
            </Button>
          </div>
        )}
      </div>
      <WalletConnectModal onOpenChange={setConnectOpen} open={connectOpen} />
    </ResponsiveDialog>
  )
}
