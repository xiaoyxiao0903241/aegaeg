/**
 * 发展津贴入口资格：仅接口明确返回 true 才展示 / 点亮。
 *
 * 缺字段、加载中、请求失败都当无资格。
 *
 * @param isUserNodeType `POST /user/user-node-type` 的 `is_user_node_type`
 * @returns 是否有津贴领取资格
 * @see docs/backend-api/api.md #user/user-node-type
 */
export function isGrantNodeEligible(isUserNodeType: boolean | null | undefined): boolean {
  return isUserNodeType === true
}
