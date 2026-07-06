import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

const sampleApiItem = {
  id: 2,
  image_url: 'https://cdn.example.com/default.png',
  link_url: 'https://x-dao.io',
  link_target: 1,
  display_mode: 1,
  version: '2026-07-04',
  sort_order: 10,
  start_time: '2026-07-04T07:04:26.711Z',
  end_time: null,
  i18n: [
    {
      locale: 'zh',
      title: '官方公告',
      content: 'AEGIS X 上市信息发布',
      image_url: 'https://cdn.example.com/zh.png',
    },
  ],
}

function notice(overrides) {
  return {
    id: 1,
    show_once: true,
    version: 'v1',
    image_url: 'https://cdn.example.com/popup.png',
    title: '',
    content: '',
    link_url: null,
    link_target: 0,
    ...overrides,
  }
}

test('normalizeHomePopupNotice resolves i18n image and title by locale', async () => {
  const { normalizeHomePopupNotice } = await loadModule('/src/views/home/popup-notice.ts')

  const result = normalizeHomePopupNotice(sampleApiItem, 'zh')

  assert.deepEqual(result, {
    id: 2,
    version: '2026-07-04',
    image_url: 'https://cdn.example.com/zh.png',
    title: '官方公告',
    content: 'AEGIS X 上市信息发布',
    link_url: 'https://x-dao.io',
    link_target: 1,
    show_once: true,
  })
})

test('normalizeHomePopupNotices sorts by sort_order ascending', async () => {
  const { normalizeHomePopupNotices } = await loadModule('/src/views/home/popup-notice.ts')

  const notices = normalizeHomePopupNotices({
    items: [
      { ...sampleApiItem, id: 3, sort_order: 30, version: 'c' },
      { ...sampleApiItem, id: 1, sort_order: 10, version: 'a' },
      { ...sampleApiItem, id: 2, sort_order: 20, version: 'b' },
    ],
  })

  assert.deepEqual(
    notices.map((item) => item.id),
    [1, 2, 3],
  )
})

test('readShowOnceFromDisplayMode maps display_mode 1/2', async () => {
  const { readShowOnceFromDisplayMode } = await loadModule('/src/views/home/popup-notice.ts')

  assert.equal(readShowOnceFromDisplayMode(1), true)
  assert.equal(readShowOnceFromDisplayMode(2), false)
})

test('normalizeHomePopupNotice defaults version to 1', async () => {
  const { normalizeHomePopupNotice } = await loadModule('/src/views/home/popup-notice.ts')

  const result = normalizeHomePopupNotice(
    { ...sampleApiItem, version: '', display_mode: 1 },
    'zh',
  )

  assert.equal(result?.version, '1')
})

test('shouldShowHomePopupNotice persists by id:version for show_once', async () => {
  const { noticeDismissKey, shouldShowHomePopupNotice } = await loadModule('/src/views/home/popup-notice.ts')

  const first = notice({ id: 1, version: 'v2' })
  const sameIdNewVersion = notice({ id: 1, version: 'v3' })
  const dismissed = new Set([noticeDismissKey(first)])

  assert.equal(shouldShowHomePopupNotice(first, dismissed), false)
  assert.equal(shouldShowHomePopupNotice(sameIdNewVersion, dismissed), true)
})

test('shouldShowHomePopupNotice ignores dismissed keys for every-visit mode', async () => {
  const { noticeDismissKey, shouldShowHomePopupNotice } = await loadModule('/src/views/home/popup-notice.ts')

  const everyVisit = notice({ id: 2, show_once: false, version: 'always' })
  const dismissed = new Set([noticeDismissKey(everyVisit)])

  assert.equal(shouldShowHomePopupNotice(everyVisit, dismissed), true)
})

test('selectNextHomePopupNotice walks queue after session dismiss', async () => {
  const { noticeDismissKey, selectNextHomePopupNotice } = await loadModule('/src/views/home/popup-notice.ts')

  const queue = [
    notice({ id: 1, version: 'a', show_once: true }),
    notice({ id: 2, version: 'b', show_once: false }),
    notice({ id: 3, version: 'c', show_once: true }),
  ]

  assert.equal(selectNextHomePopupNotice(queue)?.id, 1)

  const afterFirstClose = selectNextHomePopupNotice(queue, {
    sessionDismissedKeys: new Set([noticeDismissKey(queue[0])]),
  })
  assert.equal(afterFirstClose?.id, 2)

  const afterSecondClose = selectNextHomePopupNotice(queue, {
    sessionDismissedKeys: new Set([
      noticeDismissKey(queue[0]),
      noticeDismissKey(queue[1]),
    ]),
  })
  assert.equal(afterSecondClose?.id, 3)
})

test('selectNextHomePopupNotice skips persistently dismissed show_once items', async () => {
  const { noticeDismissKey, selectNextHomePopupNotice } = await loadModule('/src/views/home/popup-notice.ts')

  const queue = [
    notice({ id: 1, version: 'seen', show_once: true }),
    notice({ id: 2, version: 'next', show_once: true }),
  ]

  const next = selectNextHomePopupNotice(queue, {
    dismissedKeys: new Set([noticeDismissKey(queue[0])]),
  })

  assert.equal(next?.id, 2)
})

test('normalizeHomePopupNotice accepts title/content without image', async () => {
  const { normalizeHomePopupNotice } = await loadModule('/src/views/home/popup-notice.ts')

  const result = normalizeHomePopupNotice(
    {
      ...sampleApiItem,
      image_url: '',
      i18n: [{ locale: 'zh', title: '标题', content: '正文', image_url: '' }],
    },
    'zh',
  )

  assert.deepEqual(result, {
    id: 2,
    version: '2026-07-04',
    image_url: null,
    title: '标题',
    content: '正文',
    link_url: 'https://x-dao.io',
    link_target: 1,
    show_once: true,
  })
})

test('isHomePopupNoticeWithinSchedule excludes items outside start/end window', async () => {
  const { isHomePopupNoticeWithinSchedule, normalizeHomePopupNotice } =
    await loadModule('/src/views/home/popup-notice.ts')

  const window = {
    start_time: '2026-07-04T08:00:00.000Z',
    end_time: '2026-07-04T18:00:00.000Z',
  }

  const inside = Date.parse('2026-07-04T12:00:00.000Z')
  const beforeStart = Date.parse('2026-07-04T07:59:59.999Z')
  const afterEnd = Date.parse('2026-07-04T18:00:00.001Z')

  assert.equal(isHomePopupNoticeWithinSchedule(window, inside), true)
  assert.equal(isHomePopupNoticeWithinSchedule(window, beforeStart), false)
  assert.equal(isHomePopupNoticeWithinSchedule(window, afterEnd), false)
  assert.equal(
    isHomePopupNoticeWithinSchedule({ start_time: null, end_time: null }, inside),
    true,
  )

  assert.equal(
    normalizeHomePopupNotice({ ...sampleApiItem, ...window }, 'zh', inside)?.id,
    2,
  )
  assert.equal(normalizeHomePopupNotice({ ...sampleApiItem, ...window }, 'zh', beforeStart), null)
  assert.equal(normalizeHomePopupNotice({ ...sampleApiItem, ...window }, 'zh', afterEnd), null)
})

test('getHomePopupNotices uses POST with locale body', async () => {
  const { getHomePopupNotices } = await loadModule('/src/lib/api/endpoints.ts')

  const originalFetch = globalThis.fetch
  globalThis.fetch = async (url, init) => {
    assert.match(String(url), /\/home\/popup-notices$/)
    assert.equal(init?.method, 'POST')
    assert.deepEqual(JSON.parse(String(init?.body)), { locale: 'zh' })

    return Response.json({
      code: 0,
      data: { items: [sampleApiItem] },
    })
  }

  try {
    const data = await getHomePopupNotices('zh')
    assert.equal(data.items.length, 1)
    assert.equal(data.items[0].display_mode, 1)
  } finally {
    globalThis.fetch = originalFetch
  }
})
