import type { HomeContentBundle } from '../types'

export const esBundle: HomeContentBundle = {
  meta: {
    title: 'AEGIS X - Protegiendo el Futuro del Valor',
    description:
      'AEGIS X es un protocolo DeFi 4.0 nativo de IA con liquidación en USD1, acceso prioritario a wallet en BSC y un motor de protocolo autorreparable.',
  },
  nav: {
    sectionsLabel: 'Secciones de la página',
    links: [
      { href: '#protocol', label: 'Protocolo' },
      { href: '#engine', label: 'Motor' },
      { href: '#token', label: 'Token' },
      { href: '#roadmap', label: 'Hoja de ruta' },
      { href: '#security', label: 'Seguridad' },
      { href: '#faq', label: 'FAQ' },
    ],
    whitepaper: 'Whitepaper',
    launchDapp: 'Abrir DApp',
    languageLabel: 'Idioma',
  },
  hero: {
    guardianLabel: 'Guardián AEGIS X',
    eyebrow: {
      desktop: 'AI x DeFi x USD1 · Protocolo DeFi 4.0',
      mobile: 'AI x DeFi x USD1 · DeFi 4.0',
    },
    title: 'Protegiendo el Futuro del Valor',
    body: {
      desktop:
        'El primer protocolo global de pagos AI x DeFi x USD1 del mundo, impulsado por un sistema de think-tank de IA. Con USD1 como activo central de liquidación, redefiniendo las finanzas descentralizadas mediante inteligencia.',
      mobile:
        'El primer protocolo global de pagos AI x DeFi x USD1 del mundo, impulsado por un sistema de think-tank de IA.',
    },
    enterProtocol: 'Entrar al Protocolo',
    readWhitepaper: 'Leer Whitepaper',
    walletBusy: 'Abriendo wallet...',
  },
  sections: {
    protocol: {
      eyebrow: 'PROTOCOLO AEGIS X',
      title: {
        desktop: 'Infraestructura nativa de IA para la próxima era financiera',
        mobile: 'Infraestructura nativa de IA',
      },
      subtitle: {
        desktop:
          'AI x DeFi x USD1 - construyendo la red de valor de próxima generación.',
        mobile: 'AI x DeFi x USD1 - construyendo la red de valor de nueva generación.',
      },
      cards: [
        {
          index: '01',
          title: 'Think-Tank de IA',
          desktop:
            'Control de riesgo autónomo, market-making y asignación de activos - todo on-chain, todo impulsado por inteligencia.',
          mobile:
            'Control de riesgo, market-making y asignación de activos - on-chain, impulsado por inteligencia.',
        },
        {
          index: '02',
          title: 'Liquidación USD1',
          desktop:
            'Emisión sobrecolateralizada al 150%, con USD1 como activo central de liquidación de una capa base DeFi 4.0 estable.',
          mobile:
            'Emisión sobrecolateralizada al 150%, con USD1 como activo central de liquidación de DeFi 4.0.',
        },
        {
          index: '03',
          title: 'Pagos Globales',
          desktop:
            'Conectando agentes de IA, liquidez DeFi y pagos transfronterizos en una red global de valor unificada.',
          mobile:
            'Conectando agentes de IA, liquidez DeFi y pagos transfronterizos en una red de valor.',
        },
      ],
    },
    engine: {
      eyebrow: 'MOTOR CENTRAL',
      title: {
        desktop: 'Cuatro pilares, un sistema inteligente',
        mobile: 'Cuatro pilares, un sistema',
      },
      subtitle: {
        desktop:
          'El motor central DeFi 4.0 impulsado por IA - una arquitectura de precios autorreparable.',
        mobile: 'El motor central DeFi 4.0 impulsado por IA.',
      },
      cards: [
        {
          title: 'AI Market Maker',
          desktop:
            'Modelo de equilibrio dinámico: acumula reservas USD1 en subidas; en retrocesos, retira LP y ejecuta recompra + burn para autorreparar el precio.',
          mobile:
            'Equilibrio dinámico: acumula USD1 en subidas; en retrocesos, recompra + burn para autorreparar el precio.',
        },
        {
          title: 'Defensa Dinámica de Volatilidad',
          desktop:
            'Se activa automáticamente con caída diaria >=5%: la comisión de venta sube al 30%, recompra de reservas y burn de agujero negro, restauración automática tras 24h.',
          mobile:
            'Caída diaria >=5% activa: comisión de venta al 30%, recompra de reservas + burn de agujero negro, restauración tras 24h.',
        },
        {
          title: 'Rebase Engine',
          desktop:
            'Liquidación dual cada 12h con liberación lineal por bloque. Flexible hasta 540 días de staking, APY ref. 535%-4,880%.',
          mobile:
            'Liquidación dual cada 12h, liberación por bloque. APY ref. 535%-4,880%.',
        },
        {
          title: 'Mecanismo Turbo',
          desktop:
            'Diseño de compra para desbloquear: cuota de venta 1:1 con compra, cooldown adaptativo de 24-96h y lógica anti-pánico.',
          mobile:
            'Compra 1:1 desbloquea cuota de venta, cooldown adaptativo 24-96h - sin ventas por pánico.',
        },
      ],
    },
    token: {
      eyebrow: 'TOKEN Y ECOSISTEMA',
      title: 'Volante multi-activo',
      subtitle: {
        desktop:
          'Cuatro tokens, un ciclo de valor autorreforzado: crecimiento → liquidez → pagos → ecosistema.',
        mobile: 'Cuatro tokens, un ciclo de valor autorreforzado.',
      },
      cards: [
        {
          label: 'Activo central del protocolo',
          description: 'Sobrecolateralizado al 150% · Gestionado por think-tank de IA',
        },
        {
          label: 'Activo de reserva estable',
          description: 'Capa de liquidación · Liquidez respaldada en USD',
        },
        {
          label: 'Token de valor del ecosistema',
          description: '210M fijos · 25% burn en venta',
        },
        {
          label: 'Token de liquidación de recompensas',
          description: '1:1 con AGX · impulsa la minería X',
        },
      ],
    },
    roadmap: {
      eyebrow: 'HOJA DE RUTA',
      title: 'El camino hacia DeFi 4.0',
      phases: [
        {
          phase: 'FASE 01',
          time: '2026 Q3',
          title: 'Lanzamiento Genesis',
          description: 'Despliegue del protocolo · Emisión de AGX · Pool de liquidez USD1',
          dot: '✓',
          side: 'left',
          state: 'done',
        },
        {
          phase: 'FASE 02',
          time: '2026 Q4',
          title: 'DeFi Central',
          description: 'Rebase staking · LP bonds · burn bonds · AI market-making',
          dot: '✓',
          side: 'right',
          state: 'done',
        },
        {
          phase: 'FASE 03',
          time: '2027 Q1',
          title: 'DAO y Crecimiento',
          description: 'Incentivos X DAO · gobernanza multisig · nodos globales',
          dot: '✓',
          side: 'left',
          state: 'done',
        },
        {
          phase: 'FASE 04',
          time: '2027 Q2',
          title: 'Economía de Agentes IA',
          description:
            'Pagos autónomos · colaboración on-chain · market-making de agentes',
          dot: '4',
          side: 'right',
          state: 'current',
        },
        {
          phase: 'FASE 05',
          time: '2027 Q3',
          title: 'Pagos Globales',
          description: 'Liquidación transfronteriza · onboarding de comercios · rails USD1',
          dot: '5',
          side: 'left',
        },
        {
          phase: 'FASE 06',
          time: '2027 Q4',
          title: 'DeFi 4.0',
          description:
            'Productos institucionales · marco de cumplimiento · ecosistema completo',
          dot: '6',
          side: 'right',
        },
      ],
    },
    security: {
      eyebrow: 'SEGURIDAD Y CONFIANZA',
      title: 'Seguridad de nivel Aegis',
      subtitle: {
        desktop:
          'AEGIS = escudo, custodia, orden, seguridad. La seguridad de los activos está integrada desde la base.',
        mobile: 'La seguridad de los activos está integrada desde la base.',
      },
      checks: [
        {
          desktop:
            'Non-custodial - el contrato AI market-maker no puede transferir ningún activo',
          mobile:
            'Non-custodial - el AI market-maker no puede transferir activos',
        },
        'Auditado por múltiples firmas de seguridad',
        'Contratos centrales de código abierto en GitHub',
        {
          desktop: 'Gobernanza Safe multisig (derechos de upgrade + ejecución)',
          mobile: 'Gobernanza Safe multisig (upgrade + ejecución)',
        },
      ],
    },
    partners: {
      title: 'SOCIOS DEL ECOSISTEMA',
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Preguntas frecuentes',
      items: [
        {
          question: '¿Qué es AEGIS X?',
          answer:
            'El primer protocolo del mundo impulsado por un sistema de think-tank de IA, que fusiona inteligencia artificial, liquidez DeFi y pagos con stablecoin USD1 en una red de valor de próxima generación - DeFi 4.0.',
          open: true,
        },
        {
          question: '¿Cómo se emite AGX?',
          answer:
            'AGX se emite mediante el diseño de emisión colateralizada del protocolo, con USD1 como activo central de liquidación.',
        },
        {
          question: '¿Cómo se calculan las recompensas de staking?',
          answer:
            'Las recompensas siguen los niveles de staking, la liquidación por epoch y las reglas de participación definidas por los contratos de AEGIS X.',
        },
        {
          question: '¿Cómo se garantiza la seguridad del protocolo?',
          answer:
            'AEGIS X combina diseño non-custodial, auditorías, contratos open source y gobernanza multisig.',
        },
        {
          question: '¿Cómo funciona el token X?',
          answer:
            'X es el token de valor del ecosistema con suministro fijo y mecánicas de burn impulsadas por el protocolo.',
          optional: true,
        },
        {
          question: '¿Qué es el mecanismo Turbo?',
          answer:
            'Turbo vincula las cuotas de compra y venta con un cooldown adaptativo para reducir las ventas por pánico preservando la liquidez.',
        },
      ],
    },
  },
  metrics: [
    {
      value: '150%',
      countTarget: 150,
      suffix: '%',
      label: 'Ratio de Colateral',
    },
    {
      value: '100%',
      countTarget: 100,
      suffix: '%',
      label: 'APY Ref. Máximo',
    },
    {
      value: '24H',
      countTarget: 24,
      suffix: 'H',
      label: 'Cadenas Soportadas',
    },
    {
      value: '210M',
      countTarget: 210,
      suffix: 'M',
      label: 'Suministro Total X',
    },
  ],
  footer: {
    brandCopy: {
      desktop: 'Protegiendo el Futuro del Valor.\nAI x DeFi x USD1',
      mobile: 'Protegiendo el Futuro del Valor.\nAI x DeFi x USD1',
    },
    copyright: '© 2026 AEGIS X DAO. All rights reserved.',
    legal: 'Términos de Servicio · Política de Privacidad · Descargo de Responsabilidad',
    languageLabel: 'Idioma',
    groups: [
      {
        label: 'Protocolo',
        ariaLabel: 'Enlaces de protocolo en el pie de página',
        links: [
          {
            href: '/app.html',
            label: { desktop: 'Abrir DApp', mobile: 'Docs' },
          },
          { href: '#whitepaper', label: 'Whitepaper' },
          { href: '#docs', label: 'Docs' },
          { href: '#analytics', label: 'Analytics' },
        ],
      },
      {
        label: 'Ecosistema',
        ariaLabel: 'Enlaces del ecosistema en el pie de página',
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
        label: 'Comunidad',
        ariaLabel: 'Enlaces de comunidad en el pie de página',
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
