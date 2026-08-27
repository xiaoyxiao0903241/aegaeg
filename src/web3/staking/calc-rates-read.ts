import { parseAbi } from 'viem'

import { epochsPerDayFromLength } from '~/core/staking/staking-yield'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { BSC_BLOCK_SECONDS } from '~/shared/lib/constants'
import { STAKING_POOL_METHODS } from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'

const stakingPoolAbi = parseAbi([STAKING_POOL_METHODS.epoch])

export type CalcLiveRates = {
  epochsPerDay: number | null
}

/**
 * 计算器日频：只读当前 epoch.length，不查 rebase 率。
 *
 * rebase 走独立查询，避免右侧曲线卡在探测上。
 *
 * @returns 每日 epoch 数
 * @see docs/onchain-manual/contracts/stakingpool.md
 */
export async function readCalcLiveRates(): Promise<CalcLiveRates> {
  const epoch = await bscReadClient.readContract({
    address: BSC_CONTRACTS.stakingPool,
    abi: stakingPoolAbi,
    functionName: 'epoch',
  })
  return {
    epochsPerDay: epochsPerDayFromLength(epoch[0], BSC_BLOCK_SECONDS),
  }
}
