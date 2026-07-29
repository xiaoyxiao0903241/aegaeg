import { toast } from 'sonner'
import { useI18n } from '~/i18n/use-i18n'
import { dappAssets } from '~/app/assets'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappActionRow } from '~/app/shell/dapp-action-row'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { useDappShell } from '~/app/use-dapp-shell'
import { AmountBox } from '~/shared/ui/amount-box'
import { FieldActionChip } from '~/shared/ui/chip'
import { Text } from '~/shared/ui/text'
import { bscscanAddress } from '~/shared/config/explorer'
import { ExchangeMetaPanel } from '~/views/dapp/exchange/exchange-meta-panel'
import { ExchangeWidgetBody } from '~/views/dapp/exchange/exchange-widget-composites'
import { StakingSubpageHeader } from '~/views/dapp/staking/staking-subpage-header'
import { useXmineWidget } from '~/views/dapp/staking/xmine/use-xmine-widget'
import { XMINE_GATE_ERROR } from '~/views/dapp/staking/xmine/submit-xmine'
import { presentUserFacingError } from '~/web3/present-user-facing-error'
import { readErrorText } from '~/web3/errors/error-text'
import { resolveWalletTransactionError } from '~/web3/resolve-contract-error-message'

export function XmineWidget() {
  const { messages: t } = useI18n()
  const { sessionReady, walletReady } = useDappShell()
  const xmine = useXmineWidget(sessionReady)

  function resolveMessage(error: unknown) {
    const raw = readErrorText(error)
    if (raw === XMINE_GATE_ERROR.insufficientBalance) return t.staking.gates.insufficientGagx
    if (raw === XMINE_GATE_ERROR.insufficientAllowance) return t.staking.gates.insufficientAllowance
    if (raw === XMINE_GATE_ERROR.insufficientQuota) return t.staking.gates.insufficientQuota
    if (raw === XMINE_GATE_ERROR.zeroAmount) return t.staking.gates.zeroAmount
    if (raw === XMINE_GATE_ERROR.unavailable) return t.staking.gates.unavailable
    return (
      resolveWalletTransactionError(error, t.wallet.transactionErrors) ?? t.errors.chain.fallback
    )
  }

  async function handleSubmit() {
    const result = await xmine.submit()
    if (result.ok) {
      toast.success(t.staking.xmine.success)
      return
    }
    if (result.error != null) presentUserFacingError(result.error, resolveMessage)
  }

  return (
    <>
      <StakingSubpageHeader subtitle={t.staking.xmine.intro} title={t.staking.xmine.title} />
      <ExchangeWidgetBody>
        <AmountBox
          amountProps={{
            'aria-label': t.staking.xmine.amountAria,
            inputMode: 'decimal',
            onChange: (event) => xmine.setAmount(event.target.value),
            placeholder: '0',
            value: xmine.amountDisplay,
          }}
          balance={
            <>
              {t.staking.balance}: {xmine.isBalancesLoading ? '…' : xmine.balanceLabel}
            </>
          }
          endAdornment={
            <FieldActionChip disabled={!walletReady || xmine.isSubmitting} onClick={xmine.fillMax}>
              {t.staking.max}
            </FieldActionChip>
          }
          label={t.staking.amount}
          sessionReady={sessionReady}
          startAdornment={
            <span className="flex items-center gap-2">
              <DappIcon alt="" size="md" src={dappAssets.tokenGagx} />
              <Text as="span" className="font-semibold" variant="copy">
                gAGX
              </Text>
            </span>
          }
        />

        <ExchangeMetaPanel
          items={[
            { label: t.staking.xmine.meta.quota, value: xmine.quotaLabel },
            { label: t.staking.xmine.meta.daily, value: '—' },
            { label: t.staking.xmine.meta.max, value: '—' },
            { label: t.staking.xmine.meta.h24, value: '—' },
            {
              label: t.staking.xmine.meta.contract,
              value: (
                <a
                  className="text-primary underline-offset-2 hover:underline"
                  href={bscscanAddress(xmine.pool)}
                  rel="noreferrer"
                  target="_blank"
                >
                  {t.staking.viewContract}
                </a>
              ),
            },
          ]}
        />

        {walletReady ? (
          <DappActionRow>
            <DappActionButton
              density="external"
              disabled={!xmine.canSubmit}
              loading={xmine.isSubmitting}
              onClick={() => void handleSubmit()}
            >
              {t.staking.xmine.submit}
            </DappActionButton>
          </DappActionRow>
        ) : (
          <DappWidgetConnectPromo />
        )}
      </ExchangeWidgetBody>
    </>
  )
}
