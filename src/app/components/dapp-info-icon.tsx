import { cn } from '~/lib/utils'

export function DappInfoIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={cn('block size-4 shrink-0', className)}
      fill="none"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="8" cy="8" fill="#9999A6" fillOpacity="0.4" r="8" />
      <path
        d="M7.10369 12V6.54545H8.61648V12H7.10369ZM7.86364 5.84233C7.63873 5.84233 7.44579 5.76776 7.2848 5.61861C7.12618 5.46709 7.04688 5.28598 7.04688 5.07528C7.04688 4.86695 7.12618 4.68821 7.2848 4.53906C7.44579 4.38755 7.63873 4.31179 7.86364 4.31179C8.08854 4.31179 8.2803 4.38755 8.43892 4.53906C8.59991 4.68821 8.6804 4.86695 8.6804 5.07528C8.6804 5.28598 8.59991 5.46709 8.43892 5.61861C8.2803 5.76776 8.08854 5.84233 7.86364 5.84233Z"
        fill="#4D4D59"
      />
    </svg>
  )
}
