import { toast } from 'sonner'
import { useStakingViewStore } from '~/stores/staking-view-store'
import { DappTabHeader } from '~/app/shell/dapp-tab-header'
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
import { Text } from '~/shared/ui/text'
import { formatShortAddress } from '~/shared/api/format-display'
import { bscscanAddress } from '~/shared/config/explorer'
import { DappMetaPanel } from '~/app/shell/dapp-meta-panel'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import { BondPeriodList } from '~/views/dapp/staking/bond/bond-period-list'
import { useBondWidget } from '~/views/dapp/staking/bond/use-bond-widget'
import { BOND_ZAP_GATE_ERROR, type BondKind } from '~/views/dapp/staking/bond/submit-bond-zap'
import { presentUserFacingError } from '~/web3/present-user-facing-error'
import { readErrorText } from '~/web3/errors/error-text'
import { resolveWalletTransactionError } from '~/web3/resolve-contract-error-message'

export function BondWidget({ kind }: { kind: BondKind }) {
  const { messages: t } = useI18n()
  const setView = useStakingViewStore((state) => state.setView)
  const { sessionReady, walletReady } = useDappShell()
  const bond = useBondWidget(kind, sessionReady)
  const selectTab = useDappShellStore((state) => state.selectTab)
  const copy = kind === 'lp' ? t.staking.lpbond : t.staking.burnbond

  function resolveMessage(error: unknown) {
    const raw = readErrorText(error)
    if (raw === BOND_ZAP_GATE_ERROR.accountMigrated) return t.staking.gates.accountMigrated
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
    if (bond.gate === 'accountMigrated') return
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

  const ctaLabel =
    bond.writePhase === 'account_migrated'
      ? t.staking.gates.accountMigrated
      : bond.writePhase === 'need_referral'
        ? t.staking.stake.bindCta
        : copy.submit
  const amountLabel = copy.amountBalance.replace(
    '{balance}',
    bond.isBalancesLoading ? '…' : bond.balanceLabel,
  )

  return (
    <>
      <DappTabHeader
        backText={t.staking.backToHub}
        onBack={() => setView('hub')}
        subtitle={copy.intro}
        title={copy.title}
      />
      <DappWidgetStack>
        <BondPeriodList
          ariaLabel={copy.periodAria}
          copy={copy.card}
          discounts={bond.periodDiscounts}
          onChange={bond.setPeriod}
          periodLabel={copy.periodLabel}
          periodLabels={{
            '180': t.staking.stake.periods.d180,
            '360': t.staking.stake.periods.d360,
            '540': t.staking.stake.periods.d540,
          }}
          value={bond.period}
        />

        <AmountBox
          amountProps={{
            'aria-label': copy.amountAria,
            inputMode: 'decimal',
            onChange: (event) => bond.setAmount(event.target.value),
            placeholder: '0.00',
            value: bond.amountDisplay,
          }}
          endAdornment={
            <span className="flex items-center gap-2.5">
              <span className="flex items-center gap-1.5">
                <DappIcon alt="" size="md" src={dappAssets.tokenUsd1} />
                <Text as="span" className="font-semibold" variant="copy">
                  USD1
                </Text>
              </span>
              <FieldActionChip disabled={!walletReady || bond.isSubmitting} onClick={bond.fillMax}>
                {t.staking.max}
              </FieldActionChip>
            </span>
          }
          inputClassName="!ml-0 mr-auto max-w-[50%] text-left"
          label={amountLabel}
          sessionReady={sessionReady}
          startAdornment={null}
        />

        <DappMetaPanel
          className="gap-3 p-4"
          items={[
            {
              label: copy.meta.discount.replace(
                '{pct}',
                bond.isMarketLoading
                  ? '…'
                  : bond.discountLabel === '—'
                    ? '—'
                    : bond.discountLabel.replace(/%$/, ''),
              ),
              // Dollar dual-price needs AGX spot × discount; no fake demo $.
              value: '—',
            },
            {
              label: copy.meta.slippage,
              value: bond.isSlippageLoading ? '…' : bond.slippageLabel,
            },
            {
              label: copy.meta.pay,
              value: bond.amountDisplay ? `${bond.amountDisplay} USD1` : '0 USD1',
            },
            {
              label: copy.meta.receive,
              value: bond.isPayoutQuoting
                ? '…'
                : bond.receiveLabel === '—'
                  ? '—'
                  : `${bond.receiveLabel} AGX`,
            },
            {
              label: copy.meta.cap,
              value: bond.isMarketLoading ? '…' : bond.capLabel,
            },
            {
              label: copy.meta.release,
              value: copy.meta.releaseLinear.replace('{days}', bond.period),
            },
            {
              label: copy.meta.contract,
              value: (
                <a
                  className="text-primary underline-offset-2 hover:underline"
                  href={bscscanAddress(bond.depository)}
                  rel="noreferrer"
                  target="_blank"
                >
                  {formatShortAddress(bond.depository)}
                </a>
              ),
            },
          ]}
        />

        <Text as="p" className="m-0" tone="muted-foreground" variant="detail">
          {copy.footnote}
        </Text>

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
      </DappWidgetStack>
    </>
  )
}
