import { defineMessages } from '~/i18n/messages/define-messages'
import type { HomeMessagesBundle } from './types'

const home = defineMessages({
  meta: {
    description: 'AEGIS X es un protocolo DeFi 4.0 nativo de IA con liquidación en USD1, acceso prioritario a wallets en BSC y un motor de protocolo autorreparable que construye la red de valor de próxima generación.',
    title: 'AEGIS X - Protegiendo el Valor del Futuro'
  },
  nav: {
    sectionsLabel: 'Navegación de secciones de inicio',
    links: [
      {
        href: '#protocol',
        label: 'Protocolo'
      },
      {
        href: '#engine',
        label: 'Motor'
      },
      {
        href: '#token',
        label: 'Token'
      },
      {
        href: '#roadmap',
        label: 'Roadmap'
      },
      {
        href: '#security',
        label: 'Seguridad'
      },
      {
        href: '#faq',
        label: 'FAQ'
      }
    ],
    whitepaper: 'Whitepaper',
    enterApp: 'Launch App',
    languageLabel: 'Idioma'
  },
  hero: {
    guardianLabel: 'Guardián de AEGIS X',
    eyebrow: 'AI x DeFi x USD1 · Protocolo DeFi 4.0',
    title: 'Protegiendo el Valor del Futuro',
    body: 'El primer protocolo de ecosistema USD1 impulsado por un think tank de IA. Con USD1 como activo de liquidación central, conecta IA, pagos y la red global de liquidez.',
    enterProtocol: 'Entrar al protocolo',
    readWhitepaper: 'Whitepaper',
  },
  sections: {
    protocol: {
      eyebrow: 'Protocolo AEGIS X',
      title: 'Arquitectura central de la red de valor de próxima generación',
      subtitle: 'AI x DeFi x USD1 - Impulsando el flujo de valor',
      cards: [
        {
          title: 'AI Think Tank',
          body: 'Control de riesgos autónomo, market making inteligente y gestión de liquidez, todo ejecutado on-chain.',
          index: '01'
        },
        {
          title: 'USD1 Settlement',
          body: 'Con USD1 como activo de liquidación central, construye una red estable de circulación de valor.',
          index: '02'
        },
        {
          title: 'Global Payments',
          body: 'Conecta AI Agents, DeFi y escenarios de pago global para construir la red de valor de próxima generación.',
          index: '03'
        }
      ]
    },
    engine: {
      eyebrow: 'Mecanismos centrales',
      title: 'Cuatro mecanismos, un sistema inteligente',
      subtitle: 'Mediante decisiones inteligentes, ajuste dinámico y control de riesgos, construye una red de valor sostenible.',
      cards: [
        {
          title: 'Market Making Inteligente',
          body: 'Acumula activos de reserva en fases alcistas para fortalecer la capacidad de reserva del protocolo; en fases de corrección, ejecuta mecanismos de recompra y quema para reparar el precio.'
        },
        {
          title: 'Defensa contra Volatilidad',
          body: 'Se activa automáticamente cuando la caída diaria alcanza el umbral: la comisión de venta sube al 30%, se inician la recompra de reservas y la quema en agujero negro, con restauración automática tras 24 horas.'
        },
        {
          title: 'Distribución de Yield',
          body: 'Adopta un mecanismo de liberación lineal a nivel de bloque, con liquidación de yield cada 12 horas y un ciclo de participación de hasta 540 días.'
        },
        {
          title: 'Mecanismo Turbo',
          body: 'Optimiza la estructura de liquidez del mercado mediante un mecanismo dinámico de desbloqueo de compras, reforzando la estabilidad del ecosistema y la capacidad de desarrollo a largo plazo.'
        }
      ]
    },
    token: {
      eyebrow: 'Ecosistema de valor',
      title: 'Rueda de valor multiactivo',
      subtitle: 'Crecimiento de usuarios → Mayor liquidez → Expansión de pagos → Crecimiento del ecosistema.',
      cards: [
        {
          label: 'Activo central del protocolo',
          description: 'Emisión con sobrecolateralización del 150% · Motor de crecimiento de yield'
        },
        {
          label: 'Activo central de liquidación',
          description: 'Capa de liquidación del ecosistema · Infraestructura de circulación de valor'
        },
        {
          label: 'Token de valor del ecosistema',
          description: 'Suministro fijo de 210M · Acumulación continua de valor'
        },
        {
          label: 'Comprobante de liquidación de rewards',
          description: 'Canjeable por AGX · Participación en minería del ecosistema'
        }
      ]
    },
    roadmap: {
      eyebrow: 'Roadmap',
      title: 'El camino hacia la red de valor de próxima generación',
      phases: [
        {
          phase: 'PHASE 01',
          time: '2026 Q3',
          title: 'Genesis Launch',
          description: 'Despliegue del protocolo · Mint de AGX · Pool de liquidez USD1',
          dot: '✓',
          side: 'left',
          state: 'current'
        },
        {
          phase: 'PHASE 02',
          time: '2026 Q4',
          title: 'DeFi Core',
          description: 'Rebase staking · LP bonds · Burn bonds · AI market making',
          dot: '2',
          side: 'right'
        },
        {
          phase: 'PHASE 03',
          time: '2027 Q1',
          title: 'DAO & Growth',
          description: 'Incentivos X DAO · Gobernanza multisig · Nodos globales',
          dot: '3',
          side: 'left'
        },
        {
          phase: 'PHASE 04',
          time: '2027 Q2',
          title: 'AI Agent Economy',
          description: 'Pagos autónomos · Colaboración inteligente · Red económica de AI Agents',
          dot: '4',
          side: 'right'
        },
        {
          phase: 'PHASE 05',
          time: '2027 Q3',
          title: 'Global Payments',
          description: 'Red de pagos global · Integración de comercios · Escenarios de pago USD1',
          dot: '5',
          side: 'left'
        },
        {
          phase: 'PHASE 06',
          time: '2027 Q4',
          title: 'Future Value Network',
          description: 'Red de pagos · Economía de AI Agents · Ecosistema de valor',
          dot: '6',
          side: 'right'
        }
      ]
    },
    security: {
      eyebrow: 'Seguridad y confianza',
      title: 'Arquitectura de seguridad de nivel AEGIS',
      subtitle: 'Desde la arquitectura del protocolo hasta la gestión de activos, la seguridad atraviesa cada etapa',
      checks: [
        "Arquitectura non-custodial · El contrato de market making inteligente no tiene permisos para transferir activos",
        "Contratos centrales open-source verificables · Auditados profesionalmente",
        "Gobernanza multisig · Gestión conjunta de permisos centrales",
        "Mecanismo de defensa dinámica · Respuesta automática ante volatilidad extrema"
      ]
    },
    partners: {
      title: 'Infraestructura del ecosistema'
    },
    faq: {
      eyebrow: 'Guía rápida',
      title: 'Preguntas frecuentes',
      items: [
        {
          q: '¿Qué es AEGIS X?',
          a: 'AEGIS X es el primer protocolo de ecosistema USD1 impulsado por un think tank de IA, con USD1 como activo de liquidación central, conectando IA, DeFi y la red global de pagos.',
          open: true
        },
        {
          q: '¿Cómo se acuña AGX?',
          a: 'AGX se acuña mediante un mecanismo de sobrecolateralización del 150% y es el activo central del protocolo y un vehículo clave para el crecimiento de valor.'
        },
        {
          q: '¿Qué papel desempeña USD1 en AEGIS X?',
          a: 'USD1 es el activo de liquidación central del protocolo, que proporciona al ecosistema capacidades de circulación de valor, soporte de liquidez e infraestructura de pagos.'
        },
        {
          q: '¿Cómo garantiza la seguridad el protocolo?',
          a: 'Los contratos adoptan límites non-custodial, auditorías, revisión de código abierto y gobernanza multisig.'
        },
        {
          q: '¿Qué es el mecanismo Turbo?',
          a: 'El mecanismo Turbo reduce el riesgo de presión de venta concentrada mediante desbloqueo dinámico y ajuste de liquidez, reforzando la estabilidad del mercado y la capacidad de desarrollo a largo plazo.'
        },
        {
          q: '¿Cómo funciona el token X?',
          a: 'X es el token de valor del ecosistema, con suministro fijo y mecanismos de quema impulsados por el protocolo.'
        }
      ]
    }
  },
  metrics: [
    {
      value: '150%',
      countTarget: 150,
      suffix: '%',
      label: 'Sobrecolateralización'
    },
    {
      value: '100%',
      countTarget: 100,
      suffix: '%',
      label: 'LP permanentemente bloqueado'
    },
    {
      value: '24H',
      countTarget: 24,
      suffix: 'H',
      label: 'Defensa dinámica'
    },
    {
      value: '2.1M',
      countTarget: 210,
      suffix: 'M',
      label: 'Suministro fijo de X'
    }
  ],
  footer: {
    brandCopy: 'Protegiendo la red de valor del futuro \nAI x DeFi x USD1',
    copyright: '© 2026 AEGIS X DAO. Todos los derechos reservados.',
    groups: [
      {
        label: 'Protocolo',
        ariaLabel: 'Enlaces de pie de página del protocolo',
        links: [
          {
            href: '/app.html',
            label: 'Launch App'
          },
          {
            linkId: 'whitepaper',
            label: 'Whitepaper'
          },
          {
            linkId: 'docs',
            label: 'Docs'
          },
          {
            linkId: 'economicModel',
            label: 'Modelo económico'
          }
        ]
      },
      {
        label: 'Ecosistema',
        ariaLabel: 'Enlaces de pie de página del ecosistema',
        links: [
          {
            href: '#token',
            label: 'AGX'
          },
          {
            href: '#token',
            label: 'USD1'
          },
          {
            href: '#token',
            label: 'X'
          },
          {
            href: '#token',
            label: 'gGAX'
          }
        ]
      },
      {
        label: 'Community',
        ariaLabel: 'Enlaces de pie de página de la comunidad',
        links: [
          {
            socialId: 'youtube',
            label: 'Youtube'
          },
          {
            socialId: 'twitter',
            label: 'Twitter / X'
          },
          {
            socialId: 'telegram',
            label: 'Telegram'
          },
          {
            socialId: 'medium',
            label: 'Medium'
          }
        ]
      }
    ]
  }
} satisfies HomeMessagesBundle)

export default home
