/**
 * 创世页袋 UI 零件（购买表单、贡献表、全球卡、季度轮播）。
 */

import type { RefObject } from 'react'
import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { dappAssets } from '~/app/assets'
import { ActionRow } from '~/app/shell/action-row'
import { CtaButton } from '~/app/shell/cta-button'
import { goBindReferral } from '~/app/shell/go-bind-referral'
import { MetaListCard } from '~/app/shell/meta-list-card'
import { ProgressMeter } from '~/app/shell/progress-meter'
import { Skeleton } from '~/app/shell/skeleton'
import { genesisContributionsColWidths } from '~/app/shell/table-columns'
import { WidgetConnectPromo } from '~/app/shell/widget-connect-promo'
import { WalletConnectChip } from '~/app/wallet-connect-chip'
import type { SeasonOption } from '~/core/presale/genesis-promo-types'
import { useI18n } from '~/i18n/use-i18n'
import { formatGroupedNumber } from '~/shared/api/format-display'
import { Button } from '~/shared/components/button'
import { Carousel } from '~/shared/components/carousel'
import { FieldActionChip } from '~/shared/components/chip'
import { CountValue } from '~/shared/components/count-value'
import { darkBanner } from '~/shared/components/dark-banner'
import { Icon } from '~/shared/components/icon'
import { Input } from '~/shared/components/input'
import { RadioGroup, RadioIndicator } from '~/shared/components/radio'
import { Table } from '~/shared/components/table'
import { Text } from '~/shared/components/text'
import { Tooltip } from '~/shared/components/tooltip'
import { revealClass } from '~/shared/lib/reveal'
import { cn } from '~/shared/lib/utils'
import type { GenesisWidgetState } from '~/views/dapp/genesis/genesis-session-host'
import type { useGenesisDetail } from '~/views/dapp/genesis/use-genesis-detail'
import { useGenesisDock } from '~/views/dapp/genesis/use-genesis-dock'

// --- from genesis-purchase-shares-field.tsx ---
export function GenesisPurchaseSharesField({
  disabled,
  inputRef,
  label,
  max,
  maxLabel,
  min,
  onBlur,
  onChange,
  onMax,
  shareUnit,
  value,
}: {
  disabled: boolean
  inputRef: RefObject<HTMLInputElement | null>
  label: string
  max: number
  maxLabel: string
  min: number
  onBlur: () => void
  onChange: (value: string) => void
  onMax: () => void
  shareUnit: string
  value: string
}) {
  return (
    <label className="mt-1.5 grid gap-2">
      <Text as="span" variant="support" tone="muted-foreground">
        {label}
      </Text>
      <div className="flex gap-2">
        <div className="relative flex min-w-0 flex-1">
          <Input
            ref={inputRef}
            variant="numeric"
            className="pr-10 text-base font-bold"
            disabled={disabled}
            max={max}
            min={min}
            onBlur={onBlur}
            onChange={(event) => onChange(event.currentTarget.value)}
            placeholder="0"
            type="number"
            value={value}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-sm text-muted-foreground"
          >
            {shareUnit}
          </span>
        </div>
        <FieldActionChip disabled={disabled} onClick={onMax}>
          {maxLabel}
        </FieldActionChip>
      </div>
    </label>
  )
}

// --- from season/genesis-season-carousel.tsx ---
/**
 * 创世季卡样式
 *
 * 只负责布局与配色，字重行距跟随 Text 组件；
 * 选中/进行中为强调色，已结束为弱化色。
 */
export const seasonCard = tv({
  slots: {
    root: [
      'flex shrink-0 flex-col gap-1.5 border bg-card p-3',
      'w-35',
      'rounded-(--dapp-season-card-radius)',
    ],
    /** 仅设置字号；字重/行高/字距跟随 Text 变体 */
    title: 'text-(length:--dapp-season-title-size) text-foreground',
    // meta 用常规字重；badge 覆盖为中粗字重
    meta: 'm-0 text-(length:--dapp-season-meta-size) text-muted-foreground',
    metaAccent: 'text-coral-emphasis',
    radio: 'size-(--dapp-season-radio-size) rounded-[calc(var(--dapp-season-radio-size)/2)]',
    badge:
      'flex w-full items-center justify-center rounded-full px-2.25 py-0.5 text-(length:--dapp-season-badge-size) font-medium whitespace-nowrap',
  },
  variants: {
    selected: {
      true: {
        root: 'border-coral',
        radio: 'border-coral [&_span]:bg-coral',
      },
      false: {
        root: 'border-border',
      },
    },
    status: {
      live: { badge: 'bg-accent text-coral' },
      ended: { badge: 'bg-band text-muted-foreground' },
    },
  },
  defaultVariants: {
    selected: false,
    status: 'ended',
  },
})

function translateSeasonStatus(status: string, t: ReturnType<typeof useI18n>['messages']) {
  if (status === 'LIVE') return t.genesis.seasonLive
  if (status === 'Ended') return t.genesis.seasonEnded
  if (status === 'Upcoming') return t.genesis.seasonUpcoming
  return status
}

function SeasonCard({
  season,
  t,
}: {
  season: SeasonOption
  t: ReturnType<typeof useI18n>['messages']
}) {
  const selected = Boolean(season.active)
  const liveSelected = season.status === 'LIVE' && selected
  const styles = seasonCard({
    selected,
    status: liveSelected ? 'live' : 'ended',
  })

  return (
    <article aria-checked={selected} className={styles.root()} role="radio">
      <div className="flex w-full flex-col gap-0.75 overflow-hidden">
        <div className="flex items-center justify-between gap-1">
          <Text as="strong" variant="headline" className={styles.title()}>
            {season.name}
          </Text>
          <RadioIndicator checked={selected} className={styles.radio()} />
        </div>
        <Text as="p" variant="caption" className={styles.meta()}>
          {t.genesis.discountLabel}{' '}
          <Text as="span" variant="caption" className={styles.metaAccent()}>
            {season.desktopMeta.discount}
          </Text>
        </Text>
        <Text as="p" variant="caption" className={styles.meta()}>
          {t.genesis.airdropLabel}{' '}
          <Text as="span" variant="caption" className={styles.metaAccent()}>
            {season.desktopMeta.airdrop}
          </Text>
        </Text>
        <Text as="time" variant="caption" className={styles.meta()}>
          {season.date}
        </Text>
      </div>
      <div className="mt-auto w-full">
        <Text as="span" variant="caption" className={styles.badge()}>
          {translateSeasonStatus(season.status, t)}
        </Text>
      </div>
    </article>
  )
}

/**
 * 创世季卡轮播
 *
 * 卡片选中态自管；滚动条带、渐隐与指示器交给 Carousel 组件。
 */
export function GenesisSeasonCarousel({
  activePhaseIndex,
  seasons,
}: {
  activePhaseIndex?: number
  seasons: SeasonOption[]
}) {
  const { messages: t } = useI18n()
  const activeSeasonIndex = useMemo(() => {
    if (activePhaseIndex !== undefined && activePhaseIndex >= 0) {
      return activePhaseIndex
    }
    return seasons.findIndex((season) => season.active)
  }, [activePhaseIndex, seasons])
  const syncIndex = activeSeasonIndex >= 0 ? activeSeasonIndex : undefined

  return (
    <RadioGroup
      aria-label={t.genesis.title}
      className={cn(revealClass(), 'mb-1.5 min-w-0')}
      data-reveal
    >
      <Carousel
        aria-label={t.genesis.title}
        className="flex w-full min-w-0 flex-col gap-2.5 overflow-visible"
        opts={{
          align: 'start',
          containScroll: 'trimSnaps',
          dragFree: false,
          startIndex: syncIndex ?? 0,
        }}
        syncIndex={syncIndex}
      >
        <Carousel.Content chrome="peek">
          {seasons.map((season) => (
            <Carousel.Item key={season.name}>
              <SeasonCard season={season} t={t} />
            </Carousel.Item>
          ))}
        </Carousel.Content>
        <Carousel.Indicators
          chrome="plain"
          dotLabel={(index) => seasons[index]?.name ?? String(index + 1)}
          nextLabel={t.exchange.tokenNext}
          prevLabel={t.exchange.tokenPrevious}
        />
      </Carousel>
    </RadioGroup>
  )
}

// --- from season/genesis-season-option-skeleton.tsx ---
export function SeasonOptionSkeleton() {
  return (
    <div aria-hidden="true" className={seasonCard({ selected: false }).root()}>
      <div className="flex items-start justify-between gap-1">
        <Skeleton className="h-3.5 w-16" />
        <Skeleton className="size-(--dapp-skeleton-chip-size) shrink-0 rounded-[calc(var(--dapp-skeleton-chip-size)/2)]" />
      </div>
      <Skeleton className="h-3 w-full max-w-24" />
      <Skeleton className="h-3 w-full max-w-28" />
      <Skeleton className="h-3 w-20" />
      <Skeleton className="mt-auto w-full rounded-full" />
    </div>
  )
}

// --- from genesis-purchase-form.tsx ---
/**
 * 创世购买表单
 *
 * 顶部为季度选择轮播，下方为份额输入与购买清单；
 * 钱包切换时由父级以 key={address} 重建本组件以清空草稿，
 * 无需用副作用去镜像 genesis.shares。
 */
export function GenesisPurchaseForm({ genesis }: { genesis: GenesisWidgetState }) {
  const vm = useGenesisDock(genesis)
  const { t } = vm

  return (
    <>
      {genesis.seasonOptions.length === 0 ? (
        <div aria-busy="true" className={cn(revealClass(), 'mb-1.5 overflow-hidden')} data-reveal>
          <div className="flex gap-2.5">
            <SeasonOptionSkeleton />
            <SeasonOptionSkeleton />
            <SeasonOptionSkeleton />
          </div>
        </div>
      ) : (
        <GenesisSeasonCarousel
          activePhaseIndex={genesis.phaseIndex}
          seasons={genesis.seasonOptions}
        />
      )}

      <GenesisPurchaseSharesField
        disabled={!vm.walletReady || genesis.maxShares <= 0}
        inputRef={vm.sharesInputRef}
        label={t.genesis.shares.replace(
          '{max}',
          formatGroupedNumber(genesis.maxShares, { digits: 0, trimZeros: true }),
        )}
        max={Math.max(genesis.maxShares, 1)}
        maxLabel={t.common.max}
        min={1}
        onBlur={vm.handleSharesBlur}
        onChange={vm.handleSharesChange}
        onMax={vm.handleSharesMax}
        shareUnit={t.common.shareUnit}
        value={vm.sharesTextDisplay}
      />

      <MetaListCard>
        <MetaListCard.Rows
          items={[
            { label: t.genesis.quota, value: genesis.quotaLabel },
            { label: t.genesis.pay, value: genesis.payUsd1Label },
            { label: t.genesis.receive, value: `${genesis.estimatedAgxLabel} AGX` },
            { label: t.genesis.value, value: genesis.contributionValueLabel },
            {
              // 该行 Label 已自带样式，内层勿再套 Text variant/tone
              label: (
                <span className="inline-flex items-center gap-1">
                  {t.genesis.xTokenAirdrop}
                  <Tooltip.Info content={vm.xTokenAirdropHint} />
                </span>
              ),
              value: genesis.xTokenAirdropLabel,
            },
          ]}
        />
      </MetaListCard>

      {vm.walletReady ? (
        <ActionRow className="grid-cols-1">
          {vm.programEnded ? (
            <CtaButton density="card" disabled variant="secondary">
              {t.genesis.joinEnded}
            </CtaButton>
          ) : genesis.needsReferralBind ? (
            <CtaButton density="card" onClick={() => goBindReferral()} variant="primary">
              {t.genesis.goBindReferrer}
            </CtaButton>
          ) : (
            <CtaButton
              className="min-h-11"
              density="card"
              disabled={!genesis.canPurchase || genesis.isSubmitting}
              loading={genesis.isSubmitting}
              onClick={() => void vm.handlePurchase()}
              variant="primary"
            >
              {vm.purchaseCtaLabel}
            </CtaButton>
          )}
        </ActionRow>
      ) : (
        <WidgetConnectPromo />
      )}
    </>
  )
}

// --- from genesis-contributions-primitives.tsx ---
const genesisContributionsSection = tv({
  slots: {
    root: cn(revealClass(), 'flex flex-col gap-3'),
    syncHint: 'm-0',
    progressHeader: 'grid gap-2.5',
    progressRow: 'flex items-center justify-between gap-3',
    progressValue: 'mt-0 text-right',
  },
})

export function GenesisContributionsReveal({ children }: { children: ReactNode }) {
  const styles = genesisContributionsSection()
  return (
    <div className={styles.root()} data-reveal>
      {children}
    </div>
  )
}

export function GenesisContributionsSyncHint({ children }: { children: string }) {
  const styles = genesisContributionsSection()
  return (
    <Text as="p" className={styles.syncHint()} tone="muted-foreground" variant="support">
      {children}
    </Text>
  )
}

export function GenesisContributionsProgressHeader({
  contributedLabel,
  label,
  progress,
}: {
  contributedLabel: string
  label: string
  progress: number
}) {
  const styles = genesisContributionsSection()

  return (
    <div className={styles.progressHeader()}>
      <div className={styles.progressRow()}>
        <Text className="leading-[1.2] font-semibold" tone="foreground" variant="support">
          {label}
        </Text>
        <Text
          as="strong"
          className={cn(styles.progressValue(), 'leading-[1.2] font-semibold')}
          tone="foreground"
          variant="support"
        >
          {contributedLabel}
        </Text>
      </div>
      <ProgressMeter label={label} value={progress} />
    </div>
  )
}

// --- from genesis-contributions-table.tsx ---
type GenesisContributionsView = ReturnType<typeof useGenesisDetail>

export function GenesisContributionsTable({
  cumulativeLabel,
  syncPendingLabel,
  totalContributedLabel,
  connectBody,
  connectTitle,
  vm,
}: {
  cumulativeLabel: string
  syncPendingLabel: string
  totalContributedLabel: string
  connectBody: string
  connectTitle: string
  vm: GenesisContributionsView
}) {
  return (
    <GenesisContributionsReveal>
      {vm.showSalesSyncHint ? (
        <GenesisContributionsSyncHint>{syncPendingLabel}</GenesisContributionsSyncHint>
      ) : null}
      <Table>
        {vm.sessionReady && !vm.contributionsTable.requiresAuth ? (
          <Table.Header>
            <GenesisContributionsProgressHeader
              contributedLabel={vm.contributedLabel}
              label={totalContributedLabel}
              progress={vm.contributionProgress}
            />
          </Table.Header>
        ) : null}
        {vm.contributionsTable.requiresAuth ? (
          <Table.Auth body={connectBody} embedded title={connectTitle}>
            <WalletConnectChip variant="primary" />
          </Table.Auth>
        ) : vm.contributionsTable.queryEmpty && !vm.showSalesSyncHint ? (
          <Table.Empty body={vm.emptyBody} embedded title={vm.emptyTitle} />
        ) : (
          <Table.Body
            colWidths={[...genesisContributionsColWidths]}
            compact
            headers={vm.tableHeaders}
            isLoading={vm.showContributionsSkeleton}
            loadingRowCount={4}
            positiveColumns={[2]}
            rows={vm.desktopRows}
          />
        )}
        {vm.sessionReady && !vm.contributionsTable.requiresAuth ? (
          <Table.Footer>
            <Table.Pagination
              onPageChange={vm.setContributionsPage}
              page={vm.contributionsPage}
              summary={`${cumulativeLabel}${formatGroupedNumber(vm.cumulativeContributedUsd, { prefix: '$' })}`}
              total={vm.contributionsTotal}
            />
          </Table.Footer>
        ) : null}
      </Table>
    </GenesisContributionsReveal>
  )
}

// --- from genesis-global-card.tsx ---
const genesisGlobeWidth = 597
const genesisGlobeHeight = 250

const genesisGlobalCard = tv({
  slots: {
    root: cn(darkBanner().root(), 'px-6 py-4 max-dapp:p-4.5'),
    content: cn(darkBanner().content(), 'max-dapp:max-w-none'),
    // 移动端右留白不足会让标题折进按钮，故加大
    kicker: 'max-dapp:block max-dapp:pr-44',
    // 描边样式的按钮要压过 Button 次级样式的默认全宽，改用绝对定位贴右上
    contractButton: cn(
      'absolute top-11 right-5.5 z-2 max-dapp:top-4.5 max-dapp:right-4.5',
      'w-auto! gap-1.5! border-white/45! bg-transparent! px-4.5! text-white!',
      'hover:translate-y-0! hover:border-white/80! hover:shadow-none!',
      'focus-visible:translate-y-0! focus-visible:border-white/80! focus-visible:shadow-none!',
      '[&_img]:size-2.5 [&_img]:shrink-0 [&_img]:brightness-0 [&_img]:invert',
    ),
    globe: 'pointer-events-none absolute top-0 right-0 size-auto max-w-3/5 opacity-80 select-none',
  },
})

export function GenesisGlobalCard({
  body,
  contractLabel,
  kicker,
  onViewContract,
  value,
}: {
  body: string
  contractLabel: string
  kicker: string
  onViewContract: () => void
  value: ReactNode
}) {
  const styles = genesisGlobalCard()

  return (
    <div className={styles.root()} data-reveal>
      <div className={styles.content()}>
        <Text as="span" variant="eyebrow" tone="primary-bright" className={styles.kicker()}>
          {kicker}
        </Text>
        <Text as="strong" tone="inverse" variant="panel" className="block">
          {typeof value === 'string' ? <CountValue text={value} /> : value}
        </Text>
        <Text as="p" variant="copy" tone="inverse-muted" className="m-0 max-dapp:w-full">
          {body}
        </Text>
      </div>
      <Button
        className={styles.contractButton()}
        onClick={onViewContract}
        size="md"
        type="button"
        variant="secondary"
      >
        {contractLabel}
        <Icon alt="" className="size-2.5" src={dappAssets.arrowUpRight} />
      </Button>
      <img
        alt=""
        className={styles.globe()}
        draggable={false}
        height={genesisGlobeHeight}
        loading="lazy"
        src={dappAssets.genesisGlobe}
        width={genesisGlobeWidth}
      />
    </div>
  )
}
