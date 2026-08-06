/**
 * Community Hub 页面快照，供 A5 测量通过 WebBridge 求值。
 *
 * 返回按 mapLeaves 使用的 key 组织的测量矩形。
 */
;(() => {
  const rect = (el) => {
    if (!el) return null
    const r = el.getBoundingClientRect()
    const cs = getComputedStyle(el)
    return {
      w: Math.round(r.width * 100) / 100,
      h: Math.round(r.height * 100) / 100,
      x: Math.round(r.x * 100) / 100,
      y: Math.round(r.y * 100) / 100,
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      color: cs.color,
      backgroundColor: cs.backgroundColor,
      borderRadius: cs.borderRadius,
      boxShadow: cs.boxShadow,
    }
  }

  const byText = (sel, text) =>
    [...document.querySelectorAll(sel)].find((e) => (e.textContent || '').trim() === text)

  const widget = document.querySelector('[data-dapp-widget-panel]')
  const content =
    document.querySelector('[data-dapp-content-panel]') || document.querySelector('main')

  const referralLink =
    widget?.querySelector('section,article,[class*="card"]') ||
    [...(widget?.querySelectorAll('p,span') || [])]
      .find((e) => (e.textContent || '').includes('邀请链接'))
      ?.closest('section,article,div')

  const inviterRow = document.querySelector('[data-slot-id="community-referrer-row"]')
  const inviterCopy = document.querySelector('[data-slot-id="community-referrer-copy"]')
  const inviterCard = inviterRow?.closest('section,article,div')
  const inviterAvatar = inviterRow?.querySelector('span')

  const steps = document.querySelector('[data-slot-id="community-invite-steps"]')
  const stats = [...(content?.querySelectorAll('.community-stat') || [])]

  const programsTitle = byText('h2,h3,p,span', '生态支持计划')
  const programCards = programsTitle
    ? [...(programsTitle.closest('section,div')?.querySelectorAll('article') || [])]
    : []

  const membersEmpty =
    document.querySelector('[data-slot-id="community-members-empty"]') ||
    [...document.querySelectorAll('p')].find((e) => (e.textContent || '').includes('暂无社区成员'))

  return {
    referralLink: rect(referralLink),
    inviterCard: rect(inviterCard),
    inviterAvatar: rect(inviterAvatar),
    inviterCopy: rect(inviterCopy),
    myCommunityHeading: rect(byText('h1,h2,h3', '我的社区') || byText('p,span', '我的社区')),
    statDirect: rect(stats[0]),
    statTeam: rect(stats[1]),
    statRank: rect(stats[2]),
    inviteSteps: rect(steps),
    programsHeading: rect(programsTitle),
    programGenesis: rect(programCards[0]),
    programAcademy: rect(programCards[1]),
    membersHeading: rect(
      [...document.querySelectorAll('h2,h3,p')].find((e) =>
        (e.textContent || '').includes('我的社区成员'),
      ),
    ),
    membersEmpty: rect(membersEmpty),
    faqHeading: rect(byText('h2,h3,p,span', 'FAQs') || byText('h2,h3,p,span', 'FAQ')),
  }
})()
