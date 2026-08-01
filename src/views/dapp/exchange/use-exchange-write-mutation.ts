import { useRef } from 'react'

import { useChainMutation } from '~/hooks/use-chain-mutation'
import type { WriteSession } from '~/web3/wallet/require-write-session'
import { WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'

export type ExchangeSubmitOutcome = { ok: true } | { ok: false; error: unknown | null }

/** Shared EXCHANGE write envelope + outcome latch for market/flash/burn quote and turbine. */
export function useExchangeWriteMutation(onClearAmount: () => void) {
  const submitOutcomeRef = useRef<ExchangeSubmitOutcome>({ ok: false, error: null })

  const chainWrite = useChainMutation({
    path: WRITE_PATH.EXCHANGE,
    mutation: async (run: (session: WriteSession) => Promise<void>, session) => {
      await run(session)
    },
    onSuccess: () => {
      onClearAmount()
      submitOutcomeRef.current = { ok: true }
    },
    onError: (err) => {
      // Unknown outcome locks the path inside the envelope → `isLocked` / blockResubmit.
      submitOutcomeRef.current = { ok: false, error: err }
    },
  })

  return {
    chainWrite,
    submitOutcomeRef,
    isSubmitting: chainWrite.isPending,
    blockResubmit: chainWrite.isLocked,
  }
}
