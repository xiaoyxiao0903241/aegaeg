import type { ImgHTMLAttributes } from 'react'

import { dappIcon, type DappIconSize } from '~/shared/ui/dapp-icon-scale'

type DappIconProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'width' | 'height'> & {
  size?: DappIconSize
  src: string
}

export function DappIcon({ alt = '', className, size = 'base', src, ...props }: DappIconProps) {
  return (
    <img
      alt={alt}
      className={dappIcon({ size, class: ['block object-contain', className] })}
      src={src}
      {...props}
    />
  )
}
