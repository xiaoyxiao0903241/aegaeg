/** 把模板中的 `{key}` 占位符替换为对应值。 */
export function applyMessageTemplate(template: string, values: Record<string, string>): string {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, value),
    template,
  )
}
