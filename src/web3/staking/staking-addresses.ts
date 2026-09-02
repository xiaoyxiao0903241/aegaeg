import {
  type BondPeriod,
  burnBondDepositoryKey,
  lpBondDepositoryKey,
  type StakePeriod,
  stakePoolKey,
} from '~/core/staking/staking-period'
import { type Address, BSC_CONTRACTS } from '~/shared/config/contracts'

/**
 * 活期 / 定期质押池地址
 *
 * AGX 质押开仓写操作的目标合约；按质押周期从合约配置取地址。
 *
 * @param period 质押周期（liquid / 各锁仓周期）
 * @returns 对应质押池合约地址
 * @see 手册 §8 质押 Staking
 */
export function stakePoolAddress(period: StakePeriod): Address {
  return BSC_CONTRACTS[stakePoolKey(period)]
}

/**
 * LP 债券 depository 地址
 *
 * BondHelper LP zap 的债券市场目标；按债券周期取地址。
 *
 * @param period 债券周期
 * @returns 对应 LP 债券市场合约地址
 * @see docs/onchain-manual/contracts/bonddepository.md
 */
export function lpBondDepositoryAddress(period: BondPeriod): Address {
  return BSC_CONTRACTS[lpBondDepositoryKey(period)]
}

/**
 * 销毁债券 depository 地址
 *
 * BondHelper burn zap 的债券市场目标；按债券周期取地址。
 *
 * @param period 债券周期
 * @returns 对应销毁债券市场合约地址
 * @see docs/onchain-manual/contracts/burnbonddepository.md
 */
export function burnBondDepositoryAddress(period: BondPeriod): Address {
  return BSC_CONTRACTS[burnBondDepositoryKey(period)]
}
