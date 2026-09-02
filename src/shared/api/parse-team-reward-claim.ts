import type { TeamRewardSignature } from '~/shared/api/types'

function pickString(record: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = record[key]
    if (typeof value === 'string' && value.length > 0) return value
    if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  }
  return undefined
}

/**
 * 十进制数字符串精确转 wei
 *
 * 若经 Number()*1e18 转换，超过 2^53 wei（约 0.009 token 精度）会失真，
 * 进而破坏后端签名校验。超过 18 位的小数部分截断。
 */
function decimalToWei(amount: string): string | undefined {
  const match = /^(\d+)(?:\.(\d+))?$/.exec(amount.trim())
  if (!match) return undefined
  const whole = match[1]
  if (whole == null) return undefined
  const fraction = match[2] ?? ''
  const fractionWei = (fraction + '0'.repeat(18)).slice(0, 18)
  return (BigInt(whole) * 10n ** 18n + BigInt(fractionWei)).toString()
}

function parseAmountWei(record: Record<string, unknown>): string | undefined {
  const direct = pickString(record, ['amountWei', 'amount_wei', 'amountWeiStr'])
  if (direct && /^\d+$/.test(direct)) return direct

  const amount = pickString(record, ['amount'])
  if (!amount) return direct

  if (/^\d+$/.test(amount)) return amount

  return decimalToWei(amount)
}

/** uint256 合约字段（signType / expireTime）。接受整数、小数或 ISO 日期（→ unix 秒）。 */
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

function assertHexBytes(value: string, field: string): `0x${string}` {
  if (!/^0x[0-9a-fA-F]+$/.test(value) || value.length < 4 || value.length % 2 !== 0) {
    throw new Error(`team-reward claim field ${field} is not valid hex: ${value.slice(0, 24)}`)
  }
  return value as `0x${string}`
}

/**
 * 归一化 `/claim/team-reward` 响应，得到链上
 * `claimReward(signType, amount, expireTime, salt, signature)` 所需的精确参数
 * （已在实现 0x0265…fb7b 上验证）。后端基于这些值签名，因此必须逐字段精确匹配；
 * 字段缺失时抛出包含实际载荷键的错误，便于暴露真实 API 形状。
 */
export function parseTeamRewardClaim(payload: TeamRewardSignature): {
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
      `team-reward claim missing fields: ${missing.join(', ')}. /claim/team-reward keys: [${Object.keys(record).join(', ')}]`,
    )
  }

  return {
    signature: assertHexBytes(signature!, 'signature'),
    salt: assertHexBytes(salt!, 'salt'),
    signType: signType!,
    amountWei: BigInt(amountWeiStr!),
    expireTime: expireTime!,
  }
}
