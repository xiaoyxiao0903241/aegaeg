import { createContext } from 'react'
import type { ReactNode } from 'react'
import type {
  EmblaCarouselType,
  EmblaOptionsType,
  EmblaPluginType,
} from 'embla-carousel'

export type CarouselApi = EmblaCarouselType | undefined
export type CarouselOptions = EmblaOptionsType | undefined
export type CarouselPlugin = EmblaPluginType[] | undefined

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: 'horizontal' | 'vertical'
  setApi?: (api: CarouselApi) => void
  children?: ReactNode
}

type CarouselContextProps = CarouselProps & {
  carouselRef: (instance: HTMLElement | null) => void
  api: CarouselApi
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
}

export const CarouselContext = createContext<CarouselContextProps | null>(null)
