#!/usr/bin/env node
/**
 * Map arbitrary [Npx] in Tailwind class strings to closest standard scale tokens.
 * Skips subpixel borders, blur(), complex shadows, and unitless leading/tracking fractions.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const SRC = join(ROOT, 'src')

const SPACING_SCALE = [
  0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 7, 7.5, 8, 9, 9.5, 10, 11, 12, 14,
  16, 18, 20, 22, 24, 28, 30, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96, 112, 120, 128,
  144, 160, 176, 192, 208, 240, 288, 320, 384,
]

const TEXT_SCALE = [
  [10, 'text-xs'],
  [12, 'text-xs'],
  [14, 'text-sm'],
  [16, 'text-base'],
  [18, 'text-lg'],
  [20, 'text-xl'],
  [24, 'text-2xl'],
  [30, 'text-3xl'],
  [36, 'text-4xl'],
  [48, 'text-5xl'],
  [60, 'text-6xl'],
]

const ROUNDED_SCALE = [
  [10, 'rounded-sm'],
  [16, 'rounded-md'],
  [22, 'rounded-lg'],
  [28, 'rounded-xl'],
  [32, 'rounded-2xl'],
  [40, 'rounded-3xl'],
]

function closestSpacing(px) {
  const unit = px / 4
  let best = '0'
  let bestDiff = Infinity
  for (const u of SPACING_SCALE) {
    const diff = Math.abs(u - unit)
    if (diff < bestDiff) {
      bestDiff = diff
      best = String(u)
    }
  }
  return best
}

function closestText(px) {
  let best = 'text-sm'
  let bestDiff = Infinity
  for (const [size, token] of TEXT_SCALE) {
    const diff = Math.abs(size - px)
    if (diff < bestDiff) {
      bestDiff = diff
      best = token
    }
  }
  return best
}

function closestRounded(px) {
  let best = 'rounded-md'
  let bestDiff = Infinity
  for (const [size, token] of ROUNDED_SCALE) {
    const diff = Math.abs(size - px)
    if (diff < bestDiff) {
      bestDiff = diff
      best = token
    }
  }
  return best
}

function shouldSkipPx(px, fullMatch) {
  if (px < 1) return true
  if (fullMatch.includes('blur-[')) return true
  if (fullMatch.includes('shadow-[')) return true
  if (/border-\[[0-9.]+px\]/.test(fullMatch) && px <= 1) return true
  return false
}

function replacePxInClasses(content) {
  let changes = 0

  // tracking-[0] → tracking-normal
  content = content.replace(/tracking-\[0\]/g, () => {
    changes++
    return 'tracking-normal'
  })

  // text-[Npx]
  content = content.replace(/(?<![\w-])text-\[(\d+(?:\.\d+)?)px\]/g, (match, n) => {
    const px = parseFloat(n)
    if (shouldSkipPx(px, match)) return match
    changes++
    return closestText(px)
  })

  // rounded-[Npx] / rounded-t-[Npx] etc.
  content = content.replace(
    /(?<![\w-])(rounded(?:-[trblxy]+)?)-\[(\d+(?:\.\d+)?)px\]/g,
    (match, prefix, n) => {
      const px = parseFloat(n)
      changes++
      const base = closestRounded(px)
      if (prefix === 'rounded') return base
      const suffix = prefix.replace('rounded', '')
      return base.replace('rounded', `rounded${suffix}`)
    },
  )

  // size-[Npx]
  content = content.replace(/(?<![\w-])size-\[(\d+(?:\.\d+)?)px\]/g, (match, n) => {
    const px = parseFloat(n)
    changes++
    const token = closestSpacing(px)
    return `size-${token}`
  })

  // Spacing / dimension utilities: prefix-[Npx]
  content = content.replace(
    /(?<![\w-])([a-z][\w-]*?)-\[(\d+(?:\.\d+)?)px\]/g,
    (match, prefix, n) => {
      const px = parseFloat(n)
      if (shouldSkipPx(px, match)) return match
      if (prefix.startsWith('text') || prefix.startsWith('rounded')) return match
      if (prefix === 'leading' || prefix === 'tracking') return match
      if (prefix.includes('aspect')) return match

      const spacingPrefixes =
        /^(?:p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|w|min-w|max-w|h|min-h|max-h|top|right|bottom|left|inset|basis|columns|border-spacing|after:|before:|&_|&\[)/
      if (!spacingPrefixes.test(prefix) && !prefix.match(/^(?:max|min)-[dhvw]/)) {
        // [&_img]:size-[15px] — prefix might be complex
        if (!/^(?:\[[^\]]+\]:)?(?:size|w|h|min-h|max-h|p|px|py|pt|pb|pl|pr|m|mt|mb|ml|mr|gap)$/.test(prefix)) {
          return match
        }
      }

      changes++
      const token = closestSpacing(px)
      // Handle arbitrary variant prefixes like [&_img]:size-[15px]
      const variantMatch = prefix.match(/^(\[[^\]]+\]:)(.+)$/)
      if (variantMatch) {
        return `${variantMatch[1]}${variantMatch[2]}-${token}`
      }
      return `${prefix}-${token}`
    },
  )

  return { content, changes }
}

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    const st = statSync(path)
    if (st.isDirectory()) {
      if (name === 'node_modules') continue
      walk(path, files)
    } else if (['.tsx', '.ts', '.css'].includes(extname(name))) {
      files.push(path)
    }
  }
  return files
}

let totalChanges = 0
let filesChanged = 0

for (const file of walk(SRC)) {
  const original = readFileSync(file, 'utf8')
  const { content, changes } = replacePxInClasses(original)
  if (changes > 0 && content !== original) {
    writeFileSync(file, content)
    totalChanges += changes
    filesChanged++
    console.log(`${file.replace(ROOT, '')}: ${changes}`)
  }
}

console.log(`\nDone: ${totalChanges} replacements in ${filesChanged} files`)
