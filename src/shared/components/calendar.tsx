import { ChevronLeft, ChevronRight } from 'lucide-react'
import { type ComponentProps } from 'react'
import { DayPicker } from 'react-day-picker'
import { tv } from 'tailwind-variants'

import { cn } from '~/shared/lib/utils'

const calendarNav = tv({
  base: 'inline-flex size-8 items-center justify-center rounded-control text-muted-foreground hover:bg-accent aria-disabled:pointer-events-none aria-disabled:opacity-40',
})

const calendarDay = tv({
  base: [
    'inline-flex size-8 cursor-pointer items-center justify-center rounded-control bg-transparent text-sm font-medium',
    'hover:bg-accent focus-visible:bg-accent focus-visible:outline-none',
    'aria-disabled:cursor-default aria-disabled:bg-transparent aria-disabled:text-foreground/40 aria-disabled:hover:bg-transparent',
  ],
})

function CalendarChevron({
  className,
  orientation,
}: {
  className?: string
  orientation?: 'up' | 'down' | 'left' | 'right'
}) {
  const Icon = orientation === 'left' ? ChevronLeft : ChevronRight
  return <Icon aria-hidden className={cn('size-4', className)} />
}

/**
 * 日历月份网格
 *
 * 选中日用主色；不可选日只浅灰字、不铺底。哪些天能点由调用方传入。
 */
export function Calendar({
  className,
  classNames,
  components,
  formatters,
  showOutsideDays = false,
  ...props
}: ComponentProps<typeof DayPicker>) {
  const navClass = calendarNav()
  return (
    <DayPicker
      animate={false}
      className={cn('p-3', className)}
      classNames={{
        months: 'relative flex flex-col',
        month: 'relative flex flex-col gap-3',
        month_caption: 'flex h-8 items-center justify-center px-8',
        caption_label: 'text-sm font-medium text-foreground',
        nav: 'absolute inset-x-0 top-0 flex h-8 items-center justify-between',
        button_previous: navClass,
        button_next: navClass,
        month_grid: 'w-full border-collapse',
        weekdays: 'flex',
        weekday:
          'flex size-8 flex-1 items-center justify-center text-xs font-normal text-muted-foreground',
        weeks: 'flex flex-col',
        week: 'flex w-full',
        day: 'flex-1 p-0',
        day_button: calendarDay(),
        selected:
          '[&_button]:bg-primary [&_button]:text-primary-foreground [&_button]:hover:bg-primary',
        disabled:
          '[&_button]:pointer-events-none [&_button]:bg-transparent [&_button]:text-foreground/40 [&_button]:hover:bg-transparent',
        today: '[&_button]:bg-transparent [&_button]:font-semibold',
        outside: '[&_button]:bg-transparent [&_button]:text-foreground/40',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: CalendarChevron,
        ...components,
      }}
      formatters={formatters}
      showOutsideDays={showOutsideDays}
      {...props}
    />
  )
}
