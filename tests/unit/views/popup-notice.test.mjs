import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

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
  const { normalizeHomePopupNotice } = await loadModule(
    '/src/views/dapp/host/notices/popup-notice.ts',
  )

  const result = normalizeHomePopupNotice(sampleApiItem, 'zh')

  assert.deepEqual(result, {
    id: 2,
    version: '2026-07-04',
    image_url: 'https://cdn.example.com/zh.png',
    title: '官方公告',
    content: 'AEGIS X 上市信息发布',
    link_url: 'https://x-dao.io',
    link_target: 1,
    startMs: Date.parse('2026-07-04T07:04:26.711Z'),
  })
})

test('normalizeHomePopupNotices sorts by sort_order ascending', async () => {
  const { normalizeHomePopupNotices } = await loadModule(
    '/src/views/dapp/host/notices/popup-notice.ts',
  )

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

test('closed notices stay unread-false even when API sends display_mode 2', async () => {
  const { normalizeHomePopupNotice, noticeDismissKey, shouldShowHomePopupNotice } =
    await loadModule('/src/views/dapp/host/notices/popup-notice.ts')

  const item = normalizeHomePopupNotice({ ...sampleApiItem, display_mode: 2 }, 'zh')
  assert.ok(item)
  assert.equal('show_once' in item, false)
  const dismissed = new Set([noticeDismissKey(item)])
  assert.equal(shouldShowHomePopupNotice(item, dismissed), false)
})

test('normalizeHomePopupNotice defaults version to 1', async () => {
  const { normalizeHomePopupNotice } = await loadModule(
    '/src/views/dapp/host/notices/popup-notice.ts',
  )

  const result = normalizeHomePopupNotice({ ...sampleApiItem, version: '', display_mode: 1 }, 'zh')

  assert.equal(result?.version, '1')
})

test('shouldShowHomePopupNotice persists by id:version', async () => {
  const { noticeDismissKey, shouldShowHomePopupNotice } = await loadModule(
    '/src/views/dapp/host/notices/popup-notice.ts',
  )

  const first = notice({ id: 1, version: 'v2' })
  const sameIdNewVersion = notice({ id: 1, version: 'v3' })
  const dismissed = new Set([noticeDismissKey(first)])

  assert.equal(shouldShowHomePopupNotice(first, dismissed), false)
  assert.equal(shouldShowHomePopupNotice(sameIdNewVersion, dismissed), true)
})

test('selectNextHomePopupNotice walks queue after session dismiss', async () => {
  const { noticeDismissKey, selectNextHomePopupNotice } = await loadModule(
    '/src/views/dapp/host/notices/popup-notice.ts',
  )

  const queue = [
    notice({ id: 1, version: 'a' }),
    notice({ id: 2, version: 'b' }),
    notice({ id: 3, version: 'c' }),
  ]

  assert.equal(selectNextHomePopupNotice(queue)?.id, 1)

  const afterFirstClose = selectNextHomePopupNotice(queue, {
    sessionDismissedKeys: new Set([noticeDismissKey(queue[0])]),
  })
  assert.equal(afterFirstClose?.id, 2)

  const afterSecondClose = selectNextHomePopupNotice(queue, {
    sessionDismissedKeys: new Set([noticeDismissKey(queue[0]), noticeDismissKey(queue[1])]),
  })
  assert.equal(afterSecondClose?.id, 3)

  const afterQueueCleared = selectNextHomePopupNotice(queue, {
    sessionDismissedKeys: new Set([
      noticeDismissKey(queue[0]),
      noticeDismissKey(queue[1]),
      noticeDismissKey(queue[2]),
    ]),
  })
  assert.equal(afterQueueCleared, null)
})

test('selectLatestReadNotice picks newest start_time among read items', async () => {
  const { noticeDismissKey, selectLatestReadNotice, selectNextHomePopupNotice } = await loadModule(
    '/src/views/dapp/host/notices/popup-notice.ts',
  )

  const older = notice({
    id: 1,
    version: 'old',
    startMs: Date.parse('2026-01-01T00:00:00.000Z'),
  })
  const newer = notice({
    id: 2,
    version: 'new',
    startMs: Date.parse('2026-06-01T00:00:00.000Z'),
  })
  const unread = notice({
    id: 3,
    version: 'fresh',
    startMs: Date.parse('2026-08-01T00:00:00.000Z'),
  })
  const dismissedKeys = new Set([noticeDismissKey(older), noticeDismissKey(newer)])
  const queue = [older, newer, unread]

  assert.equal(selectNextHomePopupNotice(queue, { dismissedKeys })?.id, 3)
  assert.equal(selectLatestReadNotice(queue, { dismissedKeys })?.id, 2)
})

test('selectLatestReadNotice treats missing start_time as older', async () => {
  const { noticeDismissKey, selectLatestReadNotice } = await loadModule(
    '/src/views/dapp/host/notices/popup-notice.ts',
  )

  const undated = notice({ id: 10, version: 'none', startMs: null })
  const dated = notice({
    id: 11,
    version: 'dated',
    startMs: Date.parse('2026-02-01T00:00:00.000Z'),
  })
  const dismissedKeys = new Set([noticeDismissKey(undated), noticeDismissKey(dated)])

  assert.equal(selectLatestReadNotice([undated, dated], { dismissedKeys })?.id, 11)
})

test('selectLatestReadNotice breaks start_time ties with larger id', async () => {
  const { noticeDismissKey, selectLatestReadNotice } = await loadModule(
    '/src/views/dapp/host/notices/popup-notice.ts',
  )

  const startMs = Date.parse('2026-03-01T00:00:00.000Z')
  const first = notice({ id: 4, version: 'a', startMs })
  const second = notice({ id: 9, version: 'b', startMs })
  const dismissedKeys = new Set([noticeDismissKey(first), noticeDismissKey(second)])

  assert.equal(selectLatestReadNotice([first, second], { dismissedKeys })?.id, 9)
})

test('selectLatestReadNotice uses session dismiss as read', async () => {
  const { noticeDismissKey, selectLatestReadNotice, selectNextHomePopupNotice } = await loadModule(
    '/src/views/dapp/host/notices/popup-notice.ts',
  )

  const closed = notice({
    id: 5,
    version: 'session',
    startMs: Date.parse('2026-04-01T00:00:00.000Z'),
  })
  const sessionDismissedKeys = new Set([noticeDismissKey(closed)])

  assert.equal(selectNextHomePopupNotice([closed], { sessionDismissedKeys }), null)
  assert.equal(selectLatestReadNotice([closed], { sessionDismissedKeys })?.id, 5)
})

test('selectLatestReadNotice skips broken images', async () => {
  const { noticeDismissKey, selectLatestReadNotice } = await loadModule(
    '/src/views/dapp/host/notices/popup-notice.ts',
  )

  const broken = notice({
    id: 6,
    version: 'broken',
    startMs: Date.parse('2026-09-01T00:00:00.000Z'),
  })
  const older = notice({
    id: 7,
    version: 'ok',
    startMs: Date.parse('2026-01-01T00:00:00.000Z'),
  })
  const dismissedKeys = new Set([noticeDismissKey(broken), noticeDismissKey(older)])

  assert.equal(
    selectLatestReadNotice([broken, older], {
      dismissedKeys,
      brokenImageKeys: new Set([noticeDismissKey(broken)]),
    })?.id,
    7,
  )
})

test('selectNextHomePopupNotice skips persistently dismissed items', async () => {
  const { noticeDismissKey, selectNextHomePopupNotice } = await loadModule(
    '/src/views/dapp/host/notices/popup-notice.ts',
  )

  const queue = [notice({ id: 1, version: 'seen' }), notice({ id: 2, version: 'next' })]

  const next = selectNextHomePopupNotice(queue, {
    dismissedKeys: new Set([noticeDismissKey(queue[0])]),
  })

  assert.equal(next?.id, 2)
})

test('normalizeHomePopupNotice accepts title/content without image', async () => {
  const { normalizeHomePopupNotice } = await loadModule(
    '/src/views/dapp/host/notices/popup-notice.ts',
  )

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
    startMs: Date.parse('2026-07-04T07:04:26.711Z'),
  })
})

test('isHomePopupNoticeWithinSchedule excludes items outside start/end window', async () => {
  const { isHomePopupNoticeWithinSchedule, normalizeHomePopupNotice } = await loadModule(
    '/src/views/dapp/host/notices/popup-notice.ts',
  )

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
  assert.equal(isHomePopupNoticeWithinSchedule({ start_time: null, end_time: null }, inside), true)

  assert.equal(normalizeHomePopupNotice({ ...sampleApiItem, ...window }, 'zh', inside)?.id, 2)
  assert.equal(normalizeHomePopupNotice({ ...sampleApiItem, ...window }, 'zh', beforeStart), null)
  assert.equal(normalizeHomePopupNotice({ ...sampleApiItem, ...window }, 'zh', afterEnd), null)
})

test('getHomePopupNotices uses POST with JWT and locale body', async () => {
  const { getHomePopupNotices } = await loadModule('/src/shared/api/endpoints.ts')

  const originalFetch = globalThis.fetch
  globalThis.fetch = async (url, init) => {
    assert.match(String(url), /\/home\/popup-notices$/)
    assert.equal(init?.method, 'POST')
    assert.equal(init?.headers?.Authorization, 'Bearer jwt')
    assert.deepEqual(JSON.parse(String(init?.body)), { locale: 'zh' })

    return Response.json({
      code: 0,
      data: { items: [sampleApiItem] },
    })
  }

  try {
    const data = await getHomePopupNotices('jwt', 'zh')
    assert.equal(data.items.length, 1)
    assert.equal(data.items[0].display_mode, 1)
  } finally {
    globalThis.fetch = originalFetch
  }
})
