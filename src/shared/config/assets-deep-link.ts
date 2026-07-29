export type AssetsView = 'hub' | 'stake' | 'lpbond' | 'burnbond' | 'xmine'

const ASSETS_VIEWS = new Set<AssetsView>(['hub', 'stake', 'lpbond', 'burnbond', 'xmine'])

export function isAssetsView(value: string): value is AssetsView {
  return ASSETS_VIEWS.has(value as AssetsView)
}

export function assetsHashForView(view: AssetsView): string {
  return view === 'hub' ? '#assets' : `#assets/${view}`
}
