/** Promise delay — single SSOT for wallet wait / claim retry / invalidate backoff. */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
