import type { Plugin } from 'vite'

/**
 * Chrome 90–107 (project cssTarget) ignore dvh/svh/lvh/dvw/svw/lvw.
 * lightningcss does not rewrite them (parcel-bundler/lightningcss#534).
 * Inject classic vh/vw fallbacks before modern units so source can stay dvh-only.
 */

const MODERN_VIEWPORT_UNIT_RE = /\b(\d*\.?\d+)(d|s|l)v(h|w)\b/g

const DECLARATION_RE =
  /(?<=[{;])(\s*)([a-zA-Z-]+)(\s*:\s*)((?:[^;{}])*?)(\s*)(;|(?=}))/g

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
  const before = css.slice(Math.max(0, declarationStart - property.length - classicValue.length - 32), declarationStart)
  const pattern = new RegExp(
    `${escapeRegExp(property)}\\s*:\\s*${escapeRegExp(classicValue)}\\s*;\\s*$`,
  )
  return pattern.test(before)
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Inject `prop: classic;` before each `prop: …dvh|svh|lvh…` (and *vw) declaration. */
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

/** Vite: inject vh/vw fallbacks for modern viewport units in dev + production CSS. */
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
