/**
 * 所有 locale 文件（app / home / 根合并）统一通过此 helper 声明文案。
 * 配合 `satisfies` 约束 bundle 形状，避免 home / app 两套写法分叉。
 */
export function defineMessages<T>(messages: T): T {
  return messages
}
