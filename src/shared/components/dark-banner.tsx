import { tv } from 'tailwind-variants'

import { cn, revealClass } from '~/shared/lib/utils'

/** 深色横幅布局与表面配色；文案排版由调用方用 `<Text>` 配合这些槽位完成 */
export const darkBanner = tv({
  slots: {
    root: cn(revealClass(), 'relative overflow-hidden rounded-md bg-dark text-white shadow-card'),
    content: 'relative z-1 flex flex-col gap-2',
    kicker: '',
    title: '',
    body: '',
    decoration: 'pointer-events-none absolute select-none',
  },
})
