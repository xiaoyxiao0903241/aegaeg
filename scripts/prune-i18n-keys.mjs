#!/usr/bin/env node
/**
 * Remove unused leaf keys from all app locale files (same paths in every locale).
 */
import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'

const ROOT = path.resolve(import.meta.dirname, '..')
const APP_DIR = path.join(ROOT, 'src/i18n/messages/app')

/** Dot paths relative to defineMessages root */
const REMOVE_PATHS = [
  'swap.approve',
  'swap.action',
  'swap.approveSuccess',
  'swap.fixedRate',
  'swap.swipeNext',
  'swap.swipePrevious',
  'rewards.teamQualifiedPartitionsValue',
  'community.boundTo',
  'tables.postLaunchRank',
  'tables.source',
  'tables.direct',
  'tables.volume',
]

function unwrapSatisfies(node) {
  if (ts.isSatisfiesExpression(node)) return unwrapSatisfies(node.expression)
  return node
}

function findDefineMessagesCall(sourceFile) {
  let call = null
  function visit(node) {
    if (call) return
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === 'defineMessages' &&
      node.arguments.length > 0
    ) {
      call = node
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)
  return call
}

function getPropertyName(prop) {
  if (ts.isPropertyAssignment(prop) || ts.isMethodDeclaration(prop)) {
    if (ts.isIdentifier(prop.name)) return prop.name.text
    if (ts.isStringLiteral(prop.name)) return prop.name.text
  }
  return null
}

function resolveObjectAtPath(obj, segments) {
  let current = obj
  for (const seg of segments) {
    if (!ts.isObjectLiteralExpression(current)) return null
    const prop = current.properties.find((p) => getPropertyName(p) === seg)
    if (!prop || !ts.isPropertyAssignment(prop)) return null
    current = unwrapSatisfies(prop.initializer)
  }
  return ts.isObjectLiteralExpression(current) ? current : null
}

function removeProperty(obj, key) {
  const idx = obj.properties.findIndex((p) => getPropertyName(p) === key)
  if (idx === -1) return false
  obj.properties = [
    ...obj.properties.slice(0, idx),
    ...obj.properties.slice(idx + 1),
  ]
  return true
}

function pruneFile(filePath) {
  const text = fs.readFileSync(filePath, 'utf8')
  const source = ts.createSourceFile(filePath, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  const call = findDefineMessagesCall(source)
  if (!call) throw new Error(`defineMessages not found: ${filePath}`)

  const root = unwrapSatisfies(call.arguments[0])
  if (!ts.isObjectLiteralExpression(root)) throw new Error(`Expected object literal: ${filePath}`)

  let removed = 0
  for (const dotPath of REMOVE_PATHS) {
    const parts = dotPath.split('.')
    const key = parts.pop()
    const parent = resolveObjectAtPath(root, parts)
    if (parent && removeProperty(parent, key)) removed++
  }

  if (removed === 0) return { filePath, removed: 0, changed: false }

  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed })
  const newArg = printer.printNode(ts.EmitHint.Unspecified, root, source)
  const newCallText = `defineMessages(${newArg})`

  const callStart = call.getStart(source)
  const callEnd = call.getEnd()
  const updated = text.slice(0, callStart) + newCallText + text.slice(callEnd)
  fs.writeFileSync(filePath, updated, 'utf8')
  return { filePath, removed, changed: true }
}

const locales = fs
  .readdirSync(APP_DIR)
  .filter((f) => f.endsWith('.ts') && f !== 'types.ts')

for (const file of locales.sort()) {
  const result = pruneFile(path.join(APP_DIR, file))
  if (result.changed) {
    console.log(`${file}: removed ${result.removed} keys`)
  }
}
