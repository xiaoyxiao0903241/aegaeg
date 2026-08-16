import { appEnv } from '~/shared/config/env'
import { getRuntimeHostname } from '~/shared/lib/runtime-host'

/** SIWE（EIP-4361）登录消息字段。 */
export interface SiweLoginFields {
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

const DEFAULT_STATEMENT = 'Sign in to AEGIS X to access your account.'
const DEFAULT_VERSION = '1'
const DEFAULT_TTL_MS = 60 * 60 * 1000

/**
 * 生成登录 nonce。
 *
 * 优先用 crypto.randomUUID；不可用（旧环境）时退化为时间戳 + 随机串。
 *
 * @returns nonce 字符串
 */
export function generateLoginNonce(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

/**
 * 按参数生成 SIWE 登录字段。
 *
 * domain 默认取运行时 hostname；issuedAt 默认当前时间，有效期默认 1 小时，
 * invalid_before 置为 issuedAt 前一小时。
 *
 * @param params.address 钱包地址
 * @param params.chainId 链 ID
 * @param params.domain 站点域名，默认运行时 hostname
 * @param params.nonce 登录 nonce，默认自动生成
 * @param params.issuedAt 签发时间 ISO 字符串，默认当前时间
 * @param params.ttlMs 有效期毫秒，默认 1 小时
 * @returns SIWE 登录字段对象
 */
export function createSiweLoginFields(params: {
  address: string
  chainId: number
  domain?: string
  nonce?: string
  issuedAt?: string
  ttlMs?: number
}): SiweLoginFields {
  const issuedAtMs = params.issuedAt ? Date.parse(params.issuedAt) : Date.now()
  const ttlMs = params.ttlMs ?? DEFAULT_TTL_MS

  const domain = params.domain ?? getRuntimeHostname()

  return {
    domain,
    address: params.address,
    statement: DEFAULT_STATEMENT,
    uri: `https://${domain}`,
    version: DEFAULT_VERSION,
    chain_id: String(params.chainId),
    nonce: params.nonce ?? generateLoginNonce(),
    issued_at: new Date(issuedAtMs).toISOString(),
    expiration_time: new Date(issuedAtMs + ttlMs).toISOString(),
    invalid_before: new Date(issuedAtMs - ttlMs).toISOString(),
  }
}

/**
 * 将 SIWE 字段拼装为 EIP-4361 签名消息文本。
 *
 * @param payload SIWE 登录字段
 * @returns 待钱包签名的完整消息
 */
export function siweLoginMessage(payload: SiweLoginFields): string {
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

/**
 * 生成简版登录消息（Address + Nonce + Issued At）。
 *
 * 供不支持 EIP-4361 的钱包回退使用。
 *
 * @param params.address 钱包地址
 * @param params.nonce 登录 nonce
 * @param params.issuedAt 签发时间 ISO 字符串，默认当前时间
 * @returns 待签名的明文消息
 */
export function simpleLoginMessage(params: {
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

/**
 * 按指定格式生成登录消息。
 *
 * 默认 SIWE；format 传 'simple' 时走简版，用于钱包拒绝 EIP-4361 的回退。
 *
 * @param params.address 钱包地址
 * @param params.chainId 链 ID（SIWE 需要）
 * @param params.nonce 登录 nonce，默认自动生成
 * @param params.issuedAt 签发时间 ISO 字符串
 * @param params.domain 站点域名
 * @param format 消息格式，默认 'siwe'
 * @returns 待签名的登录消息
 */
export function loginMessage(
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
    return simpleLoginMessage({
      address: params.address,
      nonce,
      issuedAt: params.issuedAt,
    })
  }

  const payload = createSiweLoginFields({
    address: params.address,
    chainId: params.chainId,
    domain: params.domain,
    nonce,
    issuedAt: params.issuedAt,
  })

  return siweLoginMessage(payload)
}

/**
 * 读取当前登录消息格式（环境变量配置）。
 *
 * 配置无效时默认回退到 'siwe'。
 *
 * @returns 'siwe' 或 'simple'
 */
export function loginMessageFormat(): LoginMessageFormat {
  const configured = appEnv.authMessageFormat

  if (configured === 'simple' || configured === 'siwe') {
    return configured
  }

  return 'siwe'
}
