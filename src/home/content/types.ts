export type NavigationLink = {
  href: string
  label: string
}

export type LanguageOption = {
  href?: string
  code: string
  name: string
  label: string
  active: boolean
}

export type IconCard = {
  icon: string
  index?: string
  title: string
  body: string
}

export type TokenCard = {
  className: string
  icon: string
  iconClassName?: string
  shape: string
  shapeWrapClassName?: string
  shapeClassName?: string
  symbol: string
  label: string
  description: string
}

export type Metric = {
  value: string
  countTarget: number
  suffix: string
  label: string
}

export type RoadmapPhase = {
  phase: string
  time: string
  title: string
  description: string
  dot: string
  side: 'left' | 'right'
  state?: 'done' | 'current'
}

export type FaqItem = {
  question: string
  answer: string
  open?: boolean
}

export type FooterGroup = {
  label: string
  ariaLabel: string
  links: Array<{
    href: string
    label: string
  }>
}

export type HomeContent = {
  meta: {
    description: string
    title: string
  }
  nav: {
    sectionsLabel: string
    links: NavigationLink[]
    whitepaper: string
    launchDapp: string
    languageLabel: string
    languages: LanguageOption[]
  }
  hero: {
    guardianLabel: string
    eyebrow: string
    title: string
    body: string
    enterProtocol: string
    readWhitepaper: string
    walletBusy: string
  }
  sections: {
    protocol: {
      eyebrow: string
      title: string
      subtitle: string
      cards: IconCard[]
    }
    engine: {
      eyebrow: string
      title: string
      subtitle: string
      cards: IconCard[]
    }
    token: {
      eyebrow: string
      title: string
      subtitle: string
      cards: TokenCard[]
    }
    roadmap: {
      eyebrow: string
      title: string
      phases: RoadmapPhase[]
    }
    security: {
      eyebrow: string
      title: string
      subtitle: string
      checks: string[]
    }
    partners: {
      title: string
      items: ReadonlyArray<readonly [string, string]>
    }
    faq: {
      eyebrow: string
      title: string
      items: FaqItem[]
    }
  }
  metrics: Metric[]
  footer: {
    brandCopy: string
    copyright: string
    legal: string
    languageLabel: string
    languages: LanguageOption[]
    groups: FooterGroup[]
  }
}

export type IconCardCopy = Omit<IconCard, 'icon'>

export type TokenCardCopy = {
  label: string
  description: string
}

export type HomeContentBundle = {
  meta: HomeContent['meta']
  nav: Omit<HomeContent['nav'], 'languages'>
  hero: HomeContent['hero']
  sections: {
    protocol: {
      eyebrow: string
      title: string
      subtitle: string
      cards: IconCardCopy[]
    }
    engine: {
      eyebrow: string
      title: string
      subtitle: string
      cards: IconCardCopy[]
    }
    token: {
      eyebrow: string
      title: string
      subtitle: string
      cards: TokenCardCopy[]
    }
    roadmap: HomeContent['sections']['roadmap']
    security: HomeContent['sections']['security']
    partners: Pick<HomeContent['sections']['partners'], 'title'>
    faq: HomeContent['sections']['faq']
  }
  metrics: HomeContent['metrics']
  footer: Omit<HomeContent['footer'], 'languages'>
}
