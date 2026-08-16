;(() => {
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
  const leftish = (_e, r) => r.x < 700
  const rightish = (_e, r) => r.x > 700
  const leafTextsIn = (root) =>
    [...(root?.querySelectorAll('span,p,strong') || [])].filter((e) => {
      const t = (e.textContent || '').trim()
      if (!t) return false
      if ([...e.children].some((k) => (k.textContent || '').trim() === t)) return false
      return true
    })

  // —— header ——
  const h1 = [...document.querySelectorAll('h1')].find(
    (e) => (e.textContent || '').trim() === '奖励' && e.getBoundingClientRect().x < 700,
  )
  const title = h1 || first(textsExact('奖励', leftish))
  const subtitle = [...document.querySelectorAll('span,p')].find((e) => {
    const t = (e.textContent || '').trim()
    const r = e.getBoundingClientRect()
    return leftish(e, r) && r.y < 200 && t.length > 12 && t.length < 80 && /奖励|领取|共建/.test(t)
  })
  const headerBtns = [...document.querySelectorAll('button')].filter((b) => {
    const r = b.getBoundingClientRect()
    return near(r.width, 36, 3) && near(r.height, 36, 3) && r.y < 160 && r.x > 400 && r.x < 900
  })
  const menuBtn = headerBtns[headerBtns.length - 1] || null
  const settingsBtn = headerBtns.length > 1 ? headerBtns[0] : null

  // —— 6× mode cards ——
  const modeDefs = [
    { title: '幸运奖', bal: '余额' },
    { title: '推荐奖', bal: '余额' },
    { title: '参与奖', bal: '余额' },
    { title: '共建奖', bal: '余额' },
    { title: '发展津贴', bal: '可领取' },
    { title: '创世共建奖励', bal: '可领取', genesis: true },
  ]
  const modes = modeDefs.map((def) => {
    const btn = [...document.querySelectorAll('button')].find((el) => {
      const r = el.getBoundingClientRect()
      const spans = [...el.querySelectorAll('span,p,strong')].map((s) =>
        (s.textContent || '').trim(),
      )
      return (
        spans.includes(def.title) &&
        r.width > 300 &&
        r.width < 400 &&
        r.height > 90 &&
        r.height < 140 &&
        r.x < 700
      )
    })
    if (!btn) return {}
    const texts = leafTextsIn(btn)
    const byExact = (t) => texts.find((e) => (e.textContent || '').trim() === t)
    const body = texts.find((e) => {
      const t = (e.textContent || '').trim()
      return (
        t.length > 8 && t !== def.title && t !== def.bal && !/^≈|^0\.|^\$|进入领取|即将关闭/.test(t)
      )
    })
    const amount = texts.find((e) => {
      const t = (e.textContent || '').trim()
      return /gAGX$|^\$/.test(t) && !/^≈/.test(t)
    })
    const approx = texts.find((e) => /^≈/.test((e.textContent || '').trim()))
    const badgeText = byExact('即将关闭')
    const badge = badgeText
      ? climb(badgeText, (n) => {
          const r = n.getBoundingClientRect()
          return near(r.height, 17, 4) && r.width > 40 && r.width < 80
        })
      : null
    const claim = byExact('进入领取')
    const claimIcon = claim?.parentElement?.querySelector('img') || null
    return {
      card: styleOf(btn),
      icon: styleOf(btn.querySelector('img')),
      title: styleOf(byExact(def.title)),
      body: styleOf(body),
      bal: styleOf(byExact(def.bal)),
      amount: styleOf(amount),
      approx: styleOf(approx),
      badge: styleOf(badge),
      badgeText: styleOf(badgeText),
      claim: styleOf(claim),
      claimIcon: styleOf(claimIcon),
    }
  })

  // —— tiles ——
  const tileByLabel = (lab) => {
    const labEl = first(textsExact(lab, rightish))
    if (!labEl) return {}
    const card = climb(labEl, (n) => {
      const r = n.getBoundingClientRect()
      const cs = getComputedStyle(n)
      return (
        r.width > 200 &&
        r.width < 320 &&
        r.height > 55 &&
        r.height < 110 &&
        parseFloat(cs.paddingTop) >= 12
      )
    })
    const texts = leafTextsIn(card)
    const byExact = (t) => texts.find((e) => (e.textContent || '').trim() === t)
    const imgs = [...(card?.querySelectorAll('img') || [])]
    return { card, labEl, texts, byExact, imgs }
  }
  const total = tileByLabel('总奖励')
  const tier = tileByLabel('共建级别')
  const personal = tileByLabel('个人持仓')
  const making = tileByLabel('总业绩')
  const small = tileByLabel('小区业绩')
  const contrib = tileByLabel('贡献点数')
  const goBurnBtn = [...(contrib.card?.querySelectorAll('button') || [])].find((b) =>
    (b.textContent || '').includes('去销毁'),
  )
  const goBurnText = first(textsExact('去销毁', rightish)) || goBurnBtn
  const goBurnIcon = goBurnBtn?.querySelector('img,svg') || null

  // —— about ——
  const aboutHeading = first(textsExact('关于AEGIS X奖励', rightish))
  const carouselRoot =
    aboutHeading?.nextElementSibling ||
    [...document.querySelectorAll('div')].find((el) => {
      const r = el.getBoundingClientRect()
      return (
        rightish(el, r) &&
        r.width > 700 &&
        r.height > 120 &&
        r.height < 220 &&
        el.querySelector('img') &&
        /推荐奖|参与奖|共建奖|幸运奖/.test(el.textContent || '')
      )
    })
  const slideCard = carouselRoot
    ? climb(
        carouselRoot.querySelector('article,button,[class*="card"]') ||
          [...carouselRoot.querySelectorAll('div')].find((n) => {
            const r = n.getBoundingClientRect()
            return r.width > 600 && r.height > 100 && r.height < 160
          }),
        (n) => {
          const r = n.getBoundingClientRect()
          return r.width > 600 && r.height >= 100 && r.height <= 160
        },
      )
    : null
  const slideTitle =
    first(textsExact('推荐奖', rightish)) ||
    leafTextsIn(slideCard).find((e) => /奖$/.test((e.textContent || '').trim()))
  const slideBody = leafTextsIn(slideCard).find((e) => {
    const t = (e.textContent || '').trim()
    return t.length > 12 && t !== (slideTitle?.textContent || '').trim()
  })
  const wash = slideCard
    ? [...slideCard.querySelectorAll('div')].find((d) => {
        const cs = getComputedStyle(d)
        return /gradient|linear/i.test(cs.backgroundImage) || cs.backgroundImage !== 'none'
      })
    : null
  const mascot =
    slideCard?.querySelector('img') ||
    [...(carouselRoot?.querySelectorAll('img') || [])].find((img) => {
      const r = img.getBoundingClientRect()
      return r.height > 80
    })
  const dots = [...(carouselRoot?.querySelectorAll('button') || [])].filter((b) => {
    const r = b.getBoundingClientRect()
    return r.height <= 12 && r.width <= 30 && r.width >= 4
  })
  const navBtns = [...(carouselRoot?.querySelectorAll('button') || [])].filter((b) => {
    const t = (b.textContent || '').trim()
    const r = b.getBoundingClientRect()
    return (
      (t === '‹' || t === '›' || /prev|next/i.test(b.getAttribute('aria-label') || '')) &&
      r.width <= 24
    )
  })

  // —— mechanism ——
  const mechHeading = first(textsExact('共建奖机制', rightish))
  const mechBody =
    mechHeading?.nextElementSibling?.tagName === 'P'
      ? mechHeading.nextElementSibling
      : [...document.querySelectorAll('p')].find((e) => {
          const t = (e.textContent || '').trim()
          const r = e.getBoundingClientRect()
          return rightish(e, r) && /任意双线|等级|奖金/.test(t) && t.length > 20 && t.length < 120
        })
  const table = [...document.querySelectorAll('table')].find((t) => {
    const r = t.getBoundingClientRect()
    return rightish(t, r) && r.width > 400
  })
  const tableCard = table
    ? climb(table, (n) => {
        const r = n.getBoundingClientRect()
        return (n.tagName === 'ARTICLE' || r.height > 400) && r.width > 500
      })
    : null
  const ths = ['等级', '个人持仓', '有效账户', '团队业绩', '奖金比例'].map((lab) =>
    styleOf(first(textsExact(lab, rightish))),
  )
  const rowLabs = [
    'A1',
    'A2',
    'A3',
    'A4',
    'A5',
    'A6',
    'A7',
    'A8',
    'A9',
    'A10',
    'A11',
    'A12',
    'A13',
    '终身成就奖',
  ]
  const mechRows = rowLabs.map((lab) => {
    const level = first(textsExact(lab, rightish))
    const tr = level ? climb(level, (n) => n.tagName === 'TR') : null
    const cells = tr
      ? [...tr.querySelectorAll('td')].map((td) => {
          const texts = leafTextsIn(td)
          if (texts.length > 1) return texts.map((e) => styleOf(e))
          return styleOf(texts[0] || td.querySelector('span,p') || td)
        })
      : []
    return { level: styleOf(level), cells, tr }
  })
  const currentBadgeText = first(textsExact('当前', rightish))
  const currentBadge = currentBadgeText
    ? climb(currentBadgeText, (n) => {
        const r = n.getBoundingClientRect()
        return near(r.height, 17, 4) && r.width >= 30 && r.width <= 50
      })
    : null
  const globalDiv = first(textsExact('+全球分红 5%', rightish))
  const mechFooter = [...document.querySelectorAll('p')].find((e) => {
    const t = (e.textContent || '').trim()
    const r = e.getBoundingClientRect()
    return rightish(e, r) && t.length > 30 && /全球分红|级别|仅供参考|机制/.test(t) && r.y > 800
  })

  // —— FAQ ——
  const faqHeading = first(textsExact('FAQs', rightish)) || first(textsExact('FAQ', rightish))
  const faqItems = [...document.querySelectorAll('[data-faq-item]')].map((item) => {
    const q = item.querySelector('[data-faq-trigger],button') || item.querySelector('span,p')
    const chev =
      item.querySelector('img') ||
      item.querySelector('svg') ||
      [...item.querySelectorAll('*')].find((n) => {
        const r = n.getBoundingClientRect()
        return near(r.width, 16, 6) && near(r.height, 16, 6) && n !== q
      })
    const row = climb(q || item, (n) => {
      const r = n.getBoundingClientRect()
      return r.height >= 40 && r.height <= 70 && r.width > 400
    })
    return { row: styleOf(row), q: styleOf(q), chevron: styleOf(chev) }
  })

  const rail = document.querySelector('nav[aria-label="DApp sections"]')
  const widget = document.querySelector('[data-dapp-widget-panel]')

  const flatCells = (row) => {
    const out = []
    for (const c of row.cells || []) {
      if (Array.isArray(c)) out.push(...c)
      else out.push(c)
    }
    return out
  }

  return {
    href: location.href,
    iw: window.innerWidth,
    header: {
      title: styleOf(title),
      subtitle: styleOf(subtitle),
      settings: styleOf(settingsBtn),
      settingsIcon: styleOf(settingsBtn?.querySelector('img,svg')),
      menu: styleOf(menuBtn),
      menuIcon: styleOf(menuBtn?.querySelector('img,svg')),
    },
    modes,
    tiles: {
      total: {
        card: styleOf(total.card),
        label: styleOf(total.labEl),
        dot: styleOf(total.imgs?.[0]),
        value: styleOf(total.byExact?.('0.00 gAGX') || total.texts?.[1]),
        approx: styleOf(
          total.byExact?.('≈ $0.00') ||
            total.texts?.find((e) => /^≈/.test((e.textContent || '').trim())),
        ),
      },
      tier: {
        card: styleOf(tier.card),
        label: styleOf(tier.labEl),
        value: styleOf(tier.byExact?.('暂未达到共建级别') || tier.texts?.[1]),
        deco: styleOf(tier.imgs?.[0]),
      },
      personal: {
        card: styleOf(personal.card),
        label: styleOf(personal.labEl),
        usd: styleOf(personal.byExact?.('$0.00') || personal.texts?.[1]),
        agx: styleOf(personal.byExact?.('0.00 AGX') || personal.texts?.[2]),
      },
      making: {
        card: styleOf(making.card),
        label: styleOf(making.labEl),
        usd: styleOf(making.byExact?.('$0.00') || making.texts?.[1]),
        agx: styleOf(making.byExact?.('0.00 AGX') || making.texts?.[2]),
      },
      small: {
        card: styleOf(small.card),
        label: styleOf(small.labEl),
        usd: styleOf(small.byExact?.('$0.00') || small.texts?.[1]),
        agx: styleOf(small.byExact?.('0.00 AGX') || small.texts?.[2]),
      },
      contrib: {
        card: styleOf(contrib.card),
        label: styleOf(contrib.labEl),
        pill: styleOf(goBurnBtn),
        pillText: styleOf(goBurnText),
        pillIcon: styleOf(goBurnIcon),
        usd: styleOf(contrib.byExact?.('$0.00') || contrib.texts?.[1]),
        hint: styleOf(
          contrib.byExact?.('领取奖励按 1:1 消耗') ||
            contrib.texts?.find((e) => /1:1/.test(e.textContent || '')),
        ),
      },
    },
    about: {
      heading: styleOf(aboutHeading),
      slide: styleOf(slideCard),
      slideTitle: styleOf(slideTitle),
      slideBody: styleOf(slideBody),
      wash: styleOf(wash),
      mascot: styleOf(mascot),
      prev: styleOf(navBtns[0]),
      dots: dots.map((d) => styleOf(d)),
      next: styleOf(navBtns[1] || navBtns[0]),
    },
    mechanism: {
      heading: styleOf(mechHeading),
      body: styleOf(mechBody),
      tableCard: styleOf(tableCard),
      ths,
      rows: mechRows.map((row) => ({
        level: row.level,
        cells: flatCells(row),
      })),
      currentBadge: styleOf(currentBadge),
      currentBadgeText: styleOf(currentBadgeText),
      globalDiv: styleOf(globalDiv),
      footer: styleOf(mechFooter),
    },
    faq: {
      heading: styleOf(faqHeading),
      items: faqItems,
    },
    shell: {
      dividerL: styleOfBorderDivider(rail, 'right'),
      dividerR: styleOfBorderDivider(widget, 'right'),
    },
  }
})()
