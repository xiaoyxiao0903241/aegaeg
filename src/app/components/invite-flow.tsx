import type { ReactNode } from 'react'
import { Card } from '~/components/card'
import { Text } from '~/components/text'
import { revealClass } from '~/lib/reveal'
import { cn } from '~/lib/utils'

export type InviteFlowItem = {
  copy: string
  title: string
}

function InviteFlowStep({ children }: { children: ReactNode }) {
  return (
    <span className="grid size-7.5 shrink-0 place-items-center self-start rounded-full bg-primary text-xs font-semibold leading-[1.2] text-white max-dapp:size-7">
      {children}
    </span>
  )
}

function InviteFlowConnector({ tone }: { tone?: 'primary' | 'muted' }) {
  return (
    <i
      className="h-0.5 flex-1 shrink-0 rounded-sm bg-border max-dapp:hidden data-[tone=primary]:!bg-primary data-[tone=muted]:!bg-border"
      data-tone={tone}
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
        'mt-3.5 grid grid-cols-3 gap-0 p-5.5',
        'max-[1100px]:grid-cols-[repeat(auto-fit,minmax(min(100%,10.5rem),1fr))] max-[1100px]:gap-4',
        'max-dapp:min-w-0 max-dapp:grid-cols-1 max-dapp:gap-3.5 max-dapp:p-4',
        'group-data-[tab=community]/shell:gap-3.5 group-data-[tab=community]/shell:p-4 group-data-[tab=community]/shell:max-dapp:gap-3.5',
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
            {index < items.length - 1 ? (
              <InviteFlowConnector tone={index === 0 ? 'primary' : index === 1 ? 'muted' : undefined} />
            ) : null}
          </div>
          <Text
            as="h4"
            size="sm"
            weight="semibold"
            className="m-0 tracking-[-0.28px] max-dapp:col-start-2 max-dapp:row-start-1 max-dapp:mt-0"
          >
            {item.title}
          </Text>
          <Text
            as="p"
            size="xs"
            tone="muted"
            className={cn(
              'm-0 max-w-[24ch] tracking-[-0.24px]',
              'max-dapp:col-start-2 max-dapp:row-start-2 max-dapp:mt-0.5 max-dapp:max-w-none max-dapp:leading-[1.35]',
              'group-data-[tab=community]/shell:max-dapp:line-clamp-2 group-data-[tab=community]/shell:max-dapp:text-xs group-data-[tab=community]/shell:max-dapp:leading-[1.28]',
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
      className={cn(revealClass(), 'grid gap-3.5 p-4 max-dapp:rounded-2xl')}
      data-reveal
    >
      {items.map((item, index) => (
        <article className="flex items-start gap-3" key={item.title}>
          <InviteFlowStep>{index + 1}</InviteFlowStep>
          <div className="grid min-w-0 gap-0.5">
            <Text as="h4" size="sm" weight="semibold" className="m-0 leading-[1.2] tracking-[-0.28px]">
              {item.title}
            </Text>
            <Text as="p" size="sm" tone="muted" className="m-0 leading-normal tracking-[-0.26px]">
              {item.copy}
            </Text>
          </div>
        </article>
      ))}
    </Card>
  )
}
