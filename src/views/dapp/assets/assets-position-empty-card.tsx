import { Button } from '~/shared/ui/button'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'

/** HTML 原型 stakePosEmpty：插画位 + 标题 + 说明 + 深色 CTA. */
export function AssetsPositionEmptyCard({
  title,
  body,
  ctaLabel,
  onCta,
}: {
  title: string
  body: string
  ctaLabel: string
  onCta: () => void
}) {
  return (
    <Card surface="elevated" className="grid gap-3.5 p-5 shadow-card">
      <div className="grid justify-items-center gap-3.5 px-1 py-6">
        <span aria-hidden className="size-20 rounded-full bg-muted" />
        <Text as="p" className="text-center font-semibold" variant="detail">
          {title}
        </Text>
        <Text
          as="p"
          className="max-w-72 text-center leading-relaxed"
          tone="muted-foreground"
          variant="support"
        >
          {body}
        </Text>
      </div>
      <Button
        className="min-h-12 w-full rounded-xl border-0 bg-dark text-white hover:bg-dark hover:text-white hover:opacity-90"
        onClick={onCta}
        shape="rounded"
        type="button"
        variant="secondary"
      >
        {ctaLabel}
      </Button>
    </Card>
  )
}
