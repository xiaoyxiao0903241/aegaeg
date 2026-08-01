import type { Wallet } from 'thirdweb/wallets'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import {
  PRINCIPAL_RELEASE_VAULT_ERRORS,
  PRINCIPAL_RELEASE_VAULT_METHODS,
  REWARD_QUEUE_ERRORS,
  REWARD_QUEUE_METHODS,
} from '~/web3/abis'
import { parseWriteAbi, writeContractViaWallet } from '~/web3/wallet/wallet-contract-write'

const claimAllAbi = parseWriteAbi(REWARD_QUEUE_METHODS.claimAllVestedRewards, REWARD_QUEUE_ERRORS)
const claimManyAbi = parseWriteAbi(
  PRINCIPAL_RELEASE_VAULT_METHODS.claimMany,
  PRINCIPAL_RELEASE_VAULT_ERRORS,
)

export async function writeClaimAllVestedRewards(args: { wallet: Wallet; planIndex: number }) {
  return writeContractViaWallet({
    wallet: args.wallet,
    address: BSC_CONTRACTS.rewardQueue,
    abi: claimAllAbi,
    functionName: 'claimAllVestedRewards',
    args: [args.planIndex],
  })
}

export async function writeClaimManyReleases(args: {
  wallet: Wallet
  start: number
  limit: number
}) {
  return writeContractViaWallet({
    wallet: args.wallet,
    address: BSC_CONTRACTS.principalReleaseVault,
    abi: claimManyAbi,
    functionName: 'claimMany',
    args: [BigInt(args.start), BigInt(args.limit)],
  })
}
