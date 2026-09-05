/**
 * Genesis mode UI 零件：详情横幅 + 领取卡。
 */
import type { ReactNode } from 'react'

import { dappAssets } from '~/shared/assets/dapp'
import { Card } from '~/shared/components/card'
import { darkBanner } from '~/shared/components/dark-banner'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'
import { SessionButton } from '~/views/dapp/shared/session-button'

/**
 * 创世荣誉顶部横幅
 *
 * 深色背景展示当前股东等级与超级社区说明，右侧为荣誉装饰图。
 */
export function GenesisBanner({ children }: { children: ReactNode }) {
  const banner = darkBanner()

  return (
    <div
      className={banner.root({
        className: 'mt-4 p-6 max-dapp:p-4.5',
      })}
    >
      <div className={banner.content({ className: 'min-w-0 flex-1 pr-36 max-dapp:pr-0' })}>
        {children}
      </div>
      {/* 荣誉头图：限制在横幅内，宽度随高度按原图比例，避免拉扁或溢出 */}
      <img
        alt=""
        className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden h-full w-auto object-contain object-right select-none md:block"
        loading="lazy"
        src={dappAssets.rewardsCharacter}
      />
    </div>
  )
}

/**
 * 创世单项领取卡（组合组件）
 *
 * 顶栏标签 + 可选旁注、主额、说明或领取按钮。
 */
function Root({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Card className={cn('rounded-2xl px-5', className)} surface="outlined">
      {children}
    </Card>
  )
}

function Header({ label, meta, metaTone }: { label: string; meta?: string; metaTone?: 'primary' }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <Text as="p" className="leading-4" tone="muted-foreground" variant="support">
        {label}
      </Text>
      {meta != null ? (
        <Text
          as="p"
          className={cn(
            'leading-4',
            metaTone === 'primary' ? 'font-semibold' : 'text-foreground/70',
          )}
          tone={metaTone === 'primary' ? 'primary' : undefined}
          variant="support"
        >
          {meta}
        </Text>
      ) : null}
    </div>
  )
}

function Value({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Text as="p" className={cn('font-semibold', className)} variant="headline">
      {children}
    </Text>
  )
}

function Note({ children }: { children: ReactNode }) {
  return (
    <Text as="p" className="mt-2 leading-4" tone="muted-foreground" variant="support">
      {children}
    </Text>
  )
}

/* jscpd:ignore-start — 组合卡按钮槽，density 与释放计划卡不同，禁抽共享 Action */
function Action({
  children,
  disabled,
  loading,
  onClick,
}: {
  children: ReactNode
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
}) {
  return (
    <SessionButton
      className="mt-2.5"
      density="inverse"
      disabled={disabled}
      loading={loading}
      onClick={onClick}
    >
      {children}
    </SessionButton>
  )
}
/* jscpd:ignore-end */

export const GenesisClaimCard = Object.assign(Root, {
  Header,
  Value,
  Note,
  Action,
})
