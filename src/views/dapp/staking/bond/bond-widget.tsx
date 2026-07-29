import { toast } from 'sonner'
import { useI18n } from '~/i18n/use-i18n'
import { dappAssets } from '~/app/assets'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappActionRow } from '~/app/shell/dapp-action-row'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { useDappShell } from '~/app/use-dapp-shell'
import { useDappShellStore } from '~/stores/dapp-shell-store'
import { AmountBox } from '~/shared/ui/amount-box'
import { FieldActionChip } from '~/shared/ui/chip'
import { Segment } from '~/shared/ui/segment'
import { Text } from '~/shared/ui/text'
import { bscscanAddress } from '~/shared/config/explorer'
import { ExchangeMetaPanel } from '~/views/dapp/exchange/exchange-meta-panel'
import { ExchangeWidgetBody } from '~/views/dapp/exchange/exchange-widget-composites'
import { StakingSubpageHeader } from '~/views/dapp/staking/staking-subpage-header'
import { useBondWidget } from '~/views/dapp/staking/bond/use-bond-widget'
import { BOND_ZAP_GATE_ERROR, type BondKind } from '~/views/dapp/staking/bond/submit-bond-zap'
import { presentUserFacingError } from '~/web3/present-user-facing-error'
import { readErrorText } from '~/web3/errors/error-text'
import { resolveWalletTransactionError } from '~/web3/resolve-contract-error-message'

export function BondWidget({ kind }: { kind: BondKind }) {
  const { messages: t } = useI18n()
  const { sessionReady, walletReady } = useDappShell()
  const bond = useBondWidget(kind, sessionReady)
  const selectTab = useDappShellStore((state) => state.selectTab)
  const copy = kind === 'lp' ? t.staking.lpbond : t.staking.burnbond

  const periodOptions = [
    { label: t.staking.stake.periods.d180, value: '180' },
    { label: t.staking.stake.periods.d360, value: '360' },
    { label: t.staking.stake.periods.d540, value: '540' },
  ]

  function resolveMessage(error: unknown) {
    const raw = readErrorText(error)
    if (raw === BOND_ZAP_GATE_ERROR.notBound) return t.staking.gates.notBound
    if (raw === BOND_ZAP_GATE_ERROR.insufficientBalance) return t.staking.gates.insufficientBalance
    if (raw === BOND_ZAP_GATE_ERROR.insufficientAllowance)
      return t.staking.gates.insufficientAllowance
    if (raw === BOND_ZAP_GATE_ERROR.depositoryNotAuth) return t.staking.gates.depositoryNotAuth
    if (raw === BOND_ZAP_GATE_ERROR.zeroAmount) return t.staking.gates.zeroAmount
    if (raw === BOND_ZAP_GATE_ERROR.unavailable) return t.staking.gates.unavailable
    return (
      resolveWalletTransactionError(error, t.wallet.transactionErrors) ?? t.errors.chain.fallback
    )
  }

  async function handleSubmit() {
    if (bond.gate === 'notBound') {
      selectTab('community')
      return
    }
    const result = await bond.submit()
    if (result.ok) {
      toast.success(copy.success)
      return
    }
    if (result.error != null) {
      const raw = readErrorText(result.error)
      if (raw === BOND_ZAP_GATE_ERROR.notBound) {
        selectTab('community')
        return
      }
      presentUserFacingError(result.error, resolveMessage)
    }
  }

  const ctaLabel = bond.gate === 'notBound' ? t.staking.stake.bindCta : copy.submit

  return (
    <>
      <StakingSubpageHeader subtitle={copy.intro} title={copy.title} />
      <ExchangeWidgetBody>
        <Segment
          aria-label={copy.periodAria}
          onChange={bond.setPeriod}
          options={periodOptions}
          tone="coral"
          value={bond.period}
        />

        <AmountBox
          amountProps={{
            'aria-label': copy.amountAria,
            inputMode: 'decimal',
            onChange: (event) => bond.setAmount(event.target.value),
            placeholder: '0',
            value: bond.amountDisplay,
          }}
          balance={
            <>
              {t.staking.balance}: {bond.isBalancesLoading ? '…' : bond.balanceLabel}
            </>
          }
          endAdornment={
            <FieldActionChip disabled={!walletReady || bond.isSubmitting} onClick={bond.fillMax}>
              {t.staking.max}
            </FieldActionChip>
          }
          label={t.staking.amount}
          sessionReady={sessionReady}
          startAdornment={
            <span className="flex items-center gap-2">
              <DappIcon alt="" size="md" src={dappAssets.tokenUsd1} />
              <Text as="span" className="font-semibold" variant="copy">
                USD1
              </Text>
            </span>
          }
        />

        <ExchangeMetaPanel
          items={[
            { label: copy.meta.discount, value: '—' },
            { label: copy.meta.slippage, value: '—' },
            { label: copy.meta.pay, value: bond.amountDisplay || '—' },
            { label: copy.meta.receive, value: '—' },
            { label: copy.meta.cap, value: '—' },
            { label: copy.meta.release, value: `${bond.period}d` },
            {
              label: copy.meta.contract,
              value: (
                <a
                  className="text-primary underline-offset-2 hover:underline"
                  href={bscscanAddress(bond.depository)}
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
              disabled={!bond.canSubmit && bond.gate !== 'notBound'}
              loading={bond.isSubmitting}
              onClick={() => void handleSubmit()}
            >
              {ctaLabel}
            </DappActionButton>
          </DappActionRow>
        ) : (
          <DappWidgetConnectPromo />
        )}
      </ExchangeWidgetBody>
    </>
  )
}
