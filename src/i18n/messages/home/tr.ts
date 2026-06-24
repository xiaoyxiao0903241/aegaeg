import { defineMessages } from '~/i18n/messages/define-messages'
import type { HomeMessagesBundle } from './types'

const home = defineMessages({
  meta: {
    description: 'AEGIS X, AI-native DeFi 4.0 protokolüdür; USD1 uzlaşması, BSC öncelikli cüzdan girişi ve kendi kendini onaran protokol motoruyla geleceğin değer ağını inşa eder.',
    title: 'AEGIS X - Geleceğin Değer Ağını Koruyun'
  },
  nav: {
    sectionsLabel: 'Ana sayfa bölüm navigasyonu',
    links: [
      {
        href: '#protocol',
        label: 'Protokol'
      },
      {
        href: '#engine',
        label: 'Temel Mekanizmalar'
      },
      {
        href: '#token',
        label: 'Ekosistem Değeri'
      },
      {
        href: '#roadmap',
        label: 'Yol Haritası'
      },
      {
        href: '#security',
        label: 'Güvenlik'
      },
      {
        href: '#faq',
        label: 'SSS'
      }
    ],
    whitepaper: 'Beyaz Kağıt',
    enterApp: 'App’e Git',
    languageLabel: 'Dil'
  },
  hero: {
    guardianLabel: 'AEGIS X Muhafızı',
    eyebrow: 'AI x DeFi x USD1 · DeFi 4.0 Protokolü',
    title: 'Geleceğin Değer Ağını Koruyun',
    body: 'Dünyanın ilk AI think tank destekli USD1 ekosistem protokolü. USD1 temel uzlaşma varlığı olarak AI, ödeme ve küresel likidite ağını birbirine bağlar.',
    enterProtocol: 'Protokole Gir',
    readWhitepaper: 'Beyaz Kağıdı Oku',
  },
  sections: {
    protocol: {
      eyebrow: 'AEGIS X Protokolü',
      title: 'Geleceğin Değer Ağı Çekirdek Mimarisi',
      subtitle: 'AI x DeFi x USD1 - Değer akışını yönlendirir',
      cards: [
        {
          title: 'AI Think Tank',
          body: 'Otonom risk kontrolü, akıllı piyasa yapıcılığı ve likidite yönetimi zincir üstü yürütülür.',
          index: '01'
        },
        {
          title: 'USD1 Uzlaşması',
          body: 'USD1 temel uzlaşma varlığı olarak stabil bir değer dolaşım ağı inşa eder.',
          index: '02'
        },
        {
          title: 'Küresel Ödeme',
          body: 'AI Agent, DeFi ve küresel ödeme senaryolarını birbirine bağlayarak geleceğin değer ağını inşa eder.',
          index: '03'
        }
      ]
    },
    engine: {
      eyebrow: 'Temel Mekanizmalar',
      title: 'Dört Mekanizma, Tek Akıllı Sistem',
      subtitle: 'Akıllı karar verme, dinamik ayarlama ve risk kontrolüyle sürdürülebilir bir değer ağı oluşturur.',
      cards: [
        {
          title: 'Akıllı Piyasa Yapıcılığı Mekanizması',
          body: 'Yükseliş aşamasında rezerv varlıkları biriktirerek protokol rezerv kapasitesini güçlendirir; düzeltme aşamasında geri alım ve yakım mekanizması çalışarak fiyat onarımı sağlar.'
        },
        {
          title: 'Dalgalanma Savunma Mekanizması',
          body: 'Günlük düşüş eşiğine ulaşıldığında otomatik tetiklenir: satış ücreti %30’a çıkar, rezerv geri alımı ve kara delik yakımı başlar, 24 saat sonra otomatik olarak normale döner.'
        },
        {
          title: 'Getiri Dağılım Mekanizması',
          body: 'Blok düzeyinde doğrusal kilit açma mekanizması kullanır; her 12 saatte bir getiri uzlaşması yapılır ve maksimum 540 günlük katılım döngüsü desteklenir.'
        },
        {
          title: 'Türbin Mekanizması',
          body: 'Dinamik alım kilit açma mekanizması ile piyasa likidite yapısını optimize eder, ekosistem istikrarını ve uzun vadeli gelişim kapasitesini artırır.'
        }
      ]
    },
    token: {
      eyebrow: 'Değer Ekosistemi',
      title: 'Çok Varlıklı Değer Çarkı',
      subtitle: 'Kullanıcı büyümesi → Likidite artışı → Ödeme genişlemesi → Ekosistem büyümesi.',
      cards: [
        {
          label: 'Temel Protokol Varlığı',
          description: '%150 aşırı teminat ile basım · Getiri büyüme motoru'
        },
        {
          label: 'Temel Uzlaşma Varlığı',
          description: 'Ekosistem uzlaşma katmanı · Değer dolaşımı altyapısı'
        },
        {
          label: 'Ekosistem Değer Tokenı',
          description: 'Sabit toplam 210 milyon · Sürekli değer birikimi'
        },
        {
          label: 'Ödül Uzlaşma Belgesi',
          description: 'AGX ile değiştirilebilir · Ekosistem madenciliğine katılım'
        }
      ]
    },
    roadmap: {
      eyebrow: 'Yol Haritası',
      title: 'Geleceğin Değer Ağına Giden Yol',
      phases: [
        {
          phase: 'PHASE 01',
          time: '2026 Q3',
          title: 'Genesis Başlangıç',
          description: 'Protokol dağıtımı · AGX basımı · USD1 likidite havuzu',
          dot: '✓',
          side: 'left',
          state: 'current'
        },
        {
          phase: 'PHASE 02',
          time: '2026 Q4',
          title: 'DeFi Çekirdeği',
          description: 'Rebase stake · LP tahvili · Yakım tahvili · AI piyasa yapıcılığı',
          dot: '2',
          side: 'right'
        },
        {
          phase: 'PHASE 03',
          time: '2027 Q1',
          title: 'DAO ve Büyüme',
          description: 'X DAO teşvikleri · Çok imzalı yönetim · Küresel düğümler',
          dot: '3',
          side: 'left'
        },
        {
          phase: 'PHASE 04',
          time: '2027 Q2',
          title: 'AI Agent Ekonomisi',
          description: 'Otonom ödeme · Akıllı işbirliği · AI Agent ekonomi ağı',
          dot: '4',
          side: 'right'
        },
        {
          phase: 'PHASE 05',
          time: '2027 Q3',
          title: 'Küresel Ödeme',
          description: 'Küresel ödeme ağı · Satıcı entegrasyonu · USD1 ödeme senaryoları',
          dot: '5',
          side: 'left'
        },
        {
          phase: 'PHASE 06',
          time: '2027 Q4',
          title: 'Geleceğin Değer Ağı',
          description: 'Ödeme ağı · AI Agent ekonomisi · Değer ekosistemi',
          dot: '6',
          side: 'right'
        }
      ]
    },
    security: {
      eyebrow: 'Güvenlik ve Güven',
      title: 'AEGIS Seviyesinde Güvenlik Mimarisi',
      subtitle: 'Protokol mimarisinden varlık yönetimine, güvenlik her aşamaya nüfuz eder',
      checks: [
        "Gözetimsiz mimari · Akıllı piyasa yapıcı sözleşmesi varlık çekme yetkisine sahip değildir",
        "Temel sözleşmeler açık kaynak ve doğrulanabilir · Profesyonel güvenlik denetiminden geçmiştir",
        "Çok imzalı yönetim mekanizması · Temel yetkiler ortaklaşa yönetilir",
        "Dinamik savunma mekanizması · Aşırı dalgalanmalara otomatik yanıt verir"
      ]
    },
    partners: {
      title: 'Ekosistem Altyapısı'
    },
    faq: {
      eyebrow: 'Hızlı Bilgi',
      title: 'Sıkça Sorulan Sorular',
      items: [
        {
          q: 'AEGIS X nedir?',
          a: 'AEGIS X, dünyanın ilk AI think tank destekli USD1 ekosistem protokolüdür; USD1 temel uzlaşma varlığı olarak AI, DeFi ve küresel ödeme ağını birbirine bağlar.',
          open: true
        },
        {
          q: 'AGX nasıl basılır?',
          a: 'AGX, %150 aşırı teminat mekanizmasıyla oluşturulur ve protokolün temel varlığı ile değer büyümesinin önemli taşıyıcısıdır.'
        },
        {
          q: 'USD1, AEGIS X içinde hangi rolü üstlenir?',
          a: 'USD1, protokolün temel uzlaşma varlığıdır; ekosisteme değer dolaşımı, likidite desteği ve ödeme altyapısı yetenekleri sağlar.'
        },
        {
          q: 'Protokol güvenliği nasıl sağlanır?',
          a: 'Sözleşmeler gözetimsiz sınırlar, denetim, açık kaynak incelemesi ve çok imzalı yönetim kullanır.'
        },
        {
          q: 'Türbin mekanizması nedir?',
          a: 'Türbin mekanizması, dinamik kilit açma ve likidite ayarlama mekanizmasıyla yoğun satış baskısı riskini azaltır, piyasa istikrarını ve uzun vadeli gelişim kapasitesini artırır.'
        },
        {
          q: 'X tokenı nasıl çalışır?',
          a: 'X, ekosistem değer tokenıdır; sabit toplam ve protokol tarafından yönlendirilen yakım mekanizması kullanır.'
        }
      ]
    }
  },
  metrics: [
    {
      value: '150%',
      countTarget: 150,
      suffix: '%',
      label: 'Aşırı Teminat Oranı'
    },
    {
      value: '100%',
      countTarget: 100,
      suffix: '%',
      label: 'LP Kalıcı Kilit'
    },
    {
      value: '24H',
      countTarget: 24,
      suffix: 'H',
      label: 'Dinamik Savunma Mekanizması'
    },
    {
      value: '2.1M',
      countTarget: 210,
      suffix: 'M',
      label: 'X Sabit Toplam'
    }
  ],
  footer: {
    brandCopy: 'Geleceğin Değer Ağını Koruyun \nAI x DeFi x USD1',
    copyright: '© 2026 AEGIS X DAO. Tüm hakları saklıdır.',
    groups: [
      {
        label: 'Protokol',
        ariaLabel: 'Protokol altbilgi bağlantıları',
        links: [
          {
            href: '/app.html',
            label: 'App’e Git'
          },
          {
            linkId: 'whitepaper',
            label: 'Beyaz Kağıt'
          },
          {
            linkId: 'docs',
            label: 'Proje Dokümanları'
          },
          {
            linkId: 'economicModel',
            label: 'Ekonomik Model'
          }
        ]
      },
      {
        label: 'Ekosistem',
        ariaLabel: 'Ekosistem altbilgi bağlantıları',
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
        label: 'Topluluk',
        ariaLabel: 'Topluluk altbilgi bağlantıları',
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
