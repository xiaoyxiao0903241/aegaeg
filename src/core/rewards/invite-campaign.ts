/** 邀请奖活动结束：2026-11-20 00:00 UTC。 */
const INVITE_CAMPAIGN_END_MS = Date.parse('2026-11-20T00:00:00Z')

/**
 * 邀请奖活动剩余时间。
 *
 * @param nowMs 当前时间毫秒
 * @returns 整天数，以及 `HH:MM`
 */
export function inviteCampaignCountdown(nowMs: number): { days: number; clock: string } {
  const left = Math.max(0, INVITE_CAMPAIGN_END_MS - nowMs)
  const days = Math.floor(left / 86_400_000)
  const hours = Math.floor((left % 86_400_000) / 3_600_000)
  const minutes = Math.floor((left % 3_600_000) / 60_000)
  const pad = (value: number) => String(value).padStart(2, '0')
  return { days, clock: `${pad(hours)}:${pad(minutes)}` }
}
