import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'

const USER_DIR = '/Users/ava/Downloads/5_6186196208524993621'
const PROJECT_DIR = '/Users/ava/Documents/Projects/aegis/src/i18n/messages'
const NAMESPACES = ['app', 'home']
const LANGS = ['en', 'es', 'hi', 'id', 'ja', 'ko', 'ru', 'vi', 'zh', 'zht']

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
      if (ts.isObjectLiteralExpression(unwrapped)) {
        arg = unwrapped
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)
  return arg
}

function getPropertyName(node) {
  if (!node.name) return null
  const name = node.name
  if (ts.isIdentifier(name)) return name.text
  if (ts.isStringLiteral(name) || ts.isNumericLiteral(name)) return name.text
  if (ts.isComputedPropertyName(name) && ts.isStringLiteral(name.expression)) {
    return name.expression.text
  }
  return null
}

function collectAssignments(objLiteral) {
  const map = new Map()
  for (const prop of objLiteral.properties) {
    if (!ts.isPropertyAssignment(prop)) continue
    const name = getPropertyName(prop)
    if (name === null) continue
    map.set(name, prop)
  }
  return map
}

function normalizeNewlines(text) {
  return text.replace(/\r\n/g, '\n')
}

function mergeDefineMessages(projectSource, projectArg, userSource, userArg) {
  const replacements = []

  function collect(projectObj, userObj) {
    const projectMap = collectAssignments(projectObj)
    const userMap = collectAssignments(userObj)

    // Only overwrite keys that exist in both files. User-only keys are ignored.
    for (const [name, projectProp] of projectMap) {
      const userProp = userMap.get(name)
      if (!userProp) continue

      const projectInit = projectProp.initializer
      const userInit = userProp.initializer

      if (
        ts.isObjectLiteralExpression(projectInit) &&
        ts.isObjectLiteralExpression(userInit)
      ) {
        collect(projectInit, userInit)
      } else {
        const projectText = projectInit.getText(projectSource)
        const userText = normalizeNewlines(userInit.getText(userSource))
        if (projectText !== userText) {
          replacements.push({
            start: projectInit.getStart(projectSource),
            end: projectInit.getEnd(),
            text: userText,
          })
        }
      }
    }
  }

  collect(projectArg, userArg)

  // Apply replacements from back to front so earlier positions stay valid.
  replacements.sort((a, b) => b.start - a.start)

  let text = projectSource.getFullText()
  for (const r of replacements) {
    text = text.slice(0, r.start) + r.text + text.slice(r.end)
  }
  return text
}

function mergeFile(userPath, projectPath) {
  const userText = fs.readFileSync(userPath, 'utf8')
  const projectText = fs.readFileSync(projectPath, 'utf8')

  const userSource = ts.createSourceFile(userPath, userText, ts.ScriptTarget.Latest, true)
  const projectSource = ts.createSourceFile(projectPath, projectText, ts.ScriptTarget.Latest, true)

  const userArg = findDefineMessagesArg(userSource)
  const projectArg = findDefineMessagesArg(projectSource)

  if (!userArg) {
    console.warn(`[skip] no defineMessages found in user file: ${userPath}`)
    return false
  }
  if (!projectArg) {
    console.warn(`[skip] no defineMessages found in project file: ${projectPath}`)
    return false
  }

  const newText = mergeDefineMessages(projectSource, projectArg, userSource, userArg)
  fs.writeFileSync(projectPath, newText, 'utf8')
  return true
}

let changed = 0
let skipped = 0

for (const ns of NAMESPACES) {
  for (const lang of LANGS) {
    const userPath = path.join(USER_DIR, ns, `${lang}.ts`)
    const projectPath = path.join(PROJECT_DIR, ns, `${lang}.ts`)
    if (!fs.existsSync(userPath)) {
      console.log(`[missing user] ${ns}/${lang}.ts`)
      skipped += 1
      continue
    }
    if (!fs.existsSync(projectPath)) {
      console.log(`[missing project] ${ns}/${lang}.ts`)
      skipped += 1
      continue
    }
    const ok = mergeFile(userPath, projectPath)
    if (ok) {
      console.log(`[merged] ${ns}/${lang}.ts`)
      changed += 1
    } else {
      skipped += 1
    }
  }
}

console.log(`\nDone. Merged ${changed} files, skipped ${skipped}.`)
