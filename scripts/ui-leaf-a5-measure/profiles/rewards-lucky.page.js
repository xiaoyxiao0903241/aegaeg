;(() => {
  const near = (a, b, t = 2) => Math.abs(a - b) <= t
  const classifyColor = (c) => {
    if (!c) return 'none'
    if (/oklch\(1 |oklab\(0\.999|rgb\(255,\s*255,\s*255\)|255, 255, 255/.test(c)) return 'white'
    // body70 / muted40：先认透明度，避免 ink 基色 + /0.7 被误判为 ink
    if (/\/ 0\.4\)|0\.4\)/.test(c)) return 'muted40'
    if (/\/ 0\.7\)|0\.7\)/.test(c)) return 'body70'
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
  const styleOfHr = (el) => {
    if (!el) return null
    const r = el.getBoundingClientRect()
    if (r.height < 0.2 && r.width < 1) return null
    return {
      found: true,
      tag: el.tagName,
      w: Math.round(r.width * 10) / 10,
      h: Math.max(0.5, Math.round(r.height * 10) / 10),
      x: Math.round(r.x),
      y: Math.round(r.y),
      fs: null,
      fw: null,
      color: 'none',
      colorRaw: null,
      bg: getComputedStyle(el).borderTopColor || getComputedStyle(el).backgroundColor,
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
  const leftish = (_e, r) => r.x < 720
  const rightish = (_e, r) => r.x >= 700
  const leafTextsIn = (root) =>
    [...(root?.querySelectorAll('span,p,strong') || [])].filter((e) => {
      const t = (e.textContent || '').trim()
      if (!t) return false
      if ([...e.children].some((k) => (k.textContent || '').trim() === t)) return false
      return true
    })

  // 先收合所有 FAQ，再打开第一项（设计参考第 1 项含答案）
  ;[...document.querySelectorAll('[data-faq-item][data-state="open"]')].forEach((item) => {
    const trigger = item.querySelector('[data-faq-trigger],button')
    trigger?.click?.()
  })
  const firstFaqTrigger = [...document.querySelectorAll('[data-faq-item]')].find((item) => {
    const r = item.getBoundingClientRect()
    return rightish(null, r)
  })
  if (firstFaqTrigger && firstFaqTrigger.getAttribute('data-state') !== 'open') {
    firstFaqTrigger.querySelector('[data-faq-trigger],button')?.click?.()
  }

  // —— 页面分隔线 ——
  const rail =
    document.querySelector('[data-dapp-rail],aside,nav') ||
    [...document.querySelectorAll('aside,nav,div')].find((el) => {
      const r = el.getBoundingClientRect()
      return r.x < 120 && r.width > 60 && r.width < 140 && r.height > 400
    }) ||
    // 容器左边框作为左侧分隔线的兜底
    [...document.querySelectorAll('div')].find((el) => {
      const r = el.getBoundingClientRect()
      const cs = getComputedStyle(el)
      return (
        parseFloat(cs.borderLeftWidth) >= 1 &&
        r.width > 1000 &&
        r.height > 400 &&
        /返回奖励/.test(el.textContent || '')
      )
    })
  // 左栏：dapp-content-fade + border-r（divider R）
  const widget =
    document.querySelector('.dapp-content-fade.border-r, .dapp-content-fade[class*="border-r"]') ||
    [...document.querySelectorAll('div')].find((el) => {
      const r = el.getBoundingClientRect()
      const cs = getComputedStyle(el)
      const cls = (el.className || '').toString()
      const t = el.textContent || ''
      return (
        parseFloat(cs.borderRightWidth) >= 1 &&
        r.width > 300 &&
        r.width < 480 &&
        r.height > 400 &&
        (/dapp-content-fade/.test(cls) ||
          (/返回奖励/.test(t) && /可领取/.test(t) && !/今日奖池/.test(t)))
      )
    }) ||
    null

  // —— header ——
  const backLabel = first(textsExact('返回奖励', leftish))
  const backBtn = backLabel
    ? climb(backLabel, (n) => n.tagName === 'BUTTON' || n.getAttribute?.('role') === 'button')
    : null
  const backIcon =
    backBtn?.querySelector('svg,img') ||
    (backLabel
      ? climb(backLabel, (n) => n.querySelector?.('svg,img'))?.querySelector('svg,img')
      : null)
  const title = first(
    textsExact('幸运奖', (e, r) => leftish(e, r) && r.y < 220 && r.height >= 18 && r.height <= 36),
  )
  const subtitle = [...document.querySelectorAll('span,p')].find((e) => {
    const t = (e.textContent || '').trim()
    const r = e.getBoundingClientRect()
    return leftish(e, r) && r.y < 280 && /爆块幸运|幸运共建|随机发放/.test(t)
  })
  // 菜单钮贴右栏分界（x≈744），勿用 leftish(<720) 卡住
  const menuBtn =
    [...document.querySelectorAll('button')].find((b) => {
      const r = b.getBoundingClientRect()
      const al = (b.getAttribute('aria-label') || '').toLowerCase()
      const hasMenuImg = [...b.querySelectorAll('img')].some((img) =>
        /menu|panel|toggle/i.test(img.getAttribute('src') || ''),
      )
      return (
        r.y < 200 &&
        r.x > 500 &&
        r.x < 900 &&
        near(r.width, 36, 6) &&
        near(r.height, 36, 6) &&
        (hasMenuImg || /详情|detail|panel|toggle|hide|show|收起|展开/i.test(al))
      )
    }) || null
  const menuIcon = menuBtn?.querySelector('img,svg') || null

  // —— claimable card ——
  const claimLabel = first(textsExact('可领取', leftish))
  const claimCard = claimLabel
    ? climb(claimLabel, (n) => {
        const r = n.getBoundingClientRect()
        return leftish(null, r) && r.width > 280 && r.width < 420 && r.height > 50 && r.height < 120
      })
    : null
  const claimTexts = leafTextsIn(claimCard)
  const contribLabel =
    first(textsExact('本次需扣除贡献点数', leftish)) ||
    claimTexts.find((e) => /贡献点数/.test((e.textContent || '').trim()))
  const claimAmount =
    claimTexts.find(
      (e) =>
        /gAGX|登录|—|0\.00/.test((e.textContent || '').trim()) &&
        (e.textContent || '').trim() !== '可领取',
    ) || claimCard?.querySelector('p,span')
  const contribValue = contribLabel
    ? [...(contribLabel.parentElement?.parentElement?.querySelectorAll('span,p') || [])].find(
        (e) => {
          const t = (e.textContent || '').trim()
          return t !== '本次需扣除贡献点数' && t.length > 0 && t.length < 24
        },
      ) ||
      claimTexts.find((e) => /^\d|^—|^0/.test((e.textContent || '').trim()) && e !== claimAmount)
    : null
  const claimTokenIcon =
    claimCard?.querySelector('img') ||
    [...(claimCard?.querySelectorAll('img') || [])].find((img) => {
      const r = img.getBoundingClientRect()
      return near(r.width, 18, 8) || near(r.width, 24, 8)
    })

  // —— warning ——
  const warnText = [...document.querySelectorAll('span,p')].find((e) => {
    const t = (e.textContent || '').trim()
    const r = e.getBoundingClientRect()
    return leftish(e, r) && /贡献点数不足|前往销毁|获取贡献点数/.test(t)
  })
  const warnCard = warnText
    ? climb(warnText, (n) => {
        const r = n.getBoundingClientRect()
        const cs = getComputedStyle(n)
        return (
          leftish(null, r) &&
          r.width > 280 &&
          r.width < 420 &&
          r.height > 40 &&
          (parseFloat(cs.paddingTop) >= 8 || /primary|coral/.test(cs.backgroundColor))
        )
      })
    : null

  // —— slider ——
  const sliderRoot = document.querySelector('[data-claim-split-slider]')
  const sliderCard = sliderRoot
    ? climb(sliderRoot, (n) => {
        const r = n.getBoundingClientRect()
        return leftish(null, r) && r.width > 280 && r.width < 420 && r.height > 50 && r.height < 120
      })
    : null
  const track = sliderRoot?.querySelector('[class*="relative"]') || sliderRoot?.children?.[0]
  const trackSegs = track
    ? [...track.querySelectorAll('div')].filter((d) => {
        const r = d.getBoundingClientRect()
        return r.height >= 4 && r.height <= 16 && r.width > 20
      })
    : []
  const thumb =
    sliderRoot?.querySelector('[role=slider]') ||
    [...(sliderRoot?.querySelectorAll('div') || [])].find((d) => {
      const r = d.getBoundingClientRect()
      return near(r.height, 24, 8) && r.width > 30 && r.width < 80
    })
  const handleText =
    thumb &&
    ([...(thumb.querySelectorAll('span,p') || [])].find((e) => /%/.test(e.textContent || '')) ||
      thumb)
  const releaseLab = first(
    [...document.querySelectorAll('span,p')].filter((e) => {
      const t = (e.textContent || '').trim()
      const r = e.getBoundingClientRect()
      return leftish(e, r) && /^领取\s*\d+%/.test(t)
    }),
  )
  const restakeLab = first(
    [...document.querySelectorAll('span,p')].filter((e) => {
      const t = (e.textContent || '').trim()
      const r = e.getBoundingClientRect()
      return leftish(e, r) && /^复投\s*\d+%/.test(t)
    }),
  )

  // —— release / restake cards ——
  const packClaimCard = (titleExact, intoExact, periodExact) => {
    const intoEl = first(textsExact(intoExact, leftish))
    const titleEl =
      (intoEl &&
        [...document.querySelectorAll('span,p')].find((e) => {
          const t = (e.textContent || '').trim()
          const r = e.getBoundingClientRect()
          const ir = intoEl.getBoundingClientRect()
          return leftish(e, r) && t === titleExact && Math.abs(r.y - ir.y) < 12
        })) ||
      first(textsExact(titleExact, leftish))
    const anchor = intoEl || titleEl
    if (!anchor) return {}
    const card = climb(anchor, (n) => {
      const r = n.getBoundingClientRect()
      return leftish(null, r) && r.width > 280 && r.width < 420 && r.height > 90 && r.height < 200
    })
    const texts = leafTextsIn(card)
    const into = intoEl || texts.find((e) => (e.textContent || '').trim() === intoExact)
    const periodLab =
      first(textsExact(periodExact, leftish)) ||
      texts.find((e) => (e.textContent || '').trim() === periodExact)
    const pill =
      [...(card?.querySelectorAll('span,div') || [])].find((el) => {
        const r = el.getBoundingClientRect()
        const t = (el.textContent || '').trim()
        return near(r.height, 34, 10) && r.width > 60 && r.width < 140 && /gAGX/.test(t)
      }) || null
    const tokenIcon = pill?.querySelector('img') || card?.querySelector('img')
    const tokenText =
      [...(pill?.querySelectorAll('span,p') || [])].find(
        (e) => (e.textContent || '').trim() === 'gAGX',
      ) ||
      first(
        textsExact(
          'gAGX',
          (e, r) => leftish(e, r) && r.y > (titleEl?.getBoundingClientRect().y || 0),
        ),
      )
    const amount = texts.find((e) => {
      const t = (e.textContent || '').trim()
      return /^[\d.,]+$|^—$/.test(t) && t !== 'gAGX'
    })
    const dropdownBtn =
      [...(card?.querySelectorAll('button,[role=combobox],[aria-haspopup]') || [])].find((b) => {
        const r = b.getBoundingClientRect()
        return r.width > 80 && r.height > 24 && r.height < 48
      }) ||
      (periodLab &&
        [...(periodLab.parentElement?.querySelectorAll('button,[role=combobox]') || [])].find(
          (b) => {
            const r = b.getBoundingClientRect()
            return r.width > 80
          },
        )) ||
      null
    const dropdownText =
      (dropdownBtn &&
        [...dropdownBtn.querySelectorAll('span,p')].find((e) => /天/.test(e.textContent || ''))) ||
      texts.find(
        (e) => /天/.test((e.textContent || '').trim()) && /税率|·/.test(e.textContent || ''),
      )
    const chevron =
      dropdownBtn?.querySelector('svg,img') ||
      card?.querySelector('svg,img[src*="chev"],img[class*="chev"]')
    return {
      card: styleOf(card),
      title: styleOf(titleEl),
      into: styleOf(into),
      pill: styleOf(pill),
      tokenIcon: styleOf(tokenIcon),
      tokenText: styleOf(tokenText),
      amount: styleOf(amount),
      periodLab: styleOf(periodLab),
      dropdown: styleOf(dropdownBtn),
      dropdownText: styleOf(dropdownText),
      chevron: styleOf(chevron),
    }
  }

  const releasePack = packClaimCard('领取', '进入释放池', '释放周期')
  const restakePack = packClaimCard('复投', '进入单币质押', '复投周期')

  // —— CTA ——
  const ctaBtn =
    [...document.querySelectorAll('button')].find((b) => {
      const r = b.getBoundingClientRect()
      const t = (b.textContent || '').replace(/\s+/g, ' ')
      return (
        leftish(null, r) && r.width > 280 && r.width < 420 && r.height > 40 && /领取|复投/.test(t)
      )
    }) ||
    [...document.querySelectorAll('button,a,div')].find((b) => {
      const r = b.getBoundingClientRect()
      const t = (b.textContent || '').trim()
      return (
        leftish(null, r) &&
        r.width > 280 &&
        r.width < 420 &&
        r.height > 40 &&
        /连接钱包|Connect|登录/.test(t)
      )
    })
  const ctaSpans = [...(ctaBtn?.querySelectorAll('span') || [])].filter((e) => {
    const t = (e.textContent || '').trim()
    return t.length > 0 && ![...e.children].some((k) => (k.textContent || '').trim() === t)
  })
  const ctaReleaseLab = ctaSpans.find((e) => /^领取/.test((e.textContent || '').trim()))
  const ctaRestakeLab = ctaSpans.find((e) => /^复投/.test((e.textContent || '').trim()))
  const ctaReleaseAmt =
    ctaSpans.find((e) => {
      const t = (e.textContent || '').trim()
      return /gAGX/.test(t) && /领取/.test(ctaReleaseLab?.textContent || e.textContent || '')
    }) || (ctaReleaseLab && /gAGX/.test(ctaReleaseLab.textContent || '') ? ctaReleaseLab : null)
  // 按钮行常把「领取 1.6000 gAGX」放在一个 span 中；同一节点按两个位置测量即可
  const ctaLine0 = ctaSpans[0] || null
  const ctaLine1 = ctaSpans[1] || null

  // —— right tiles ——
  const dataHeading = first(textsExact('数据', rightish))
  const tileByLabel = (lab) => {
    const labEl = first(textsExact(lab, rightish))
    if (!labEl) return {}
    const card = climb(labEl, (n) => {
      const r = n.getBoundingClientRect()
      const cs = getComputedStyle(n)
      return (
        rightish(null, r) &&
        r.width > 180 &&
        r.width < 360 &&
        r.height > 50 &&
        r.height < 130 &&
        parseFloat(cs.paddingTop) >= 8
      )
    })
    const texts = leafTextsIn(card)
    const value = texts.find((e) => e !== labEl && (e.textContent || '').trim() !== lab) || texts[1]
    const hint = texts.find((e) => e !== labEl && e !== value) || null
    return { card, labEl, value, hint, texts }
  }
  const pool = tileByLabel('今日奖池')
  const qualify = tileByLabel('今日抽奖资格')
  const wins = tileByLabel('累计中奖')

  // —— chainlink ——
  const vrfTitle =
    first(textsExact('Chainlink VRF v2 可验证随机抽奖', rightish)) ||
    [...document.querySelectorAll('span,p')].find((e) => {
      const t = (e.textContent || '').trim()
      const r = e.getBoundingClientRect()
      return rightish(e, r) && /Chainlink VRF/.test(t)
    })
  const chainCard = vrfTitle
    ? climb(vrfTitle, (n) => {
        const r = n.getBoundingClientRect()
        return rightish(null, r) && r.width > 500 && r.height > 80
      })
    : null
  const chainIcon =
    chainCard?.querySelector('img') || [...(chainCard?.querySelectorAll('img') || [])][0]
  const verifyText = first(textsExact('验证教程', rightish))
  const verifyBtn =
    verifyText?.closest?.('button') ||
    (verifyText
      ? climb(verifyText, (n) => {
          if (n.tagName !== 'BUTTON' && n.getAttribute?.('role') !== 'button') return false
          const r = n.getBoundingClientRect()
          return r.width > 40 && r.width < 200 && r.height > 20 && r.height < 44
        })
      : null)
  const vrfBody = [...(chainCard?.querySelectorAll('span,p') || [])].find((e) => {
    const t = (e.textContent || '').trim()
    return t.length > 40 && /Chainlink|VRF|幸运奖采用/.test(t)
  })

  // —— results ——
  const resultsHeading = first(textsExact('开奖结果', rightish))
  const dateText =
    [...document.querySelectorAll('span,p')].find((e) => {
      const t = (e.textContent || '').trim()
      const r = e.getBoundingClientRect()
      if (!rightish(e, r)) return false
      if (!(/^\d{4}-\d{2}-\d{2}$/.test(t) || t === '—')) return false
      // 表头区日期 pill：在「开奖结果」标题下方、表体之上
      if (!resultsHeading) return true
      const hy = resultsHeading.getBoundingClientRect().y
      return r.y > hy - 4 && r.y < hy + 120
    }) || null
  const dateBtn = dateText
    ? dateText.closest?.('button') ||
      climb(
        dateText,
        (n) => n.tagName === 'BUTTON' || near(n.getBoundingClientRect().height, 30, 8),
      )
    : null
  const dateChev =
    dateBtn?.querySelector('svg,img,[class*="chevron"],[class*="Chevron"]') ||
    (dateBtn
      ? [...dateBtn.querySelectorAll('*')].find((el) => {
          const r = el.getBoundingClientRect()
          return r.width > 4 && r.width < 16 && r.height > 4 && r.height < 16 && el !== dateText
        })
      : null) ||
    null
  const resultsSummary = [...document.querySelectorAll('span,p')].find((e) => {
    const t = (e.textContent || '').trim()
    const r = e.getBoundingClientRect()
    return rightish(e, r) && /^开奖/.test(t) && /幸运用户/.test(t)
  })
  const verifyHash = [...document.querySelectorAll('span,p,a')].find((e) => {
    const t = (e.textContent || '').trim()
    const r = e.getBoundingClientRect()
    return rightish(e, r) && /验证本轮开奖哈希/.test(t)
  })
  const resultsTableCard = resultsSummary
    ? climb(resultsSummary, (n) => {
        const r = n.getBoundingClientRect()
        return rightish(null, r) && r.width > 500 && r.height > 40
      })
    : null
  const resultsTable = resultsTableCard?.querySelector('table') || document.querySelector('table')
  const resultsThs = [...(resultsTable?.querySelectorAll('thead th') || [])].map((th) =>
    styleOf(th.querySelector('span,p') || th),
  )
  const resultBodyRows = [...(resultsTable?.querySelectorAll('tbody tr') || [])]
  const resultRows = Array.from({ length: 10 }, (_, ri) => {
    const tr = resultBodyRows[ri]
    if (!tr) return {}
    const cells = [...tr.querySelectorAll('td')].map((td) => td.querySelector('span,p,div') || td)
    const meBadge =
      [...tr.querySelectorAll('span,div')].find((e) => (e.textContent || '').trim() === '我') ||
      null
    const meWrap = meBadge
      ? climb(meBadge, (n) => {
          const r = n.getBoundingClientRect()
          return near(r.height, 17, 6) && r.width > 16 && r.width < 48
        })
      : null
    // 用行底边框作为分隔线的代理
    const sepEl = tr
    return {
      rank: styleOf(cells[0]),
      addr: styleOf(cells[1]),
      meBadge: styleOf(meWrap),
      meText: styleOf(meBadge),
      stake: styleOf(cells[2]),
      prize: styleOf(cells[3]),
      sep: styleOfHr(
        [...tr.querySelectorAll('*')].find((el) => {
          const cs = getComputedStyle(el)
          return parseFloat(cs.borderBottomWidth) > 0 || parseFloat(cs.height) <= 1
        }) || sepEl,
      ),
    }
  })
  // 修正分隔线：改用 tr 的 border-bottom 实测
  for (let i = 0; i < resultRows.length; i++) {
    const tr = resultBodyRows[i]
    if (!tr) continue
    const r = tr.getBoundingClientRect()
    const cs = getComputedStyle(tr.querySelector('td') || tr)
    const bw = parseFloat(cs.borderBottomWidth)
    if (bw > 0) {
      resultRows[i].sep = {
        found: true,
        tag: 'SEP',
        w: Math.round(r.width * 10) / 10,
        h: bw,
        x: Math.round(r.x),
        y: Math.round(r.y + r.height - bw),
        fs: null,
        fw: null,
        color: 'none',
        colorRaw: null,
        bg: cs.borderBottomColor,
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
  }
  const sepControls = resultsSummary
    ? styleOfHr(
        [...(resultsTableCard?.querySelectorAll('div,hr') || [])].find((el) => {
          const r = el.getBoundingClientRect()
          const cs = getComputedStyle(el)
          return (
            r.width > 400 &&
            (r.height <= 2 ||
              parseFloat(cs.borderTopWidth) > 0 ||
              parseFloat(cs.borderBottomWidth) > 0)
          )
        }),
      )
    : null
  const sepHeader =
    resultsTable?.querySelector('thead tr') != null
      ? (() => {
          const tr = resultsTable.querySelector('thead tr')
          const r = tr.getBoundingClientRect()
          const cs = getComputedStyle(tr.querySelector('th') || tr)
          const bw = parseFloat(cs.borderBottomWidth) || 0.5
          return {
            found: true,
            tag: 'SEP',
            w: Math.round(r.width * 10) / 10,
            h: bw,
            x: Math.round(r.x),
            y: Math.round(r.y + r.height),
            fs: null,
            fw: null,
            color: 'none',
            colorRaw: null,
            bg: cs.borderBottomColor,
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
        })()
      : null

  // —— history ——
  const historyHeading = first(textsExact('抽奖记录', rightish))
  const historyTable =
    [...document.querySelectorAll('table')].find((tb) => {
      const r = tb.getBoundingClientRect()
      const head = (tb.querySelector('thead')?.textContent || '').replace(/\s+/g, '')
      return rightish(null, r) && /日期/.test(head) && /抽奖结果|验证/.test(head)
    }) || null
  const historyTableCard = historyTable
    ? climb(historyTable, (n) => {
        const r = n.getBoundingClientRect()
        return rightish(null, r) && r.width > 500
      })
    : historyHeading
      ? climb(historyHeading, (n) => {
          const r = n.getBoundingClientRect()
          return rightish(null, r) && r.width > 500 && r.height > 60
        })
      : null
  const historyThs = [...(historyTable?.querySelectorAll('thead th') || [])].map((th) =>
    styleOf(th.querySelector('span,p') || th),
  )
  const histBodyRows = [...(historyTable?.querySelectorAll('tbody tr') || [])]
  const historyRows = Array.from({ length: 5 }, (_, ri) => {
    const tr = histBodyRows[ri]
    if (!tr) return {}
    const cells = [...tr.querySelectorAll('td')]
    const cellEls = cells.map((td) => td.querySelector('span,p,div') || td)
    const badgeHost = cells[2]?.querySelector('[class*="badge"],span,div') || cellEls[2] || null
    const badgeText = cellEls[2]
    const ext =
      cells[3]?.querySelector('svg,img,a') ||
      [...(cells[3]?.querySelectorAll('svg,img') || [])][0] ||
      null
    const r = tr.getBoundingClientRect()
    const cs = getComputedStyle(tr.querySelector('td') || tr)
    const bw = parseFloat(cs.borderBottomWidth)
    const sep =
      bw > 0
        ? {
            found: true,
            tag: 'SEP',
            w: Math.round(r.width * 10) / 10,
            h: bw,
            x: Math.round(r.x),
            y: Math.round(r.y + r.height - bw),
            fs: null,
            fw: null,
            color: 'none',
            colorRaw: null,
            bg: cs.borderBottomColor,
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
        : null
    return {
      date: styleOf(cellEls[0]),
      stake: styleOf(cellEls[1]),
      badge: styleOf(badgeHost),
      badgeText: styleOf(badgeText),
      hash: styleOf(cellEls[3]),
      extLink: styleOf(ext),
      sep,
    }
  })
  const histSepHeader =
    historyTable?.querySelector('thead tr') != null
      ? (() => {
          const tr = historyTable.querySelector('thead tr')
          const r = tr.getBoundingClientRect()
          const cs = getComputedStyle(tr.querySelector('th') || tr)
          const bw = parseFloat(cs.borderBottomWidth) || 0.5
          return {
            found: true,
            tag: 'SEP',
            w: Math.round(r.width * 10) / 10,
            h: bw,
            x: Math.round(r.x),
            y: Math.round(r.y + r.height),
            fs: null,
            fw: null,
            color: 'none',
            colorRaw: null,
            bg: cs.borderBottomColor,
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
        })()
      : null

  // —— FAQ ——
  const faqHeading = first(textsExact('FAQs', rightish))
  const faqQs = [
    '如何获得抽奖资格？',
    '抽奖是如何开奖的？',
    '如何验证抽奖结果是公平的？',
    '中奖后奖金如何发放？',
    '为什么我质押了 $5,000 却没有资格？',
    '参与活期质押是否能获得抽奖资格？',
  ]
  const faqItems = [...document.querySelectorAll('[data-faq-item]')].filter((item) => {
    const r = item.getBoundingClientRect()
    return rightish(null, r) && r.width > 400
  })
  const faqs = faqQs.map((q, qi) => {
    const item =
      faqItems[qi] ||
      (() => {
        const qEl = first(
          [...document.querySelectorAll('span,button,p')].filter((e) => {
            const t = (e.textContent || '').trim()
            const r = e.getBoundingClientRect()
            return rightish(e, r) && (t === q || t.startsWith(q.slice(0, 10)))
          }),
        )
        return qEl
          ? climb(qEl, (n) => {
              const r = n.getBoundingClientRect()
              return r.height >= 48 && r.width > 400
            })
          : null
      })()
    if (!item) return {}
    const trigger = item.querySelector?.('[data-faq-trigger],button') || item
    const qEl =
      [...(trigger?.querySelectorAll?.('span,p') || [])].find(
        (e) => (e.textContent || '').trim().length > 4,
      ) ||
      first(textsExact(q, rightish)) ||
      trigger
    const chev =
      item.querySelector?.('img.faq-chevron,img[src*="faq-chevron"],.faq-chevron') ||
      item.querySelector?.('svg,img')
    const answer =
      item.querySelector?.('[data-faq-content], [data-state] p, [role=region]') ||
      [...(item.querySelectorAll?.('span,p') || [])].find((e) => {
        const t = (e.textContent || '').trim()
        return t.length > 20 && t !== q && !faqQs.includes(t)
      })
    return {
      row: styleOf(item),
      q: styleOf(qEl),
      chevron: styleOf(chev),
      answer: styleOf(answer),
    }
  })

  return {
    href: location.href,
    iw: window.innerWidth,
    shell: {
      dividerL: styleOfBorderDivider(
        rail,
        rail && parseFloat(getComputedStyle(rail).borderLeftWidth) >= 1 ? 'left' : 'right',
      ),
      dividerR: styleOfBorderDivider(widget, 'right'),
      claimDivider: null,
    },
    header: {
      backIcon: styleOf(backIcon),
      backLabel: styleOf(backLabel),
      menuBtn: styleOf(menuBtn),
      menuIcon: styleOf(menuIcon),
      title: styleOf(title),
      subtitle: styleOf(subtitle),
    },
    claim: {
      card: styleOf(claimCard),
      label: styleOf(claimLabel),
      tokenIcon: styleOf(claimTokenIcon),
      amount: styleOf(claimAmount),
      contribLabel: styleOf(contribLabel),
      contribValue: styleOf(contribValue),
    },
    warning: {
      card: styleOf(warnCard),
      text: styleOf(warnText),
    },
    slider: {
      card: styleOf(sliderCard),
      segL: styleOf(trackSegs[0]),
      segR: styleOf(trackSegs[1]),
      handle: styleOf(thumb),
      handleText: styleOf(handleText),
      releaseLab: styleOf(releaseLab),
      restakeLab: styleOf(restakeLab),
    },
    release: releasePack,
    restake: restakePack,
    cta: {
      btn: styleOf(ctaBtn),
      releaseLab: styleOf(ctaReleaseLab || ctaLine0),
      releaseAmt: styleOf(ctaReleaseAmt || ctaLine0),
      restakeLab: styleOf(ctaRestakeLab || ctaLine1),
      restakeAmt: styleOf(ctaLine1),
    },
    tiles: {
      dataHeading: styleOf(dataHeading),
      pool: {
        card: styleOf(pool.card),
        label: styleOf(pool.labEl),
        value: styleOf(pool.value),
        hint: styleOf(pool.hint),
      },
      qualify: {
        card: styleOf(qualify.card),
        label: styleOf(qualify.labEl),
        value: styleOf(qualify.value),
        hint: styleOf(qualify.hint),
      },
      wins: {
        card: styleOf(wins.card),
        label: styleOf(wins.labEl),
        value: styleOf(wins.value),
        hint: styleOf(wins.hint),
      },
    },
    chainlink: {
      card: styleOf(chainCard),
      icon: styleOf(chainIcon),
      title: styleOf(vrfTitle),
      verifyBtn: styleOf(verifyBtn),
      verifyText: styleOf(verifyText),
      body: styleOf(vrfBody),
    },
    results: {
      heading: styleOf(resultsHeading),
      table: styleOf(resultsTableCard),
      dateBtn: styleOf(dateBtn),
      dateText: styleOf(dateText),
      dateChev: styleOf(dateChev),
      summary: styleOf(resultsSummary),
      verifyHash: styleOf(verifyHash),
      extLink: null,
      sepControls,
      ths: resultsThs,
      sepHeader,
      rows: resultRows,
    },
    history: {
      heading: styleOf(historyHeading),
      table: styleOf(historyTableCard),
      ths: historyThs,
      sepHeader: histSepHeader,
      rows: historyRows,
    },
    faq: {
      heading: styleOf(faqHeading),
      items: faqs,
    },
  }
})()
