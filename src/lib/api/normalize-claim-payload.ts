import type { TeamRewardSignature } from '~/lib/api/types'

function pickString(record: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = record[key]
    if (typeof value === 'string' && value.length > 0) {
      return value
    }
  }
  return undefined
}

function parseAmountWei(record: Record<string, unknown>): string | undefined {
  const direct = pickString(record, ['amountWei', 'amount_wei', 'amountWeiStr'])
  if (direct) return direct

  const amount = pickString(record, ['amount'])
  if (!amount) return undefined

  if (/^\d+$/.test(amount)) return amount

  const parsed = Number(amount)
  if (!Number.isFinite(parsed)) return undefined

  return BigInt(Math.round(parsed * 1e18)).toString()
}

export function normalizeTeamRewardClaimPayload(payload: TeamRewardSignature): {
  signature: `0x${string}`
  salt: `0x${string}`
  amountWei: bigint
} {
  const record = payload as TeamRewardSignature & Record<string, unknown>
  const signature = pickString(record, ['signature'])
  const salt = pickString(record, ['salt', 'saltHash', 'salt_hash'])
  const amountWeiStr = parseAmountWei(record)

  if (!signature) {
    throw new Error('Claim API did not return signature')
  }

  if (!salt) {
    throw new Error(
      'Claim API returned signature only; salt is required for on-chain claim (see POST /claim/team-reward)',
    )
  }

  if (!amountWeiStr) {
    throw new Error(
      'Claim API returned signature only; amountWei is required for on-chain claim (see POST /claim/team-reward)',
    )
  }

  return {
    signature: signature as `0x${string}`,
    salt: salt as `0x${string}`,
    amountWei: BigInt(amountWeiStr),
  }
}
