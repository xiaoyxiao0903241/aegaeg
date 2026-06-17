import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

const LOCALES = ['zh', 'ko', 'ja', 'vi', 'es', 'ru']

/**
 * @param {unknown} reference
 * @param {unknown} candidate
 * @param {string} [path]
 * @returns {string[]}
 */
function compareStructure(reference, candidate, path = '') {
  const errors = []

  if (Array.isArray(reference)) {
    if (!Array.isArray(candidate)) {
      errors.push(`${path || '(root)'}: expected array, got ${typeof candidate}`)
      return errors
    }

    if (reference.length !== candidate.length) {
      errors.push(
        `${path || '(root)'}: array length ${candidate.length} !== ${reference.length}`,
      )
    }

    for (let index = 0; index < reference.length; index += 1) {
      const itemPath = `${path}[${index}]`
      const referenceItem = reference[index]
      const candidateItem = candidate[index]

      if (referenceItem !== null && typeof referenceItem === 'object') {
        errors.push(...compareStructure(referenceItem, candidateItem, itemPath))
      }
    }

    return errors
  }

  if (reference !== null && typeof reference === 'object') {
    if (candidate === null || typeof candidate !== 'object' || Array.isArray(candidate)) {
      errors.push(
        `${path || '(root)'}: expected object, got ${Array.isArray(candidate) ? 'array' : typeof candidate}`,
      )
      return errors
    }

    for (const key of Object.keys(reference)) {
      const keyPath = path ? `${path}.${key}` : key

      if (!(key in candidate)) {
        errors.push(`missing key: ${keyPath}`)
        continue
      }

      const referenceValue = reference[key]
      const candidateValue = candidate[key]

      if (referenceValue !== null && typeof referenceValue === 'object') {
        errors.push(...compareStructure(referenceValue, candidateValue, keyPath))
      }
    }

    for (const key of Object.keys(candidate)) {
      if (!(key in reference)) {
        errors.push(`extra key: ${path ? `${path}.${key}` : key}`)
      }
    }

    return errors
  }

  return errors
}

test('all locale message files share identical key structure with en', async () => {
  const enModule = await loadModule('/src/i18n/messages/en.ts')
  const en = enModule.default

  for (const locale of LOCALES) {
    const localeModule = await loadModule(`/src/i18n/messages/${locale}.ts`)
    const messages = localeModule.default
    const errors = compareStructure(en, messages)

    assert.deepEqual(
      errors,
      [],
      `${locale} message keys must match en:\n${errors.join('\n')}`,
    )
  }
})
