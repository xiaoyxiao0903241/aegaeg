export interface SiweLoginPayload {
  domain: string
  address: string
  statement: string
  uri: string
  version: string
  chain_id: string
  nonce: string
  issued_at: string
  expiration_time: string
  invalid_before?: string
  resources?: string[]
}

const DEFAULT_DOMAIN = 'aegis-x.io'
const DEFAULT_STATEMENT = 'Sign in to AEGIS X to access your account.'
const DEFAULT_VERSION = '1'
const DEFAULT_TTL_MS = 60 * 60 * 1000

export function generateLoginNonce(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function createSiweLoginPayload(params: {
  address: string
  chainId: number
  domain?: string
  nonce?: string
  issuedAt?: string
  ttlMs?: number
}): SiweLoginPayload {
  const issuedAtMs = params.issuedAt ? Date.parse(params.issuedAt) : Date.now()
  const ttlMs = params.ttlMs ?? DEFAULT_TTL_MS

  return {
    domain: params.domain ?? DEFAULT_DOMAIN,
    address: params.address,
    statement: DEFAULT_STATEMENT,
    uri: `https://${params.domain ?? DEFAULT_DOMAIN}`,
    version: DEFAULT_VERSION,
    chain_id: String(params.chainId),
    nonce: params.nonce ?? generateLoginNonce(),
    issued_at: new Date(issuedAtMs).toISOString(),
    expiration_time: new Date(issuedAtMs + ttlMs).toISOString(),
    invalid_before: new Date(issuedAtMs - ttlMs).toISOString(),
  }
}

export function buildSiweLoginMessage(payload: SiweLoginPayload): string {
  const header = `${payload.domain} wants you to sign in with your Ethereum account:`
  let prefix = [header, payload.address].join('\n')
  prefix = [prefix, payload.statement].join('\n\n')

  if (payload.statement) {
    prefix += '\n'
  }

  const suffixLines = [
    `URI: ${payload.uri}`,
    `Version: ${payload.version}`,
    `Chain ID: ${payload.chain_id}`,
    `Nonce: ${payload.nonce}`,
    `Issued At: ${payload.issued_at}`,
    `Expiration Time: ${payload.expiration_time}`,
  ]

  if (payload.invalid_before) {
    suffixLines.push(`Not Before: ${payload.invalid_before}`)
  }

  if (payload.resources?.length) {
    suffixLines.push(['Resources:', ...payload.resources.map((item) => `- ${item}`)].join('\n'))
  }

  return [prefix, suffixLines.join('\n')].join('\n')
}

export function buildSimpleLoginMessage(params: {
  address: string
  nonce: string
  issuedAt?: string
}): string {
  const issuedAt = params.issuedAt ?? new Date().toISOString()

  return [
    'Sign in to AEGIS X',
    '',
    `Address: ${params.address}`,
    `Nonce: ${params.nonce}`,
    `Issued At: ${issuedAt}`,
  ].join('\n')
}

export type LoginMessageFormat = 'siwe' | 'simple'

export function buildLoginMessage(
  params: {
    address: string
    chainId: number
    nonce?: string
    issuedAt?: string
    domain?: string
  },
  format: LoginMessageFormat = 'siwe',
): string {
  const nonce = params.nonce ?? generateLoginNonce()

  if (format === 'simple') {
    return buildSimpleLoginMessage({
      address: params.address,
      nonce,
      issuedAt: params.issuedAt,
    })
  }

  const payload = createSiweLoginPayload({
    address: params.address,
    chainId: params.chainId,
    domain: params.domain,
    nonce,
    issuedAt: params.issuedAt,
  })

  return buildSiweLoginMessage(payload)
}

export function resolveLoginMessageFormat(): LoginMessageFormat {
  const configured = import.meta.env.VITE_AUTH_MESSAGE_FORMAT

  if (configured === 'simple' || configured === 'siwe') {
    return configured
  }

  return 'siwe'
}
