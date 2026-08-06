import { useEffect, useState } from 'react'

import { useI18n } from '~/i18n/use-i18n'
import { useDappHostStore } from '~/stores/dapp-host-store'
import { useExchangeViewStore } from '~/stores/exchange-view-store'
import { OnboardingSpotlight } from '~/views/dapp/host/onboarding/onboarding-spotlight'
import { prepareOnboardingStep } from '~/views/dapp/host/onboarding/onboarding-steps'
import {
  type OnboardingChromeCopy,
  OnboardingTourTooltip,
} from '~/views/dapp/host/onboarding/onboarding-tooltip'
import {
  ONBOARDING_STEP_COUNT,
  readOnboardingPersistence,
  writeOnboardingDone,
} from '~/views/dapp/host/onboarding/shared'

/**
 * DApp 新手引导（不包含创世页）。
 *
 * 自研 spotlight：紧贴目标 primary 描边、气泡视口躲避；
 * 首次访问（storage 未完成）自动启动一次；PC 顶栏可重播，H5 隐藏重播入口。
 * 完成/跳过：关 H5 抽屉并回到兑换中心（DApp 首页）。
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
  /** 文案/点阵与高亮对齐：仅在 prepare 完成后推进 */
  const [displayStep, setDisplayStep] = useState(0)
  const [disabledActions, setDisabledActions] = useState(false)
  const [target, setTarget] = useState<Element | null>(null)
  const [prevOpen, setPrevOpen] = useState(open)

  // 打开瞬间重置步骤（React「依据 props 调整 state」）
  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open) {
      setCurrentStep(0)
      setDisplayStep(0)
      setTarget(null)
      setDisabledActions(true)
    }
  }

  const copy: OnboardingChromeCopy = {
    skip: t.onboarding.skip,
    prev: t.onboarding.prev,
    next: t.onboarding.next,
    done: t.onboarding.done,
    steps: t.onboarding.steps,
  }

  useEffect(() => {
    if (!open) return
    const controller = new AbortController()
    void prepareOnboardingStep(currentStep, controller.signal)
      .then((el) => {
        if (controller.signal.aborted) return
        setTarget(el)
        setDisplayStep(currentStep)
        setDisabledActions(false)
      })
      .catch(() => {
        if (controller.signal.aborted) return
        setTarget(null)
        setDisplayStep(currentStep)
        setDisabledActions(false)
      })
    return () => {
      controller.abort()
    }
  }, [open, currentStep])

  if (!open) return null

  const finish = (done: boolean) => {
    writeOnboardingDone(done)
    const host = useDappHostStore.getState()
    host.setMobileNavOpen(false)
    host.selectTab('exchange')
    useExchangeViewStore.getState().backToHub()
    onOpenChange(false)
  }

  return (
    <OnboardingSpotlight target={target}>
      <OnboardingTourTooltip
        copy={copy}
        currentStep={displayStep}
        disabledActions={disabledActions}
        onComplete={() => finish(true)}
        onNext={() => {
          setDisabledActions(true)
          setCurrentStep((s) => Math.min(ONBOARDING_STEP_COUNT - 1, s + 1))
        }}
        onPrev={() => {
          setDisabledActions(true)
          setCurrentStep((s) => Math.max(0, s - 1))
        }}
        onSkip={() => finish(true)}
      />
    </OnboardingSpotlight>
  )
}

/**
 * 首次访问 DApp 时自动打开引导（持久化标记未完成时；PC / H5 均适用）。
 * H5 仅隐藏顶栏重播按钮，不阻止首次自动弹出。
 *
 * @returns open 是否打开 · setOpen 手动开关 · startTour 重播入口 ·
 *          done 本版本是否已完成过
 */
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
