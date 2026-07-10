import {
  evaluateGenesisPostApproveGate,
  type GenesisPostApproveGate,
} from '~/core/presale/presale-math'

/**
 * Re-read bind + pause after approve (or any await) so the post-approve gate
 * does not close over a stale React Query render snapshot.
 */
export async function fetchLiveGenesisPostApproveGate(args: {
  address: string | undefined
  fetchIsBound: (address: string) => Promise<boolean>
  fetchPaused: () => Promise<boolean>
}): Promise<GenesisPostApproveGate> {
  if (!args.address) {
    return { ok: false, reason: 'not_bound' }
  }

  try {
    const [isBound, isPaused] = await Promise.all([
      args.fetchIsBound(args.address),
      args.fetchPaused(),
    ])
    return evaluateGenesisPostApproveGate({
      isBound,
      isPaused,
      isPausedUnknown: false,
    })
  } catch {
    return { ok: false, reason: 'unavailable' }
  }
}
