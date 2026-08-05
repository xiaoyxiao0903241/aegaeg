/**
 * 创世单项领取卡（组合式）
 *
 * 顶栏标签 + 可选旁注、主额、说明或领取按钮。
 */
import { type ReactNode } from 'react'

import { DappActionButton } from '~/app/shell/dapp-action-button'
import { Card } from '~/shared/components/card'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

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
    <DappActionButton
      className="mt-2.5"
      density="inverse"
      disabled={disabled}
      loading={loading}
      onClick={onClick}
    >
      {children}
    </DappActionButton>
  )
}

export const GenesisClaimCard = Object.assign(Root, {
  Header,
  Value,
  Note,
  Action,
})
