import type { EpochScheduleLabels } from '~/core/staking/staking-yield'
import { interpolate } from '~/i18n/interpolate'

/**
 * 将 Epoch 日程 `{blocks}` / `{hours}` / `{timesPerDay}` 写入文案模板。
 */
export function withEpochSchedule(template: string, labels: EpochScheduleLabels): string {
  return interpolate(template, labels)
}

/**
 * FAQ 答案插值 Epoch 日程。
 */
export function mapFaqWithEpochSchedule<T extends { q: string; a: string }>(
  items: readonly T[],
  labels: EpochScheduleLabels,
): T[] {
  return items.map((item) => ({ ...item, a: withEpochSchedule(item.a, labels) }))
}

/**
 * 机制步骤 body 插值 Epoch 日程。
 */
export function mapStepsWithEpochSchedule<T extends { title: string; body: string }>(
  steps: readonly T[],
  labels: EpochScheduleLabels,
): T[] {
  return steps.map((step) => ({ ...step, body: withEpochSchedule(step.body, labels) }))
}
