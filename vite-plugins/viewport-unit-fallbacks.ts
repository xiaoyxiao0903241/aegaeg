import type { Plugin } from 'vite'

/**
 * 为旧版 Chromium 注入经典视口单位回退。
 *
 * 目标浏览器 Chrome 90–107 不识别 dvh/svh/lvh/dvw/svw/lvw，
 * lightningcss 也不会自动改写（parcel-bundler/lightningcss#534），
 * 因此在现代单位前补一条 vh/vw 声明，源码仍可只写现代单位。
 */

const MODERN_VIEWPORT_UNIT_RE = /\b(\d*\.?\d+)(d|s|l)v(h|w)\b/g

const DECLARATION_RE = /(?<=[{;])(\s*)([a-zA-Z-]+)(\s*:\s*)((?:[^;{}])*?)(\s*)(;|(?=}))/g

function hasModernViewportUnit(value: string) {
  MODERN_VIEWPORT_UNIT_RE.lastIndex = 0
  return MODERN_VIEWPORT_UNIT_RE.test(value)
}

function toClassicViewportUnits(value: string) {
  return value.replace(MODERN_VIEWPORT_UNIT_RE, '$1v$3')
}

function alreadyHasClassicFallback(
  css: string,
  declarationStart: number,
  property: string,
  classicValue: string,
) {
  const before = css.slice(
    Math.max(0, declarationStart - property.length - classicValue.length - 32),
    declarationStart,
  )
  const pattern = new RegExp(
    `${escapeRegExp(property)}\\s*:\\s*${escapeRegExp(classicValue)}\\s*;\\s*$`,
  )
  return pattern.test(before)
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * 给含现代视口单位的声明前插入对应的经典 vh/vw 回退。
 *
 * 仅处理现代单位被实际使用时，且已存在相同经典回退时跳过，避免重复声明。
 *
 * @param css 原始 CSS 文本
 * @returns 插入回退后的 CSS 文本
 */
export function injectViewportUnitFallbacks(css: string) {
  return css.replace(
    DECLARATION_RE,
    (full, lead, property, colon, value, trail, end, offset, source) => {
      if (!hasModernViewportUnit(value)) {
        return full
      }

      const classicValue = toClassicViewportUnits(value)
      if (classicValue === value) {
        return full
      }

      if (alreadyHasClassicFallback(source, offset, property, classicValue)) {
        return full
      }

      const terminator = end === ';' ? ';' : ''
      return `${lead}${property}${colon}${classicValue}${trail};${lead}${property}${colon}${value}${trail}${terminator}`
    },
  )
}

function shouldTransform(idOrFile: string) {
  return idOrFile.endsWith('.css')
}

/**
 * Vite 插件：开发与构建产物中统一注入现代视口单位的 vh/vw 回退。
 */
export function viewportUnitFallbacksPlugin(): Plugin {
  return {
    name: 'aegis-viewport-unit-fallbacks',
    enforce: 'post',
    transform(code, id) {
      if (!shouldTransform(id)) {
        return null
      }

      const next = injectViewportUnitFallbacks(code)
      if (next === code) {
        return null
      }

      return { code: next, map: null }
    },
    generateBundle(_options, bundle) {
      for (const chunk of Object.values(bundle)) {
        if (chunk.type !== 'asset' || !shouldTransform(chunk.fileName)) {
          continue
        }

        if (typeof chunk.source === 'string') {
          chunk.source = injectViewportUnitFallbacks(chunk.source)
        } else if (chunk.source instanceof Uint8Array) {
          const css = new TextDecoder().decode(chunk.source)
          chunk.source = new TextEncoder().encode(injectViewportUnitFallbacks(css))
        }
      }
    },
  }
}
