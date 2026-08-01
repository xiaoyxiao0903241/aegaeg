import { cn } from '~/shared/lib/utils'

/** Figma hub metric hint `4518:7188` — 12px outline circle + `i` glyph @ 40% ink. */
export function DappInfoIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={cn('block size-3 shrink-0', className)}
      fill="none"
      height="12"
      viewBox="0 0 12 12"
      width="12"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 11C7.3807 11 8.6307 10.4404 9.53553 9.53553C10.4404 8.6307 11 7.3807 11 6C11 4.6193 10.4404 3.3693 9.53553 2.46447C8.6307 1.55965 7.3807 1 6 1C4.6193 1 3.3693 1.55965 2.46447 2.46447C1.55965 3.3693 1 4.6193 1 6C1 7.3807 1.55965 8.6307 2.46447 9.53553C3.3693 10.4404 4.6193 11 6 11Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeOpacity="0.4"
      />
      <path
        clipRule="evenodd"
        d="M6 2.75C6.34517 2.75 6.625 3.02982 6.625 3.375C6.625 3.72017 6.34517 4 6 4C5.65482 4 5.375 3.72017 5.375 3.375C5.375 3.02982 5.65482 2.75 6 2.75Z"
        fill="currentColor"
        fillOpacity="0.4"
        fillRule="evenodd"
      />
      <path
        d="M6.125 4.5C6.40114 4.5 6.625 4.72386 6.625 5V8H7C7.27614 8 7.5 8.22386 7.5 8.5C7.5 8.77614 7.27614 9 7 9H5.25C4.97386 9 4.75 8.77614 4.75 8.5C4.75 8.22386 4.97386 8 5.25 8H5.625V5.5C5.34886 5.5 5.125 5.27614 5.125 5C5.125 4.72386 5.34886 4.5 5.625 4.5H6.125Z"
        fill="currentColor"
        fillOpacity="0.4"
      />
    </svg>
  )
}
