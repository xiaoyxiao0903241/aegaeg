import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'

import { iconVariants } from '~/shared/components/icon'
import { Text } from '~/shared/components/text'
import { DetailToggle } from '~/views/dapp/shared/detail-toggle'
import { DockPanel } from '~/views/dapp/shared/dock-frame'

/**
 * 子页壳：贴稿 backRow leaf。
 *
 * 固定行 = ← +「返回xx」| btn/menu（H5 落在固定高 chrome 带内）；title/desc 在滚动区。
 */
export function TabHeader({
  backText,
  children,
  className,
  onBack,
  subtitle,
  title,
}: {
  backText: string
  children: ReactNode
  className?: string
  onBack: () => void
  subtitle: ReactNode
  title: ReactNode
}) {
  return (
    <DockPanel
      className={className}
      chrome={
        <div className="flex w-full items-center justify-between gap-2">
          <button
            className="inline-flex min-w-0 flex-1 cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-left"
            onClick={onBack}
            type="button"
          >
            <ArrowLeft aria-hidden className={iconVariants({ size: 'sm' })} strokeWidth={1.5} />
            <Text className="text-base font-medium" tone="muted-foreground" variant="headline">
              {backText}
            </Text>
          </button>
          <DetailToggle />
        </div>
      }
    >
      <div className="mb-4 grid gap-1.5">
        <Text as="h1" variant="panel" className="m-0">
          {title}
        </Text>
        {subtitle ? (
          <Text
            as="p"
            variant="copy"
            tone="muted-foreground"
            className="m-0 max-w-70 max-dapp:max-w-none [&_strong]:font-bold [&_strong]:text-primary"
          >
            {subtitle}
          </Text>
        ) : null}
      </div>
      {children}
    </DockPanel>
  )
}
