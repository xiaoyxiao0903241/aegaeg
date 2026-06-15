import type { HomeContentBundle } from '../types'

export const ruBundle: HomeContentBundle = {
  meta: {
    title: 'AEGIS X - Защита Будущего Ценности',
    description:
      'AEGIS X — AI-native протокол DeFi 4.0 с расчётами в USD1, приоритетным доступом через кошелёк на BSC и самовосстанавливающимся движком протокола.',
  },
  nav: {
    sectionsLabel: 'Разделы главной страницы',
    links: [
      { href: '#protocol', label: 'Протокол' },
      { href: '#engine', label: 'Движок' },
      { href: '#token', label: 'Токен' },
      { href: '#roadmap', label: 'Дорожная карта' },
      { href: '#security', label: 'Безопасность' },
      { href: '#faq', label: 'FAQ' },
    ],
    whitepaper: 'Whitepaper',
    launchDapp: 'Запустить DApp',
    languageLabel: 'Язык',
  },
  hero: {
    guardianLabel: 'Страж AEGIS X',
    eyebrow: 'AI x DeFi x USD1 · Протокол DeFi 4.0',
    title: 'Защита Будущего Ценности',
    body: {
      desktop:
        'Первый в мире глобальный платёжный протокол AI x DeFi x USD1, управляемый системой AI think-tank. С USD1 в качестве основного расчётного актива — переосмысление децентрализованных финансов через интеллект.',
      mobile:
        'Первый в мире глобальный платёжный протокол AI x DeFi x USD1, управляемый системой AI think-tank.',
    },
    enterProtocol: 'Войти в Протокол',
    readWhitepaper: 'Читать Whitepaper',
    walletBusy: 'Открываем кошелёк...',
  },
  sections: {
    protocol: {
      eyebrow: 'ПРОТОКОЛ AEGIS X',
      title: {
        desktop: 'AI-native инфраструктура для следующей финансовой эры',
        mobile: 'AI-native инфраструктура',
      },
      subtitle: {
        desktop:
          'AI x DeFi x USD1 — строим сеть ценности нового поколения.',
        mobile: 'AI x DeFi x USD1 — строим сеть ценности нового поколения.',
      },
      cards: [
        {
          index: '01',
          title: 'AI Think-Tank',
          desktop:
            'Автономный контроль рисков, маркет-мейкинг и распределение активов — всё on-chain, всё на базе интеллекта.',
          mobile:
            'Контроль рисков, маркет-мейкинг и распределение активов — on-chain, на базе интеллекта.',
        },
        {
          index: '02',
          title: 'Расчёты USD1',
          desktop:
            'Эмиссия с обеспечением 150%, USD1 — основной расчётный актив стабильного базового слоя DeFi 4.0.',
          mobile:
            'Эмиссия с обеспечением 150%, USD1 — основной расчётный актив DeFi 4.0.',
        },
        {
          index: '03',
          title: 'Глобальные Платежи',
          desktop:
            'Объединяем AI-агентов, ликвидность DeFi и трансграничные платежи в единую глобальную сеть ценности.',
          mobile:
            'Объединяем AI-агентов, ликвидность DeFi и трансграничные платежи в единую сеть ценности.',
        },
      ],
    },
    engine: {
      eyebrow: 'ЯДРО ДВИЖКА',
      title: {
        desktop: 'Четыре столпа, одна интеллектуальная система',
        mobile: 'Четыре столпа, одна система',
      },
      subtitle: {
        desktop:
          'AI-driven ядро DeFi 4.0 — самовосстанавливающаяся ценовая архитектура.',
        mobile: 'AI-driven ядро DeFi 4.0.',
      },
      cards: [
        {
          title: 'AI Market Maker',
          desktop:
            'Модель динамического баланса: на росте накапливает резервы USD1; при откате выходит из LP и запускает buyback + burn для самовосстановления цены.',
          mobile:
            'Динамический баланс: накапливает USD1 на росте; при откате buyback + burn для самовосстановления цены.',
        },
        {
          title: 'Динамическая Защита от Волатильности',
          desktop:
            'Автоматически при падении >=5% за день: комиссия на продажу до 30%, buyback резервов и black-hole burn, автовосстановление через 24ч.',
          mobile:
            'Падение >=5% за день: комиссия 30%, buyback резервов + black-hole burn, восстановление через 24ч.',
        },
        {
          title: 'Rebase Engine',
          desktop:
            'Двухэпоховый расчёт каждые 12ч с линейным выпуском по блокам. Гибкие стейкинг-уровни до 540 дней, ref. APY 535%-4,880%.',
          mobile:
            'Двухэпоховый расчёт каждые 12ч, выпуск по блокам. Ref. APY 535%-4,880%.',
        },
        {
          title: 'Механизм Turbo',
          desktop:
            'Дизайн «покупка для разблокировки»: квота продажи 1:1 к покупке, адаптивный cooldown 24-96ч и логика против панических продаж.',
          mobile:
            'Покупка 1:1 разблокирует квоту продажи, адаптивный cooldown 24-96ч — без панических продаж.',
        },
      ],
    },
    token: {
      eyebrow: 'ТОКЕН И ЭКОСИСТЕМА',
      title: 'Мультиактивный маховик',
      subtitle: {
        desktop:
          'Четыре токена, один самоусиливающийся цикл ценности: рост → ликвидность + платежи + экосистема.',
        mobile: 'Четыре токена, один самоусиливающийся цикл ценности.',
      },
      cards: [
        {
          label: 'Стабильный резервный актив',
          description: 'Расчётный слой · Ликвидность, обеспеченная USD',
        },
        {
          label: 'Основной актив протокола',
          description: 'Обеспечение 150% · Управление AI think-tank',
        },
        {
          label: 'Токен расчёта наград',
          description: '1:1 к AGX · питает X mining',
        },
        {
          label: 'Токен ценности экосистемы',
          description: '210M фиксированно · 25% sell-burn',
        },
      ],
      note: 'Пользователи → Ликвидность → Платежи → Рост → бесконечность',
    },
    roadmap: {
      eyebrow: 'ДОРОЖНАЯ КАРТА',
      title: 'Путь к DeFi 4.0',
      phases: [
        {
          phase: 'ФАЗА 01',
          time: '2025 Q3',
          title: 'Genesis Launch',
          description: 'Развёртывание протокола · Эмиссия AGX · Пул ликвидности USD1',
          dot: '✓',
          side: 'left',
          state: 'done',
        },
        {
          phase: 'ФАЗА 02',
          time: '2025 Q4',
          title: 'DeFi Core',
          description: 'Rebase staking · LP bonds · burn bonds · AI market-making',
          dot: '✓',
          side: 'right',
          state: 'done',
        },
        {
          phase: 'ФАЗА 03',
          time: '2026 Q1',
          title: 'DAO и Рост',
          description: 'Incentives X DAO · multisig governance · глобальные ноды',
          dot: '✓',
          side: 'left',
          state: 'done',
        },
        {
          phase: 'ФАЗА 04',
          time: '2026 Q2',
          title: 'Экономика AI Agent',
          description:
            'Автономные платежи · on-chain коллаборация · agent market-making',
          dot: '4',
          side: 'right',
          state: 'current',
        },
        {
          phase: 'ФАЗА 05',
          time: '2026 Q3',
          title: 'Глобальные Платежи',
          description: 'Трансграничные расчёты · onboarding мерчантов · USD1 rails',
          dot: '5',
          side: 'left',
        },
        {
          phase: 'ФАЗА 06',
          time: '2026 Q4',
          title: 'DeFi 4.0',
          description:
            'Институциональные продукты · compliance framework · полная экосистема',
          dot: '6',
          side: 'right',
        },
      ],
    },
    security: {
      eyebrow: 'БЕЗОПАСНОСТЬ И ДОВЕРИЕ',
      title: 'Безопасность уровня Aegis',
      subtitle: {
        desktop:
          'AEGIS = щит, защита, порядок, безопасность. Безопасность активов заложена с самого основания.',
        mobile: 'Безопасность активов заложена с самого основания.',
      },
      checks: [
        {
          desktop:
            'Non-custodial — контракт AI market-maker не может вывести никакие активы',
          mobile:
            'Non-custodial — AI market-maker не может вывести активы',
        },
        'Аудит несколькими компаниями по безопасности',
        'Основные контракты с открытым исходным кодом на GitHub',
        {
          desktop: 'Safe multisig governance (права upgrade + execution)',
          mobile: 'Safe multisig governance (upgrade + execution)',
        },
      ],
    },
    partners: {
      title: 'ПАРТНЁРЫ ЭКОСИСТЕМЫ',
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Часто задаваемые вопросы',
      items: [
        {
          question: 'Что такое AEGIS X?',
          answer:
            'Первый в мире протокол, управляемый системой AI think-tank, объединяющий AI-интеллект, ликвидность DeFi и платежи stablecoin USD1 в сеть ценности нового поколения — DeFi 4.0.',
          open: true,
        },
        {
          question: 'Как эмитируется AGX?',
          answer:
            'AGX эмитируется через коллатерализованную модель выпуска протокола с USD1 в качестве основного расчётного актива.',
        },
        {
          question: 'Как рассчитываются награды за staking?',
          answer:
            'Награды следуют уровням staking, эпохальным расчётам и правилам участия, определённым контрактами AEGIS X.',
        },
        {
          question: 'Как обеспечивается безопасность протокола?',
          answer:
            'AEGIS X сочетает non-custodial дизайн, аудиты, open-source контракты и multisig governance.',
        },
        {
          question: 'Как работает токен X?',
          answer:
            'X — токен ценности экосистемы с фиксированным supply и burn-механикой, управляемой протоколом.',
          optional: true,
        },
        {
          question: 'Что такое механизм Turbo?',
          answer:
            'Turbo связывает квоты покупки и продажи с адаптивным cooldown, снижая панические продажи и сохраняя ликвидность.',
        },
      ],
    },
  },
  metrics: [
    {
      value: '150%',
      countTarget: 150,
      suffix: '%',
      label: 'Коэффициент Обеспечения',
    },
    {
      value: '4,880%',
      countTarget: 4880,
      suffix: '%',
      label: 'Макс. Ref. APY',
    },
    {
      value: '2+',
      countTarget: 2,
      suffix: '+',
      label: 'Поддерживаемые Сети',
    },
    {
      value: '210M',
      countTarget: 210,
      suffix: 'M',
      label: 'Общий Supply X',
    },
  ],
  footer: {
    brandCopy: {
      desktop: 'Защита Будущего Ценности.\nAI x DeFi x USD1',
      mobile: 'Защита Будущего Ценности.\nAI x DeFi x USD1',
    },
    copyright: '© 2026 AEGIS X DAO. All rights reserved.',
    legal: 'Условия использования · Политика конфиденциальности · Отказ от ответственности',
    languageLabel: 'Язык',
    groups: [
      {
        label: 'Протокол',
        ariaLabel: 'Ссылки протокола в подвале',
        links: [
          {
            href: '/app.html',
            label: { desktop: 'Запустить DApp', mobile: 'Docs' },
          },
          { href: '#whitepaper', label: 'Whitepaper' },
          { href: '#docs', label: 'Docs' },
          { href: '#analytics', label: 'Analytics' },
        ],
      },
      {
        label: 'Экосистема',
        ariaLabel: 'Ссылки экосистемы в подвале',
        links: [
          {
            href: '#token',
            label: { desktop: 'AGX Staking', mobile: 'Docs' },
          },
          {
            href: '#token',
            label: { desktop: 'LP Bond', mobile: 'Whitepaper' },
          },
          { href: '#token', label: 'Burn Bond' },
          { href: '#token', label: 'X Mining' },
        ],
      },
      {
        label: 'Сообщество',
        ariaLabel: 'Ссылки сообщества в подвале',
        links: [
          {
            href: '#discord',
            label: { desktop: 'Discord', mobile: 'Docs' },
          },
          {
            href: '#twitter',
            label: { desktop: 'Twitter / X', mobile: 'Whitepaper' },
          },
          { href: '#telegram', label: 'Telegram' },
          { href: '#github', label: 'GitHub' },
        ],
      },
    ],
  },
}
