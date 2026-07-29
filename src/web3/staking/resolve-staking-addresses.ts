import { BSC_CONTRACTS, type Address } from '~/shared/config/contracts'
import {
  resolveBurnBondDepositoryKey,
  resolveLpBondDepositoryKey,
  resolveStakePoolKey,
  type BondPeriod,
  type StakePeriod,
} from '~/core/staking/staking-period'

/** Resolve staking pool address for AGX stake open path. */
export function resolveStakePoolAddress(period: StakePeriod): Address {
  return BSC_CONTRACTS[resolveStakePoolKey(period)]
}

/** Resolve LP Bond depository for BondHelper zap. */
export function resolveLpBondDepository(period: BondPeriod): Address {
  return BSC_CONTRACTS[resolveLpBondDepositoryKey(period)]
}

/** Resolve Burn Bond depository for BondHelper zap. */
export function resolveBurnBondDepository(period: BondPeriod): Address {
  return BSC_CONTRACTS[resolveBurnBondDepositoryKey(period)]
}
