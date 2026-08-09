import { encodeFunctionResult, parseAbi } from 'viem'

export const USER = '0x1111111111111111111111111111111111111111'
export const ZERO = '0x0000000000000000000000000000000000000000'
export const DAY = 86_400n

export function sessionWithReadClient(readContract) {
  return {
    wallet: { __test: 'must-not-write' },
    address: USER,
    readClient: { readContract },
  }
}

export function enc(abiItem, functionName, result) {
  return encodeFunctionResult({
    abi: parseAbi([abiItem]),
    functionName,
    result,
  })
}

export function ok(returnData) {
  return { success: true, returnData }
}

/** Claim-plan + contribution handlers for mixed/rewards submit mocks. */
export function claimPlanAndContribHandlers(overrides = {}) {
  const { contribution = 1_000_000n, requiredContribution = 1n, rewardAvailable } = overrides

  return {
    queuePlans: () => [
      { releaseDuration: 5n * DAY, feeRate: 0n, feeRecipient: ZERO },
      { releaseDuration: 20n * DAY, feeRate: 0n, feeRecipient: ZERO },
    ],
    getPlanCount: () => 2n,
    getPlan: (request) => {
      const index = Number(request.args?.[0] ?? 0n)
      const period = index === 0 ? 360n * DAY : 540n * DAY
      return [period, 0n, ZERO, true]
    },
    originalOf: () => ZERO,
    userContribution: () => contribution,
    quoteRequiredContribution: () => requiredContribution,
    balanceOf: () => (rewardAvailable === undefined ? contribution : rewardAvailable),
  }
}

export function dispatchRead(handlers, request) {
  const byName = handlers[request.functionName]
  if (typeof byName === 'function') return byName(request)
  if (byName !== undefined) return byName
  throw new Error(`unexpected ${request.functionName}`)
}
