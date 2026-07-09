import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useState } from 'react'
import { modalContentClass, modalOverlayClass } from '~/shared/ui/dialog'
import { Text } from '~/shared/ui/text'
import { homeAssets } from '~/views/home/assets'
import { PopupNoticeContent } from '~/views/home/popup-notice-content'
import { useI18n } from '~/i18n/use-i18n'
import type { HomePopupNotice } from '~/shared/api/types'
import { cn } from '~/shared/lib/utils'

export function HomePopupNoticeModal({
  notice,
  onDismiss,
  onImageLoadError,
  open,
}: {
  notice: HomePopupNotice
  open: boolean
  onDismiss: () => void
  onImageLoadError: () => void
}) {
  const { messages } = useI18n()
  const [heroHidden, setHeroHidden] = useState(false)

  const showHero = Boolean(notice.image_url) && !heroHidden
  const hasBody = Boolean(notice.title || notice.content)

  return (
    <DialogPrimitive.Root open={open}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            modalOverlayClass,
            'bg-black/55 backdrop-blur-sm',
          )}
        />
        <DialogPrimitive.Content
          aria-describedby={hasBody ? 'home-popup-notice-body' : undefined}
          className={cn(
            modalContentClass,
            'w-[min(92vw,26rem)] max-w-none border-0 bg-transparent p-0 shadow-none',
          )}
          onEscapeKeyDown={(event) => event.preventDefault()}
          onPointerDownOutside={(event) => event.preventDefault()}
        >
          <DialogPrimitive.Title className="sr-only">
            {notice.title || messages.home.meta.title}
          </DialogPrimitive.Title>

          <article className="relative flex max-h-[min(92dvh,calc(100dvh-2rem))] w-full flex-col overflow-hidden rounded-2xl bg-card shadow-modal-panel">
            <header className="relative z-10 flex shrink-0 items-center justify-between gap-3 px-4 pb-3 pt-4">
              <div className="inline-flex min-w-0 items-center gap-2">
                <img
                  alt=""
                  className="h-7 w-7 shrink-0 object-contain"
                  decoding="async"
                  height={27}
                  src={homeAssets.logoMark}
                  width={28}
                />
                <Text
                  as="span"
                  className="truncate"
                  tone="foreground"
                  variant="headline"
                >
                  {messages.common.brand}
                </Text>
              </div>

              <button
                aria-label={messages.common.close}
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-black/35 text-white transition-colors hover:bg-black/65 focus:outline-none"
                onClick={onDismiss}
                type="button"
              >
                <X aria-hidden className="size-4" strokeWidth={2.25} />
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto [-webkit-overflow-scrolling:touch]">
              {showHero ? (
                <img
                  alt=""
                  className="block h-auto w-full"
                  decoding="async"
                  draggable={false}
                  loading="eager"
                  onError={() => {
                    setHeroHidden(true)
                    if (!hasBody) onImageLoadError()
                  }}
                  src={notice.image_url ?? undefined}
                />
              ) : null}

              {hasBody ? (
                <div
                  className={cn('px-5 pb-5', showHero ? 'pt-4' : 'pt-1')}
                  id="home-popup-notice-body"
                >
                  {notice.title ? (
                    <Text
                      as="h2"
                      className="text-balance"
                      tone="foreground"
                      variant="headline"
                    >
                      {notice.title}
                    </Text>
                  ) : null}

                  {notice.content ? (
                    <div className={notice.title ? 'mt-4' : undefined}>
                      <PopupNoticeContent content={notice.content} />
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </article>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
