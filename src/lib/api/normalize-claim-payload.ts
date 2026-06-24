import type { TeamRewardSignature } from '~/lib/api/types'

function pickString(record: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = record[key]
    if (typeof value === 'string' && value.length > 0) return value
    if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  }
  return undefined
}

function parseAmountWei(record: Record<string, unknown>): string | undefined {
  const direct = pickString(record, ['amountWei', 'amount_wei', 'amountWeiStr'])
  if (direct && /^\d+$/.test(direct)) return direct

  const amount = pickString(record, ['amount'])
  if (!amount) return direct

  if (/^\d+$/.test(amount)) return amount

  const parsed = Number(amount)
  if (!Number.isFinite(parsed)) return undefined

  return BigInt(Math.round(parsed * 1e18)).toString()
}

/** uint256 contract field (signType / expireTime). Accepts int, decimal, or ISO date (→ unix seconds). */
function parseUintField(record: Record<string, unknown>, keys: string[]): bigint | undefined {
  const raw = pickString(record, keys)
  if (raw === undefined) return undefined
  if (/^\d+$/.test(raw)) return BigInt(raw)

  const ms = Date.parse(raw)
  if (Number.isFinite(ms)) return BigInt(Math.floor(ms / 1000))

  const num = Number(raw)
  if (Number.isFinite(num)) return BigInt(Math.trunc(num))
  return undefined
}

/**
 * Normalize the `/claim/team-reward` response into the exact arguments the
 * on-chain `claimReward(signType, amount, expireTime, salt, signature)` needs
 * (verified on impl 0x0265…fb7b). The backend signs over these values, so they
 * must match exactly. If a field is missing we throw with the actual payload
 * keys so the real API shape is visible.
 */
export function normalizeTeamRewardClaimPayload(payload: TeamRewardSignature): {
  signature: `0x${string}`
  salt: `0x${string}`
  signType: bigint
  amountWei: bigint
  expireTime: bigint
} {
  const record = payload as TeamRewardSignature & Record<string, unknown>
  const signature = pickString(record, ['signature', 'sign'])
  const salt = pickString(record, ['salt', 'saltHash', 'salt_hash'])
  const amountWeiStr = parseAmountWei(record)
  const signType = parseUintField(record, ['signType', 'sign_type', 'signtype', 'type'])
  const expireTime = parseUintField(record, [
    'expireTime',
    'expire_time',
    'expiretime',
    'expireAt',
    'expire_at',
    'deadline',
    'expiry',
  ])

  const missing: string[] = []
  if (!signature) missing.push('signature')
  if (!salt) missing.push('salt')
  if (!amountWeiStr) missing.push('amount/amountWei')
  if (signType === undefined) missing.push('signType')
  if (expireTime === undefined) missing.push('expireTime')

  if (missing.length > 0) {
    throw new Error(
      `领取签名缺少字段: ${missing.join(', ')}。/claim/team-reward 实际返回字段: [${Object.keys(record).join(', ')}]`,
    )
  }

  return {
    signature: signature as `0x${string}`,
    salt: salt as `0x${string}`,
    signType: signType as bigint,
    amountWei: BigInt(amountWeiStr as string),
    expireTime: expireTime as bigint,
  }
}
