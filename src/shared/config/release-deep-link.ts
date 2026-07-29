export type ReleaseView = 'hub' | 'queue' | 'buffer'

const RELEASE_VIEWS = new Set<ReleaseView>(['hub', 'queue', 'buffer'])

export function isReleaseView(value: string): value is ReleaseView {
  return RELEASE_VIEWS.has(value as ReleaseView)
}

export function releaseHashForView(view: ReleaseView): string {
  return view === 'hub' ? '#release' : `#release/${view}`
}
