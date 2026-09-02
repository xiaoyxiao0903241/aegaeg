/**
 * 解析 A4 GDC 的 `spec` 字符串，并与 WebBridge 测得的样式比较。
 */

/**
 * 从 spec 颜色片段解析出颜色归类。
 *
 * @param {string | null | undefined} raw
 * @returns {'muted40' | 'body70' | 'white' | 'ink' | 'coral' | null}
 */
export function parseColorHint(raw) {
  if (!raw) return null
  const s = raw.replace(/\s+/g, '').toLowerCase()
  if (s.includes('rgba(0,0,0,0.4)') || s.includes('text/muted')) return 'muted40'
  if (s.includes('rgba(0,0,0,0.7)') || s.includes('text/body')) return 'body70'
  if (s.includes('#ffffff') || s.includes('color=#fff')) return 'white'
  if (s.includes('#0b0e14') || s.includes('text/ink')) return 'ink'
  if (s.includes('coral') || s.includes('#e9785a')) return 'coral'
  return null
}

/**
 * 解析 spec 中的字号、字重与颜色期望值。
 *
 * @param {string | null | undefined} spec
 */
export function parseSpec(spec) {
  if (!spec) return { fs: null, fw: null, colorHint: null, colorRaw: null }
  const fs = spec.match(/fontSize=(\d+)/)
  const fw = spec.match(/fontWeight=(\d+)/)
  const color = spec.match(/color=([^;]+)/)
  const colorRaw = color?.[1]?.trim() ?? null
  return {
    fs: fs ? Number(fs[1]) : null,
    fw: fw ? Number(fw[1]) : null,
    // 只认 `color=`；禁止把 fill=…white 误判成字色
    colorHint: parseColorHint(colorRaw),
    colorRaw,
  }
}

/**
 * 比较实测样式与清单期望值，并生成逐项判定。
 *
 * 数据依赖项在缺会话或缺行时允许按 OPTIONAL_MISS 通过；
 * 外观与装饰类元素宽度随内容伸缩，默认只校验高度。
 *
 * @param {object | null} measured
 * @param {{ w?: number | null, h?: number | null, kind: string, name?: string }} leaf
 * @param {{ fs: number | null, fw: number | null, colorHint: string | null }} expected
 * @param {{ sizeTol?: number, fluidWide?: boolean }} [opts]
 */
export function compareLeaf(measured, leaf, expected, opts = {}) {
  const sizeTol = opts.sizeTol ?? 2
  /** @type {string[]} */
  const verdicts = []
  let ok = true

  if (!measured?.found) {
    // 数据依赖 leaf（ops 行等）：无会话/无行时允许缺测，仍计入 R
    if (leaf.optionalLocate === true) {
      return { ok: true, verdicts: ['OPTIONAL_MISS'] }
    }
    return { ok: false, verdicts: ['LOCATE_FAIL'] }
  }

  const ew = leaf.w ?? null
  const eh = leaf.h ?? null
  // 外观 / 装饰元素宽度随内容列伸缩；有期望高度时只校验高度
  const skipWidth =
    leaf.skipSize === true ||
    leaf.kind === 'chrome' ||
    opts.fluidWide === true ||
    leaf.fluidWide === true ||
    /deco/i.test(leaf.name ?? '') ||
    (typeof ew === 'number' && ew >= 700)

  const skipHeight = leaf.skipSize === true

  if (leaf.kind === 'surface' || leaf.kind === 'icon' || leaf.kind === 'chrome') {
    if (!skipHeight && typeof eh === 'number' && eh > 0 && Math.abs(measured.h - eh) > sizeTol) {
      ok = false
      verdicts.push(`SIZE:h ${measured.h}≠${eh}`)
    }
    if (typeof ew === 'number' && ew > 0 && !skipWidth && Math.abs(measured.w - ew) > sizeTol) {
      ok = false
      verdicts.push(`SIZE:w ${measured.w}≠${ew}`)
    }
  }

  if (
    !leaf.skipFs &&
    expected.fs != null &&
    measured.fs != null &&
    Math.abs(measured.fs - expected.fs) > (opts.fsTol ?? 1)
  ) {
    ok = false
    verdicts.push(`FS:${measured.fs}≠${expected.fs}`)
  }

  if (
    !leaf.skipFw &&
    expected.fw != null &&
    measured.fw != null &&
    Math.abs(measured.fw - expected.fw) > 100
  ) {
    ok = false
    verdicts.push(`FW:${measured.fw}≠${expected.fw}`)
  }

  if (expected.colorHint && !leaf.skipColor) {
    const got = measured.color
    if (got !== expected.colorHint) {
      ok = false
      verdicts.push(`COLOR:want ${expected.colorHint} got ${got}`)
    }
  }

  return { ok, verdicts }
}
