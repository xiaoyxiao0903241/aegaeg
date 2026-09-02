/**
 * 文案命名插值（对齐 i18next `interpolation`：`{name}` → 值）。
 *
 * 本仓文案是 typed 对象树，不跑 i18next 实例；插值语义与
 * `i18next.init({ interpolation: { prefix: '{', suffix: '}' } })` 一致。
 * 缺 key 保留原占位；值为 `null`/`undefined` 时替换为空串。
 *
 * @example interpolate('约 {days} 天', { days: 30 }) // '约 30 天'
 */
export function interpolate(
  template: string,
  values: Readonly<Record<string, string | number | bigint | null | undefined>>,
): string {
  return template.replace(/\{(\w+)\}/g, (whole, name: string) => {
    if (!Object.hasOwn(values, name)) return whole
    const raw = values[name]
    if (raw == null) return ''
    return String(raw)
  })
}
