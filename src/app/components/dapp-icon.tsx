import type { ImgHTMLAttributes } from 'react'
import { cn } from '~/lib/utils'
import { dappIconClass, type DappIconSize } from '~/app/dapp-icon-scale'

type DappIconProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'width' | 'height'> & {
  size?: DappIconSize
  src: string
}

export function DappIcon({
  alt = '',
  className,
  size = 'base',
  src,
  ...props
}: DappIconProps) {
  return (
    <img
      alt={alt}
      className={cn('block shrink-0 object-contain', dappIconClass[size], className)}
      src={src}
      {...props}
    />
  )
}
