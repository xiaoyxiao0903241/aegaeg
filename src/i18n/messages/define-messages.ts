/** Compile-time helper for locale files; keeps inference without circular imports. */
export function defineMessages<T>(messages: T): T {
  return messages
}
