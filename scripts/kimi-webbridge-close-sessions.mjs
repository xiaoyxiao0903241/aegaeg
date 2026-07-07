#!/usr/bin/env node
/** 关闭 tmp 报告里记录过的 WebBridge session 标签组 */
import fs, { globSync } from 'node:fs'
import path from 'node:path'

const WB = 'http://127.0.0.1:10086/command'
const ROOT = process.argv[2] ?? 'tmp'

function collectSessions(dir) {
  const sessions = new Set()
  for (const file of globSync('**/report.json', { cwd: dir, absolute: true })) {
    try {
      const d = JSON.parse(fs.readFileSync(file, 'utf8'))
      if (d.session) sessions.add(d.session)
    } catch {
      /* ignore */
    }
  }
  return sessions
}

async function closeSession(name) {
  const res = await fetch(WB, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'close_session', args: {}, session: name }),
  })
  const json = await res.json()
  if (!json.ok) return 0
  return json.data?.closed ?? 0
}

const sessions = collectSessions(path.resolve(ROOT))
sessions.add('aegis-visual-compare')

let total = 0
for (const s of sessions) {
  const n = await closeSession(s)
  if (n > 0) console.log(`closed ${n} tabs — ${s}`)
  total += n
}
console.log(`done, total ${total} tabs closed`)
