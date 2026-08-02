;(() => {
  const near = (a, b, t = 2) => Math.abs(a - b) <= t
  const classifyColor = (c) => {
    if (!c) return 'none'
    if (/oklch\(1 |oklab\(0\.999|rgb\(255,\s*255,\s*255\)|255, 255, 255/.test(c)) return 'white'
    if (/\/ 0\.4\)|0\.4\)/.test(c)) return 'muted40'
    if (/\/ 0\.7\)|0\.7\)/.test(c) && !/0\.1635/.test(c)) return 'body70'
    if (/0\.6683|36\.6|e978/.test(c)) return 'coral'
    if (/0\.1635|11,\s*14,\s*20|#0b0e14/i.test(c)) return 'ink'
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
      borderTop: `${cs.borderTopStyle} ${cs.borderTopWidth}`,
      shadow: cs.boxShadow === 'none' ? 'none' : 'yes',
      src: img ? img.getAttribute('src') || '' : null,
      text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60),
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

  const modeCards = [...document.querySelectorAll('article')]
    .filter((el) => {
      const r = el.getBoundingClientRect()
      const t = el.textContent || ''
      return (
        r.width > 300 &&
        r.width < 380 &&
        r.height > 100 &&
        r.height < 140 &&
        t.includes('0.00%') &&
        t.includes('仓位')
      )
    })
    .sort((a, b) => a.getBoundingClientRect().y - b.getBoundingClientRect().y)

  const modePack = (card) => {
    if (!card) return {}
    const title = [...card.querySelectorAll('span')].find((e) =>
      ['质押', 'LP债券', '销毁债券', 'X挖矿'].includes((e.textContent || '').trim()),
    )
    const apr = [...card.querySelectorAll('span')].find(
      (e) => (e.textContent || '').trim() === '0.00%',
    )
    const infoEl = [...card.querySelectorAll('svg')].find((s) => {
      const r = s.getBoundingClientRect()
      return near(r.width, 12, 2) && near(r.height, 12, 2)
    })
    const icon = card.querySelector('img')
    const posLab = [...card.querySelectorAll('span')].find(
      (e) => (e.textContent || '').trim() === '仓位',
    )
    const yldLab = [...card.querySelectorAll('span')].find(
      (e) => (e.textContent || '').trim() === '总收益',
    )
    const strongs = [...card.querySelectorAll('strong')]
    const approx = [...card.querySelectorAll('span')].filter((e) =>
      /^≈/.test((e.textContent || '').trim()),
    )
    return {
      card: styleOf(card),
      icon: styleOf(icon),
      title: styleOf(title),
      apr: styleOf(apr),
      info: styleOf(infoEl),
      posLab: styleOf(posLab),
      yldLab: styleOf(yldLab),
      posVal: styleOf(strongs[0]),
      yldVal: styleOf(strongs[1]),
      posApprox: styleOf(approx[0]),
      yldApprox: styleOf(approx[1]),
    }
  }

  const title = first(
    textsExact(
      '资产',
      (e, r) => r.y < 160 && r.x > 200 && r.x < 700 && r.height >= 20 && r.height <= 32,
    ),
  )
  const subtitle = [...document.querySelectorAll('span,p')].find((e) => {
    const t = (e.textContent || '').trim()
    const r = e.getBoundingClientRect()
    return /管理您的|生态系统资金/.test(t) && r.y < 220 && t.length < 40
  })
  const headerBtns = [...document.querySelectorAll('button')]
    .filter((e) => {
      const r = e.getBoundingClientRect()
      return r.y < 180 && near(r.width, 36, 3) && near(r.height, 36, 3)
    })
    .slice(0, 2)
  const settingsBtn = headerBtns[0]
  const menuBtn = headerBtns[1]

  const ovTitle = first(textsExact('资产总览'))
  const ovLab = first(textsExact('总资产价值'))
  const ovCard = climb(ovLab, (el) => {
    const r = el.getBoundingClientRect()
    return r.width > 500 && r.height > 90 && r.height < 200
  })
  const ovInfo = ovCard?.querySelector('svg')
  const ovMain = [...(ovCard?.querySelectorAll('strong,span') || [])].find(
    (e) =>
      (e.textContent || '').trim() === '$0.00' && parseFloat(getComputedStyle(e).fontSize) >= 28,
  )
  const claimLab = first(textsExact('可领取收益'))
  const claimedLab = first(textsExact('累计已领取'))
  const contribLab = first(textsExact('我的贡献点数'))
  const ovApprox = [...(ovCard?.querySelectorAll('span') || [])].filter(
    (e) => (e.textContent || '').trim() === '≈ $0.00',
  )
  const ovGagx = [...(ovCard?.querySelectorAll('strong,span') || [])].filter(
    (e) => (e.textContent || '').trim() === '0.00 gAGX',
  )
  const contribHint = [...(ovCard?.querySelectorAll('span,p') || [])].find((e) =>
    /领取收益按/.test(e.textContent || ''),
  )
  const deco = ovCard?.querySelector('img')

  const holdTitle = [...document.querySelectorAll('span')].find(
    (e) => (e.textContent || '').trim() === '持仓' && e.getBoundingClientRect().x > 700,
  )
  const holdCard = climb(holdTitle, (el) => {
    const r = el.getBoundingClientRect()
    return r.width > 300 && r.height > 90 && r.height < 140
  })
  const bufTitle = first(textsExact('缓冲池'))
  const bufCard = climb(bufTitle, (el) => {
    const r = el.getBoundingClientRect()
    return r.width > 300 && r.height > 90 && r.height < 140
  })
  const holdReleased = [...(holdCard?.querySelectorAll('span') || [])].find(
    (e) => (e.textContent || '').trim() === '已释放',
  )
  const holdLabs = [...(holdCard?.querySelectorAll('span') || [])].filter((e) =>
    ['已释放', '总持仓', '锁定中'].includes((e.textContent || '').trim()),
  )
  const holdTotalLab = [...(holdCard?.querySelectorAll('span') || [])].find((e) =>
    ['总持仓', '锁定中'].includes((e.textContent || '').trim()),
  )
  const holdStrongs = [...(holdCard?.querySelectorAll('strong') || [])]
  const holdApprox = [...(holdCard?.querySelectorAll('span') || [])].filter((e) =>
    /^≈/.test((e.textContent || '').trim()),
  )
  const holdToken = holdCard?.querySelector('img')

  const bufSwitch = bufCard?.querySelector('button')
  const bufSwapWrap = bufSwitch?.querySelector('span')
  const bufSwapIcon = bufSwitch?.querySelector('img')
  const bufAssetLab = [...(bufSwitch?.querySelectorAll('span') || [])].find((e) =>
    /AGX|gAGX/.test((e.textContent || '').trim()),
  )
  const bufMetricLabs = [...(bufCard?.querySelectorAll('span') || [])].filter((e) =>
    ['总量', '已释放', '可提取'].includes((e.textContent || '').trim()),
  )
  const bufStrongs = [...(bufCard?.querySelectorAll('strong') || [])]
  const bufApprox = [...(bufCard?.querySelectorAll('span') || [])].filter((e) =>
    /^≈/.test((e.textContent || '').trim()),
  )
  const bufToken = [...(bufCard?.querySelectorAll('img') || [])].find(
    (img) => !(img.getAttribute('src') || '').includes('buffer-swap'),
  )

  const distTitle = first(textsExact('持仓分布'))
  const emptyText = [...document.querySelectorAll('p,span')].find(
    (e) => /暂无持仓/.test(e.textContent || '') && e.children.length === 0,
  )
  const emptyShell = climb(emptyText, (el) => getComputedStyle(el).borderTopStyle === 'dashed')

  const rebaseTitle = [...document.querySelectorAll('h2,h3,span')].find(
    (e) =>
      /Rebase/.test(e.textContent || '') &&
      (e.textContent || '').trim().length < 40 &&
      e.getBoundingClientRect().width > 100,
  )
  const rebaseSub = [...document.querySelectorAll('p,span')].find(
    (e) => /分阶段结算|持续释放/.test(e.textContent || '') && e.getBoundingClientRect().y > 500,
  )
  const rebaseCard = climb(
    [...document.querySelectorAll('span')].find(
      (e) => (e.textContent || '').trim() === '区块驱动运行',
    ),
    (el) => {
      const r = el.getBoundingClientRect()
      return r.width > 500 && r.height > 180
    },
  )
  const line =
    rebaseCard &&
    [...rebaseCard.querySelectorAll('div')].find((el) => {
      const r = el.getBoundingClientRect()
      const cs = getComputedStyle(el)
      return r.height <= 3 && r.width > 200 && cs.backgroundColor !== 'rgba(0, 0, 0, 0)'
    })
  const dots = rebaseCard
    ? [...rebaseCard.querySelectorAll('span')].filter((el) => {
        const r = el.getBoundingClientRect()
        return near(r.width, 10, 2) && near(r.height, 10, 2) && el.children.length === 0
      })
    : []
  const stepTitleUnique = []
  for (const el of [...(rebaseCard?.querySelectorAll('p,span') || [])]) {
    const t = (el.textContent || '').trim()
    if (!['Block', 'Epoch', 'Rebase'].includes(t)) continue
    if ([...el.children].some((k) => (k.textContent || '').trim() === t)) continue
    stepTitleUnique.push(el)
  }
  const stepBodies = [...(rebaseCard?.querySelectorAll('p') || [])].filter((e) => {
    const t = (e.textContent || '').trim()
    return (t.includes('\n') || /区块|小时|结算|分配|每日/.test(t)) && !/以区块驱动周期/.test(t)
  })
  const tagsBar = [...(rebaseCard?.querySelectorAll('div') || [])].find((el) => {
    const t = el.textContent || ''
    const r = el.getBoundingClientRect()
    return t.includes('区块驱动运行') && t.includes('平滑释放') && r.height > 30 && r.height < 60
  })
  const tagChecks = tagsBar ? [...tagsBar.querySelectorAll('img')] : []
  const tagTexts = tagsBar
    ? [...tagsBar.querySelectorAll('span')].filter((e) => {
        const t = (e.textContent || '').trim()
        return t.length > 2 && e.children.length === 0 && /驱动|结算|分配|释放/.test(t)
      })
    : []
  const footer = [...document.querySelectorAll('p')].find((e) =>
    (e.textContent || '').includes('以区块驱动周期'),
  )

  const faqTitle = first(textsExact('FAQs')) || first(textsExact('常见问题'))
  const faqItems = [...document.querySelectorAll('[data-faq-item]')].filter((el) => {
    const r = el.getBoundingClientRect()
    return r.width > 500 && r.height >= 48 && r.height <= 80
  })

  return {
    iw: innerWidth,
    href: location.href,
    header: {
      title: styleOf(title),
      subtitle: styleOf(subtitle),
      settingsBtn: styleOf(settingsBtn),
      settingsIcon: styleOf(settingsBtn?.querySelector('img,svg')),
      menuBtn: styleOf(menuBtn),
      menuIcon: styleOf(menuBtn?.querySelector('img,svg')),
    },
    modes: modeCards.map(modePack),
    overview: {
      title: styleOf(ovTitle),
      card: styleOf(ovCard),
      deco: styleOf(deco),
      totalLab: styleOf(ovLab),
      info: styleOf(ovInfo),
      main: styleOf(ovMain),
      claimLab: styleOf(claimLab),
      claimedLab: styleOf(claimedLab),
      contribLab: styleOf(contribLab),
      gagx: ovGagx.map(styleOf),
      approx: ovApprox.map(styleOf),
      contribHint: styleOf(contribHint),
      strongs: [...(ovCard?.querySelectorAll('strong') || [])].map(styleOf),
    },
    holdings: {
      card: styleOf(holdCard),
      title: styleOf(holdTitle),
      labs: holdLabs.map(styleOf),
      strongs: holdStrongs.map(styleOf),
      approx: holdApprox.map(styleOf),
      token: styleOf(holdToken),
      released: styleOf(holdReleased),
      totalLab: styleOf(holdTotalLab),
    },
    buffer: {
      card: styleOf(bufCard),
      title: styleOf(bufTitle),
      swapBtn: styleOf(bufSwitch),
      swapWrap: styleOf(bufSwapWrap),
      swapIcon: styleOf(bufSwapIcon),
      assetLab: styleOf(bufAssetLab),
      labs: bufMetricLabs.map(styleOf),
      strongs: bufStrongs.map(styleOf),
      approx: bufApprox.map(styleOf),
      token: styleOf(bufToken),
    },
    distribution: {
      title: styleOf(distTitle),
      emptyShell: styleOf(emptyShell),
      emptyText: styleOf(emptyText),
    },
    rebase: {
      title: styleOf(rebaseTitle),
      subtitle: styleOf(rebaseSub),
      card: styleOf(rebaseCard),
      line: styleOf(line),
      dots: dots.map(styleOf),
      stepTitles: stepTitleUnique.map(styleOf),
      stepBodies: stepBodies.map(styleOf),
      tagsBar: styleOf(tagsBar),
      tagChecks: tagChecks.map(styleOf),
      tagTexts: tagTexts.map(styleOf),
      footer: styleOf(footer),
    },
    faq: {
      title: styleOf(faqTitle),
      items: faqItems.map((el) => {
        const q = el.querySelector('span,p')
        const chev = el.querySelector('img.faq-chevron, img[src*="chevron"], img[src*="faq"]')
        return { row: styleOf(el), q: styleOf(q), chevron: styleOf(chev) }
      }),
    },
  }
})()
