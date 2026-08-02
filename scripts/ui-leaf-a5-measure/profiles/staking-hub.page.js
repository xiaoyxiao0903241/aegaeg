;(() => {
  const near = (a, b, t = 2) => Math.abs(a - b) <= t
  const classifyColor = (c) => {
    if (!c) return 'none'
    if (/oklch\(1 |oklab\(0\.999|rgb\(255,\s*255,\s*255\)|255, 255, 255/.test(c)) return 'white'
    if (/\/ 0\.4\)|0\.4\)/.test(c)) return 'muted40'
    if (/\/ 0\.7\)|0\.7\)/.test(c) && !/0\.1635/.test(c)) return 'body70'
    if (/0\.6683|36\.6|e978|e86a|primary/.test(c)) return 'coral'
    if (/0\.1635|11,\s*14,\s*20|#0b0e14/i.test(c)) return 'ink'
    if (/success|34,\s*197|22,\s*163/.test(c)) return 'success'
    return c.slice(0, 48)
  }
  const styleOf = (el) => {
    if (!el) return null
    const r = el.getBoundingClientRect()
    const cs = getComputedStyle(el)
    const img = el.tagName === 'IMG' ? el : el.querySelector?.('img')
    return {
      found: true,
      tag: el.tagName,
      w: Math.round(r.width * 10) / 10,
      h: Math.round(r.height * 10) / 10,
      x: Math.round(r.x),
      y: Math.round(r.y),
      fs: parseFloat(cs.fontSize) || null,
      fw: parseInt(cs.fontWeight, 10) || null,
      color: classifyColor(cs.color),
      colorRaw: cs.color,
      bg: cs.backgroundColor,
      br: cs.borderRadius,
      padT: parseFloat(cs.paddingTop),
      padB: parseFloat(cs.paddingBottom),
      padL: parseFloat(cs.paddingLeft),
      padR: parseFloat(cs.paddingRight),
      borderTop: `${cs.borderTopStyle} ${cs.borderTopWidth}`,
      shadow: cs.boxShadow === 'none' ? 'none' : 'yes',
      src: img ? img.getAttribute('src') || '' : null,
      text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80),
    }
  }
  const textsExact = (exact, pred) =>
    [...document.querySelectorAll('span,p,strong,h1,h2,h3,button,div,a,li')].filter((e) => {
      const t = (e.textContent || '').trim()
      if (t !== exact) return false
      if ([...e.children].some((k) => (k.textContent || '').trim() === exact)) return false
      const r = e.getBoundingClientRect()
      if (r.width < 1 || r.height < 1) return false
      return pred ? pred(e, r) : true
    })
  const first = (arr) => arr[0] || null
  const climb = (el, pred, max = 14) => {
    let n = el
    for (let i = 0; i < max && n; i++) {
      if (pred(n)) return n
      n = n.parentElement
    }
    return el
  }

  const title = first(
    textsExact(
      '质押',
      (e, r) => r.y < 160 && r.x > 180 && r.x < 700 && r.height >= 18 && r.height <= 32,
    ),
  )
  const subtitle = [...document.querySelectorAll('span,p')].find((e) => {
    const t = (e.textContent || '').trim()
    const r = e.getBoundingClientRect()
    return /Rebase 复利增长/.test(t) && r.y < 220 && t.length < 40
  })
  const menuBtn = [...document.querySelectorAll('button')].find((b) => {
    const r = b.getBoundingClientRect()
    return near(r.width, 36, 1) && near(r.height, 36, 1) && r.y < 160
  })
  const menuIcon = menuBtn?.querySelector('svg,img') || null

  const modeTitles = ['质押', 'LP债券', '销毁债券', 'X挖矿', '收益计算器']
  const modeCards = modeTitles.map((name) => {
    const btn = [...document.querySelectorAll('button')].find((el) => {
      const r = el.getBoundingClientRect()
      const t = (el.textContent || '').replace(/\s+/g, '')
      return (
        r.width > 300 &&
        r.width < 380 &&
        r.height > 50 &&
        r.height < 90 &&
        t.startsWith(name.replace(/\s+/g, ''))
      )
    })
    if (!btn) return {}
    const titleEl = [...btn.querySelectorAll('span,p,strong')].find(
      (e) => (e.textContent || '').trim() === name,
    )
    const bodyEl = [...btn.querySelectorAll('span,p')].find((e) => {
      const t = (e.textContent || '').trim()
      return t.length > 8 && t !== name && !e.querySelector('span,p')
    })
    const icon = btn.querySelector('img')
    return {
      card: styleOf(btn),
      icon: styleOf(icon),
      title: styleOf(titleEl),
      body: styleOf(bodyEl),
    }
  })

  const overviewTitle = first(textsExact('数据总览'))
  const metricDefs = [
    { id: 'tvl', lab: '质押总量(TVL)', hasApprox: true, hasToken: true },
    { id: 'mcap', lab: '总市值', hasApprox: false, hasToken: false },
    { id: 'circ', lab: 'AGX 流通量', hasApprox: false, hasToken: true },
    { id: 'treasury', lab: '智库储备', hasApprox: true, hasToken: true },
    { id: 'price', lab: 'AGX 价格', hasApprox: false, hasToken: true },
    { id: 'burn', lab: '总销毁量', hasApprox: false, hasToken: true },
    { id: 'rebase', lab: '当前 Rebase 收益率', hasApprox: false, hasToken: false },
    { id: 'runway', lab: '可运行周期', hasApprox: false, hasToken: false },
    { id: 'stakers', lab: '质押地址数', hasApprox: false, hasToken: false },
  ]
  const tiles = {}
  for (const def of metricDefs) {
    const labEl = first(textsExact(def.lab))
    if (!labEl) {
      tiles[def.id] = {}
      continue
    }
    const card = climb(labEl, (n) => {
      const r = n.getBoundingClientRect()
      const cs = getComputedStyle(n)
      return (
        r.width > 200 &&
        r.width < 280 &&
        r.height > 55 &&
        r.height < 100 &&
        parseFloat(cs.paddingTop) >= 14
      )
    })
    const info = [...card.querySelectorAll('svg,button,img')].find((s) => {
      const r = s.getBoundingClientRect()
      return near(r.width, 12, 3) && near(r.height, 12, 3)
    })
    const valueCandidates = [...card.querySelectorAll('span,p,strong')].filter((e) => {
      const t = (e.textContent || '').trim()
      if (!t || t === def.lab) return false
      if ([...e.children].some((k) => (k.textContent || '').trim() === t)) return false
      return true
    })
    const approx = valueCandidates.find((e) => /^≈/.test((e.textContent || '').trim()))
    const value = valueCandidates.find(
      (e) => e !== approx && !/^≈/.test((e.textContent || '').trim()),
    )
    const token = [...card.querySelectorAll('img')].find((img) => {
      const r = img.getBoundingClientRect()
      return near(r.width, 18, 4) && near(r.height, 18, 4)
    })
    tiles[def.id] = {
      card: styleOf(card),
      label: styleOf(labEl),
      info: styleOf(info),
      value: styleOf(value),
      approx: styleOf(approx),
      token: styleOf(token),
    }
  }

  const periodTitle = first(textsExact('质押周期与收益'))
  const tabLabels = ['质押', 'LP债券', '销毁债券']
  const tabs = tabLabels.map((lab) => {
    const el = [...document.querySelectorAll('[role=tab],button,span')].find((e) => {
      const t = (e.textContent || '').trim()
      const r = e.getBoundingClientRect()
      return t === lab && r.height >= 24 && r.height <= 36 && r.y > 200
    })
    const surface = el
      ? climb(el, (n) => {
          const r = n.getBoundingClientRect()
          return near(r.height, 28, 4) && r.width > 40 && r.width < 160
        })
      : null
    return { surface: styleOf(surface), text: styleOf(el) }
  })

  const tableTitleRow = first(textsExact('周期'))
  const table = tableTitleRow
    ? climb(
        tableTitleRow,
        (n) =>
          n.tagName === 'TABLE' ||
          (n.getBoundingClientRect().width > 400 && n.querySelector?.('table')),
      )
    : null
  const tableCard = table
    ? climb(table, (n) => {
        const r = n.getBoundingClientRect()
        const cs = getComputedStyle(n)
        return r.width > 500 && parseFloat(cs.paddingTop) >= 12
      })
    : null
  const colLabs = ['周期', '基础收益率（日）', '收益率加成', '周期收益率'].map((t) =>
    styleOf(first(textsExact(t))),
  )
  const rowLabs = ['活期（限期）', '180 天', '360 天', '540 天']
  const rows = rowLabs.map((lab) => {
    const period = first(textsExact(lab))
    const tr = period ? climb(period, (n) => n.tagName === 'TR') : null
    const cells = tr
      ? [...tr.querySelectorAll('td')].map((td) => styleOf(td.querySelector('span,p') || td))
      : []
    return {
      period: styleOf(period),
      base: cells[1] || null,
      bonus: cells[2] || null,
      yield: cells[3] || null,
    }
  })

  const metricsTitle = first(textsExact('数据指标'))
  const chartMetricTabs = ['质押总量TVL', '总市值'].map((lab) => {
    const el = [...document.querySelectorAll('button,span,[role=tab]')].find(
      (e) =>
        (e.textContent || '').trim() === lab || (e.textContent || '').replace(/\s+/g, '') === lab,
    )
    return styleOf(el)
  })
  // Segment may show "质押总量 TVL" with space
  if (!chartMetricTabs[0]) {
    const el = [...document.querySelectorAll('button,span')].find(
      (e) => /质押总量/.test((e.textContent || '').trim()) && /TVL/.test(e.textContent || ''),
    )
    chartMetricTabs[0] = styleOf(el)
  }

  const chartValue = [...document.querySelectorAll('strong,span')].find((e) => {
    const t = (e.textContent || '').trim()
    const r = e.getBoundingClientRect()
    return (
      (/^\$|^0\.00|AGX|—/.test(t) || t === '$0.00') &&
      r.height >= 18 &&
      r.height <= 28 &&
      /数据指标/.test(document.body.innerText)
    )
  })
  // Prefer strong near chart header
  const chartHeaderStrong = [...document.querySelectorAll('strong')].find((e) => {
    const t = (e.textContent || '').trim()
    return t === '$0.00' || t === '0.00' || /^\$/.test(t)
  })
  const chartDelta = [...document.querySelectorAll('span')].find(
    (e) => (e.textContent || '').trim() === '+0.0%' || (e.textContent || '').trim() === '0.0%',
  )
  const chartCard = chartHeaderStrong
    ? climb(chartHeaderStrong, (n) => {
        const r = n.getBoundingClientRect()
        return r.width > 400 && r.height > 180
      })
    : null
  const ranges = ['1周', '1月', '1年', '全部'].map((lab) => styleOf(first(textsExact(lab))))
  const xaxis = [...document.querySelectorAll('span,text,p')].filter((e) =>
    /^\d{4}-\d{2}$/.test((e.textContent || '').trim()),
  )
  const chartSvg = chartCard?.querySelector('svg') || null
  const chartPaths = chartSvg ? [...chartSvg.querySelectorAll('path')].slice(0, 2) : []

  const faqTitle = first(textsExact('FAQs')) || first(textsExact('FAQ'))
  const faqItems = [...document.querySelectorAll('[data-faq-item]')].map((item) => {
    const q = item.querySelector('[data-faq-trigger],button') || item.querySelector('span,p')
    const chev =
      item.querySelector('img.faq-chevron,img[src*="faq-chevron"],.faq-chevron') ||
      item.querySelector('svg')
    const row = climb(q || item, (n) => {
      const r = n.getBoundingClientRect()
      return r.height >= 48 && r.height <= 72 && r.width > 300
    })
    return { row: styleOf(row), q: styleOf(q), chevron: styleOf(chev) }
  })

  return {
    header: {
      title: styleOf(title),
      subtitle: styleOf(subtitle),
      menuBtn: styleOf(menuBtn),
      menuIcon: styleOf(menuIcon),
    },
    modes: modeCards,
    overview: { title: styleOf(overviewTitle) },
    tiles,
    period: {
      title: styleOf(periodTitle),
      tabs,
      tableCard: styleOf(tableCard),
      cols: colLabs,
      rows,
    },
    chart: {
      title: styleOf(metricsTitle),
      metricTabs: chartMetricTabs,
      card: styleOf(chartCard),
      value: styleOf(chartHeaderStrong || chartValue),
      delta: styleOf(chartDelta),
      ranges,
      xaxis: xaxis.map(styleOf),
      area: styleOf(chartPaths[0] || chartSvg),
      line: styleOf(chartPaths[1] || chartSvg),
    },
    faq: {
      title: styleOf(faqTitle),
      items: faqItems,
    },
  }
})()
