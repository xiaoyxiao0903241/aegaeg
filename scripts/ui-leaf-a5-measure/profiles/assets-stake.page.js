;(() => {
  const near = (a, b, t = 2) => Math.abs(a - b) <= t
  const classifyColor = (c) => {
    if (!c) return 'none'
    if (/oklch\(1 |oklab\(0\.999|rgb\(255,\s*255,\s*255\)|255, 255, 255/.test(c)) return 'white'
    if (/\/ 0\.4\)|0\.4\)/.test(c)) return 'muted40'
    if (/\/ 0\.7\)|0\.7\)/.test(c) && !/0\.1635/.test(c)) return 'body70'
    if (/0\.6683|36\.6|e978|c85c|coral|primary/i.test(c)) return 'coral'
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
      opacity: cs.opacity,
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
  const leftish = (e, r) => r.x < 920
  const rightish = (e, r) => r.x >= 700

  // collapse FAQ
  ;[...document.querySelectorAll('[data-faq-trigger][data-state="open"]')].forEach((el) =>
    el.click(),
  )

  // —— shell ——
  const rail =
    document.querySelector('[data-dapp-rail], nav[aria-label], aside') ||
    [...document.querySelectorAll('nav,aside')].find((el) => {
      const r = el.getBoundingClientRect()
      return r.x < 120 && r.width > 40 && r.width < 120 && r.height > 200
    })
  const headerLogo = [...document.querySelectorAll('img,span')].find((e) => {
    const t = (e.textContent || '').trim()
    const r = e.getBoundingClientRect()
    return (t === 'AEGIS X' || /aegis/i.test(e.getAttribute?.('alt') || '')) && r.y < 80
  })
  const header = headerLogo
    ? climb(headerLogo, (n) => {
        const r = n.getBoundingClientRect()
        return r.height >= 20 && r.height <= 64 && r.width > 80 && r.y < 100
      })
    : null
  const dividerNav = [...document.querySelectorAll('div')].find((el) => {
    const r = el.getBoundingClientRect()
    const cs = getComputedStyle(el)
    return (
      near(r.width, 1, 1) &&
      r.height > 400 &&
      r.x < 200 &&
      cs.backgroundColor !== 'rgba(0, 0, 0, 0)'
    )
  })
  const dividerCols = [...document.querySelectorAll('div')].find((el) => {
    const r = el.getBoundingClientRect()
    const cs = getComputedStyle(el)
    return (
      near(r.width, 1, 1) &&
      r.height > 400 &&
      r.x > 400 &&
      r.x < 900 &&
      cs.backgroundColor !== 'rgba(0, 0, 0, 0)'
    )
  })

  // —— left header ——
  const backLabel = first(textsExact('返回资产', leftish))
  const backBtn = backLabel
    ? climb(backLabel, (n) => n.tagName === 'BUTTON' || n.getAttribute?.('role') === 'button')
    : null
  const backIcon =
    backBtn?.querySelector('svg,img') ||
    (backLabel
      ? climb(backLabel, (n) => n.querySelector?.('svg,img'))?.querySelector('svg,img')
      : null)
  const title = first(
    textsExact(
      '质押仓位',
      (e, r) => leftish(e, r) && r.y < 220 && r.height >= 18 && r.height <= 32,
    ),
  )
  const subtitle = [...document.querySelectorAll('span,p')].find((e) => {
    const t = (e.textContent || '').trim()
    const r = e.getBoundingClientRect()
    return leftish(e, r) && /管理您的每一笔质押/.test(t) && r.y < 280
  })
  const menuBtn =
    [...document.querySelectorAll('button')].find((b) => {
      const lab = b.getAttribute('aria-label') || ''
      const r = b.getBoundingClientRect()
      return (
        leftish(null, r) &&
        r.y < 220 &&
        near(r.width, 36, 4) &&
        near(r.height, 36, 4) &&
        (/详情|面板|Details|detail/i.test(lab) || b.querySelector('img[src*="menu"]'))
      )
    }) ||
    [...document.querySelectorAll('button')].find((b) => {
      const r = b.getBoundingClientRect()
      return near(r.width, 36, 2) && near(r.height, 36, 2) && r.y < 200 && leftish(null, r)
    })
  const menuIcon = menuBtn?.querySelector('svg,img') || null

  const sortText = first(textsExact('排序', leftish))
  const sortPill = sortText
    ? climb(sortText, (n) => {
        const r = n.getBoundingClientRect()
        return near(r.height, 24, 6) && r.width > 40 && r.width < 120
      })
    : null
  const sortChevron = sortPill?.querySelector('svg,img') || null

  const quoteLabel =
    first(textsExact('计价单位', leftish)) || first(textsExact('Quote Currency', leftish))
  const quoteTabs = [...document.querySelectorAll('[role=tablist] [role=tab], [role=tab]')]
  const quoteAgxEl =
    first(textsExact('AGX', (e, r) => leftish(e, r) && r.y < 320 && r.height <= 24)) ||
    quoteTabs.find((t) => (t.textContent || '').trim() === 'AGX')?.querySelector('span') ||
    null
  const quoteUsdEl =
    first(textsExact('USD', (e, r) => leftish(e, r) && r.y < 320 && r.height <= 24)) ||
    quoteTabs.find((t) => (t.textContent || '').trim() === 'USD')?.querySelector('span') ||
    null
  const quoteToggle = quoteAgxEl
    ? climb(quoteAgxEl, (n) => {
        const r = n.getBoundingClientRect()
        const t = (n.textContent || '').replace(/\s+/g, '')
        return t.includes('AGX') && t.includes('USD') && near(r.height, 24, 8) && r.width > 80
      })
    : null

  // —— position cards ——
  const cardEls = [...document.querySelectorAll('article,div')]
    .filter((el) => {
      const r = el.getBoundingClientRect()
      const cs = getComputedStyle(el)
      const t = el.textContent || ''
      return (
        leftish(null, r) &&
        r.width > 300 &&
        r.width < 400 &&
        r.height > 120 &&
        r.height < 230 &&
        parseFloat(cs.paddingTop) >= 14 &&
        t.includes('收益') &&
        /领取|解锁|赎回/.test(t)
      )
    })
    .sort((a, b) => a.getBoundingClientRect().y - b.getBoundingClientRect().y)
    .slice(0, 5)

  const packCard = (card) => {
    if (!card) return {}
    const periodText = [...card.querySelectorAll('span')].find((e) => {
      const t = (e.textContent || '').trim()
      return t === '活期' || /^\d+\s*天$/.test(t) || /^\d+天$/.test(t)
    })
    const periodPill = periodText
      ? climb(periodText, (n) => {
          const r = n.getBoundingClientRect()
          return near(r.height, 24, 6) && r.width < 100
        })
      : null
    const remainLab = [...card.querySelectorAll('span')].find(
      (e) => (e.textContent || '').trim() === '剩余时间',
    )
    const remainVal = remainLab
      ? [...(remainLab.parentElement?.querySelectorAll('span') || [])].find((e) => {
          const t = (e.textContent || '').trim()
          return t && t !== '剩余时间'
        })
      : null
    const amtLab = [...card.querySelectorAll('span')].find(
      (e) => (e.textContent || '').trim() === '质押数量',
    )
    const yldLab = [...card.querySelectorAll('span')].find(
      (e) => (e.textContent || '').trim() === '收益',
    )
    const strongs = [...card.querySelectorAll('strong')]
    const chips = [...card.querySelectorAll('span')].filter((el) => {
      const r = el.getBoundingClientRect()
      const cs = getComputedStyle(el)
      // 含 opacity-0 的 boost 占位
      return (
        near(r.height, 21, 8) &&
        r.width > 40 &&
        r.width < 160 &&
        parseFloat(cs.paddingLeft) >= 6 &&
        el.querySelector('img')
      )
    })
    const lockChip =
      chips.find((c) => {
        const t = c.textContent || ''
        return /AGX/.test(t) && !/gAGX/.test(t)
      }) || chips[0]
    const boostChip =
      chips.find((c) => c !== lockChip && /gAGX/.test(c.textContent || '')) ||
      [...card.querySelectorAll('span')].find((el) => {
        const cs = getComputedStyle(el)
        return (
          el.querySelector('img') &&
          /gAGX/.test(el.textContent || '') &&
          parseFloat(cs.opacity) === 0
        )
      }) ||
      chips[1]
    const claimText =
      first(
        [...card.querySelectorAll('span,button')].filter(
          (e) => (e.textContent || '').trim() === '领取',
        ),
      ) || null
    const redeemText =
      first(
        [...card.querySelectorAll('span,button')].filter((e) =>
          ['解锁', '赎回'].includes((e.textContent || '').trim()),
        ),
      ) || null
    const claimBtn = claimText
      ? climb(
          claimText,
          (n) => n.tagName === 'BUTTON' || near(n.getBoundingClientRect().height, 28, 8),
        )
      : null
    const redeemBtn = redeemText
      ? climb(
          redeemText,
          (n) => n.tagName === 'BUTTON' || near(n.getBoundingClientRect().height, 28, 8),
        )
      : null
    const voucherLab = [...card.querySelectorAll('span')].find(
      (e) => (e.textContent || '').trim() === '凭证',
    )
    const voucherVal = voucherLab
      ? [...(voucherLab.parentElement?.querySelectorAll('a,span') || [])].find((e) => {
          const t = (e.textContent || '').trim()
          return t && t !== '凭证' && /^0x/i.test(t)
        })
      : null
    return {
      card: styleOf(card),
      periodPill: styleOf(periodPill),
      periodText: styleOf(periodText),
      remainLab: styleOf(remainLab),
      remainVal: styleOf(remainVal),
      amtLab: styleOf(amtLab),
      amtVal: styleOf(strongs[0]),
      lockChip: styleOf(lockChip),
      lockIcon: styleOf(lockChip?.querySelector('img,svg')),
      lockText: styleOf(
        lockChip
          ? [...lockChip.querySelectorAll('span')].find((e) => {
              const t = (e.textContent || '').trim()
              return /AGX|gAGX/.test(t) && e.children.length === 0
            }) || lockChip
          : null,
      ),
      yldLab: styleOf(yldLab),
      yldVal: styleOf(strongs[1] || strongs[0]),
      boostChip: styleOf(boostChip),
      boostIcon: styleOf(boostChip?.querySelector('img,svg')),
      boostText: styleOf(
        boostChip
          ? [...boostChip.querySelectorAll('span')].find((e) => {
              const t = (e.textContent || '').trim()
              return /gAGX|AGX/.test(t) && e.children.length === 0
            }) || boostChip
          : null,
      ),
      voucherLab: styleOf(voucherLab),
      voucherVal: styleOf(voucherVal),
      claimBtn: styleOf(claimBtn),
      claimText: styleOf(claimText),
      redeemBtn: styleOf(redeemBtn),
      redeemText: styleOf(redeemText),
    }
  }

  // —— list pager ——
  const pagerTotal = [...document.querySelectorAll('span,p')].find((e) => {
    const t = (e.textContent || '').trim()
    const r = e.getBoundingClientRect()
    return leftish(e, r) && /^共\s*\d+\s*条/.test(t) && /每页/.test(t)
  })
  const pagerPrevText = first(textsExact('上一页', leftish))
  const pagerNextText = first(textsExact('下一页', leftish))
  const pagerPrevBtn = pagerPrevText ? climb(pagerPrevText, (n) => n.tagName === 'BUTTON') : null
  const pagerNextBtn = pagerNextText ? climb(pagerNextText, (n) => n.tagName === 'BUTTON') : null
  const pagerInd = [...document.querySelectorAll('span')].find((e) => {
    const t = (e.textContent || '').trim()
    const r = e.getBoundingClientRect()
    return leftish(e, r) && /^\d+\s*\/\s*\d+$/.test(t) && r.y > 200
  })

  // —— right stats ——
  const statsTitle = first(textsExact('仓位数据', rightish))
  const metricLabs = [
    '我的持仓',
    '已释放',
    '待释放',
    '当前 Rebase 收益',
    '当前 Rebase 加成',
    '质押总收益',
  ]
  const stats = metricLabs.map((lab) => {
    const labEl = first(textsExact(lab, rightish))
    if (!labEl) return {}
    const card = climb(labEl, (n) => {
      const r = n.getBoundingClientRect()
      const cs = getComputedStyle(n)
      return (
        r.width > 160 &&
        r.width < 420 &&
        r.height > 60 &&
        r.height < 130 &&
        parseFloat(cs.paddingTop) >= 12
      )
    })
    const token = [...(card?.querySelectorAll('img') || [])].find((img) => {
      const r = img.getBoundingClientRect()
      return near(r.width, 18, 6) && near(r.height, 18, 6)
    })
    const value = [...(card?.querySelectorAll('strong,span') || [])].find((e) => {
      const t = (e.textContent || '').trim()
      return t && t !== lab && !/^≈/.test(t) && (/\d/.test(t) || t === '—')
    })
    const approx = [...(card?.querySelectorAll('span') || [])].find((e) =>
      /^≈/.test((e.textContent || '').trim()),
    )
    return {
      card: styleOf(card),
      label: styleOf(labEl),
      token: styleOf(token),
      value: styleOf(value),
      approx: styleOf(approx),
    }
  })

  // —— ops ——
  const opsTitle = first(textsExact('操作记录', rightish))
  const colLabs = ['时间', '操作', '数量', '交易哈希']
  const cols = colLabs.map((lab) =>
    styleOf(
      [...document.querySelectorAll('th span, thead span, th,span')].find((e) => {
        const t = (e.textContent || '').trim()
        const r = e.getBoundingClientRect()
        if (t !== lab || !rightish(e, r)) return false
        if ([...e.children].some((k) => (k.textContent || '').trim() === lab)) return false
        const ty = opsTitle?.getBoundingClientRect().y || 400
        return r.y > ty
      }),
    ),
  )
  const emptyMsg = [...document.querySelectorAll('span,p')].find((e) =>
    /暂无操作记录/.test((e.textContent || '').trim()),
  )
  const table =
    first(textsExact('交易哈希', rightish)) &&
    climb(first(textsExact('交易哈希', rightish)), (n) => {
      const r = n.getBoundingClientRect()
      return n.tagName === 'TABLE' || (r.width > 400 && n.querySelector?.('table,thead,[role=row]'))
    })
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
  const bodyRows = table
    ? [...table.querySelectorAll('tbody tr, [role=row]')].filter((tr) => {
        const t = (tr.textContent || '').trim()
        return t && !colLabs.every((c) => t.includes(c))
      })
    : []
  const row0 = (() => {
    const tr = bodyRows[0]
    if (!tr) return [null, null, null, null]
    const tds = [...tr.querySelectorAll('td')]
    if (tds.length >= 4) {
      return tds.slice(0, 4).map((td) => styleOf(td.querySelector('span,a,p') || td))
    }
    return [null, null, null, null]
  })()
  const trowRest =
    bodyRows.length > 1
      ? styleOf(
          climb(bodyRows[1], (n) => {
            const r = n.getBoundingClientRect()
            return r.height > 100 && r.width > 500
          }) || bodyRows[1],
        )
      : null

  // ops pagination (DappTablePagination)
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
      r.y > (opsTitle?.getBoundingClientRect().y || 0)
    )
  })
  const opsIndicator = opsPageText
    ? climb(opsPageText, (n) => {
        const r = n.getBoundingClientRect()
        return n.tagName === 'BUTTON' || (near(r.height, 24, 10) && r.width > 40 && r.width < 100)
      })
    : null
  // 展开 chevron = Lucide / masked chrome，非业务 img
  const chevronOf = (btn) =>
    btn?.querySelector?.('span[aria-hidden]') || btn?.querySelector?.('svg,img') || null
  const opsDropdown = chevronOf(opsIndicator)

  const faqTitle = first(textsExact('FAQs', rightish))
  const faqList =
    document.querySelector('[data-faq-list]') ||
    (() => {
      const item = document.querySelector('[data-faq-item]')
      return item
        ? climb(item, (n) => {
            const r = n.getBoundingClientRect()
            return r.height > 200 && r.width > 500
          })
        : null
    })()

  return {
    href: location.href,
    iw: window.innerWidth,
    shell: {
      rail: styleOf(rail),
      header: styleOf(header),
      dividerNav: styleOf(dividerNav),
      dividerCols: styleOf(dividerCols),
    },
    left: {
      backIcon: styleOf(backIcon),
      backLabel: styleOf(backLabel),
      menuBtn: styleOf(menuBtn),
      menuIcon: styleOf(menuIcon),
      title: styleOf(title),
      subtitle: styleOf(subtitle),
      sortPill: styleOf(sortPill),
      sortText: styleOf(sortText),
      sortChevron: styleOf(sortChevron),
      quoteLabel: styleOf(quoteLabel),
      quoteToggle: styleOf(quoteToggle),
      quoteAgx: styleOf(quoteAgxEl),
      quoteUsd: styleOf(quoteUsdEl),
      cards: cardEls.map(packCard),
      pager: {
        totalText: styleOf(pagerTotal),
        prevBtn: styleOf(pagerPrevBtn),
        prevText: styleOf(pagerPrevText),
        pageInd: styleOf(pagerInd),
        nextBtn: styleOf(pagerNextBtn),
        nextText: styleOf(pagerNextText),
      },
    },
    right: {
      statsTitle: styleOf(statsTitle),
      stats,
      opsTitle: styleOf(opsTitle),
      tableCard: styleOf(tableCard),
      cols,
      row0,
      trowRest,
      opsPag: {
        total: styleOf(opsTotal),
        perPage: styleOf(opsPerPage),
        prevBtn: styleOf(opsPrevBtn),
        prevIcon: styleOf(chevronOf(opsPrevBtn)),
        indicator: styleOf(opsIndicator),
        pageText: styleOf(opsPageText),
        dropdown: styleOf(opsDropdown),
        nextBtn: styleOf(opsNextBtn),
        nextIcon: styleOf(chevronOf(opsNextBtn)),
      },
      faqTitle: styleOf(faqTitle),
      faqList: styleOf(faqList),
    },
  }
})()
