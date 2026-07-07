import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'
import { dappCaptionClass } from '~/app/dapp-type-scale'
import { revealClass } from '~/shared/lib/reveal'
import { cn } from '~/shared/lib/utils'

export type InviteFlowItem = {
  copy: string
  title: string
}

const inviteFlowStep = tv({
  base: cn(
    'grid size-7.5 shrink-0 place-items-center self-start rounded-full bg-primary font-semibold leading-[1.3] text-white',
    'max-dapp:size-7',
    dappCaptionClass,
  ),
})

function InviteFlowStep({ children }: { children: ReactNode }) {
  return <span className={inviteFlowStep()}>{children}</span>
}

/** Figma `flow` connector — coral primary, 2px thick. */
function InviteFlowConnector({ orientation = 'horizontal' }: { orientation?: 'horizontal' | 'vertical' }) {
  return (
    <i
      className={cn(
        'shrink-0 rounded-sm bg-primary',
        orientation === 'horizontal' && 'h-0.5 flex-1 max-dapp:hidden',
        orientation === 'vertical' && 'w-0.5 min-h-6 flex-1',
      )}
    />
  )
}

export function InviteFlow({ items }: { items: InviteFlowItem[] }) {
  return (
    <Card
      as="div"
      surface="elevated"
      className={cn(
        revealClass(),
        'grid grid-cols-3 gap-0 p-5.5',
        'max-tablet:grid-cols-[repeat(auto-fit,minmax(min(100%,10.5rem),1fr))] max-tablet:gap-4',
        'max-dapp:min-w-0 max-dapp:grid-cols-1 max-dapp:gap-3.5 max-dapp:p-4',
        'gap-3.5 p-4',
      )}
      data-reveal
    >
      {items.map((item, index) => (
        <article
          className="flex min-w-0 flex-col gap-2 px-1 max-dapp:grid max-dapp:grid-cols-[7_minmax(0,1fr)] max-dapp:gap-x-3 max-dapp:px-0"
          key={item.title}
        >
          <div className="flex items-center gap-2.5 max-dapp:items-start">
            <InviteFlowStep>{index + 1}</InviteFlowStep>
            {index < items.length - 1 ? <InviteFlowConnector /> : null}
          </div>
          <Text
            as="h4"
            variant="sm"
            weight="semibold"
            className="m-0 tracking-[-0.28px] max-dapp:col-start-2 max-dapp:row-start-1 max-dapp:mt-0"
          >
            {item.title}
          </Text>
          <Text
            as="p"
            variant="xs"
            tone="faint"
            className={cn(
              'm-0 max-w-[24ch] tracking-[-0.24px]',
              'max-dapp:col-start-2 max-dapp:row-start-2 max-dapp:mt-0.5 max-dapp:max-w-none max-dapp:leading-[1.35]',
              'max-dapp:line-clamp-2 max-dapp:leading-[1.28]',
            )}
          >
            {item.copy}
          </Text>
        </article>
      ))}
    </Card>
  )
}

export function InviteFlowStack({ items }: { items: InviteFlowItem[] }) {
  return (
    <Card
      as="div"
      surface="elevated"
      className={cn(revealClass(), 'grid gap-0 p-4 max-dapp:rounded-2xl')}
      data-reveal
    >
      {items.map((item, index) => (
        <article className="flex items-stretch gap-3" key={item.title}>
          <div className="flex w-7 flex-col items-center">
            <InviteFlowStep>{index + 1}</InviteFlowStep>
            {index < items.length - 1 ? <InviteFlowConnector orientation="vertical" /> : null}
          </div>
          <div className={cn('grid min-w-0 gap-0.5', index < items.length - 1 && 'pb-3.5')}>
            <Text as="h4" variant="sm" weight="semibold" className="m-0 leading-[1.2] tracking-[-0.28px]">
              {item.title}
            </Text>
            <Text as="p" variant="sm" tone="faint" className="m-0 leading-normal tracking-[-0.26px]">
              {item.copy}
            </Text>
          </div>
        </article>
      ))}
    </Card>
  )
}
