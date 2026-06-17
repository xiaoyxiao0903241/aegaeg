import type { ImgHTMLAttributes } from 'react'
import type { Locale } from '~/i18n/locales'

export function labelKey(label: string) {
  return label
}

export function prefixedPath(locale: Locale, path: string) {
  if (path.startsWith('#')) {
    return path
  }

  return `/${locale}${path.startsWith('/') ? path : `/${path}`}`
}

export function MultilineCopy({ copy }: { copy: string }) {
  const lines = copy.split('\n')
  return (
    <>
      {lines.map((line, index) => (
        <span key={`${line}-${index}`}>
          {index > 0 ? <br /> : null}
          {line}
        </span>
      ))}
    </>
  )
}

type DeferredImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string
}

export function DeferredImage({
  src,
  className,
  loading = 'lazy',
  ...props
}: DeferredImageProps) {
  return <img {...props} className={className} src={src} loading={loading} />
}
