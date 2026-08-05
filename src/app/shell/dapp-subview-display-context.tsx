import { createContext, useContext } from 'react'

export const DappSubviewDisplayViewContext = createContext<string | null>(null)

/**
 * 读取当前渲染层应展示的子视图名。
 *
 * 静止时返回状态仓库里的视图；切换动画期间由过渡层
 * 注入退场视图或入场视图，让两层各自渲染对应内容。
 *
 * @returns 当前子视图名
 * @throws 未挂载在 DappSubviewShell 下时抛出
 */
export function useDappSubviewDisplayView<TView extends string = string>(): TView {
  const view = useContext(DappSubviewDisplayViewContext)
  if (view == null) {
    throw new Error('useDappSubviewDisplayView must be used under DappSubviewShell')
  }
  return view as TView
}
