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
  // 右栏 detail：1920 下 x≈625；勿用 700 漏掉
  const rightish = (_e, r) => r.x > 500
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
      (e) => (e.textContent || '').trim() === '缓冲池',
    ) || null
  const tabHeader = title
    ? climb(title, (n) => {
        const r = n.getBoundingClientRect()
        if (!(r.width > 280 && r.width < 560 && r.height >= 80 && r.height <= 140)) return false
        const hasBack = !!n.querySelector?.('button')
        const hasH1 = !!n.querySelector?.('h1')
        return hasBack && hasH1
      })
    : null

  // —— left buf cards（AGX / gAGX）——
  const packBuf = (token) => {
    const pillText =
      [...(widgetPanel?.querySelectorAll('span') || [])].find((e) => {
        const t = (e.textContent || '').trim()
        if (t !== token) return false
        const r = e.getBoundingClientRect()
        return r.width > 20 && r.width < 80 && r.height >= 14 && r.height <= 32 && r.x < 500
      }) || null
    const card = pillText
      ? climb(pillText, (n) => {
          const r = n.getBoundingClientRect()
          return (
            near(r.height, 183, 24) &&
            near(r.width, 351, 40) &&
            !!n.querySelector?.('button') &&
            !!n.querySelector?.('img')
          )
        })
      : null
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
    const pill = pillText
      ? climb(pillText, (n) => {
          const r = n.getBoundingClientRect()
          const cs = getComputedStyle(n)
          return (
            near(r.height, 25, 8) &&
            r.width >= 40 &&
            r.width <= 90 &&
            (parseFloat(cs.borderRadius) >= 8 || /999|50%|9999px/.test(cs.borderRadius))
          )
        })
      : null

    // 原型/产品刷新（替稿 radio）
    const refresh =
      card.querySelector(`[data-slot-id="release-buffer-refresh-${token.toLowerCase()}"]`) ||
      [...card.querySelectorAll('button')].find((b) => {
        const lab = b.getAttribute('aria-label') || ''
        return /刷新|Refresh/i.test(lab)
      }) ||
      null

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
        return /gAGX|AGX|\d/.test(t) && !/^已释放$/.test(t) && !/^释放中$/.test(t)
      }) || null
    const releasingAmt =
      [...(rightPair?.querySelectorAll('span') || [])].find((e) => {
        const t = (e.textContent || '').trim()
        return /gAGX|AGX|\d/.test(t) && !/^已释放$/.test(t) && !/^释放中$/.test(t)
      }) || null
    const releasedLab = styleOfTextNode(leftPair, (t) => /^已释放$/.test(t))
    const releasingLab = styleOfTextNode(rightPair, (t) => /^释放中$/.test(t))

    const bar =
      [...card.querySelectorAll('div')].find((d) => {
        const r = d.getBoundingClientRect()
        const cs = getComputedStyle(d)
        return (
          near(r.height, 6, 4) &&
          r.width > 200 &&
          parseFloat(cs.borderRadius) >= 4 &&
          d.children.length <= 2
        )
      }) || null

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
        return t === '提取' || /提取/.test(t)
      }) || null
    const claimText =
      (claimBtn &&
        [...claimBtn.querySelectorAll('span')].find(
          (e) => (e.textContent || '').trim() === '提取',
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

  const bufs = {
    AGX: packBuf('AGX'),
    gAGX: packBuf('gAGX'),
  }

  // —— stats wide cards ——
  const statsHeading =
    first(textsExact('缓冲池数据', rightish)) || document.querySelector('#release-buffer-title')
  const packWide = (token) => {
    const tokenLabel =
      [...document.querySelectorAll('strong,span')].find((e) => {
        const t = (e.textContent || '').trim()
        if (t !== token) return false
        const r = e.getBoundingClientRect()
        return rightish(e, r) && r.y > 80 && r.y < 500 && near(r.height, 20, 8)
      }) || null
    const card = tokenLabel
      ? climb(tokenLabel, (n) => {
          const r = n.getBoundingClientRect()
          return near(r.height, 119, 30) && r.width > 600 && r.width < 900 && rightish(null, r)
        })
      : null
    const icon = card?.querySelector('img') || null
    const metricLabs = ['累计进入', '累计提取', '释放中']
    const metrics = metricLabs.map((lab) => {
      const label = byExactIn(card, lab) || first(textsExact(lab, rightish))
      const cell = label
        ? climb(label, (n) => {
            const r = n.getBoundingClientRect()
            return n.classList?.contains?.('grid') || (r.height >= 40 && r.height <= 80)
          })
        : null
      // DappCountValue 拆 digit reel → 用 cell 整串 / strong 包层定位，勿依赖稿演示数
      const value =
        (cell &&
          [...cell.querySelectorAll('strong,span')].find((e) => {
            const t = (e.textContent || '').replace(/\s+/g, ' ').trim()
            return /\d/.test(t) && /AGX|gAGX/.test(t) && t !== lab && t !== token
          })) ||
        leafTextsIn(cell || card).find((e) => {
          const t = (e.textContent || '').trim()
          return /gAGX|AGX/.test(t) && t !== lab && t !== token && !/^累计|^释放中$/.test(t)
        }) ||
        null
      const approx =
        leafTextsIn(cell || card).find((e) => {
          const t = (e.textContent || '').trim()
          return /^≈|^\$/.test(t)
        }) || null
      return {
        label: styleOf(label),
        value: styleOf(value),
        approx: styleOf(approx),
      }
    })
    return {
      card: styleOf(card),
      icon: styleOf(icon),
      tokenLabel: styleOf(tokenLabel),
      metrics,
    }
  }

  // —— records ——
  const recordsHeading = first(textsExact('缓冲池记录', rightish))
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

  // pager（空会话 / 现码未挂 DappTablePagination → locate_fail OK）
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

  // —— mechanism ——
  const mechTitle = first(textsExact('资金释放机制', rightish))
  const mechSubtitle =
    (mechTitle?.nextElementSibling?.tagName === 'P' ? mechTitle.nextElementSibling : null) ||
    first(textsExact('质押与债券本金采用双阶段释放模型，增强市场稳定性', rightish))
  const stepTitles = ['质押/', '区块级', '提取后', '二次线性']
  const stepBodies = ['债券本金', '线性释放', '30 天缓冲', '释放']
  // 稿拆行（line1/line2）= title/body
  const figmaLine1 = stepTitles
  const figmaLine2 = stepBodies
  const stages =
    document.querySelector('[data-slot-id="release-buffer-mech-stages"]') ||
    [...document.querySelectorAll('ol,div')].find((ol) => {
      const t = (ol.textContent || '').replace(/\s+/g, ' ')
      const r = ol.getBoundingClientRect()
      return rightish(null, r) && /质押/.test(t) && /二次线性/.test(t) && ol.children.length >= 4
    })
  const fcard =
    document.querySelector('[data-slot-id="release-buffer-mechanism"]') ||
    (stages
      ? climb(stages, (n) => {
          const r = n.getBoundingClientRect()
          return near(r.height, 183, 50) && r.width > 600 && rightish(null, r)
        })
      : mechTitle
        ? [...(mechTitle.parentElement?.querySelectorAll('div,article') || [])].find((n) => {
            const r = n.getBoundingClientRect()
            return near(r.height, 183, 50) && r.width > 600
          })
        : null)
  const steps = stepTitles.map((lab, i) => {
    const li =
      [...(stages?.children || [])].find((el) => (el.textContent || '').includes(lab)) ||
      [...(stages?.querySelectorAll(':scope > div, :scope > *') || [])].find((el) =>
        (el.textContent || '').includes(lab),
      ) ||
      null
    const titleEl = byExactIn(li || fcard, lab) || first(textsExact(lab, rightish))
    const bodyEl =
      byExactIn(li || fcard, stepBodies[i]) || first(textsExact(stepBodies[i], rightish))
    const line1 =
      byExactIn(li || fcard, figmaLine1[i]) ||
      styleOfTextNode(li || fcard, (t) => t === figmaLine1[i]) ||
      titleEl
    const line2 =
      byExactIn(li || fcard, figmaLine2[i]) ||
      styleOfTextNode(li || fcard, (t) => t === figmaLine2[i]) ||
      bodyEl
    // 圆标 44（data-slot）；勿量到内部 svg/img 22
    const icon =
      document.querySelector(`[data-slot-id="release-buffer-mech-icon-${i}"]`) ||
      [...(li?.querySelectorAll('span,div') || [])].find((el) => {
        const r = el.getBoundingClientRect()
        return near(r.width, 44, 10) && near(r.height, 44, 10)
      }) ||
      null
    return {
      icon: styleOf(icon),
      line1: line1 && line1.found ? line1 : styleOf(line1),
      line2: line2 && line2.found ? line2 : styleOf(line2),
    }
  })
  const conns = [0, 1, 2].map((i) =>
    styleOf(
      document.querySelector(`[data-slot-id="release-buffer-mech-arrow-${i}"]`) ||
        document.querySelector(`[data-slot-id="release-buffer-mech-conn-${i}"]`),
    ),
  )

  const benefitLabs = ['避免集中解锁', '降低市场抛压', '平滑资金释放', '增强市场稳定性']
  const stripEl = document.querySelector('[data-slot-id="release-buffer-mech-strip"]')
  const benefitLis = [...((stripEl || fcard)?.querySelectorAll('li') || [])].filter((li) => {
    const t = (li.textContent || '').trim()
    return benefitLabs.some((lab) => t.includes(lab))
  })
  const strip =
    stripEl ||
    (benefitLis[0]
      ? climb(benefitLis[0], (n) => {
          const r = n.getBoundingClientRect()
          return (
            n.tagName === 'UL' ||
            (r.width > 500 && r.height >= 24 && r.height <= 50 && rightish(null, r))
          )
        })
      : null)
  const benefits = benefitLabs.map((lab, i) => {
    const li = benefitLis[i] || null
    const text = byExactIn(li || fcard, lab) || first(textsExact(lab, rightish))
    const check =
      li?.querySelector('img') ||
      li?.querySelector('svg') ||
      li?.querySelector('span[aria-hidden]') ||
      [...(li?.querySelectorAll('span,svg,img') || [])].find((el) => {
        const r = el.getBoundingClientRect()
        return r.width <= 16 && r.height <= 16 && r.width >= 4
      }) ||
      null
    return { check: styleOf(check), text: styleOf(text) }
  })

  // —— FAQ（§8.2a reuse · 整块 list）——
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
    bufs,
    stats: {
      heading: styleOf(statsHeading),
      wide: {
        AGX: packWide('AGX'),
        gAGX: packWide('gAGX'),
      },
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
    mech: {
      title: styleOf(mechTitle),
      subtitle: styleOf(mechSubtitle),
      fcard: styleOf(fcard),
      steps,
      conns,
      strip: styleOf(strip),
      benefits,
    },
    faq: {
      list: styleOf(faqList),
    },
  }
})()
