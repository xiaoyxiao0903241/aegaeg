import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Check } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { useI18n } from '~/i18n/use-i18n'
import { ResponsiveDialog, SheetHandle } from '~/shared/components/dialog'
import { MainButton } from '~/shared/components/main-button'
import { Text } from '~/shared/components/text'
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
import { withEpochSchedule } from '~/views/dapp/shared/epoch-schedule'
import { useEpochScheduleLabels } from '~/web3/staking/use-staking-queries'

/**
 * DApp 新手引导（不包含创世页）。
 *
 * 自研 spotlight：紧贴目标 primary 描边、气泡视口躲避；
 * 首次访问（storage 未完成）自动启动一次；PC 顶栏可重播，H5 隐藏重播入口。
 * 走完 12 步后弹出「教程完成」对话框；跳过则直接结束。
 * 结束时关 H5 抽屉并回到兑换中心（DApp 首页）。
 */
export function OnboardingGuide({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { messages: t } = useI18n()
  const epochSchedule = useEpochScheduleLabels()
  const onboardingSteps = useMemo(
    () =>
      t.onboarding.steps.map((step) => ({
        ...step,
        body: withEpochSchedule(step.body, epochSchedule),
      })),
    [t.onboarding.steps, epochSchedule],
  )
  const [currentStep, setCurrentStep] = useState(0)
  /** 文案/点阵与高亮对齐：仅在 prepare 完成后推进 */
  const [displayStep, setDisplayStep] = useState(0)
  const [disabledActions, setDisabledActions] = useState(false)
  const [target, setTarget] = useState<Element | null>(null)
  const [completeOpen, setCompleteOpen] = useState(false)
  const [prevOpen, setPrevOpen] = useState(open)

  // 打开瞬间重置步骤（React「依据 props 调整 state」）
  if (open !== prevOpen) {
    setPrevOpen(open)
    setCompleteOpen(false)
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
    steps: onboardingSteps,
  }

  useEffect(() => {
    if (!open || completeOpen) return
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
  }, [open, currentStep, completeOpen])

  if (!open) return null

  const finish = (done: boolean) => {
    writeOnboardingDone(done)
    const host = useDappHostStore.getState()
    host.setMobileNavOpen(false)
    host.selectTab('exchange')
    useExchangeViewStore.getState().backToHub()
    setCompleteOpen(false)
    onOpenChange(false)
  }

  const showComplete = () => {
    writeOnboardingDone(true)
    useDappHostStore.getState().setMobileNavOpen(false)
    setCompleteOpen(true)
  }

  return (
    <>
      {completeOpen ? null : (
        <OnboardingSpotlight target={target}>
          <OnboardingTourTooltip
            copy={copy}
            currentStep={displayStep}
            disabledActions={disabledActions}
            onComplete={showComplete}
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
      )}
      <OnboardingCompleteDialog
        body={t.onboarding.complete.body}
        cta={t.onboarding.complete.cta}
        onDismiss={() => finish(true)}
        open={completeOpen}
        title={t.onboarding.complete.title}
      />
    </>
  )
}

/**
 * 教程走完后的完成确认弹窗。
 *
 * 点主按钮或关掉弹窗都会结束引导并回到兑换中心。
 *
 * @param open 是否打开
 * @param title 标题
 * @param body 说明
 * @param cta 主按钮文案
 * @param onDismiss 关闭或点主按钮
 */
function OnboardingCompleteDialog({
  body,
  cta,
  onDismiss,
  open,
  title,
}: {
  open: boolean
  title: string
  body: string
  cta: string
  onDismiss: () => void
}) {
  return (
    <ResponsiveDialog
      className="dapp:max-w-sm dapp:px-8 dapp:py-8"
      onOpenChange={(next) => {
        if (!next) onDismiss()
      }}
      open={open}
      overlayClassName="bg-modal-overlay-strong"
    >
      <SheetHandle />
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
          <Check aria-hidden className="size-7" strokeWidth={2.5} />
        </span>
        <DialogPrimitive.Title asChild>
          <Text as="h2" className="m-0 font-semibold" variant="copy">
            {title}
          </Text>
        </DialogPrimitive.Title>
        <DialogPrimitive.Description asChild>
          <Text as="p" className="m-0 leading-normal" tone="muted-foreground" variant="caption">
            {body}
          </Text>
        </DialogPrimitive.Description>
        <MainButton className="mt-1 dapp:w-auto dapp:px-7" onClick={onDismiss}>
          {cta}
        </MainButton>
      </div>
    </ResponsiveDialog>
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
