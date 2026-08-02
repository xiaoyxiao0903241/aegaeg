;(() => {
  const near = (a, b, t = 2) => Math.abs(a - b) <= t
  const classifyColor = (c) => {
    if (!c) return 'none'
    if (/oklch\(1 |oklab\(0\.999|rgb\(255,\s*255,\s*255\)|255, 255, 255/.test(c)) return 'white'
    if (/\/ 0\.4\)|0\.4\)/.test(c)) return 'muted40'
    if (/\/ 0\.7\)|0\.7\)/.test(c) && !/0\.1635/.test(c)) return 'body70'
    if (/0\.6683|36\.6|e978|e86a|primary/.test(c)) return 'coral'
    if (/0\.685|0\.145\s*38|coral/.test(c)) return 'coral'
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
    [...document.querySelectorAll('span,p,strong,h1,h2,h3,button,div,a,li,label')].filter((e) => {
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
  const leftish = (e, r) => r.x < 720
  const rightish = (e, r) => r.x >= 700

  // —— left header ——
  const backLabel = first(textsExact('返回质押', leftish))
  const backBtn = backLabel
    ? climb(backLabel, (n) => n.tagName === 'BUTTON' || n.getAttribute?.('role') === 'button')
    : null
  const backIcon =
    backBtn?.querySelector('svg,img') ||
    (backLabel
      ? climb(backLabel, (n) => n.querySelector?.('svg,img'))?.querySelector('svg,img')
      : null)

  const title = first(
    textsExact('质押', (e, r) => leftish(e, r) && r.y < 200 && r.height >= 18 && r.height <= 32),
  )
  const subtitle = [...document.querySelectorAll('span,p')].find((e) => {
    const t = (e.textContent || '').trim()
    const r = e.getBoundingClientRect()
    return leftish(e, r) && /Rebase 复利增长/.test(t) && r.y < 260
  })
  // collapse FAQ so row height matches closed 56
  ;[...document.querySelectorAll('[data-faq-trigger][data-state="open"]')].forEach((el) =>
    el.click(),
  )
  const menuBtn = [...document.querySelectorAll('button')].find((b) => {
    const r = b.getBoundingClientRect()
    return near(r.width, 36, 2) && near(r.height, 36, 2) && r.y < 180
  })
  const menuIcon = menuBtn?.querySelector('svg,img') || null

  const periodLabel = first(textsExact('选择质押周期', leftish))
  const periodLabs = ['活期', '180天', '360天', '540天']
  const periodTexts = periodLabs.map((lab) =>
    styleOf(first(textsExact(lab, (e, r) => leftish(e, r) && r.y > 180 && r.y < 420))),
  )
  const periodSegEl = periodLabel
    ? (() => {
        const next = periodLabel.parentElement?.querySelector('[role=tablist],div')
        const tabsRoot = [...document.querySelectorAll('[role=tablist],div')].find((el) => {
          const r = el.getBoundingClientRect()
          const t = (el.textContent || '').replace(/\s+/g, '')
          return (
            leftish(null, r) &&
            near(r.height, 36, 6) &&
            r.width > 280 &&
            r.width < 400 &&
            t.includes('活期') &&
            t.includes('180天')
          )
        })
        return tabsRoot || next
      })()
    : null

  const amountLabel = [...document.querySelectorAll('span,label,p')].find((e) => {
    const t = (e.textContent || '').trim()
    const r = e.getBoundingClientRect()
    return leftish(e, r) && /^数量/.test(t) && r.y > 250
  })
  const amountInput = [...document.querySelectorAll('input')].find((el) => {
    const r = el.getBoundingClientRect()
    return leftish(null, r) && r.width > 40 && r.y > 280
  })
  const inputBox = amountInput
    ? climb(amountInput, (n) => {
        const r = n.getBoundingClientRect()
        return near(r.height, 53, 8) && r.width > 280 && r.width < 400
      })
    : null
  const amountText =
    amountInput ||
    [...(inputBox?.querySelectorAll('span,p') || [])].find((e) =>
      /0\.00|^\d/.test((e.textContent || '').trim()),
    )
  const agxToken = [...document.querySelectorAll('img')].find((img) => {
    const r = img.getBoundingClientRect()
    return (
      leftish(null, r) && near(r.width, 22, 6) && near(r.height, 22, 6) && r.y > 300 && r.y < 520
    )
  })
  const agxText = first(textsExact('AGX', (e, r) => leftish(e, r) && r.y > 300 && r.y < 520))
  const maxText = first(textsExact('最大', leftish))
  const maxChip = maxText
    ? climb(maxText, (n) => {
        const r = n.getBoundingClientRect()
        return near(r.height, 27, 8) && r.width > 30 && r.width < 80
      })
    : null

  const metaLabs = ['基础收益率（日）', '周期收益率', '收益率加成', '锁定天数', '查看合约']
  const metaRows = metaLabs.map((lab) => {
    const labEl = first(textsExact(lab, leftish))
    if (!labEl) return { label: null, value: null }
    const row = climb(labEl, (n) => {
      const r = n.getBoundingClientRect()
      return r.width > 250 && r.height >= 16 && r.height <= 40 && leftish(null, r)
    })
    const valueEl = [...(row?.querySelectorAll('span,a,strong,p') || [])].find((e) => {
      const t = (e.textContent || '').trim()
      return t && t !== lab && ![...e.children].some((k) => (k.textContent || '').trim() === t)
    })
    return { label: styleOf(labEl), value: styleOf(valueEl) }
  })
  const infoBox = metaRows[0]?.label
    ? (() => {
        const labEl = first(textsExact('基础收益率（日）', leftish))
        return climb(labEl, (n) => {
          const r = n.getBoundingClientRect()
          return r.height > 120 && r.height < 220 && r.width > 280 && r.width < 400
        })
      })()
    : null

  const ctaTextEl =
    first(
      textsExact('质押', (e, r) => leftish(e, r) && r.y > 500 && r.height >= 16 && r.height <= 28),
    ) ||
    first(textsExact('连接钱包', (e, r) => leftish(e, r) && r.y > 500)) ||
    null
  const ctaBtn =
    (ctaTextEl
      ? climb(ctaTextEl, (n) => {
          const r = n.getBoundingClientRect()
          return n.tagName === 'BUTTON' || (r.height > 44 && r.width > 280 && r.width < 400)
        })
      : null) ||
    [...document.querySelectorAll('button')].find((b) => {
      const r = b.getBoundingClientRect()
      const t = (b.textContent || '').trim()
      return (
        leftish(null, r) &&
        near(r.height, 52, 10) &&
        r.width > 280 &&
        r.width < 400 &&
        r.y > 500 &&
        /质押|连接|绑定/.test(t)
      )
    })

  // —— overview tiles ——
  const overviewTitle = first(textsExact('概览', rightish))
  const metricCardFromLabel = (lab, predX = rightish) => {
    const labEl = first(textsExact(lab, predX))
    if (!labEl) return {}
    const card = climb(labEl, (n) => {
      const r = n.getBoundingClientRect()
      const cs = getComputedStyle(n)
      return (
        r.width > 180 &&
        r.width < 450 &&
        r.height > 55 &&
        r.height < 120 &&
        parseFloat(cs.paddingTop) >= 10
      )
    })
    const valueCandidates = [...card.querySelectorAll('span,p,strong')].filter((e) => {
      const t = (e.textContent || '').trim()
      if (!t || t === lab) return false
      if ([...e.children].some((k) => (k.textContent || '').trim() === t)) return false
      return true
    })
    const approx = valueCandidates.find((e) => /^≈/.test((e.textContent || '').trim()))
    const value = valueCandidates.find(
      (e) => e !== approx && !/^≈/.test((e.textContent || '').trim()),
    )
    const token = [...card.querySelectorAll('img')].find((img) => {
      const r = img.getBoundingClientRect()
      return near(r.width, 18, 6) && near(r.height, 18, 6)
    })
    return {
      card: styleOf(card),
      label: styleOf(labEl),
      value: styleOf(value),
      approx: styleOf(approx),
      token: styleOf(token),
    }
  }

  const overview = {
    title: styleOf(overviewTitle),
    tvl: metricCardFromLabel('总质押量'),
    epoch: metricCardFromLabel('当前 Epoch'),
    next: metricCardFromLabel('下一次 Rebase 发放'),
    rebase: metricCardFromLabel('当前 Rebase 收益率'),
  }

  const posTitle = first(textsExact('我的仓位', rightish))
  const viewText = first(textsExact('查看', rightish))
  const viewBadge = viewText
    ? climb(viewText, (n) => {
        const r = n.getBoundingClientRect()
        return near(r.height, 21, 8) && r.width > 30 && r.width < 80
      })
    : null

  const positions = {
    title: styleOf(posTitle),
    viewBadge: styleOf(viewBadge),
    viewText: styleOf(viewText),
    held: metricCardFromLabel('我的持仓'),
    released: metricCardFromLabel('已释放'),
    pending: metricCardFromLabel('待释放'),
    rebaseYield: metricCardFromLabel('当前Rebase 收益'),
    rebaseBonus: metricCardFromLabel('当前Rebase 加成'),
  }

  // —— records ——
  const recordsTitle = first(textsExact('我的质押记录', rightish))
  const colLabs = ['时间', '周期', '数量', '已释放', '交易哈希']
  // Prefer table header cells
  const table = (() => {
    const th = first(textsExact('交易哈希', rightish))
    if (!th) return null
    return climb(
      th,
      (n) =>
        n.tagName === 'TABLE' ||
        (n.getBoundingClientRect().width > 400 && n.querySelector?.('table,thead,[role=row]')),
    )
  })()
  const emptyMsg = [...document.querySelectorAll('span,p')].find((e) =>
    /暂无质押记录/.test((e.textContent || '').trim()),
  )
  const tableCard = table
    ? climb(table, (n) => {
        const r = n.getBoundingClientRect()
        return r.width > 500 && r.height > 80
      })
    : emptyMsg
      ? climb(emptyMsg, (n) => {
          const r = n.getBoundingClientRect()
          const cs = getComputedStyle(n)
          return r.width > 500 && (cs.boxShadow !== 'none' || parseFloat(cs.paddingTop) >= 12)
        })
      : null
  const cols = colLabs.map((lab) => {
    // header row near records
    const el = [...document.querySelectorAll('th,span,div,p')].find((e) => {
      const t = (e.textContent || '').trim()
      const r = e.getBoundingClientRect()
      if (t !== lab || !rightish(e, r)) return false
      if (lab === '已释放') {
        // avoid position metric
        return r.y > (recordsTitle?.getBoundingClientRect().y || 600)
      }
      return true
    })
    return styleOf(el)
  })
  const bodyRows = table
    ? [...table.querySelectorAll('tbody tr, [role=row]')].filter((tr) => {
        const t = (tr.textContent || '').trim()
        return t && !colLabs.every((c) => t.includes(c))
      })
    : []
  const cellStyles = (tr) => {
    const cells = [...tr.querySelectorAll('td, [role=cell], span')].filter((e) => {
      const t = (e.textContent || '').trim()
      return t && ![...e.children].some((k) => (k.textContent || '').trim() === t)
    })
    // Prefer td children
    const tds = [...tr.querySelectorAll('td')]
    if (tds.length >= 5) {
      return tds.slice(0, 5).map((td) => styleOf(td.querySelector('span,a,p') || td))
    }
    return cells.slice(0, 5).map(styleOf)
  }
  const dataRows = [0, 1].map((i) => {
    const tr = bodyRows[i]
    if (!tr) return [null, null, null, null, null]
    const cells = cellStyles(tr)
    while (cells.length < 5) cells.push(null)
    return cells
  })
  const footCumEl = first(
    [...document.querySelectorAll('span,p,div')].filter((e) => {
      const t = (e.textContent || '').trim()
      const r = e.getBoundingClientRect()
      return rightish(e, r) && (t === '累计质押' || /^累计质押/.test(t)) && t.length < 40
    }),
  )
  const footCountEl = first(
    [...document.querySelectorAll('span,p,div')].filter((e) => {
      const t = (e.textContent || '').trim()
      const r = e.getBoundingClientRect()
      return rightish(e, r) && /^共\s*\d+\s*条/.test(t)
    }),
  )

  // —— mechanism ——
  const mechTitle = first(textsExact('质押运行机制', rightish))
  const stepTitles = ['质押 AGX', '每日 Rebase 收益', '到期释放与领取']
  const steps = stepTitles.map((st, idx) => {
    const titleEl = first(textsExact(st, rightish))
    const numEl = first(
      textsExact(String(idx + 1), (e, r) => {
        if (!rightish(e, r)) return false
        const pr = titleEl?.getBoundingClientRect()
        if (!pr) return near(r.width, 28, 10)
        return Math.abs(r.y - pr.y) < 80
      }),
    )
    const cir = numEl
      ? climb(numEl, (n) => {
          const r = n.getBoundingClientRect()
          return near(r.width, 28, 6) && near(r.height, 28, 6)
        })
      : null
    const bodyEl = titleEl
      ? [...(titleEl.parentElement?.querySelectorAll('span,p') || [])].find((e) => {
          const t = (e.textContent || '').trim()
          return t && t !== st && t.length > 12
        })
      : null
    return {
      cir: styleOf(cir),
      num: styleOf(numEl),
      title: styleOf(titleEl),
      body: styleOf(bodyEl),
    }
  })
  const mechTitleEl = first(textsExact('质押 AGX', rightish))
  // 爬到带 pad 的 Card（article），勿停在内层 flex/ol 内容壳
  const mechCard = mechTitleEl
    ? climb(mechTitleEl, (n) => {
        const r = n.getBoundingClientRect()
        const cs = getComputedStyle(n)
        const pad = parseFloat(cs.paddingTop) || 0
        return (
          (n.tagName === 'ARTICLE' || pad >= 20) &&
          r.width > 500 &&
          r.height > 120 &&
          r.height < 240
        )
      })
    : null

  // —— chart ——
  const chartTitleEl = first(
    [...document.querySelectorAll('span,h2,h3,p,strong')].filter((e) => {
      const t = (e.textContent || '').trim()
      const r = e.getBoundingClientRect()
      return rightish(e, r) && /TVL/.test(t) && /数据指标/.test(t)
    }),
  )
  const chartValue = [...document.querySelectorAll('strong,span')].find((e) => {
    const t = (e.textContent || '').trim()
    const r = e.getBoundingClientRect()
    return (
      rightish(e, r) &&
      (t === '$0.00' || t === '—' || /^\$/.test(t)) &&
      r.height >= 18 &&
      r.height <= 32
    )
  })
  const chartDelta = [...document.querySelectorAll('span')].find((e) => {
    const t = (e.textContent || '').trim()
    const r = e.getBoundingClientRect()
    return rightish(e, r) && (t === '+0.0%' || t === '0.0%' || t === '—') && r.height <= 24
  })
  const chartCard = chartValue
    ? climb(chartValue, (n) => {
        const r = n.getBoundingClientRect()
        return r.width > 500 && r.height > 180
      })
    : null
  const ranges = ['1周', '1月', '1年', '全部'].map((lab) =>
    styleOf(first(textsExact(lab, rightish))),
  )
  const xaxis = [...document.querySelectorAll('span,text,p')].filter((e) =>
    /^\d{4}-\d{2}$/.test((e.textContent || '').trim()),
  )
  const chartSvg = chartCard?.querySelector('svg') || null
  const chartPaths = chartSvg ? [...chartSvg.querySelectorAll('path')].slice(0, 2) : []

  // —— FAQ ——
  const faqQs = [
    '质押收益如何计算？',
    '质押本金何时可取？',
    '参考 APY 是固定的吗？',
    'Rebase 收益和 Rebase 加成有什么区别？',
    '收益以什么形式发放？',
    '质押到期前可以提前退出吗？',
    '活期质押有什么限制？',
    '同一账户可以有多笔质押吗？',
  ]
  const faqItems = [...document.querySelectorAll('[data-faq-item]')].map((item) => {
    const trigger = item.querySelector('[data-faq-trigger]')
    const q =
      [...(trigger?.querySelectorAll('span,p') || [])].find(
        (e) => (e.textContent || '').trim().length > 4,
      ) ||
      trigger?.querySelector('span,p') ||
      trigger
    const chev =
      item.querySelector('img.faq-chevron,img[src*="faq-chevron"],.faq-chevron') ||
      item.querySelector('svg,img')
    return { row: styleOf(item), q: styleOf(q), chevron: styleOf(chev) }
  })
  const faqByText = faqQs.map((q) => {
    const qEl = first(
      [...document.querySelectorAll('span,button,p')].filter((e) => {
        const t = (e.textContent || '').trim()
        const r = e.getBoundingClientRect()
        return rightish(e, r) && (t === q || t.startsWith(q.slice(0, 8)))
      }),
    )
    if (!qEl) return { row: null, q: null, chevron: null }
    const row = climb(qEl, (n) => {
      const r = n.getBoundingClientRect()
      return r.height >= 48 && r.height <= 80 && r.width > 300
    })
    const chev = row?.querySelector?.('img.faq-chevron,img[src*="faq"],.faq-chevron,svg') || null
    return { row: styleOf(row), q: styleOf(qEl), chevron: styleOf(chev) }
  })
  const faqs = faqItems.length >= 8 ? faqItems.slice(0, 8) : faqByText

  return {
    href: location.href,
    iw: window.innerWidth,
    header: {
      backIcon: styleOf(backIcon),
      backLabel: styleOf(backLabel),
      menuBtn: styleOf(menuBtn),
      menuIcon: styleOf(menuIcon),
      title: styleOf(title),
      subtitle: styleOf(subtitle),
    },
    form: {
      periodLabel: styleOf(periodLabel),
      periodSeg: styleOf(periodSegEl),
      periodTexts,
      amountLabel: styleOf(amountLabel),
      inputBox: styleOf(inputBox),
      amount: styleOf(amountText),
      agxToken: styleOf(agxToken),
      agxText: styleOf(agxText),
      maxChip: styleOf(maxChip),
      maxText: styleOf(maxText),
      infoBox: styleOf(infoBox),
      meta: metaRows,
      cta: styleOf(ctaBtn),
      ctaText: styleOf(
        ctaBtn
          ? [...ctaBtn.querySelectorAll('span')].find(
              (e) => (e.textContent || '').trim().length > 0,
            ) || ctaBtn
          : ctaTextEl,
      ),
    },
    overview,
    positions,
    records: {
      title: styleOf(recordsTitle),
      tableCard: styleOf(tableCard),
      cols,
      rows: dataRows,
      footCum: styleOf(footCumEl),
      footCount: styleOf(footCountEl),
    },
    mechanism: {
      title: styleOf(mechTitle),
      card: styleOf(mechCard),
      steps,
    },
    chart: {
      title: styleOf(chartTitleEl),
      card: styleOf(chartCard),
      value: styleOf(chartValue),
      delta: styleOf(chartDelta),
      ranges,
      area: styleOf(chartPaths[0] || chartSvg),
      line: styleOf(chartPaths[1] || chartSvg),
      xaxis: xaxis.map(styleOf),
    },
    faq: { items: faqs },
  }
})()
