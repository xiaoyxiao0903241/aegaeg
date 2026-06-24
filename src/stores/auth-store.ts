import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { normalizeAuthAddress } from '~/lib/api/auth/auth-address'
import { isJwtExpired, withJwtExpiry } from '~/lib/api/auth/jwt'
import type { StoredLoginSignature } from '~/lib/api/auth/login-signature-cache'
import {
  AUTH_SESSION_STORAGE_KEY,
  AUTH_SIGNATURE_STORAGE_KEY,
  type StoredAuthSession,
} from '~/lib/api/auth/session'

export const AUTH_STORE_STORAGE_KEY = 'aegis.auth.store'

interface AuthPersistState {
  session: StoredAuthSession | null
  signaturesByAddress: Record<string, StoredLoginSignature>
  sessionsByAddress: Record<string, StoredAuthSession>
}

interface AuthStore extends AuthPersistState {
  hasHydrated: boolean
  loginError: string | null
  isLoggingIn: boolean
  setHasHydrated: (value: boolean) => void
  setSession: (session: StoredAuthSession) => void
  clearSession: () => void
  upsertSessionForAddress: (session: StoredAuthSession) => void
  readSessionForAddress: (address: string | undefined) => StoredAuthSession | null
  removeSessionForAddress: (address: string) => void
  upsertSignatureForAddress: (signature: StoredLoginSignature) => void
  readSignatureForAddress: (address: string | undefined) => StoredLoginSignature | null
  clearSignatureForAddress: (address: string) => void
  setLoginError: (error: string | null) => void
  setIsLoggingIn: (value: boolean) => void
}

function readLegacyPersistedAuth(): Partial<AuthPersistState> | null {
  if (typeof localStorage === 'undefined') return null

  try {
    const legacySessionRaw = localStorage.getItem(AUTH_SESSION_STORAGE_KEY)
    const legacySignatureRaw = localStorage.getItem(AUTH_SIGNATURE_STORAGE_KEY)
    if (!legacySessionRaw && !legacySignatureRaw) return null

    const session = legacySessionRaw
      ? (JSON.parse(legacySessionRaw) as StoredAuthSession)
      : null
    const legacySignature = legacySignatureRaw
      ? (JSON.parse(legacySignatureRaw) as unknown)
      : null

    localStorage.removeItem(AUTH_SESSION_STORAGE_KEY)
    localStorage.removeItem(AUTH_SIGNATURE_STORAGE_KEY)

    const signaturesByAddress: Record<string, StoredLoginSignature> = {}
    if (legacySignature && typeof legacySignature === 'object') {
      if ('address' in legacySignature && typeof legacySignature.address === 'string') {
        signaturesByAddress[normalizeAuthAddress(legacySignature.address)] =
          legacySignature as StoredLoginSignature
      } else {
        Object.assign(signaturesByAddress, legacySignature as Record<string, StoredLoginSignature>)
      }
    }

    const sessionsByAddress: Record<string, StoredAuthSession> = {}
    const normalizedSession = normalizePersistedSession(session)
    if (normalizedSession) {
      sessionsByAddress[normalizeAuthAddress(normalizedSession.address)] = normalizedSession
    }

    return {
      session: normalizedSession,
      signaturesByAddress,
      sessionsByAddress,
    }
  } catch {
    return null
  }
}

function normalizePersistedSession(
  session: StoredAuthSession | null,
): StoredAuthSession | null {
  if (!session?.token || !session.address) return null
  if (isJwtExpired(session.token)) return null
  return withJwtExpiry(session)
}

function normalizePersistedSessions(
  sessionsByAddress: Record<string, StoredAuthSession> | undefined,
): Record<string, StoredAuthSession> {
  if (!sessionsByAddress) return {}

  return Object.fromEntries(
    Object.entries(sessionsByAddress).flatMap(([address, session]) => {
      const normalized = normalizePersistedSession(session)
      return normalized ? [[normalizeAuthAddress(address), normalized] as const] : []
    }),
  )
}

function normalizeLegacyPersistedState(
  persistedState: Partial<AuthPersistState & { signature?: StoredLoginSignature | null }>,
  legacy: Partial<AuthPersistState> | null,
): AuthPersistState {
  const signaturesByAddress = {
    ...(legacy?.signaturesByAddress ?? {}),
    ...(persistedState.signaturesByAddress ?? {}),
  }

  if (persistedState.signature?.address) {
    signaturesByAddress[normalizeAuthAddress(persistedState.signature.address)] =
      persistedState.signature
  }

  const sessionsByAddress = normalizePersistedSessions({
    ...(legacy?.sessionsByAddress ?? {}),
    ...(persistedState.sessionsByAddress ?? {}),
  })

  const session =
    normalizePersistedSession(persistedState.session ?? null) ??
    normalizePersistedSession(legacy?.session ?? null)

  if (session) {
    sessionsByAddress[normalizeAuthAddress(session.address)] = session
  }

  return {
    session,
    signaturesByAddress,
    sessionsByAddress,
  }
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      session: null,
      signaturesByAddress: {},
      sessionsByAddress: {},
      hasHydrated: false,
      loginError: null,
      isLoggingIn: false,
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      setSession: (session) => {
        const normalized = normalizePersistedSession(session)
        if (!normalized) {
          set({ session: null })
          return
        }

        set((state) => ({
          session: normalized,
          sessionsByAddress: {
            ...state.sessionsByAddress,
            [normalizeAuthAddress(normalized.address)]: normalized,
          },
        }))
      },
      clearSession: () => set({ session: null }),
      upsertSessionForAddress: (session) => {
        const normalized = normalizePersistedSession(session)
        if (!normalized) return

        set((state) => ({
          sessionsByAddress: {
            ...state.sessionsByAddress,
            [normalizeAuthAddress(normalized.address)]: normalized,
          },
        }))
      },
      readSessionForAddress: (address) => {
        if (!address) return null
        return get().sessionsByAddress[normalizeAuthAddress(address)] ?? null
      },
      removeSessionForAddress: (address) =>
        set((state) => {
          const key = normalizeAuthAddress(address)
          const { [key]: _removed, ...sessionsByAddress } = state.sessionsByAddress
          return { sessionsByAddress }
        }),
      upsertSignatureForAddress: (signature) =>
        set((state) => ({
          signaturesByAddress: {
            ...state.signaturesByAddress,
            [normalizeAuthAddress(signature.address)]: signature,
          },
        })),
      readSignatureForAddress: (address) => {
        if (!address) return null
        return get().signaturesByAddress[normalizeAuthAddress(address)] ?? null
      },
      clearSignatureForAddress: (address) =>
        set((state) => {
          const key = normalizeAuthAddress(address)
          const { [key]: _removed, ...signaturesByAddress } = state.signaturesByAddress
          return { signaturesByAddress }
        }),
      setLoginError: (loginError) => set({ loginError }),
      setIsLoggingIn: (isLoggingIn) => set({ isLoggingIn }),
    }),
    {
      name: AUTH_STORE_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        session: state.session,
        signaturesByAddress: state.signaturesByAddress,
        sessionsByAddress: state.sessionsByAddress,
      }),
      merge: (persisted, currentState) => {
        const legacy = readLegacyPersistedAuth()
        const persistedState = (persisted ?? {}) as Partial<
          AuthPersistState & { signature?: StoredLoginSignature | null }
        >
        const merged = normalizeLegacyPersistedState(persistedState, legacy)

        return {
          ...currentState,
          ...merged,
        }
      },
      onRehydrateStorage: () => (state, error) => {
        if (error || !state) {
          state?.setHasHydrated(true)
          return
        }

        if (state.session && isJwtExpired(state.session.token)) {
          state.clearSession()
        }

        state.setHasHydrated(true)
      },
    },
  ),
)

export function createMemoryAuthStoreState(
  initial: Partial<AuthPersistState> = {},
): AuthStore {
  return {
    session: initial.session ?? null,
    signaturesByAddress: initial.signaturesByAddress ?? {},
    sessionsByAddress: initial.sessionsByAddress ?? {},
    hasHydrated: true,
    loginError: null,
    isLoggingIn: false,
    setHasHydrated: () => {},
    setSession: () => {},
    clearSession: () => {},
    upsertSessionForAddress: () => {},
    readSessionForAddress: () => null,
    removeSessionForAddress: () => {},
    upsertSignatureForAddress: () => {},
    readSignatureForAddress: () => null,
    clearSignatureForAddress: () => {},
    setLoginError: () => {},
    setIsLoggingIn: () => {},
  }
}
