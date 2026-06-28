import { defineMessages } from '~/i18n/messages/define-messages'
import type { HomeMessagesBundle } from './types'

const home = defineMessages({
  meta: {
    description: 'AEGIS X adalah protokol DeFi 4.0 berbasis AI dengan penyelesaian USD1, akses dompet prioritas BSC, dan mesin protokol yang dapat memperbaiki diri, membangun jaringan nilai generasi berikutnya.',
    title: 'AEGIS X - Menjaga Nilai Masa Depan'
  },
  nav: {
    sectionsLabel: 'Navigasi bagian beranda',
    links: [
      {
        href: '#protocol',
        label: 'Protokol'
      },
      {
        href: '#engine',
        label: 'Mekanisme Inti'
      },
      {
        href: '#token',
        label: 'Nilai Ekosistem'
      },
      {
        href: '#roadmap',
        label: 'Peta Jalan'
      },
      {
        href: '#security',
        label: 'Keamanan'
      },
      {
        href: '#faq',
        label: 'FAQs'
      }
    ],
    whitepaper: 'Whitepaper',
    enterApp: 'Masuk App',
    languageLabel: 'Bahasa'
  },
  hero: {
    guardianLabel: 'Penjaga AEGIS X',
    eyebrow: 'AI x DeFi x USD1 · Protokol DeFi 4.0',
    title: 'Menjaga Nilai Masa Depan',
    body: 'Protokol ekosistem USD1 pertama di dunia yang didorong oleh think-tank AI. Dengan USD1 sebagai aset penyelesaian inti, menghubungkan AI, pembayaran, dan jaringan likuiditas global.',
    enterProtocol: 'Masuk Protokol',
    readWhitepaper: 'Baca Whitepaper',
  },
  sections: {
    protocol: {
      eyebrow: 'PROTOKOL AEGIS X',
      title: 'Arsitektur inti jaringan nilai generasi berikutnya',
      subtitle: 'AI x DeFi x USD1 - menggerakkan aliran nilai',
      cards: [
        {
          title: 'Think-Tank AI',
          body: 'Kontrol risiko otonom, market making, dan manajemen likuiditas dieksekusi sepenuhnya on-chain.',
          index: '01'
        },
        {
          title: 'Penyelesaian USD1',
          body: 'Dengan USD1 sebagai aset penyelesaian inti, membangun jaringan sirkulasi nilai yang stabil.',
          index: '02'
        },
        {
          title: 'Pembayaran Global',
          body: 'Menghubungkan AI Agent, DeFi, dan skenario pembayaran global untuk membangun jaringan nilai generasi berikutnya.',
          index: '03'
        }
      ]
    },
    engine: {
      eyebrow: 'MEKANISME INTI',
      title: 'Empat mekanisme, satu sistem cerdas',
      subtitle: 'Melalui keputusan cerdas, penyesuaian dinamis, dan kontrol risiko, membangun jaringan nilai yang berkelanjutan.',
      cards: [
        {
          title: 'Mekanisme Market Making Cerdas',
          body: 'Fase kenaikan mengakumulasi aset cadangan untuk memperkuat cadangan protokol; fase koreksi menjalankan buyback dan burn untuk perbaikan harga.'
        },
        {
          title: 'Mekanisme Pertahanan Volatilitas',
          body: 'Terpicu otomatis saat penurunan harian mencapai ambang: biaya jual naik ke 30%, buyback cadangan dan burn black hole dimulai, pulih otomatis setelah 24 jam.'
        },
        {
          title: 'Mekanisme Distribusi Hasil',
          body: 'Menggunakan pelepasan linear per blok, penyelesaian hasil setiap 12 jam, mendukung periode partisipasi hingga 540 hari.'
        },
        {
          title: 'Mekanisme Turbo',
          body: 'Melalui mekanisme unlock beli dinamis, mengoptimalkan struktur likuiditas pasar dan memperkuat stabilitas ekosistem serta kapasitas pengembangan jangka panjang.'
        }
      ]
    },
    token: {
      eyebrow: 'EKOSISTEM NILAI',
      title: 'Roda nilai multi-aset',
      subtitle: 'Pertumbuhan pengguna → peningkatan likuiditas → ekspansi pembayaran → pertumbuhan ekosistem.',
      cards: [
        {
          label: 'Aset protokol inti',
          description: 'Pencetakan jaminan berlebih 150% · mesin pertumbuhan hasil'
        },
        {
          label: 'Aset penyelesaian inti',
          description: 'Lapisan penyelesaian ekosistem · infrastruktur sirkulasi nilai'
        },
        {
          label: 'Token nilai ekosistem',
          description: 'Pasokan tetap 210 juta · akumulasi nilai berkelanjutan'
        },
        {
          label: 'Bukti penyelesaian hadiah',
          description: 'Dapat ditukar ke AGX · ikut mining ekosistem'
        }
      ]
    },
    roadmap: {
      eyebrow: 'PETA JALAN',
      title: 'Menuju jaringan nilai generasi berikutnya',
      phases: [
        {
          phase: 'PHASE 01',
          time: '2026 Q3',
          title: 'Peluncuran Genesis',
          description: 'Deployment protokol · pencetakan AGX · pool likuiditas USD1',
          dot: '✓',
          side: 'left',
          state: 'current'
        },
        {
          phase: 'PHASE 02',
          time: '2026 Q4',
          title: 'Inti DeFi',
          description: 'Staking Rebase · LP Bond · Burn Bond · AI market making',
          dot: '2',
          side: 'right'
        },
        {
          phase: 'PHASE 03',
          time: '2027 Q1',
          title: 'DAO & Pertumbuhan',
          description: 'Insentif X DAO · tata kelola multisig · node global',
          dot: '3',
          side: 'left'
        },
        {
          phase: 'PHASE 04',
          time: '2027 Q2',
          title: 'Ekonomi AI Agent',
          description: 'Pembayaran otonom · kolaborasi cerdas · jaringan ekonomi AI Agent',
          dot: '4',
          side: 'right'
        },
        {
          phase: 'PHASE 05',
          time: '2027 Q3',
          title: 'Pembayaran Global',
          description: 'Jaringan pembayaran global · integrasi merchant · skenario pembayaran USD1',
          dot: '5',
          side: 'left'
        },
        {
          phase: 'PHASE 06',
          time: '2027 Q4',
          title: 'Jaringan Nilai Masa Depan',
          description: 'Jaringan pembayaran · ekonomi AI Agent · ekosistem nilai',
          dot: '6',
          side: 'right'
        }
      ]
    },
    security: {
      eyebrow: 'KEAMANAN & KEPERCAYAAN',
      title: 'Arsitektur keamanan tingkat AEGIS',
      subtitle: 'Dari arsitektur protokol hingga manajemen aset, keamanan menyeluruh di setiap tahap',
      checks: [
        "Arsitektur non-kustodian · kontrak market maker tidak memiliki izin transfer aset keluar",
        "Kontrak inti open source dan dapat diverifikasi · telah melalui audit keamanan profesional",
        "Mekanisme tata kelola multisig · otoritas inti dikelola bersama",
        "Mekanisme pertahanan dinamis · merespons volatilitas ekstrem secara otomatis"
      ]
    },
    partners: {
      title: 'Infrastruktur Ekosistem'
    },
    faq: {
      eyebrow: 'PELAJARI CEPAT',
      title: 'Pertanyaan Umum',
      items: [
        {
          q: 'Apa itu AEGIS X?',
          a: 'AEGIS X adalah protokol ekosistem USD1 pertama di dunia yang didorong oleh think-tank AI, dengan USD1 sebagai aset penyelesaian inti, menghubungkan AI, DeFi, dan jaringan pembayaran global.',
          open: true
        },
        {
          q: 'Bagaimana AGX dicetak?',
          a: 'AGX diterbitkan melalui mekanisme jaminan berlebih 150%, sebagai aset inti protokol dan pembawa pertumbuhan nilai penting.'
        },
        {
          q: 'Peran apa yang diemban USD1 di AEGIS X?',
          a: 'USD1 adalah aset penyelesaian inti protokol, menyediakan sirkulasi nilai, dukungan likuiditas, dan infrastruktur pembayaran untuk ekosistem.'
        },
        {
          q: 'Bagaimana protokol menjamin keamanan?',
          a: 'Kontrak menggunakan batas non-kustodian, audit, tinjauan open source, dan tata kelola multisig.'
        },
        {
          q: 'Apa itu mekanisme Turbo?',
          a: 'Mekanisme Turbo melalui unlock dinamis dan penyesuaian likuiditas, mengurangi risiko tekanan jual terkonsentrasi dan memperkuat stabilitas pasar serta kapasitas pengembangan jangka panjang.'
        },
        {
          q: 'Bagaimana token X beroperasi?',
          a: 'X adalah token nilai ekosistem dengan pasokan tetap dan mekanisme burn yang didorong protokol.'
        }
      ]
    }
  },
  metrics: [
    {
      value: '150%',
      countTarget: 150,
      suffix: '%',
      label: 'Rasio Jaminan Berlebih'
    },
    {
      value: '100%',
      countTarget: 100,
      suffix: '%',
      label: 'LP Terkunci Permanen'
    },
    {
      value: '24H',
      countTarget: 24,
      suffix: 'H',
      label: 'Mekanisme Pertahanan Dinamis'
    },
    {
      value: '2.1M',
      countTarget: 210,
      suffix: 'M',
      label: 'Pasokan Tetap X'
    }
  ],
  footer: {
    brandCopy: 'Menjaga jaringan nilai masa depan \nAI x DeFi x USD1',
    copyright: '© 2026 AEGIS X DAO. Hak cipta dilindungi.',
    groups: [
      {
        label: 'Protokol',
        ariaLabel: 'Tautan footer protokol',
        links: [
          {
            href: '/app.html',
            label: 'Masuk App'
          },
          {
            linkId: 'whitepaper',
            label: 'Whitepaper'
          },
          {
            linkId: 'docs',
            label: 'Dokumen Proyek'
          },
          {
            linkId: 'economicModel',
            label: 'Model Ekonomi'
          }
        ]
      },
      {
        label: 'Ekosistem',
        ariaLabel: 'Tautan footer ekosistem',
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
            label: 'gAGX'
          }
        ]
      },
      {
        label: 'Komunitas',
        ariaLabel: 'Tautan footer komunitas',
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
