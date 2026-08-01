import type { StepType, TourProps } from '@reactour/tour'
import { type ComponentType, lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'

import { readOnboardingPersistence, writeOnboardingDone } from '~/app/shell/onboarding-persistence'
import {
  ONBOARDING_STEP_IDS,
  prepareOnboardingStep,
  tourSelector,
} from '~/app/shell/onboarding-steps'
import { type OnboardingChromeCopy, OnboardingTourTooltip } from '~/app/shell/onboarding-tooltip'
import { useI18n } from '~/i18n/use-i18n'

type TourComponent = ComponentType<TourProps>

const LazyTour = lazy(async () => {
  const mod = await import('@reactour/tour')
  await import('@reactour/tour/dist/index.css')
  return { default: mod.Tour as TourComponent }
})

function onboardingSteps(): StepType[] {
  return ONBOARDING_STEP_IDS.map((id) => ({
    selector: tourSelector(id),
    content: '',
    mutationObservables: [tourSelector(id)],
    resizeObservables: [tourSelector(id)],
  }))
}

/**
 * DApp-only 12-step guide (no genesis). Auto-starts once; replay via topbar chip.
 * `@reactour/tour` loads only when the tour opens.
 */
export function OnboardingGuide({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { messages: t } = useI18n()
  const [currentStep, setCurrentStep] = useState(0)
  const [disabledActions, setDisabledActions] = useState(false)
  const steps = useMemo(() => onboardingSteps(), [])

  const copy: OnboardingChromeCopy = {
    skip: t.onboarding.skip,
    prev: t.onboarding.prev,
    next: t.onboarding.next,
    done: t.onboarding.done,
    steps: t.onboarding.steps,
  }

  const wasOpen = useRef(false)
  useEffect(() => {
    if (open && !wasOpen.current) setCurrentStep(0)
    wasOpen.current = open
  }, [open])

  useEffect(() => {
    if (!open) return
    const controller = new AbortController()
    setDisabledActions(true)
    void prepareOnboardingStep(currentStep, controller.signal).finally(() => {
      if (!controller.signal.aborted) setDisabledActions(false)
    })
    return () => {
      controller.abort()
    }
  }, [open, currentStep])

  if (!open) return null

  const finish = (done: boolean) => {
    writeOnboardingDone(done)
    onOpenChange(false)
  }

  return (
    <Suspense fallback={null}>
      <LazyTour
        ContentComponent={(props) => (
          <OnboardingTourTooltip
            {...props}
            copy={copy}
            disabledActions={disabledActions}
            onComplete={() => finish(true)}
            onSkip={() => finish(true)}
          />
        )}
        className="bg-transparent! p-0! shadow-none!"
        currentStep={currentStep}
        disableInteraction
        disableWhenSelectorFalsy
        disabledActions={disabledActions}
        isOpen={open}
        maskClassName="opacity-40"
        onClickClose={() => finish(true)}
        onClickMask={() => undefined}
        padding={{ mask: 8, popover: 12 }}
        scrollSmooth
        setCurrentStep={setCurrentStep}
        setDisabledActions={setDisabledActions}
        setIsOpen={(value) => {
          const next = typeof value === 'function' ? value(open) : value
          if (!next) finish(true)
          else onOpenChange(true)
        }}
        showBadge={false}
        showCloseButton={false}
        showDots={false}
        showNavigation={false}
        steps={steps}
        styles={{
          popover: (base) => ({
            ...base,
            backgroundColor: 'transparent',
            padding: 0,
            boxShadow: 'none',
            borderRadius: 0,
          }),
          maskArea: (base) => ({ ...base, rx: 16 }),
        }}
      />
    </Suspense>
  )
}

/** Auto-open on first DApp visit when persistence says not done. */
export function useOnboardingAutoStart(): {
  open: boolean
  setOpen: (open: boolean) => void
  startTour: () => void
  done: boolean
} {
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState(() =>
    typeof window === 'undefined' ? true : readOnboardingPersistence().done,
  )

  useEffect(() => {
    if (done) return
    const timer = window.setTimeout(() => setOpen(true), 400)
    return () => window.clearTimeout(timer)
  }, [done])

  return {
    open,
    setOpen: (next) => {
      setOpen(next)
      if (!next) setDone(readOnboardingPersistence().done)
    },
    startTour: () => {
      setDone(false)
      setOpen(true)
    },
    done,
  }
}
