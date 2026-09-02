import type { Plugin } from 'vite'

const LAYER_STATEMENT_RE = /@layer\s+[\w.-]+(?:\s*,\s*[\w.-]+)*\s*;/g
const LAYER_BLOCK_RE = /@layer\s+[\w.-]+(?:\s*,\s*[\w.-]+)*\s*\{/g

/**
 * 从开括号位置找配对的闭括号，支持嵌套。
 *
 * @param css CSS 文本
 * @param openBraceIndex 开括号下标
 * @returns 闭括号下标；未闭合时返回 -1
 */
function findMatchingBrace(css: string, openBraceIndex: number) {
  let depth = 0
  let i = openBraceIndex

  while (i < css.length) {
    const char = css[i]
    if (char === '{') {
      depth += 1
    } else if (char === '}') {
      depth -= 1
      if (depth === 0) {
        return i
      }
    }
    i += 1
  }

  return -1
}

/**
 * 展开 Tailwind v4 的 `@layer` 块。
 *
 * 旧版 Chromium（<99）不支持 cascade layers，需去掉 layer 声明并保留块内规则。
 *
 * @param css 原始 CSS 文本
 * @returns 去除 layer 包装后的 CSS 文本
 */
export function flattenCssCascadeLayers(css: string) {
  let out = css.replace(LAYER_STATEMENT_RE, '')

  while (true) {
    LAYER_BLOCK_RE.lastIndex = 0
    const match = LAYER_BLOCK_RE.exec(out)
    if (!match) {
      break
    }

    const layerStart = match.index
    const openBrace = layerStart + match[0].length - 1
    const closeBrace = findMatchingBrace(out, openBrace)
    if (closeBrace < 0) {
      break
    }

    const inner = out.slice(openBrace + 1, closeBrace)
    out = out.slice(0, layerStart) + inner + out.slice(closeBrace + 1)
  }

  return out
}

/**
 * Vite 插件：开发转换与构建产物中统一展开 CSS cascade layers。
 */
export function flattenCssCascadeLayersPlugin(): Plugin {
  const shouldFlatten = (idOrFile: string) => idOrFile.endsWith('.css')

  return {
    name: 'aegis-flatten-css-cascade-layers',
    enforce: 'post',
    transform(code, id) {
      if (!shouldFlatten(id)) {
        return null
      }

      const flattened = flattenCssCascadeLayers(code)
      if (flattened === code) {
        return null
      }

      return { code: flattened, map: null }
    },
    generateBundle(_options, bundle) {
      for (const chunk of Object.values(bundle)) {
        if (chunk.type !== 'asset' || !shouldFlatten(chunk.fileName)) {
          continue
        }

        if (typeof chunk.source === 'string') {
          chunk.source = flattenCssCascadeLayers(chunk.source)
        } else if (chunk.source instanceof Uint8Array) {
          const css = new TextDecoder().decode(chunk.source)
          chunk.source = new TextEncoder().encode(flattenCssCascadeLayers(css))
        }
      }
    },
  }
}
