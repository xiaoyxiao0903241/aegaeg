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
import { Segment } from '~/shared/ui/segment'
import { Text } from '~/shared/ui/text'
import { formatShortAddress } from '~/shared/api/format-display'
import { bscscanAddress } from '~/shared/config/explorer'
import { DappMetaPanel } from '~/app/shell/dapp-meta-panel'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import { useStakeWidget } from '~/views/dapp/staking/stake/use-stake-widget'
import { STAKING_GATE_ERROR } from '~/views/dapp/staking/stake/submit-stake'
import { presentUserFacingError } from '~/web3/present-user-facing-error'
import { readErrorText } from '~/web3/errors/error-text'
import { resolveWalletTransactionError } from '~/web3/resolve-contract-error-message'

export function StakeWidget() {
  const { messages: t } = useI18n()
  const setView = useStakingViewStore((state) => state.setView)
  const { sessionReady, walletReady } = useDappShell()
  const stake = useStakeWidget(sessionReady)
  const selectTab = useDappShellStore((state) => state.selectTab)

  const periodOptions = [
    { label: t.staking.stake.periods.liquid, value: 'liquid' },
    { label: t.staking.stake.periods.d180, value: '180' },
    { label: t.staking.stake.periods.d360, value: '360' },
    { label: t.staking.stake.periods.d540, value: '540' },
  ]

  const lockLabel =
    stake.period === 'liquid'
      ? t.staking.stake.meta.lockLiquid
      : t.staking.stake.meta.lockDays.replace('{days}', stake.period)

  const amountLabel = t.staking.stake.amountBalance.replace(
    '{balance}',
    stake.isBalancesLoading ? '…' : `${stake.balanceLabel}`,
  )

  function resolveMessage(error: unknown) {
    const raw = readErrorText(error)
    if (raw === STAKING_GATE_ERROR.accountMigrated) return t.staking.gates.accountMigrated
    if (raw === STAKING_GATE_ERROR.notBound) return t.staking.gates.notBound
    if (raw === STAKING_GATE_ERROR.insufficientBalance) return t.staking.gates.insufficientBalance
    if (raw === STAKING_GATE_ERROR.insufficientAllowance)
      return t.staking.gates.insufficientAllowance
    if (raw === STAKING_GATE_ERROR.insufficientQuota) return t.staking.gates.insufficientQuota
    if (raw === STAKING_GATE_ERROR.poolPaused) return t.staking.gates.poolPaused
    if (raw === STAKING_GATE_ERROR.zeroAmount) return t.staking.gates.zeroAmount
    if (raw === STAKING_GATE_ERROR.unavailable) return t.staking.gates.unavailable
    return (
      resolveWalletTransactionError(error, t.wallet.transactionErrors) ?? t.errors.chain.fallback
    )
  }

  async function handleSubmit() {
    if (stake.gate === 'accountMigrated') return
    if (stake.gate === 'notBound') {
      selectTab('community')
      return
    }
    const result = await stake.submit()
    if (result.ok) {
      toast.success(t.staking.stake.success)
      return
    }
    if (result.error != null) {
      const raw = readErrorText(result.error)
      if (raw === STAKING_GATE_ERROR.notBound) {
        selectTab('community')
        return
      }
      presentUserFacingError(result.error, resolveMessage)
    }
  }

  async function handleWarmup() {
    const result = await stake.claimWarmup()
    if (result.ok) {
      toast.success(t.staking.stake.warmupSuccess)
      return
    }
    if (result.error != null) presentUserFacingError(result.error, resolveMessage)
  }

  const ctaLabel =
    stake.writePhase === 'account_migrated'
      ? t.staking.gates.accountMigrated
      : stake.writePhase === 'need_referral'
        ? t.staking.stake.bindCta
        : t.staking.stake.submit

  return (
    <>
      <DappTabHeader
        backText={t.staking.backToHub}
        onBack={() => setView('hub')}
        subtitle={t.staking.stake.intro}
        title={t.staking.stake.title}
      />
      <DappWidgetStack>
        <div className="grid gap-2.5">
          <Text as="span" tone="muted-foreground" variant="detail">
            {t.staking.stake.periodLabel}
          </Text>
          <Segment
            aria-label={t.staking.stake.periodAria}
            onChange={stake.setPeriod}
            options={periodOptions}
            tone="ink"
            value={stake.period}
          />
        </div>

        <AmountBox
          amountProps={{
            'aria-label': t.staking.stake.amountAria,
            inputMode: 'decimal',
            onChange: (event) => stake.setAmount(event.target.value),
            placeholder: '0.00',
            value: stake.amountDisplay,
          }}
          endAdornment={
            <span className="flex items-center gap-2.5">
              <span className="flex items-center gap-1.5">
                <DappIcon alt="" size="md" src={dappAssets.tokenAgx} />
                <Text as="span" className="font-semibold" variant="copy">
                  AGX
                </Text>
              </span>
              <FieldActionChip
                disabled={!walletReady || stake.isSubmitting}
                onClick={stake.fillMax}
              >
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
            { label: t.staking.stake.meta.baseDaily, value: '—' },
            {
              label: t.staking.stake.meta.periodYield,
              value: '—',
              valueClassName: 'text-primary',
            },
            { label: t.staking.stake.meta.bonus, value: '—' },
            { label: t.staking.stake.meta.lock, value: lockLabel },
            {
              label: t.staking.stake.meta.contract,
              value: (
                <a
                  className="text-primary underline-offset-2 hover:underline"
                  href={bscscanAddress(stake.pool)}
                  rel="noreferrer"
                  target="_blank"
                >
                  {formatShortAddress(stake.pool)}
                </a>
              ),
            },
          ]}
        />

        {walletReady ? (
          <DappActionRow>
            <DappActionButton
              density="external"
              disabled={!stake.canSubmit && stake.gate !== 'notBound'}
              loading={stake.isSubmitting}
              onClick={() => void handleSubmit()}
            >
              {ctaLabel}
            </DappActionButton>
            {stake.showWarmupClaim ? (
              <DappActionButton
                density="external"
                disabled={stake.isSubmitting}
                onClick={() => void handleWarmup()}
                variant="secondary"
              >
                {t.staking.stake.warmupCta}
              </DappActionButton>
            ) : null}
          </DappActionRow>
        ) : (
          <DappWidgetConnectPromo />
        )}
      </DappWidgetStack>
    </>
  )
}
