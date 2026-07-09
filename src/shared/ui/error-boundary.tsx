import { Component, type ErrorInfo, type ReactNode } from 'react'
import { CircleAlert } from 'lucide-react'
import { Text } from '~/shared/ui/text'
import { Button } from '~/shared/ui/button'

interface ErrorBoundaryProps {
  children: ReactNode
  /** Optional label for logs / recovery UI. */
  name?: string
  fallbackTitle?: string
  fallbackBody?: string
}

interface ErrorBoundaryState {
  error: Error | null
}

/**
 * Page/shell isolation — render failures stay in this subtree.
 * Behavior SSOT: recover via full reload; do not swallow chain/API errors here
 * (those use toast / auth-machine classification).
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[ErrorBoundary${this.props.name ? `:${this.props.name}` : ''}]`, error, info.componentStack)
  }

  private handleReload = () => {
    window.location.reload()
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div
        className="flex min-h-64 flex-col items-center justify-center gap-5 px-6 py-12 text-center"
        role="alert"
      >
        <span
          aria-hidden
          className="grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive"
        >
          <CircleAlert className="size-6" strokeWidth={1.75} />
        </span>
        <div className="flex max-w-sm flex-col items-center gap-2">
          <Text as="h2" tone="foreground" variant="headline">
            {this.props.fallbackTitle ?? 'Page failed to load'}
          </Text>
          <Text tone="muted-foreground" variant="copy">
            {this.props.fallbackBody ??
              'Something broke while rendering. Reload to continue — your wallet stays connected.'}
          </Text>
        </div>
        <Button
          className="w-auto"
          onClick={this.handleReload}
          shape="rounded"
          size="md"
          type="button"
          variant="primary"
        >
          Reload page
        </Button>
      </div>
    )
  }
}
