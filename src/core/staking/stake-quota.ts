/**
 * 质押有效额度：池全局剩余 ∩ 个人累计剩余 ∩（活期）个人日剩余。
 * limit=0 表示该层不限，不参与取 min。
 */

export type StakeQuotaKind = 'pool' | 'personal' | 'personalDaily'

export type StakeEffectiveQuota = {
  remaining: bigint
  /** 收紧有效额度的那一层；并列时优先个人层（对用户更可行动）。 */
  kind: StakeQuotaKind
}

const KIND_TIE_ORDER: Record<StakeQuotaKind, number> = {
  personalDaily: 0,
  personal: 1,
  pool: 2,
}

/**
 * 多层额度取最紧一层，并标出是个人还是池（链上全局）在卡。
 *
 * @param args.poolRemaining `remainingStakeAmount()` 池/全局剩余
 * @param args.personalRemaining 单地址累计剩余；`null` = 该层不限
 * @param args.personalDailyRemaining 单地址日剩余；`null`/省略 = 不限或非活期
 */
export function pickStakeEffectiveQuota(args: {
  poolRemaining: bigint
  personalRemaining: bigint | null
  personalDailyRemaining?: bigint | null
}): StakeEffectiveQuota {
  const candidates: StakeEffectiveQuota[] = [{ remaining: args.poolRemaining, kind: 'pool' }]
  if (args.personalRemaining != null) {
    candidates.push({ remaining: args.personalRemaining, kind: 'personal' })
  }
  if (args.personalDailyRemaining != null) {
    candidates.push({ remaining: args.personalDailyRemaining, kind: 'personalDaily' })
  }

  let best = candidates[0]!
  for (const next of candidates.slice(1)) {
    if (next.remaining < best.remaining) {
      best = next
      continue
    }
    if (
      next.remaining === best.remaining &&
      KIND_TIE_ORDER[next.kind] < KIND_TIE_ORDER[best.kind]
    ) {
      best = next
    }
  }
  return best
}

/** 有限层剩余；`limit === 0` → 不限（`null`）。 */
export function remainingAfterFiniteLimit(limit: bigint, used: bigint): bigint | null {
  if (limit === 0n) return null
  return limit > used ? limit - used : 0n
}
