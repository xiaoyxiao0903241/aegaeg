import { CircleAlert } from 'lucide-react'
import { Component, type ErrorInfo, type ReactNode } from 'react'

import { useI18n } from '~/i18n/use-i18n'
import { Button } from '~/shared/components/button'
import { Text } from '~/shared/components/text'

interface ErrorBoundaryProps {
  children: ReactNode
  /** 日志与恢复界面使用的名称标识（可选） */
  name?: string
  fallbackTitle?: string
  fallbackBody?: string
  reloadLabel?: string
}

interface ErrorBoundaryState {
  error: Error | null
}

/**
 * 页面 / 外层隔离
 *
 * 渲染失败只影响本子树，恢复方式为整页刷新。
 * 不在此吞掉链上 / API 错误（那些走 toast / 认证状态机分类）。
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(
      `[ErrorBoundary${this.props.name ? `:${this.props.name}` : ''}]`,
      error,
      info.componentStack,
    )
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
          {this.props.reloadLabel ?? 'Reload page'}
        </Button>
      </div>
    )
  }
}

/** 用多语言文案包装 ErrorBoundary，避免兜底文案只有英文 */
export function LocalizedErrorBoundary({ children, name }: { children: ReactNode; name?: string }) {
  const { messages: t } = useI18n()
  return (
    <ErrorBoundary
      fallbackBody={t.errors.pageLoadFailedBody}
      fallbackTitle={t.errors.pageLoadFailed}
      name={name}
      reloadLabel={t.errors.reloadPage}
    >
      {children}
    </ErrorBoundary>
  )
}
