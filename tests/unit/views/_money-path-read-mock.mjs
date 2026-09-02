import { encodeFunctionResult, parseAbi } from 'viem'

import { loadModule } from '../load-module.mjs'
import { expandAggregate3 } from '../web3/_bsc-read-client-test.mjs'

export const USER = '0x1111111111111111111111111111111111111111'
export const ZERO = '0x0000000000000000000000000000000000000000'
export const DAY = 86_400n

export async function moneyPathSession(readContract) {
  const { setBscReadClientForTest } = await loadModule('/src/web3/bsc-read-client.ts')
  setBscReadClientForTest({ readContract })
  return {
    wallet: { __test: 'must-not-write' },
    address: USER,
  }
}

export async function clearMoneyPathReadClient() {
  const { setBscReadClientForTest } = await loadModule('/src/web3/bsc-read-client.ts')
  setBscReadClientForTest(null)
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

const CLAIM_DISPATCH_ABI = parseAbi([
  'function queuePlans() view returns ((uint256 releaseDuration, uint256 feeRate, address feeRecipient)[])',
  'function getPlanCount() view returns (uint256)',
  'function getPlan(uint256 index) view returns (uint256 period, uint256 taxBP, address target, bool exists)',
  'function originalOf(address account) view returns (address)',
  'function userContribution(address user) view returns (uint256)',
  'function quoteRequiredContribution(uint256 rewardAmount) view returns (uint256)',
  'function paused() view returns (bool)',
  'function getRewardInfo(address user) view returns (uint256 accrued, uint256 claimed, uint256 pending)',
  'function migrationEnabled() view returns (bool)',
  'function isOldAccount(address account) view returns (bool)',
  'function balanceOf(address owner) view returns (uint256)',
  'function getReleasedRewardsWithPlanIndex(address user, uint8 planIndex) view returns (uint256)',
  'function getReleasedRewardsWithOffset(address user, uint8 planIndex, uint256 start, uint256 limit) view returns (uint256)',
  'function getQueuePlanSize(address user, uint8 planIndex) view returns (uint256)',
  'function getRewardsWithPlanIndex(address user, uint8 planIndex) view returns (uint256)',
])

export function dispatchRead(handlers, request) {
  if (request.functionName === 'aggregate3') {
    return expandAggregate3(request, (inner) => dispatchRead(handlers, inner), CLAIM_DISPATCH_ABI)
  }
  const byName = handlers[request.functionName]
  if (typeof byName === 'function') return byName(request)
  if (byName !== undefined) return byName
  throw new Error(`unexpected ${request.functionName}`)
}
