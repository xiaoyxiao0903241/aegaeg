import { BSC_CONTRACTS, type Address } from '~/shared/config/contracts'
import {
  burnBondDepositoryKey,
  lpBondDepositoryKey,
  stakePoolKey,
  type BondPeriod,
  type StakePeriod,
} from '~/core/staking/staking-period'

/** Resolve staking pool address for AGX stake open path. */
export function stakePoolAddress(period: StakePeriod): Address {
  return BSC_CONTRACTS[stakePoolKey(period)]
}

/** Resolve LP Bond depository for BondHelper zap. */
export function lpBondDepositoryAddress(period: BondPeriod): Address {
  return BSC_CONTRACTS[lpBondDepositoryKey(period)]
}

/** Resolve Burn Bond depository for BondHelper zap. */
export function burnBondDepositoryAddress(period: BondPeriod): Address {
  return BSC_CONTRACTS[burnBondDepositoryKey(period)]
}
