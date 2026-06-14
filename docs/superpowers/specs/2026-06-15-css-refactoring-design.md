# AEGIS X CSS 重构设计规范

**日期**: 2026-06-15  
**状态**: Draft  
**作者**: Claude Code + S1m0nE

## 执行摘要

将 AEGIS X 项目从传统 CSS 类系统迁移到基于 shadcn/ui + Tailwind CSS v4 + tailwind-variants 的现代化设计系统。目标是达到世界级的代码质量标准：可维护性、性能、类型安全、响应式一致性和可访问性。

### 核心决策

- ✅ **CSS 变量**: 完全采用 oklch 色彩空间
- ✅ **设计系统**: 遵循 shadcn/ui 规范
- ✅ **组件库**: 使用 tailwind-variants 增强 Tailwind
- ✅ **组件位置**: shadcn 组件统一放在 `src/components/`
- ✅ **重构策略**: 渐进式迁移，分 4 个阶段
- ✅ **i18n**: 使用 react-i18next，支持延迟加载
- ✅ **性能**: 保持纯 React SPA，不使用预编译 HTML

---

## 技术栈

### 核心依赖

```json
{
  "dependencies": {
    "@radix-ui/react-slot": "^1.1.0",
    "tailwindcss": "^4.3.0",
    "@tailwindcss/vite": "^4.3.0",
    "tailwind-variants": "^0.2.1",
    "react-i18next": "^14.1.0",
    "i18next": "^23.11.0",
    "i18next-browser-languagedetector": "^7.2.0"
  },
  "devDependencies": {
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.3.0"
  }
}
```

### 为什么选择 tailwind-variants？

相比 `class-variance-authority` (cva)，`tailwind-variants` 提供：

- ✅ **更好的性能** - 编译时优化
- ✅ **更小的 bundle** - ~2.5KB vs cva 的 ~4KB
- ✅ **更好的类型推断** - 无需手动类型注解
- ✅ **更灵活的 API** - 支持 slots、compound variants、响应式变体
- ✅ **内置 Tailwind 支持** - 无需额外配置

```typescript
// tailwind-variants 示例
import { tv } from 'tailwind-variants'

const button = tv({
  base: 'font-semibold rounded-full',
  variants: {
    color: {
      primary: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
    },
    size: {
      sm: 'h-9 px-4',
      md: 'h-11 px-5',
    },
  },
  compoundVariants: [
    {
      color: 'primary',
      size: 'md',
      class: 'shadow-lg',
    },
  ],
  defaultVariants: {
    color: 'primary',
    size: 'md',
  },
})
```

---

## 目录

1. [架构设计](#架构设计)
2. [技术栈](#技术栈)
3. [设计系统](#设计系统)
4. [组件系统](#组件系统)
5. [i18n 国际化](#i18n-国际化)
6. [性能优化](#性能优化)
7. [实施路线图](#实施路线图)
8. [迁移指南](#迁移指南)

---

## 技术栈

### 核心依赖

```json
{
  "dependencies": {
    "@radix-ui/react-slot": "^1.1.0",
    "tailwindcss": "^4.3.0",
    "@tailwindcss/vite": "^4.3.0",
    "tailwind-variants": "^0.2.1",
    "react-i18next": "^14.1.0",
    "i18next": "^23.11.0",
    "i18next-browser-languagedetector": "^7.2.0"
  },
  "devDependencies": {
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.3.0"
  }
}
```

### 为什么选择 tailwind-variants？

相比 `class-variance-authority` (cva)，`tailwind-variants` 提供：

- ✅ **更好的性能** - 编译时优化
- ✅ **更小的 bundle** - ~2.5KB vs cva 的 ~4KB
- ✅ **更好的类型推断** - 无需手动类型注解
- ✅ **更灵活的 API** - 支持 slots、compound variants、响应式变体
- ✅ **内置 Tailwind 支持** - 无需额外配置

```typescript
// tailwind-variants 示例
import { tv } from 'tailwind-variants'

const button = tv({
  base: 'font-semibold rounded-full',
  variants: {
    color: {
      primary: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
    },
    size: {
      sm: 'h-9 px-4',
      md: 'h-11 px-5',
    },
  },
  compoundVariants: [
    {
      color: 'primary',
      size: 'md',
      class: 'shadow-lg',
    },
  ],
  defaultVariants: {
    color: 'primary',
    size: 'md',
  },
})
```

---

## 架构设计

### 分层架构

```
┌─────────────────────────────────────────────────────┐
│  第四层: 动画与状态 (Animation Layer)                │
│  - 复杂动画关键帧                                    │
│  - 状态机驱动的样式                                  │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│  第三层: 业务组件 (Business Layer)                   │
│  - SwapCard, MetricCard, DappTopbar 等               │
│  - 混合使用: 简单布局用 Tailwind, 复杂组件用 variants│
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│  第二层: 组件系统 (Component Layer)                  │
│  - shadcn 组件: Button, Card, Input 等               │
│  - tailwind-variants 封装可复用变体                  │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│  第一层: 设计基础 (Foundation Layer)                 │
│  - Tailwind v4 + oklch 色彩空间                      │
│  - shadcn 标准 CSS 变量                              │
│  - 响应式断点系统                                    │
└─────────────────────────────────────────────────────┘
```

### 设计原则

1. **渐进式重构** - 分阶段迁移，保持系统可运行
2. **类型安全优先** - 所有样式 props 都有 TypeScript 约束
3. **性能优先** - 代码分割、懒加载、最小化 CSS bundle
4. **可访问性** - WCAG 2.1 AA 标准
5. **开发体验** - IDE 智能提示、组件文档、Storybook

---

## 技术栈

### 核心依赖

```json
{
  "dependencies": {
    "@radix-ui/react-slot": "^1.1.0",
    "tailwindcss": "^4.3.0",
    "@tailwindcss/vite": "^4.3.0",
    "tailwind-variants": "^0.2.1",
    "react-i18next": "^14.1.0",
    "i18next": "^23.11.0",
    "i18next-browser-languagedetector": "^7.2.0"
  },
  "devDependencies": {
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.3.0"
  }
}
```

### 为什么选择 tailwind-variants？

相比 `class-variance-authority` (cva)，`tailwind-variants` 提供：

- ✅ **更好的性能** - 编译时优化
- ✅ **更小的 bundle** - ~2.5KB vs cva 的 ~4KB
- ✅ **更好的类型推断** - 无需手动类型注解
- ✅ **更灵活的 API** - 支持 slots、compound variants、响应式变体
- ✅ **内置 Tailwind 支持** - 无需额外配置

```typescript
// tailwind-variants 示例
import { tv } from 'tailwind-variants'

const button = tv({
  base: 'font-semibold rounded-full',
  variants: {
    color: {
      primary: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
    },
    size: {
      sm: 'h-9 px-4',
      md: 'h-11 px-5',
    },
  },
  compoundVariants: [
    {
      color: 'primary',
      size: 'md',
      class: 'shadow-lg',
    },
  ],
  defaultVariants: {
    color: 'primary',
    size: 'md',
  },
})
```

---

## 设计系统

### CSS 变量（shadcn + oklch）

```css
/* src/styles/theme.css */
@layer base {
  :root {
    /* shadcn 标准变量 - 全部使用 oklch 格式 */
    --background: 97.29% 0.0029 264.54;
    --foreground: 16.35% 0.0136 264.09;
    --card: 100% 0 89.88;
    --card-foreground: 16.35% 0.0136 264.09;
    --primary: 66.83% 0.1625 36.6;
    --primary-foreground: 100% 0 89.88;
    --border: 94.87% 0.0058 264.53;
    --ring: 66.83% 0.1625 36.6;
    --radius: 16px;
    
    /* 项目扩展 */
    --coral: 60.32% 0.1448 36.02;
    --success: 69.46% 0.1551 159.22;
    --dark: 19.25% 0.0189 270.25;
  }
}
```

### 变量映射

| 旧变量 | 新变量 | Tailwind 类 |
|---|---|---|
| `--aegis-surface` | `--card` | `bg-card` |
| `--aegis-ink` | `--foreground` | `text-foreground` |
| `--aegis-coral-button` | `--primary` | `bg-primary` |

---

## 组件系统

### 目录结构

```
src/
├── components/
│   ├── button.tsx              # shadcn Button
│   ├── card.tsx                # shadcn Card
│   ├── input.tsx               # shadcn Input
│   ├── accordion.tsx           # shadcn Accordion
│   ├── carousel.tsx            # shadcn Carousel
│   ├── language-menu.tsx       # 业务组件
│   └── ...
├── lib/
│   └── utils.ts                # cn() 工具
└── styles/
    ├── globals.css
    ├── theme.css
    └── animations.css
```

### Button 组件（完整示例）

```typescript
// src/components/button.tsx
import { Slot } from '@radix-ui/react-slot'
import { tv, type VariantProps } from 'tailwind-variants'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = tv({
  base: [
    'inline-flex items-center justify-center gap-2',
    'whitespace-nowrap rounded-full',
    'text-sm font-semibold tracking-normal',
    'ring-offset-background',
    'transition-all duration-180',
    'focus-visible:outline-none focus-visible:ring-2',
    'focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground hover:-translate-y-px hover:shadow-lg',
      outline: 'border border-input bg-background hover:bg-accent hover:-translate-y-px',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
    },
    size: {
      default: 'h-11 px-5',
      sm: 'h-9 px-4',
      lg: 'h-12 px-6',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
```


---

## i18n 国际化

### 为什么选择 react-i18next？

- ✅ **业界标准** - React 生态最成熟的 i18n 方案
- ✅ **延迟加载** - 按需加载语言包，减少首屏体积
- ✅ **类型安全** - 支持 TypeScript 类型推断
- ✅ **丰富的功能** - 插值、复数、上下文、命名空间等
- ✅ **SSR 兼容** - 未来如需 SSR 可平滑迁移

### 配置方案

```typescript
// src/i18n/config.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'zh'],
    
    // 延迟加载配置
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    // 命名空间分割
    ns: ['common', 'home', 'dapp'],
    defaultNS: 'common',
    
    // 性能优化
    load: 'languageOnly', // 只加载 'en' 不加载 'en-US'
    
    interpolation: {
      escapeValue: false, // React 已经转义
    },
  })

export default i18n
```

### 延迟加载策略

```typescript
// src/i18n/lazy-loader.ts
import i18n from './config'

// 路由级别的语言包懒加载
export async function loadNamespace(ns: string) {
  if (!i18n.hasResourceBundle(i18n.language, ns)) {
    await i18n.loadNamespaces(ns)
  }
}

// 使用示例：在路由组件中
export function HomePage() {
  useEffect(() => {
    loadNamespace('home')
  }, [])
  
  const { t } = useTranslation('home')
  return <h1>{t('hero.title')}</h1>
}
```

### 类型安全

```typescript
// src/i18n/types.ts
import 'react-i18next'
import type en from './locales/en/common.json'

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: {
      common: typeof en
      home: typeof import('./locales/en/home.json')
      dapp: typeof import('./locales/en/dapp.json')
    }
  }
}
```

### 迁移策略

```typescript
// 从现有系统迁移
// ❌ 旧方式
const { messages } = useI18n()
const text = messages.swap.balance

// ✅ 新方式
const { t } = useTranslation('dapp')
const text = t('swap.balance')
```

---

## 性能优化

### 首屏加载优化

#### 1. 代码分割策略

```typescript
// src/App.tsx
import { lazy, Suspense } from 'react'

// 路由懒加载
const HomePage = lazy(() => import('./home/HomePage'))
const DappShell = lazy(() => import('./app/DappShell'))

export function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Router>
        <Route path="/" element={<HomePage />} />
        <Route path="/dapp" element={<DappShell />} />
      </Router>
    </Suspense>
  )
}
```

#### 2. 语言包按需加载

```json
// 首屏只加载 common 命名空间（~2KB）
{
  "common": {
    "connectWallet": "Connect Wallet",
    "language": "Language"
  }
}

// 进入 DApp 后再加载 dapp 命名空间（~8KB）
// 进入首页后再加载 home 命名空间（~5KB）
```

#### 3. CSS 优化

```typescript
// vite.config.ts
export default {
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer(),
      ],
    },
  },
  build: {
    // CSS 代码分割
    cssCodeSplit: true,
    
    // 分块策略
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'ui': ['@radix-ui/react-slot', 'tailwind-variants'],
          'i18n': ['react-i18next', 'i18next'],
        },
      },
    },
  },
}
```

### 性能目标

| 指标 | 目标值 | 当前值 | 优化方案 |
|---|---|---|---|
| 首屏 FCP | < 1.5s | ~2.1s | 代码分割 + 预加载 |
| TTI | < 3.5s | ~4.2s | 懒加载 + Tree shaking |
| CSS Bundle | < 20KB | ~85KB | Tailwind JIT + PurgeCSS |
| JS Bundle (main) | < 150KB | ~220KB | 动态导入 + 路由分割 |
| Lighthouse | > 90 | 78 | 综合优化 |

### 不使用预编译 HTML 的理由

1. **开发体验** - 保持热更新的即时性
2. **动态内容** - DApp 数据完全动态，预编译无意义
3. **部署简单** - 单一构建产物，无需 SSR 服务器
4. **SEO 不敏感** - Web3 DApp 用户直接访问，非搜索引擎流量

### 优化方案

```html
<!-- public/index.html -->
<!DOCTYPE html>
<html>
<head>
  <!-- 预加载关键资源 -->
  <link rel="preload" href="/assets/fonts/montserrat.woff2" as="font" crossorigin>
  
  <!-- 预连接第三方域名 -->
  <link rel="preconnect" href="https://thirdweb.com">
  
  <!-- 内联关键 CSS（首屏必需） -->
  <style>
    /* 加载动画 + 基础样式（< 1KB） */
  </style>
</head>
<body>
  <div id="root"></div>
</body>
</html>
```

---

## 实施路线图

### 阶段 1：基础设施（3 天）

**目标**: 建立新的设计系统基础

#### 任务清单

- [ ] 安装依赖
  ```bash
  pnpm add tailwind-variants clsx tailwind-merge
  pnpm add @radix-ui/react-slot
  pnpm add react-i18next i18next i18next-browser-languagedetector
  ```

- [ ] 创建工具函数
  - `src/lib/utils.ts` - cn() 工具
  - `src/i18n/config.ts` - i18n 配置

- [ ] 重写 CSS 变量
  - `src/styles/theme.css` - shadcn 变量定义
  - `src/styles/globals.css` - Tailwind 基础层
  - 删除 `src/styles/shared.css`

- [ ] 配置 Tailwind
  - 更新 `tailwind.config.ts`
  - 配置 oklch 色彩空间
  - 设置响应式断点

**验收标准**:
- ✅ 所有依赖安装成功
- ✅ 开发服务器正常启动
- ✅ CSS 变量可在浏览器中访问
- ✅ TypeScript 无编译错误

---

### 阶段 2：shadcn 组件迁移（5 天）

**目标**: 创建可复用的基础组件

#### 任务清单

**Day 1-2: 核心组件**
- [ ] Button (`src/components/button.tsx`)
- [ ] Card (`src/components/card.tsx`)
- [ ] Input (`src/components/input.tsx`)
- [ ] 为每个组件编写单元测试

**Day 3-4: 扩展组件**
- [ ] Select / Dropdown
- [ ] Tabs / PillTabs
- [ ] Dialog / Modal
- [ ] Tooltip

**Day 5: 集成测试**
- [ ] Storybook 集成（可选）
- [ ] 视觉回归测试
- [ ] 可访问性测试

**验收标准**:
- ✅ 所有组件支持 variants
- ✅ TypeScript 类型完整
- ✅ 支持 forwardRef
- ✅ 可访问性符合 WCAG 2.1 AA

---

### 阶段 3：业务组件重构（7 天）

**目标**: 迁移现有业务组件到新系统

#### 任务清单

**Day 1-2: 首页 (HomePage)**
- [ ] 迁移 `home.css` 到 Tailwind utilities
- [ ] 重构 Hero、Metrics、Timeline 组件
- [ ] 配置 i18n 懒加载 (home 命名空间)

**Day 3-4: DApp 布局**
- [ ] DappTopbar 组件重构
- [ ] DappWindow 布局系统
- [ ] DappRail 侧边栏

**Day 5-7: DApp 页面**
- [ ] SwapTab 重构
- [ ] GenesisTab 重构
- [ ] RewardsTab 重构
- [ ] CommunityTab 重构

**验收标准**:
- ✅ UI 像素级还原（对比 Figma）
- ✅ 所有交互功能正常
- ✅ 响应式适配完整
- ✅ E2E 测试通过

---

### 阶段 4：清理与优化（2 天）

**目标**: 删除旧代码，优化性能

#### 任务清单

**Day 1: 清理**
- [ ] 删除 `src/styles/dapp.css` (2871 行)
- [ ] 删除 `src/styles/home.css` (479 行)
- [ ] 删除 `src/components/primitiveStyles.ts`
- [ ] 删除旧的 i18n 实现 (`src/i18n/useI18n.ts`)
- [ ] 更新所有 import 路径

**Day 2: 优化**
- [ ] Bundle 分析 (`pnpm build --report`)
- [ ] Tree shaking 验证
- [ ] Lighthouse 性能测试
- [ ] 可访问性审计

**验收标准**:
- ✅ CSS bundle < 20KB (gzip)
- ✅ JS bundle (main) < 150KB (gzip)
- ✅ Lighthouse 分数 > 90
- ✅ 无 TypeScript 错误
- ✅ 无控制台警告

---

## 迁移指南

### 组件迁移模式

#### 模式 1: 简单布局 → Tailwind Utilities

```typescript
// ❌ 旧的方式
<div className="dapp-topbar">
  <a className="brand">AEGIS X</a>
  <div className="dapp-top-actions">
    <button className="dapp-language">EN</button>
  </div>
</div>

// ✅ 新的方式
<header className="flex items-center justify-between gap-6 px-[26px] py-[18px] min-h-[76px]">
  <a className="flex items-center gap-[11px] text-lg font-semibold text-foreground">
    AEGIS X
  </a>
  <div className="flex items-center gap-[10px]">
    <Button variant="outline" size="sm">EN</Button>
  </div>
</header>
```

#### 模式 2: 卡片组件 → shadcn Card

```typescript
// ❌ 旧的方式
<article className="metric-card">
  <span className="metric-label">TVL</span>
  <strong className="metric-value">$2.4M</strong>
  <small className="metric-hint">+12.5% from last month</small>
</article>

// ✅ 新的方式
<Card className="p-[18px]">
  <p className="text-xs text-muted-foreground">TVL</p>
  <p className="mt-1.5 text-[22px] font-bold">$2.4M</p>
  <p className="mt-[7px] text-xs text-muted-foreground">+12.5% from last month</p>
</Card>
```

#### 模式 3: 复杂组件 → tailwind-variants

```typescript
// src/app/components/swap-card.tsx
import { tv } from 'tailwind-variants'
import { Card } from '@/components/card'

const swapCardVariants = tv({
  slots: {
    base: 'mt-3.5 p-4 max-sm:mt-3',
    label: 'text-xs text-muted-foreground',
    amountRow: 'mt-[9px] flex items-center justify-between gap-3',
    input: 'w-full text-right text-[22px] font-bold text-foreground outline-none',
  },
})

export function SwapCard({ token, amount, balance }) {
  const styles = swapCardVariants()
  
  return (
    <Card className={styles.base()}>
      <div className="flex items-center justify-between">
        <p className={styles.label()}>{token}</p>
        <p className={styles.label()}>{balance}</p>
      </div>
      <div className={styles.amountRow()}>
        <TokenIcon />
        <input className={styles.input()} value={amount} />
      </div>
    </Card>
  )
}
```

### CSS 变量替换脚本

```bash
# 自动化替换脚本
# scripts/migrate-css-vars.sh

#!/bin/bash

# 定义替换映射
declare -A VAR_MAP=(
  ["--aegis-surface"]="--card"
  ["--aegis-ink"]="--foreground"
  ["--aegis-body"]="--muted-foreground"
  ["--aegis-border"]="--border"
  ["--aegis-coral-button"]="--primary"
  ["--aegis-coral-soft"]="--accent"
  ["--aegis-page"]="--background"
)

# 遍历所有 .tsx 和 .ts 文件
for file in $(find src -name "*.tsx" -o -name "*.ts"); do
  for old_var in "${!VAR_MAP[@]}"; do
    new_var="${VAR_MAP[$old_var]}"
    sed -i '' "s/var($old_var)/oklch(var($new_var))/g" "$file"
  done
done

echo "✅ CSS 变量迁移完成"
```

### i18n 迁移

```typescript
// 1. 重组翻译文件
// ❌ 旧结构
src/i18n/messages/en.ts  // 所有翻译在一个文件

// ✅ 新结构
public/locales/
├── en/
│   ├── common.json   // 全局通用
│   ├── home.json     // 首页
│   └── dapp.json     // DApp
└── zh/
    ├── common.json
    ├── home.json
    └── dapp.json

// 2. 更新组件
// ❌ 旧方式
const { messages: t } = useI18n()
const text = t.swap.balance

// ✅ 新方式
const { t } = useTranslation('dapp')
const text = t('swap.balance')
```

### 响应式迁移

```typescript
// ❌ 旧方式（CSS 媒体查询）
@media (max-width: 820px) {
  .dapp-topbar {
    min-height: 60px;
    padding: 12px 16px;
  }
}

// ✅ 新方式（Tailwind 响应式）
<header className="min-h-[76px] px-[26px] py-[18px] max-sm:min-h-[60px] max-sm:px-4 max-sm:py-3">
```

---

## 风险与缓解

### 风险 1: 样式不一致

**风险**: 迁移过程中新旧样式冲突

**缓解**:
- 使用视觉回归测试（Playwright + screenshots）
- 每个阶段完成后与 Figma 逐像素对比
- 保留旧 CSS 文件直到完全迁移完成

### 风险 2: 性能回退

**风险**: 新系统可能影响首屏性能

**缓解**:
- 每个阶段运行 Lighthouse 测试
- 监控 bundle 大小变化
- 使用 code splitting 和懒加载

### 风险 3: 类型错误

**风险**: TypeScript 类型定义不完整

**缓解**:
- 所有组件必须有完整的 Props 类型
- 启用 `strict` 模式
- 使用 `satisfies` 操作符验证类型

---

## 成功标准

### 技术指标

- ✅ **CSS Bundle**: < 20KB (当前 ~85KB)
- ✅ **JS Bundle**: < 150KB (当前 ~220KB)
- ✅ **Lighthouse**: > 90 (当前 78)
- ✅ **TypeScript**: 0 错误
- ✅ **E2E 测试**: 100% 通过

### 代码质量

- ✅ **可维护性**: 所有组件 < 200 行
- ✅ **可复用性**: shadcn 组件可跨项目使用
- ✅ **类型安全**: 100% TypeScript 覆盖
- ✅ **可访问性**: WCAG 2.1 AA 合规

### 开发体验

- ✅ **IDE 支持**: 智能提示和类型检查
- ✅ **文档**: 每个组件有清晰的 API 文档
- ✅ **可测试性**: 单元测试覆盖率 > 80%

---

## 参考资源

- [shadcn/ui 官方文档](https://ui.shadcn.com)
- [Tailwind CSS v4 文档](https://tailwindcss.com/docs)
- [tailwind-variants 文档](https://www.tailwind-variants.org)
- [react-i18next 文档](https://react.i18next.com)
- [OKLCH 色彩空间介绍](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl)

