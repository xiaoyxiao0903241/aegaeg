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
    <span className="grid aspect-square w-[30px] flex-none place-items-center rounded-[15px] bg-primary text-[13px] font-semibold text-white max-[820px]:w-7 max-[820px]:rounded-[14px]">
      {children}
    </span>
  )
}

function InviteFlowConnector({ tone }: { tone?: 'primary' | 'muted' }) {
  return (
    <i
      className="h-0.5 flex-1 rounded-sm bg-border max-[820px]:hidden data-[tone=primary]:!bg-primary data-[tone=muted]:!bg-border"
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
        'mt-3.5 grid grid-cols-3 gap-0 p-[22px]',
        'max-[1100px]:grid-cols-[repeat(auto-fit,minmax(min(100%,170px),1fr))] max-[1100px]:gap-4',
        'max-[820px]:min-w-0 max-[820px]:grid-cols-1 max-[820px]:gap-3.5 max-[820px]:p-4',
        'group-data-[tab=community]/shell:gap-3.5 group-data-[tab=community]/shell:p-4 group-data-[tab=community]/shell:max-[820px]:gap-3.5',
      )}
      data-reveal
    >
      {items.map((item, index) => (
        <article
          className="flex min-w-0 flex-col gap-2 px-1 max-[820px]:grid max-[820px]:grid-cols-[28px_minmax(0,1fr)] max-[820px]:gap-x-3 max-[820px]:px-0"
          key={item.title}
        >
          <div className="flex items-center gap-2.5 max-[820px]:items-start">
            <InviteFlowStep>{index + 1}</InviteFlowStep>
            {index < items.length - 1 ? (
              <InviteFlowConnector tone={index === 0 ? 'primary' : index === 1 ? 'muted' : undefined} />
            ) : null}
          </div>
          <Text
            as="h4"
            size="sm"
            weight="semibold"
            className="m-0 tracking-[-0.28px] max-[820px]:col-start-2 max-[820px]:row-start-1 max-[820px]:mt-0"
          >
            {item.title}
          </Text>
          <Text
            as="p"
            size="xs"
            tone="muted"
            className={cn(
              'm-0 max-w-[24ch] tracking-[-0.24px]',
              'max-[820px]:col-start-2 max-[820px]:row-start-2 max-[820px]:mt-[3px] max-[820px]:max-w-none max-[820px]:leading-[1.35]',
              'group-data-[tab=community]/shell:max-[820px]:line-clamp-2 group-data-[tab=community]/shell:max-[820px]:text-[13px] group-data-[tab=community]/shell:max-[820px]:leading-[1.28]',
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
      className={cn(revealClass(), 'grid gap-3.5 p-4 max-[820px]:rounded-2xl')}
      data-reveal
    >
      {items.map((item, index) => (
        <article className="flex gap-3" key={item.title}>
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
