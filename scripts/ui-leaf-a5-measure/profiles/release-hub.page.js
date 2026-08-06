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
  const styleOfBorderTop = (el) => {
    if (!el) return null
    const r = el.getBoundingClientRect()
    const cs = getComputedStyle(el)
    const bw = parseFloat(cs.borderTopWidth)
    if (!(bw > 0)) return null
    return {
      found: true,
      tag: 'DIVIDER',
      w: Math.round(r.width * 10) / 10,
      h: bw,
      x: Math.round(r.x),
      y: Math.round(r.y),
      fs: null,
      fw: null,
      color: 'none',
      colorRaw: null,
      bg: cs.borderTopColor,
      br: '0',
      padT: 0,
      padB: 0,
      padL: 0,
      padR: 0,
      borderTop: `${cs.borderTopStyle} ${cs.borderTopWidth}`,
      shadow: 'none',
      src: null,
      text: '',
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
  const rightish = (_e, r) => r.x > 700
  const leafTextsIn = (root) =>
    [...(root?.querySelectorAll('span,p,strong') || [])].filter((e) => {
      const t = (e.textContent || '').trim()
      if (!t) return false
      if ([...e.children].some((k) => (k.textContent || '').trim() === t)) return false
      return true
    })
  const byExactIn = (root, t) => leafTextsIn(root).find((e) => (e.textContent || '').trim() === t)

  // —— 标题区（WidgetHeader + DappPanelToggle；锚定 widget panel，避免 x<700 或引导浮层里的「释放」）——
  const widgetPanel = document.querySelector('[data-dapp-widget-panel]')
  const title =
    [...(widgetPanel?.querySelectorAll('h1') || [])].find(
      (e) => (e.textContent || '').trim() === '释放',
    ) || null
  const subtitle =
    [...(widgetPanel?.querySelectorAll('span,p') || [])].find((e) => {
      const t = (e.textContent || '').trim()
      if ([...e.children].some((k) => (k.textContent || '').trim() === t)) return false
      return /管理与查看|收益与本金释放/.test(t)
    }) || null
  const menuBtn =
    [...(widgetPanel?.querySelectorAll('button') || [])].find((b) => {
      const a = b.getAttribute('aria-label') || ''
      return /详情面板|details panel|詳細/i.test(a)
    }) ||
    [...(widgetPanel?.querySelectorAll('button') || [])].find((b) => {
      const r = b.getBoundingClientRect()
      return near(r.width, 36, 4) && near(r.height, 36, 4) && b.querySelector('img,svg')
    }) ||
    null
  const menuIcon = menuBtn?.querySelector('img') || menuBtn?.querySelector('svg') || null

  // —— 释放池 / 缓冲池卡片 ——
  const queueCard = document.querySelector('[data-slot-id="release-pool-card"]')
  const bufferCard = document.querySelector('[data-slot-id="buffer-pool-card"]')

  const packPoolCard = (card, titleText) => {
    if (!card) return {}
    const kids = [...card.children]
    const header = kids[0]
    const grid1 = kids[1]
    const grid2 = kids[2]
    // 量 img 本身（size-5≈20）；不要向上爬到 header 行
    const icon = header?.querySelector('img') || null
    const titleEl = byExactIn(header, titleText)
    const pctHost =
      [...(header?.querySelectorAll('[aria-label]') || [])].find((e) =>
        /%/.test(e.getAttribute('aria-label') || ''),
      ) || null
    const pct = pctHost
      ? climb(pctHost, (n) => {
          const r = n.getBoundingClientRect()
          return n.tagName === 'SPAN' && near(r.height, 16, 8) && r.width < 100
        })
      : leafTextsIn(header).find((e) => /%/.test((e.textContent || '').trim()))
    const gridPs = [...(grid1?.querySelectorAll(':scope > p, :scope > span') || [])]
    return { card, header, grid1, grid2, icon, titleEl, pct, gridPs }
  }

  const queue = packPoolCard(queueCard, '释放池')
  const buffer = packPoolCard(bufferCard, '缓冲池')

  // 释放池网格：标签 ×2、金额 ×2、近似值 ×2
  const qReleasingLab = byExactIn(queue.grid1, '释放中')
  const qReleasedLab = byExactIn(queue.grid1, '已释放')
  const qAmountL = queue.gridPs?.[2] || null
  const qAmountR = queue.gridPs?.[3] || null
  const qApproxL = queue.gridPs?.[4] || null
  const qApproxR = queue.gridPs?.[5] || null

  // 缓冲池网格 1：AGX 总量、gAGX、近似值 ×2；网格 2：已释放对
  const bTotalAgx = buffer.gridPs?.[0] || null
  const bGagx = buffer.gridPs?.[1] || null
  const bApproxL = buffer.gridPs?.[2] || null
  const bApproxR = buffer.gridPs?.[3] || null
  const bReleasedPairs = [...(buffer.grid2?.children || [])]
  const bReleasedLabL = byExactIn(bReleasedPairs[0], '已释放')
  const bReleasedAmtL =
    leafTextsIn(bReleasedPairs[0]).find((e) => (e.textContent || '').trim() !== '已释放') || null
  const bReleasedLabR = byExactIn(bReleasedPairs[1], '已释放')
  const bReleasedAmtR =
    leafTextsIn(bReleasedPairs[1]).find((e) => (e.textContent || '').trim() !== '已释放') || null

  // —— about ——
  const aboutHeading =
    first(textsExact('关于释放', rightish)) || document.querySelector('#release-hub-title')
  const carouselRoot =
    aboutHeading
      ?.closest('section,div')
      ?.querySelector('[data-slot="carousel"],[class*="carousel"]') ||
    aboutHeading?.parentElement?.querySelector('[data-slot="carousel"]') ||
    (() => {
      const slide = first(textsExact('释放池 · 收益与奖励释放', rightish))
      return slide
        ? climb(slide, (n) => {
            const r = n.getBoundingClientRect()
            return r.width > 700 && r.height > 80 && r.height < 200
          })
        : null
    })()
  const slideCard =
    carouselRoot?.querySelector('article') ||
    (() => {
      const t = first(textsExact('释放池 · 收益与奖励释放', rightish))
      return t
        ? climb(t, (n) => {
            const r = n.getBoundingClientRect()
            return n.tagName === 'ARTICLE' || (r.width > 600 && r.height >= 90 && r.height <= 160)
          })
        : null
    })()
  const slideTitle =
    byExactIn(slideCard, '释放池 · 收益与奖励释放') ||
    first(textsExact('释放池 · 收益与奖励释放', rightish))
  const slideBody = leafTextsIn(slideCard).find((e) => {
    const t = (e.textContent || '').trim()
    return t.length > 20 && t !== (slideTitle?.textContent || '').trim()
  })
  const aboutDeco =
    [...(slideCard?.querySelectorAll('img') || carouselRoot?.querySelectorAll('img') || [])].find(
      (img) => /release-deco|about-carousel/.test(img.getAttribute('src') || ''),
    ) ||
    slideCard?.querySelector('img') ||
    null

  // —— mechanism ——
  const mechHeading = first(textsExact('收益领取机制', rightish))
  const mechBody =
    mechHeading?.nextElementSibling?.tagName === 'P'
      ? mechHeading.nextElementSibling
      : [...document.querySelectorAll('p')].find((e) => {
          const t = (e.textContent || '').trim()
          const r = e.getBoundingClientRect()
          return rightish(e, r) && /时间换税率|节奏换稳定/.test(t)
        })
  const mechCard =
    document.querySelector('[data-slot-id="release-mechanism-steps"]') ||
    document.querySelector('[data-slot-id="release-mechanism-card"]') ||
    (mechHeading
      ? climb(
          [...(mechHeading.parentElement?.querySelectorAll('div,article') || [])].find((n) => {
            const r = n.getBoundingClientRect()
            return r.width > 700 && r.height > 80
          }),
          (n) => {
            const r = n.getBoundingClientRect()
            return r.width > 700 && r.height > 80
          },
        )
      : null)

  const stepTitles = [
    '领取 Rebase / DAO 奖励',
    '6 : 1 贡献机制',
    '进入释放池 · 线性释放',
    '领取进入涡轮',
  ]
  const stepBodies = [
    '收益产生',
    '50% 销毁 · 50% 注入 X 底池',
    '选择 5 / 20 / 40 / 60 天周期',
    '1:1 买入解锁卖出额度',
  ]
  const steps = stepTitles.map((lab, i) => {
    const titleEl = byExactIn(mechCard, lab) || first(textsExact(lab, rightish))
    const bodyEl = byExactIn(mechCard, stepBodies[i]) || first(textsExact(stepBodies[i], rightish))
    const li = titleEl ? climb(titleEl, (n) => n.tagName === 'LI') : null
    // 结构：li > div.flex > span.size-7（badge）[+ connector]；不要向上爬到 flex 行（约 2 倍高）
    const badgeRow = li?.querySelector(':scope > div')
    const badge =
      [...(badgeRow?.children || [])].find((n) => {
        const t = (n.textContent || '').trim()
        const r = n.getBoundingClientRect()
        return (
          t === String(i + 1) &&
          n.tagName === 'SPAN' &&
          near(r.width, r.height, 4) &&
          r.width >= 20 &&
          r.width <= 64
        )
      }) || null
    const badgeNum = badge || byExactIn(li, String(i + 1))
    return {
      title: styleOf(titleEl),
      body: styleOf(bodyEl),
      badge: styleOf(badge),
      badgeText: styleOf(badgeNum),
    }
  })

  const connectors = [...(mechCard?.querySelectorAll('span[aria-hidden]') || [])].filter((el) => {
    const r = el.getBoundingClientRect()
    const cs = getComputedStyle(el)
    return r.height <= 4 && r.width > 40 && cs.display !== 'none'
  })
  const connector = connectors[0] || null

  const meDividerEl =
    [...(mechCard?.querySelectorAll('div') || [])].find((d) => {
      const cs = getComputedStyle(d)
      const r = d.getBoundingClientRect()
      return (
        parseFloat(cs.borderTopWidth) > 0 &&
        r.width > 500 &&
        r.height < 8 &&
        !d.querySelector('p,span,li')
      )
    }) || null

  const purposeTitle =
    byExactIn(mechCard, '释放的作用') || first(textsExact('释放的作用', rightish))
  const purposeBody = leafTextsIn(mechCard).find((e) => {
    const t = (e.textContent || '').trim()
    return t.length > 40 && /涡轮|线性释放|抛压/.test(t) && !/时间换税率/.test(t)
  })
  const taxTitle =
    byExactIn(mechCard, '长期释放享受更低税率') ||
    first(textsExact('长期释放享受更低税率', rightish))
  const taxPeriod = byExactIn(mechCard, '释放周期') || first(textsExact('释放周期', rightish))
  const taxRate = byExactIn(mechCard, '领取税率') || first(textsExact('领取税率', rightish))
  const periods = ['5 天', '20 天', '40 天', '60 天'].map(
    (lab) => byExactIn(mechCard, lab) || first(textsExact(lab, rightish)),
  )
  const rates = ['20%', '10%', '5%', '1%'].map(
    (lab) => byExactIn(mechCard, lab) || first(textsExact(lab, rightish)),
  )
  // 税率高亮柱（现码 data-slot-id）
  const taxHighlight20 = document.querySelector('[data-slot-id="tax-highlight-20"]')
  const taxHighlight60 = document.querySelector('[data-slot-id="tax-highlight-60"]')

  // —— FAQ（外观统一取关闭态卡片；首项展开时不要量 answer 高度）——
  const faqHeading = first(textsExact('FAQs', rightish)) || first(textsExact('FAQ', rightish))
  const faqList =
    faqHeading?.parentElement?.querySelector('[data-faq-item]')?.parentElement ||
    document.querySelector('[data-faq-item]')?.parentElement ||
    null
  const faqClosedChrome = [...document.querySelectorAll('[data-faq-item]')].find((el) => {
    const r = el.getBoundingClientRect()
    return near(r.height, 54, 10) && r.width > 400
  })
  const faqItems = [...document.querySelectorAll('[data-faq-item]')].map((item) => {
    const q =
      item.querySelector('[data-faq-trigger] span, [data-faq-trigger] p') ||
      item.querySelector('[data-faq-trigger],button') ||
      item.querySelector('span,p')
    const chev =
      item.querySelector('img.faq-chevron,img') ||
      item.querySelector('svg') ||
      [...item.querySelectorAll('*')].find((n) => {
        const r = n.getBoundingClientRect()
        return near(r.width, 16, 6) && near(r.height, 16, 6) && n !== q
      })
    return { row: styleOf(faqClosedChrome || item), q: styleOf(q), chevron: styleOf(chev) }
  })

  const rail = document.querySelector('nav[aria-label="DApp sections"]')
  const widget = document.querySelector('[data-dapp-widget-panel]')

  return {
    href: location.href,
    iw: window.innerWidth,
    header: {
      title: styleOf(title),
      subtitle: styleOf(subtitle),
      menu: styleOf(menuBtn),
      menuIcon: styleOf(menuIcon),
    },
    queue: {
      card: styleOf(queue.card),
      icon: styleOf(queue.icon),
      title: styleOf(queue.titleEl),
      pct: styleOf(queue.pct),
      releasingLab: styleOf(qReleasingLab),
      releasedLab: styleOf(qReleasedLab),
      amountL: styleOf(qAmountL),
      amountR: styleOf(qAmountR),
      approxL: styleOf(qApproxL),
      approxR: styleOf(qApproxR),
    },
    buffer: {
      card: styleOf(buffer.card),
      icon: styleOf(buffer.icon),
      title: styleOf(buffer.titleEl),
      pct: styleOf(buffer.pct),
      totalAgx: styleOf(bTotalAgx),
      gagx: styleOf(bGagx),
      approxL: styleOf(bApproxL),
      approxR: styleOf(bApproxR),
      releasedLabL: styleOf(bReleasedLabL),
      releasedAmtL: styleOf(bReleasedAmtL),
      releasedLabR: styleOf(bReleasedLabR),
      releasedAmtR: styleOf(bReleasedAmtR),
    },
    about: {
      heading: styleOf(aboutHeading),
      slide: styleOf(slideCard),
      slideTitle: styleOf(slideTitle),
      slideBody: styleOf(slideBody),
      deco: styleOf(aboutDeco),
    },
    mechanism: {
      heading: styleOf(mechHeading),
      body: styleOf(mechBody),
      card: styleOf(mechCard),
      connector: styleOf(connector),
      steps,
      divider: styleOfBorderTop(meDividerEl) || styleOf(meDividerEl),
      purposeTitle: styleOf(purposeTitle),
      purposeBody: styleOf(purposeBody),
      taxTitle: styleOf(taxTitle),
      taxHighlight20: styleOf(taxHighlight20),
      taxHighlight60: styleOf(taxHighlight60),
      taxPeriod: styleOf(taxPeriod),
      periods: periods.map((e) => styleOf(e)),
      taxRate: styleOf(taxRate),
      rates: rates.map((e) => styleOf(e)),
    },
    faq: {
      heading: styleOf(faqHeading),
      list: styleOf(faqList),
      items: faqItems,
    },
    shell: {
      dividerL: styleOfBorderDivider(rail, 'right'),
      dividerR: styleOfBorderDivider(widget, 'right'),
    },
  }
})()
