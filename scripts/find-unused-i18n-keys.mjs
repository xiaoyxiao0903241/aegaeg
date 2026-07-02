#!/usr/bin/env node
/**
 * Find leaf i18n keys in app/zh.ts + home/zh.ts with no reference in src/ or tests/.
 * A key is "used" when any prefix path appears as t.* or messages.* in scanned code.
 */
import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'

const ROOT = path.resolve(import.meta.dirname, '..')
const APP_ZH = path.join(ROOT, 'src/i18n/messages/app/zh.ts')
const HOME_ZH = path.join(ROOT, 'src/i18n/messages/home/zh.ts')

function unwrapSatisfies(node) {
  if (ts.isSatisfiesExpression(node)) return unwrapSatisfies(node.expression)
  return node
}

function findDefineMessagesArg(sourceFile) {
  let arg = null
  function visit(node) {
    if (arg) return
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === 'defineMessages' &&
      node.arguments.length > 0
    ) {
      const unwrapped = unwrapSatisfies(node.arguments[0])
      if (ts.isObjectLiteralExpression(unwrapped)) arg = unwrapped
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)
  return arg
}

function evalLiteral(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text
  if (ts.isNumericLiteral(node)) return Number(node.text)
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(evalLiteral)
  if (ts.isObjectLiteralExpression(node)) {
    const out = {}
    for (const prop of node.properties) {
      if (!ts.isPropertyAssignment(prop)) continue
      const name = ts.isIdentifier(prop.name)
        ? prop.name.text
        : ts.isStringLiteral(prop.name)
          ? prop.name.text
          : null
      if (name == null) continue
      out[name] = evalLiteral(prop.initializer)
    }
    return out
  }
  return undefined
}

function loadMessages(filePath) {
  const text = fs.readFileSync(filePath, 'utf8')
  const source = ts.createSourceFile(filePath, text, ts.ScriptTarget.Latest, true)
  const arg = findDefineMessagesArg(source)
  if (!arg) throw new Error(`defineMessages not found: ${filePath}`)
  return evalLiteral(arg)
}

function flattenLeaves(obj, prefix = '') {
  const leaves = []
  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      leaves.push(prefix)
      return leaves
    }
    if (typeof obj[0] !== 'object' || obj[0] === null) {
      leaves.push(prefix)
      return leaves
    }
    for (let i = 0; i < obj.length; i++) {
      leaves.push(...flattenLeaves(obj[i], `${prefix}.${i}`))
    }
    return leaves
  }
  if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      const p = prefix ? `${prefix}.${k}` : k
      if (v && typeof v === 'object') leaves.push(...flattenLeaves(v, p))
      else leaves.push(p)
    }
    return leaves
  }
  if (prefix) leaves.push(prefix)
  return leaves
}

function collectSourceFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out
  const messagesDir = path.join(ROOT, 'src/i18n/messages')
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules') continue
      collectSourceFiles(full, out)
      continue
    }
    if (full.startsWith(messagesDir)) continue
    if (/\.(tsx?|jsx?|mjs)$/.test(entry.name)) out.push(full)
  }
  return out
}

const CHAINED_METHOD_RE = /^\.(?:map|find|filter|replace|includes|some|every)\b/
const CHAINED_METHODS = new Set([
  'map',
  'find',
  'filter',
  'replace',
  'includes',
  'some',
  'every',
  'toLowerCase',
  'toUpperCase',
  'trim',
  'split',
  'slice',
])

function normalizeMessagePath(pathStr) {
  const parts = pathStr.split('.')
  while (parts.length > 1 && CHAINED_METHODS.has(parts[parts.length - 1])) {
    parts.pop()
  }
  return parts.join('.')
}

function collectReferences(sourceText) {
  const direct = new Set()
  const objectPass = new Set()

  const re = /(?:\b(t|messages))\.([A-Za-z_][\w]*(?:\.[A-Za-z_][\w]*)*)/g
  let m
  while ((m = re.exec(sourceText)) !== null) {
    const raw = m[2]
    const pathStr = normalizeMessagePath(raw)
    const hadMethodSuffix = pathStr !== raw

    const end = m.index + m[0].length
    const next = sourceText[end]
    const tail = sourceText.slice(end)

    if (next === '.' || next === '?') {
      if (CHAINED_METHOD_RE.test(tail) || hadMethodSuffix) {
        direct.add(pathStr)
        objectPass.add(pathStr)
      }
      continue
    }

    direct.add(pathStr)
    objectPass.add(pathStr)
  }

  if (/messages\.home\.sections\s*\[/.test(sourceText)) {
    objectPass.add('home.sections')
  }

  return { direct, objectPass }
}

function isDescendantOrEqual(leaf, ancestor) {
  return leaf === ancestor || leaf.startsWith(`${ancestor}.`)
}

function isPathUsed(leafPath, namespace, { direct, objectPass }) {
  const full = namespace === 'app' ? leafPath : `home.${leafPath}`
  const withoutIndex = full.replace(/\.\d+(?=\.|$)/g, '')

  if (direct.has(full) || direct.has(withoutIndex)) return true

  for (const objPath of objectPass) {
    if (isDescendantOrEqual(full, objPath) || isDescendantOrEqual(withoutIndex, objPath)) {
      return true
    }
  }

  return false
}

const app = loadMessages(APP_ZH)
const home = loadMessages(HOME_ZH)
const appLeaves = flattenLeaves(app)
const homeLeaves = flattenLeaves(home)

let corpus = ''
for (const file of collectSourceFiles(path.join(ROOT, 'src'))) {
  if (file.includes(`${path.sep}i18n${path.sep}messages${path.sep}`)) continue
  corpus += fs.readFileSync(file, 'utf8') + '\n'
}
for (const file of collectSourceFiles(path.join(ROOT, 'tests'))) {
  corpus += fs.readFileSync(file, 'utf8') + '\n'
}

const referenced = collectReferences(corpus)

const unusedApp = appLeaves.filter((p) => !isPathUsed(p, 'app', referenced))
const unusedHome = homeLeaves.filter((p) => !isPathUsed(p, 'home', referenced))

console.log('Direct refs:', referenced.direct.size, '| object-pass refs:', referenced.objectPass.size)
console.log('\nUnused APP keys (' + unusedApp.length + '):')
for (const k of unusedApp.sort()) console.log('  ' + k)
console.log('\nUnused HOME keys (' + unusedHome.length + '):')
for (const k of unusedHome.sort()) console.log('  ' + k)
