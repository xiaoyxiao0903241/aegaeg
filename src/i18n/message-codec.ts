import { inflateSync, strFromU8 } from 'fflate'

/** HTML 引导脚本的编码标记（data-enc），与 home-renderer 的 zlib 编码端成对演进。 */
export const MESSAGE_PAYLOAD_ENCODING = 'deflate-b64'

/**
 * base64 文案载荷 → 原始字节。
 *
 * atob 返回 binary string，必须逐字节取码点组装 Uint8Array；
 * 不能把 binary string 直接交给 TextDecoder（会按 UTF-8 展开每个码点）。
 */
export function base64ToBytes(payload: string): Uint8Array {
  const binary = atob(payload)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes
}

/**
 * 解压（deflate-raw）并解析文案 JSON。
 *
 * 编码端有两处，都用 node zlib 的 `deflateRawSync` 序列化文案袋：
 * home-renderer（HTML 引导，base64 文本）与 render-home.mjs（public/i18n/&lt;locale&gt;.bin，原始字节）。
 * 本函数是浏览器侧唯一解码入口；同步实现 —— 首屏 `getMessagesSync` 不允许异步。
 */
export function inflateMessages<T>(bytes: Uint8Array): T {
  return JSON.parse(strFromU8(inflateSync(bytes))) as T
}
