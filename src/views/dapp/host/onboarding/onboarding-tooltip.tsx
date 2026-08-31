import { carouselIndicatorDotClass } from '~/shared/components/carousel'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'
import { ONBOARDING_STEP_COUNT } from '~/views/dapp/host/onboarding/shared'

export type OnboardingStepCopy = {
  title: string
  body: string
}

export type OnboardingChromeCopy = {
  skip: string
  prev: string
  next: string
  done: string
  steps: OnboardingStepCopy[]
}

/**
 * 引导提示气泡：标题 / 跳过 / 正文 / 上一步 · 进度点 · 下一步或完成。
 */
export function OnboardingTourTooltip({
  copy,
  currentStep,
  onPrev,
  onNext,
  onSkip,
  onComplete,
  disabledActions = false,
}: {
  copy: OnboardingChromeCopy
  currentStep: number
  onPrev: () => void
  onNext: () => void
  onSkip: () => void
  onComplete: () => void
  disabledActions?: boolean
}) {
  const step = copy.steps[currentStep]
  const isFirst = currentStep <= 0
  const isLast = currentStep >= ONBOARDING_STEP_COUNT - 1
  const navLocked = Boolean(disabledActions)
  const prevEnabled = !isFirst && !navLocked

  if (!step) return null

  return (
    <div
      className={cn(
        'flex w-[min(21.25rem,calc(100dvw-2rem))] flex-col gap-4 rounded-md bg-card p-4',
        'shadow-[0px_10px_30px_0px_rgba(0,0,0,0.16)]',
      )}
      data-onboarding-tooltip
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <Text
            as="p"
            className="m-0 text-[length:var(--type-headline-size)] leading-normal"
            variant="copy"
          >
            {step.title}
          </Text>
          {isLast ? null : (
            <button
              className="cursor-pointer border-0 bg-transparent p-0 disabled:cursor-not-allowed"
              disabled={navLocked}
              onClick={onSkip}
              type="button"
            >
              <Text as="span" className="text-foreground/40" variant="copy">
                {copy.skip}
              </Text>
            </button>
          )}
        </div>
        <Text as="p" className="m-0 text-foreground/70" variant="copy">
          {step.body}
        </Text>
      </div>

      <div className="flex items-center justify-between gap-2">
        <button
          className={cn(
            'rounded-full px-3 py-1',
            prevEnabled ? 'cursor-pointer bg-primary' : 'cursor-not-allowed bg-border',
          )}
          disabled={!prevEnabled}
          onClick={onPrev}
          type="button"
        >
          <Text
            as="span"
            className={prevEnabled ? undefined : 'text-foreground/40'}
            tone={prevEnabled ? 'inverse' : undefined}
            variant="copy"
          >
            {copy.prev}
          </Text>
        </button>

        <div aria-hidden className="flex h-1.5 items-center gap-1.5" data-onboarding-dots>
          {copy.steps.map((_, index) => (
            <span className={carouselIndicatorDotClass(index === currentStep)} key={index} />
          ))}
        </div>

        <button
          className={cn(
            'rounded-full bg-primary px-3 py-1',
            navLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
          )}
          disabled={navLocked}
          onClick={() => {
            if (isLast) {
              onComplete()
              return
            }
            onNext()
          }}
          type="button"
        >
          <Text as="span" tone="inverse" variant="copy">
            {isLast ? copy.done : copy.next}
          </Text>
        </button>
      </div>
    </div>
  )
}
