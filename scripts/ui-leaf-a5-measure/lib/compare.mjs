/** Parse A4 GDC `spec` strings and compare to WebBridge measured styles. */

/**
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
    return { ok: false, verdicts: ['LOCATE_FAIL'] }
  }

  const ew = leaf.w ?? null
  const eh = leaf.h ?? null
  // chrome / deco 宽随内容列伸缩；只钉 h（若有）
  const skipWidth =
    leaf.kind === 'chrome' ||
    opts.fluidWide === true ||
    /deco/i.test(leaf.name ?? '') ||
    (typeof ew === 'number' && ew >= 700)

  if (leaf.kind === 'surface' || leaf.kind === 'icon' || leaf.kind === 'chrome') {
    if (typeof eh === 'number' && eh > 0 && Math.abs(measured.h - eh) > sizeTol) {
      ok = false
      verdicts.push(`SIZE:h ${measured.h}≠${eh}`)
    }
    if (typeof ew === 'number' && ew > 0 && !skipWidth && Math.abs(measured.w - ew) > sizeTol) {
      ok = false
      verdicts.push(`SIZE:w ${measured.w}≠${ew}`)
    }
  }

  if (
    expected.fs != null &&
    measured.fs != null &&
    Math.abs(measured.fs - expected.fs) > (opts.fsTol ?? 1)
  ) {
    ok = false
    verdicts.push(`FS:${measured.fs}≠${expected.fs}`)
  }

  if (expected.fw != null && measured.fw != null && Math.abs(measured.fw - expected.fw) > 100) {
    ok = false
    verdicts.push(`FW:${measured.fw}≠${expected.fw}`)
  }

  if (expected.colorHint) {
    const got = measured.color
    if (got !== expected.colorHint) {
      ok = false
      verdicts.push(`COLOR:want ${expected.colorHint} got ${got}`)
    }
  }

  return { ok, verdicts }
}
