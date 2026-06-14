import { ConnectButton } from 'thirdweb/react'
import {
  appMetadata,
  defaultChain,
  supportedChains,
  thirdwebClient,
  walletConnectProjectId,
} from '../web3/thirdweb'
import { useI18n } from '../i18n/use-i18n'
import { cn } from '~/lib/utils'

const walletLabelClass = 'inline-flex items-center gap-2'

const walletStatusDotClass =
  'aspect-square w-2 shrink-0 rounded-full bg-success'

const walletGlyphClass = cn(
  'relative aspect-[16/13] w-4 shrink-0 rounded border-[1.5px] border-primary',
  'after:absolute after:right-0.5 after:top-[3px] after:aspect-square after:w-[5px] after:rounded-full after:bg-primary after:content-[""]',
)

export function WalletConnectChip({
  connected = false,
  label,
  variant = 'pill',
}: {
  connected?: boolean
  label: string
  variant?: 'pill' | 'primary' | 'inline'
}) {
  const { messages: t } = useI18n()
  const buttonClassName =
    variant === 'primary'
      ? 'aegis-thirdweb-button aegis-thirdweb-button-primary'
      : variant === 'inline'
        ? 'aegis-thirdweb-button aegis-thirdweb-button-inline'
        : 'aegis-thirdweb-button'

  return (
    <div className="inline-flex items-center">
      <ConnectButton
        appMetadata={appMetadata}
        autoConnect={{ timeout: 15_000 }}
        chain={defaultChain}
        chains={[...supportedChains]}
        client={thirdwebClient}
        connectButton={{
          label: (
            <span className={walletLabelClass}>
              {variant !== 'primary' ? (
                <span
                  className={connected ? walletStatusDotClass : walletGlyphClass}
                  aria-hidden="true"
                />
              ) : null}
              {label}
            </span>
          ),
          className: buttonClassName,
        }}
        connectModal={{
          showThirdwebBranding: false,
          size: 'compact',
          title: t.wallet.connectTitle,
          titleIcon: '',
        }}
        detailsButton={{
          connectedAccountName: (
            <span className={walletLabelClass}>
              <span className={walletStatusDotClass} aria-hidden="true" />
              {label}
            </span>
          ),
          className: buttonClassName,
        }}
        detailsModal={{
          networkSelector: {
            sections: [{ label: t.wallet.supportedNetwork, chains: [...supportedChains] }],
          },
        }}
        hiddenWallets={['inApp']}
        showAllWallets={false}
        theme="light"
        walletConnect={
          walletConnectProjectId ? { projectId: walletConnectProjectId } : undefined
        }
      />
    </div>
  )
}
