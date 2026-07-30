import { parseAbi } from 'viem'
import { resolveAgxSellTaxBps } from '~/core/exchange/agx-sell-tax'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { AGX_SELL_TAX_METHODS } from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'
import type { ChainReadClient } from '~/web3/chain-read-client'

const agxSellTaxAbi = parseAbi([
  AGX_SELL_TAX_METHODS.sellRatio,
  AGX_SELL_TAX_METHODS.extraSellBP,
  AGX_SELL_TAX_METHODS.crashFuseActive,
])

/** Live AGX sell-tax bps for non-whitelist pair sells. */
export async function readAgxSellTaxBps(
  client: ChainReadClient = bscReadClient,
  agx: `0x${string}` = BSC_CONTRACTS.agx,
): Promise<number> {
  const [sellRatio, extraSellBP, crashFuseActive] = await Promise.all([
    client.readContract({
      address: agx,
      abi: agxSellTaxAbi,
      functionName: 'sellRatio',
    }),
    client.readContract({
      address: agx,
      abi: agxSellTaxAbi,
      functionName: 'extraSellBP',
    }),
    client.readContract({
      address: agx,
      abi: agxSellTaxAbi,
      functionName: 'crashFuseActive',
    }),
  ])

  return resolveAgxSellTaxBps({ crashFuseActive, sellRatio, extraSellBP })
}
