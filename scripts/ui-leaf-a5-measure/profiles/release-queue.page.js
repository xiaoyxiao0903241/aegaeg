;(() => {
  // 与 waitUntilReady 同钉：防 CDP iw 漂移导致 rem≠16
  document.documentElement.classList.remove('site-fluid')
  document.documentElement.style.setProperty('font-size', '16px', 'important')

  const near = (a, b, t = 2) => Math.abs(a - b) <= t
  const classifyColor = (c) => {
    if (!c) return 'none'
    if (/oklch\(1 |oklab\(0\.999|rgb\(255,\s*255,\s*255\)|255, 255, 255/.test(c)) return 'white'
    if (/\/ 0\.4\)|0\.4\)/.test(c)) return 'muted40'
    if (/\/ 0\.7\)|0\.7\)/.test(c) && !/0\.1635/.test(c)) return 'body70'
    if (/0\.6683|36\.6|e978|e86a|primary|0\.685.*38/.test(c)) return 'coral'
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
  const styleOfBorderDivider = (el, side = 'right') => {
    if (!el) return null
    const r = el.getBoundingClientRect()
    const cs = getComputedStyle(el)
    const bw = parseFloat(side === 'right' ? cs.borderRightWidth : cs.borderLeftWidth)
    if (!(bw > 0)) return null
    return {
      found: true,
      tag: 'DIVIDER',
      w: bw,
      h: Math.round(r.height * 10) / 10,
      x: Math.round(side === 'right' ? r.x + r.width - bw : r.x),
      y: Math.round(r.y),
      fs: null,
      fw: null,
      color: 'none',
      colorRaw: null,
      bg: side === 'right' ? cs.borderRightColor : cs.borderLeftColor,
      br: '0',
      padT: 0,
      padB: 0,
      padL: 0,
      padR: 0,
      borderTop: 'none 0px',
      shadow: 'none',
      src: null,
      text: '',
    }
  }
  /** 量纯文本节点（「已释放」与金额同 span 时） */
  const styleOfTextNode = (root, pred) => {
    if (!root) return null
    const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    let n
    while ((n = tw.nextNode())) {
      const t = (n.textContent || '').trim()
      if (!t || !pred(t)) continue
      const range = document.createRange()
      range.selectNodeContents(n)
      const r = range.getBoundingClientRect()
      if (r.width < 1 || r.height < 1) continue
      const parent = n.parentElement
      const cs = parent ? getComputedStyle(parent) : null
      return {
        found: true,
        tag: 'TEXT',
        w: Math.round(r.width * 10) / 10,
        h: Math.round(r.height * 10) / 10,
        x: Math.round(r.x),
        y: Math.round(r.y),
        fs: cs ? parseFloat(cs.fontSize) || null : null,
        fw: cs ? parseInt(cs.fontWeight, 10) || null : null,
        color: cs ? classifyColor(cs.color) : 'none',
        colorRaw: cs?.color ?? null,
        bg: 'transparent',
        br: '0',
        padT: 0,
        padB: 0,
        padL: 0,
        padR: 0,
        borderTop: 'none 0px',
        shadow: 'none',
        src: null,
        text: t.slice(0, 80),
      }
    }
    return null
  }
  const textsExact = (exact, pred) =>
    [...document.querySelectorAll('span,p,strong,h1,h2,h3,button,div,a,li,th,td')].filter((e) => {
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
  const rightish = (_e, r) => r.x > 700
  const leafTextsIn = (root) =>
    [...(root?.querySelectorAll('span,p,strong') || [])].filter((e) => {
      const t = (e.textContent || '').trim()
      if (!t) return false
      if ([...e.children].some((k) => (k.textContent || '').trim() === t)) return false
      return true
    })
  const byExactIn = (root, t) => leafTextsIn(root).find((e) => (e.textContent || '').trim() === t)
  const chevronOf = (btn) =>
    btn?.querySelector?.('span[aria-hidden]') || btn?.querySelector?.('svg,img') || null

  // —— header（DappTabHeader = WidgetSubpageHeader 整块）——
  const widgetPanel = document.querySelector('[data-dapp-widget-panel]')
  const title =
    [...(widgetPanel?.querySelectorAll('h1') || [])].find(
      (e) => (e.textContent || '').trim() === '释放池',
    ) || null
  // WidgetSubpageHeader 根节点：含返回按钮和 h1；不要停在标题/文案行（高约 22–40）
  const tabHeader = title
    ? climb(title, (n) => {
        const r = n.getBoundingClientRect()
        if (!(r.width > 280 && r.width < 560 && r.height >= 80 && r.height <= 140)) return false
        const hasBack = !!n.querySelector?.('button')
        const hasH1 = !!n.querySelector?.('h1')
        return hasBack && hasH1
      })
    : null

  // —— plan cards（data-slot-id）——
  const packPlan = (days) => {
    const card = document.querySelector(`[data-slot-id="release-queue-plan-${days}"]`)
    if (!card) {
      return {
        card: null,
        icon: null,
        pill: null,
        pillText: null,
        refresh: null,
        releasedLab: null,
        releasedAmt: null,
        releasingLab: null,
        releasingAmt: null,
        bar: null,
        pct: null,
        approx: null,
        claimBtn: null,
        claimText: null,
      }
    }
    const icon = card.querySelector('img') || null
    const pillText =
      byExactIn(card, `${days} 天`) ||
      leafTextsIn(card).find((e) =>
        new RegExp(`^${days}\\s*天$`).test((e.textContent || '').trim()),
      )
    const pill = pillText
      ? climb(pillText, (n) => {
          const r = n.getBoundingClientRect()
          const cs = getComputedStyle(n)
          return (
            near(r.height, 25, 8) &&
            r.width >= 40 &&
            r.width <= 80 &&
            (parseFloat(cs.borderRadius) >= 8 || /999|50%|9999px/.test(cs.borderRadius))
          )
        })
      : null
    const refresh = document.querySelector(`[data-slot-id="release-queue-refresh-${days}"]`)
    const bar = document.querySelector(`[data-slot-id="release-queue-bar-${days}"]`)

    // 金额行：左「已释放 + amt」· 右「释放中 + amt」
    const amountRow = [...card.querySelectorAll('div')].find((d) => {
      const t = (d.textContent || '').replace(/\s+/g, ' ')
      const r = d.getBoundingClientRect()
      return (
        /已释放/.test(t) &&
        /释放中/.test(t) &&
        r.height >= 12 &&
        r.height <= 28 &&
        r.width > 200 &&
        [...d.children].length >= 2
      )
    })
    const leftPair = amountRow?.children?.[0] || null
    const rightPair = amountRow?.children?.[1] || null
    const releasedAmt =
      [...(leftPair?.querySelectorAll('span') || [])].find((e) => {
        const t = (e.textContent || '').trim()
        return /gAGX|AGX/.test(t) && !/已释放|释放中/.test(t)
      }) || null
    const releasingAmt =
      [...(rightPair?.querySelectorAll('span') || [])].find((e) => {
        const t = (e.textContent || '').trim()
        return /gAGX|AGX/.test(t) && !/已释放|释放中/.test(t)
      }) || null
    const releasedLab = styleOfTextNode(leftPair, (t) => /^已释放$/.test(t))
    const releasingLab = styleOfTextNode(rightPair, (t) => /^释放中$/.test(t))

    // 底行：pct · ≈$
    const footRow = [...card.querySelectorAll('div')].find((d) => {
      const t = (d.textContent || '').replace(/\s+/g, ' ')
      const r = d.getBoundingClientRect()
      return (
        /已释放/.test(t) &&
        /%/.test(t) &&
        /≈|\$/.test(t) &&
        r.height >= 10 &&
        r.height <= 24 &&
        r.width > 200
      )
    })
    const pct =
      leafTextsIn(footRow).find(
        (e) => /已释放/.test((e.textContent || '').trim()) && /%/.test(e.textContent || ''),
      ) ||
      leafTextsIn(card).find(
        (e) => /已释放/.test((e.textContent || '').trim()) && /%/.test(e.textContent || ''),
      )
    const approx =
      leafTextsIn(footRow).find((e) => /≈|\$/.test((e.textContent || '').trim())) ||
      leafTextsIn(card).find(
        (e) => /^≈/.test((e.textContent || '').trim()) || /^\$/.test((e.textContent || '').trim()),
      )

    const claimBtn =
      [...card.querySelectorAll('button')].find((b) => {
        const t = (b.textContent || '').trim()
        return t === '领取' || /领取/.test(t)
      }) || null
    const claimText =
      (claimBtn &&
        [...claimBtn.querySelectorAll('span')].find(
          (e) => (e.textContent || '').trim() === '领取',
        )) ||
      claimBtn

    return {
      card: styleOf(card),
      icon: styleOf(icon),
      pill: styleOf(pill || pillText),
      pillText: styleOf(pillText),
      refresh: styleOf(refresh),
      releasedLab,
      releasedAmt: styleOf(releasedAmt),
      releasingLab,
      releasingAmt: styleOf(releasingAmt),
      bar: styleOf(bar),
      pct: styleOf(pct),
      approx: styleOf(approx),
      claimBtn: styleOf(claimBtn),
      claimText: styleOf(claimText),
    }
  }

  const plans = [5, 20, 40, 60].map(packPlan)

  // —— stats ——
  const statsHeading =
    first(textsExact('释放池数据', rightish)) || document.querySelector('#release-queue-title')
  const statLabels = ['释放中', '已释放', '累计从释放池领取']
  const statCards = statLabels.map((lab) => {
    const card =
      document.querySelector(`[data-slot-id="release-queue-stat-${lab}"]`) ||
      (() => {
        const labEl = first(textsExact(lab, rightish))
        return labEl
          ? climb(labEl, (n) => {
              const r = n.getBoundingClientRect()
              return near(r.height, 100, 30) && near(r.width, 251, 40)
            })
          : null
      })()
    const label = byExactIn(card, lab) || first(textsExact(lab, rightish))
    const icon = card?.querySelector('img') || null
    const value =
      leafTextsIn(card).find((e) => {
        const t = (e.textContent || '').trim()
        return /gAGX|AGX/.test(t) && t !== lab
      }) || null
    const approx =
      leafTextsIn(card).find((e) => {
        const t = (e.textContent || '').trim()
        return /^≈|^\$/.test(t)
      }) || null
    return {
      card: styleOf(card),
      label: styleOf(label),
      icon: styleOf(icon),
      value: styleOf(value),
      approx: styleOf(approx),
    }
  })

  // —— records ——
  const recordsHeading = first(textsExact('释放池记录', rightish))
  const colLabs = ['时间', '操作', '数量', '交易哈希']
  const emptyMsg = [...document.querySelectorAll('span,p')].find((e) => {
    const t = (e.textContent || '').trim()
    const r = e.getBoundingClientRect()
    return rightish(e, r) && /暂无|连接/.test(t) && t.length < 80
  })
  const table = (() => {
    const th = first(textsExact('交易哈希', rightish)) || first(textsExact('时间', rightish))
    if (!th) return null
    return climb(
      th,
      (n) =>
        n.tagName === 'TABLE' ||
        (n.getBoundingClientRect().width > 400 && n.querySelector?.('table,thead,[role=row]')),
    )
  })()
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
  const headers = colLabs.map((lab) => {
    const el = [...document.querySelectorAll('th,span,div,p')].find((e) => {
      const t = (e.textContent || '').trim()
      const r = e.getBoundingClientRect()
      if (t !== lab || !rightish(e, r)) return false
      if ([...e.children].some((k) => (k.textContent || '').trim() === lab)) return false
      return r.y > (recordsHeading?.getBoundingClientRect().y || 400)
    })
    return styleOf(el)
  })
  const bodyRows = table
    ? [...table.querySelectorAll('tbody tr, [role=row]')].filter((tr) => {
        const t = (tr.textContent || '').trim()
        return t && !colLabs.every((c) => t.includes(c))
      })
    : []
  const dataRows = [0, 1, 2, 3, 4].map((i) => {
    const tr = bodyRows[i]
    if (!tr) return [null, null, null, null]
    const tds = [...tr.querySelectorAll('td')]
    if (tds.length >= 4) {
      return tds.slice(0, 4).map((td) => styleOf(td.querySelector('span,a,p') || td))
    }
    return [null, null, null, null]
  })

  // 分页（DappTablePagination；本页现码可能未挂，允许定位失败）
  const opsTotal = [...document.querySelectorAll('span,p')].find((e) => {
    const t = (e.textContent || '').trim()
    const r = e.getBoundingClientRect()
    return rightish(e, r) && /^共\s*[\d,]+\s*条$/.test(t)
  })
  const opsPerPage = [...document.querySelectorAll('span,p')].find((e) => {
    const t = (e.textContent || '').trim()
    const r = e.getBoundingClientRect()
    return rightish(e, r) && /^每页\s*\d+\s*条$/.test(t)
  })
  const opsPrevBtn = [...document.querySelectorAll('button')].find((b) => {
    const r = b.getBoundingClientRect()
    const lab = b.getAttribute('aria-label') || ''
    return rightish(null, r) && lab === '上一页' && near(r.width, 24, 12) && near(r.height, 24, 12)
  })
  const opsNextBtn = [...document.querySelectorAll('button')].find((b) => {
    const r = b.getBoundingClientRect()
    const lab = b.getAttribute('aria-label') || ''
    return rightish(null, r) && lab === '下一页' && near(r.width, 24, 12) && near(r.height, 24, 12)
  })
  const opsPageText = [...document.querySelectorAll('span')].find((e) => {
    const t = (e.textContent || '').trim()
    const r = e.getBoundingClientRect()
    return (
      rightish(e, r) &&
      /^\d+\s*\/\s*\d+$/.test(t) &&
      r.y > (recordsHeading?.getBoundingClientRect().y || 0)
    )
  })
  const opsIndicator = opsPageText
    ? climb(opsPageText, (n) => {
        const r = n.getBoundingClientRect()
        return n.tagName === 'BUTTON' || (near(r.height, 24, 10) && r.width > 40 && r.width < 100)
      })
    : null

  // —— FAQ（复用 §8.2a，量整块列表）——
  const faqHeading = first(textsExact('FAQs', rightish)) || first(textsExact('FAQ', rightish))
  const faqItem0 = document.querySelector('[data-faq-item]')
  const faqList = faqItem0
    ? climb(faqItem0, (n) => {
        const r = n.getBoundingClientRect()
        return (
          r.width > 500 &&
          r.height > 200 &&
          (n.querySelectorAll?.('[data-faq-item]')?.length || 0) >= 3
        )
      }) || faqItem0.parentElement
    : null

  const rail = document.querySelector('nav[aria-label="DApp sections"]')
  const widget = document.querySelector('[data-dapp-widget-panel]')

  return {
    href: location.href,
    iw: window.innerWidth,
    rem: parseFloat(getComputedStyle(document.documentElement).fontSize),
    shell: {
      dividerL: styleOfBorderDivider(rail, 'right'),
      dividerR: styleOfBorderDivider(widget, 'right'),
    },
    header: {
      tabHeader: styleOf(tabHeader),
      title: styleOf(title),
    },
    plans,
    stats: {
      heading: styleOf(statsHeading),
      cards: statCards,
    },
    records: {
      heading: styleOf(recordsHeading),
      tableCard: styleOf(tableCard),
      headers,
      rows: dataRows,
      pager: {
        total: styleOf(opsTotal),
        perPage: styleOf(opsPerPage),
        prevBtn: styleOf(opsPrevBtn),
        prevIcon: styleOf(chevronOf(opsPrevBtn)),
        indicator: styleOf(opsIndicator),
        pageText: styleOf(opsPageText),
        dropdown: styleOf(chevronOf(opsIndicator)),
        nextBtn: styleOf(opsNextBtn),
        nextIcon: styleOf(chevronOf(opsNextBtn)),
      },
    },
    faq: {
      heading: styleOf(faqHeading),
      list: styleOf(faqList),
    },
  }
})()
