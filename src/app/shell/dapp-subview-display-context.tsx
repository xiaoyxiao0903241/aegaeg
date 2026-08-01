import { createContext, useContext } from 'react'

export const DappSubviewDisplayViewContext = createContext<string | null>(null)

/** Current layer's view (idle = store view; transition = outgoing or incoming). */
export function useDappSubviewDisplayView<TView extends string = string>(): TView {
  const view = useContext(DappSubviewDisplayViewContext)
  if (view == null) {
    throw new Error('useDappSubviewDisplayView must be used under DappSubviewShell')
  }
  return view as TView
}
