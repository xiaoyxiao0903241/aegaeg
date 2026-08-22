import { loadModule } from '../load-module.mjs'

export async function withBscReadClient(client, run) {
  const { setBscReadClientForTest } = await loadModule('/src/web3/bsc-read-client.ts')
  setBscReadClientForTest(client)
  try {
    return await run()
  } finally {
    setBscReadClientForTest(null)
  }
}
