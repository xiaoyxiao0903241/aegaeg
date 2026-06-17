import type { HomeContentBundle } from '~/home/content/types'

const home = {
  "meta": {
    "description": "AEGIS X 是 AI 原生 DeFi 4.0 协议，以 USD1 结算、BSC 优先钱包入口和自修复协议引擎构建下一代价值网络。",
    "title": "AEGIS X - 守护未来价值"
  },
  "nav": {
    "sectionsLabel": "首页区块导航",
    "links": [
      {
        "href": "#protocol",
        "label": "协议"
      },
      {
        "href": "#engine",
        "label": "核心机制"
      },
      {
        "href": "#token",
        "label": "生态价值"
      },
      {
        "href": "#roadmap",
        "label": "路线图"
      },
      {
        "href": "#security",
        "label": "安全"
      },
      {
        "href": "#faq",
        "label": "常见问题"
      }
    ],
    "whitepaper": "白皮书",
    "launchDapp": "启动 DApp",
    "languageLabel": "语言"
  },
  "hero": {
    "guardianLabel": "AEGIS X 守护者",
    "eyebrow": "AI x DeFi x USD1 · DeFi 4.0 协议",
    "title": "守护未来价值",
    "body": "全球首个AI智库驱动的USD1生态协议。以USD1为核心结算资产，连接AI、支付与全球流动性网络。",
    "enterProtocol": "进入协议",
    "readWhitepaper": "阅读白皮书",
    "walletBusy": "正在打开钱包..."
  },
  "sections": {
    "protocol": {
      "eyebrow": "AEGIS X 协议",
      "title": "下一代价值网络核心架构",
      "subtitle": "AI x DeFi x USD1 - 驱动价值流动",
      "cards": [
        {
          "title": "AI 智库",
          "body": "自主风险控制、智能做市与流动性管理全部链上执行。",
          "index": "01"
        },
        {
          "title": "USD1 结算",
          "body": "以 USD1 为核心结算资产，构建稳定的价值流通网络。",
          "index": "02"
        },
        {
          "title": "全球支付",
          "body": "连接 AI Agent、DeFi 与全球支付场景，构建下一代价值网络。",
          "index": "03"
        }
      ]
    },
    "engine": {
      "eyebrow": "核心机制",
      "title": "四大机制，一个智能系统",
      "subtitle": "通过智能决策、动态调节与风险控制，构建可持续运行的价值网络。",
      "cards": [
        {
          "title": "智能做市机制",
          "body": "上涨阶段累积储备资产，增强协议储备能力；回调阶段执行回购与销毁机制，实现价格修复。"
        },
        {
          "title": "波动防御机制",
          "body": "当日跌幅达到阈值自动触发：卖出费率提升至 30%，储备回购与黑洞销毁启动，24 小时后自动恢复。"
        },
        {
          "title": "收益分配机制",
          "body": "采用区块级线性释放机制，每12小时进行一次收益结算，支持最长540天参与周期。"
        },
        {
          "title": "涡轮机制",
          "body": "通过动态买入解锁机制，优化市场流动性结构，增强生态稳定性与长期发展能力。"
        }
      ]
    },
    "token": {
      "eyebrow": "价值生态",
      "title": "多资产价值飞轮",
      "subtitle": "用户增长 → 流动性增强 → 支付扩张 → 生态增长。",
      "cards": [
        {
          "label": "核心协议资产",
          "description": "150% 超额抵押铸造 · 收益增长引擎"
        },
        {
          "label": "核心结算资产",
          "description": "生态结算层 · 价值流通基础设施"
        },
        {
          "label": "生态价值代币",
          "description": "固定总量2.1亿 · 持续价值沉淀"
        },
        {
          "label": "奖励结算凭证",
          "description": "可兑换AGX · 参与生态挖矿"
        }
      ]
    },
    "roadmap": {
      "eyebrow": "路线图",
      "title": "通往下一代价值网络",
      "phases": [
        {
          "phase": "PHASE 01",
          "time": "2026 Q3",
          "title": "创世启动",
          "description": "协议部署 · AGX 铸造 · USD1 流动性池",
          "dot": "✓",
          "side": "left",
          "state": "current"
        },
        {
          "phase": "PHASE 02",
          "time": "2026 Q4",
          "title": "DeFi 核心",
          "description": "Rebase 质押 · LP 债券 · 销毁债券 · AI 做市",
          "dot": "2",
          "side": "right"
        },
        {
          "phase": "PHASE 03",
          "time": "2027 Q1",
          "title": "DAO 与增长",
          "description": "X DAO 激励 · 多签治理 · 全球节点",
          "dot": "3",
          "side": "left"
        },
        {
          "phase": "PHASE 04",
          "time": "2027 Q2",
          "title": "AI Agent 经济",
          "description": "自主支付 · 智能协作 · AI Agent经济网络",
          "dot": "4",
          "side": "right"
        },
        {
          "phase": "PHASE 05",
          "time": "2027 Q3",
          "title": "全球支付",
          "description": "全球支付网络 · 商户接入 · USD1支付场景",
          "dot": "5",
          "side": "left"
        },
        {
          "phase": "PHASE 06",
          "time": "2027 Q4",
          "title": "未来价值网络",
          "description": "支付网络 · AI Agent经济 · 价值生态",
          "dot": "6",
          "side": "right"
        }
      ]
    },
    "security": {
      "eyebrow": "安全与信任",
      "title": "AEGIS级安全架构",
      "subtitle": "从协议架构到资产管理，安全贯穿每一个环节",
      "checks": [
        "非托管架构 · 智能做市合约不具备资产转出权限",
        "核心合约开源可验证 · 通过专业安全审计",
        "多签治理机制 · 核心权限共同管理",
        "动态防御机制 · 自动应对极端波动"
      ]
    },
    "partners": {
      "title": "生态基础设施"
    },
    "faq": {
      "eyebrow": "快速了解",
      "title": "常见问题",
      "items": [
        {
          "question": "AEGIS X 是什么？",
          "answer": "AEGIS X 是全球首个AI智库驱动的USD1生态协议，以USD1为核心结算资产，连接AI、DeFi与全球支付网络。",
          "open": true
        },
        {
          "question": "AGX 如何铸造？",
          "answer": "AGX 通过150%超额抵押机制生成，是协议核心资产与价值增长的重要载体。"
        },
        {
          "question": "USD1 在 AEGIS X 中承担什么角色？",
          "answer": "USD1 是协议核心结算资产，为生态提供价值流通、流动性支持与支付基础设施能力。"
        },
        {
          "question": "协议如何保障安全？",
          "answer": "合约采用非托管边界、审计、开源审查与多签治理。"
        },
        {
          "question": "涡轮机制是什么？",
          "answer": "涡轮机制通过动态解锁与流动性调节机制，降低集中性抛压风险，增强市场稳定性与长期发展能力。",
          "optional": true
        },
        {
          "question": "X 代币如何运作？",
          "answer": "X 是生态价值代币，采用固定总量与协议驱动的销毁机制。"
        }
      ]
    }
  },
  "metrics": [
    {
      "value": "150%",
      "countTarget": 150,
      "suffix": "%",
      "label": "超额抵押率"
    },
    {
      "value": "100%",
      "countTarget": 100,
      "suffix": "%",
      "label": "LP永久锁定"
    },
    {
      "value": "24H",
      "countTarget": 24,
      "suffix": "H",
      "label": "动态防御机制"
    },
    {
      "value": "2.1M",
      "countTarget": 210,
      "suffix": "M",
      "label": "X固定总量"
    }
  ],
  "footer": {
    "brandCopy": "守护未来价值网络 \nAI x DeFi x USD1",
    "copyright": "© 2026 AEGIS X DAO. 保留所有权利。",
    "legal": "服务条款 · 隐私政策 · 免责声明",
    "languageLabel": "语言",
    "groups": [
      {
        "label": "协议",
        "ariaLabel": "协议页脚链接",
        "links": [
          {
            "href": "/app.html",
            "label": "进入 App"
          },
          {
            "href": "#whitepaper",
            "label": "白皮书"
          },
          {
            "href": "#docs",
            "label": "项目文档"
          },
          {
            "href": "#analytics",
            "label": "发展路线图"
          }
        ]
      },
      {
        "label": "生态",
        "ariaLabel": "生态页脚链接",
        "links": [
          {
            "href": "#token",
            "label": "AGX"
          },
          {
            "href": "#token",
            "label": "USD1"
          },
          {
            "href": "#token",
            "label": "X"
          },
          {
            "href": "#token",
            "label": "gGAX"
          }
        ]
      },
      {
        "label": "社区",
        "ariaLabel": "社区页脚链接",
        "links": [
          {
            "href": "#discord",
            "label": "Discord"
          },
          {
            "href": "#twitter",
            "label": "Twitter / X"
          },
          {
            "href": "#telegram",
            "label": "Telegram"
          },
          {
            "href": "#github",
            "label": "GitHub"
          }
        ]
      }
    ]
  }
} satisfies HomeContentBundle

export default home
