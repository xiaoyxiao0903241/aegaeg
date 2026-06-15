import { useActiveAccount } from 'thirdweb/react'
import { cn } from '~/lib/utils'
import { AnchoredTooltip } from '../components/anchored-tooltip'
import { useI18n } from '../i18n/use-i18n'
import { dappAssets } from './assets'
import { WalletConnectChip } from './wallet-connect-chip'

const networkPillClass = cn(
  'inline-flex h-9 min-h-9 cursor-default items-center justify-center gap-2 rounded-full border border-border bg-background px-3.5',
  'text-[13px] font-semibold leading-none tracking-normal shadow-none',
  'max-[820px]:h-[30px] max-[820px]:min-h-[30px] max-[820px]:px-3 max-[820px]:text-[11px]',
)

export function WalletTopbarActions() {
  const account = useActiveAccount()
  const { messages: t } = useI18n()
  const connected = Boolean(account)

  if (connected) {
    return (
      <>
        <AnchoredTooltip content={t.nav.bscTooltip} position="bottom">
          <div className={networkPillClass} aria-label={t.topbar.currentNetwork}>
            <img
              className="block aspect-square w-[18px] flex-none rounded-full object-contain"
              src={dappAssets.bsc}
              alt=""
              width="18"
              height="18"
            />
            {t.common.bsc}
          </div>
        </AnchoredTooltip>
        <WalletConnectChip variant="connected" />
      </>
    )
  }

  return <WalletConnectChip label={t.common.connectWallet} variant="primary" />
}
