import type { ImgHTMLAttributes } from 'react'

import { dappIcon, type DappIconShape, type DappIconSize } from '~/shared/ui/dapp-icon-scale'

type DappIconProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'width' | 'height'> & {
  shape?: DappIconShape
  size?: DappIconSize
  src: string
}

export function DappIcon({
  alt = '',
  className,
  shape = 'plain',
  size = 'base',
  src,
  ...props
}: DappIconProps) {
  return (
    <img alt={alt} className={dappIcon({ size, shape, class: className })} src={src} {...props} />
  )
}
