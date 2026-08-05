import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

/**
 * DApp 纯文案空态
 *
 * 文案由调用方传入；不放插画 / CTA / 业务文案。
 * @see docs/foundation/component-usage.md
 */
export function Empty({
  body,
  className,
  title,
}: {
  body?: string
  className?: string
  title: string
}) {
  return (
    <div
      className={cn(
        'flex w-full flex-col items-center justify-center px-5 py-11 text-center',
        'max-dapp:px-4 max-dapp:py-8',
        className,
      )}
    >
      <Text as="p" className="m-0 text-foreground/40" variant="copy">
        {title}
      </Text>
      {body ? (
        <Text as="p" className="mt-2 mb-0 text-foreground/40" variant="support">
          {body}
        </Text>
      ) : null}
    </div>
  )
}
