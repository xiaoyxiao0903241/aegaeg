# 阶段 1：基础设施 - 详细任务清单

**预计时间**: 3 天  
**目标**: 建立新的设计系统基础

---

## Day 1: 依赖安装与工具配置

### Task 1.1: 安装核心依赖 ⏱️ 30min

```bash
# 安装 tailwind-variants 和工具库
pnpm add tailwind-variants clsx tailwind-merge

# 安装 Radix UI（shadcn 依赖）
pnpm add @radix-ui/react-slot

# 安装 i18n 库
pnpm add react-i18next i18next i18next-browser-languagedetector

# 验证安装
pnpm list | grep -E "(tailwind-variants|clsx|react-i18next)"
```

**验收标准**:
- [ ] 所有依赖成功安装
- [ ] `package.json` 中版本正确
- [ ] `pnpm install` 无错误

---

### Task 1.2: 创建工具函数 ⏱️ 15min

**文件**: `src/lib/utils.ts`

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**验收标准**:
- [ ] 文件创建成功
- [ ] TypeScript 编译无错误
- [ ] 可以从其他文件导入使用

---

### Task 1.3: 配置 i18n 基础 ⏱️ 45min

**步骤 1**: 创建配置文件 `src/i18n/config.ts`

```typescript
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
    ns: ['common', 'home', 'dapp'],
    defaultNS: 'common',
    
    // 性能优化
    load: 'languageOnly',
    
    interpolation: {
      escapeValue: false,
    },
    
    // 开发环境配置
    debug: import.meta.env.DEV,
  })

export default i18n
```

**步骤 2**: 创建类型定义 `src/i18n/types.ts`

```typescript
import 'react-i18next'

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
  }
}
```

**步骤 3**: 在 `src/main.tsx` 中初始化

```typescript
import './i18n/config'
```

**验收标准**:
- [ ] i18n 配置文件创建
- [ ] TypeScript 类型定义完成
- [ ] 应用启动时 i18n 正确初始化
- [ ] 控制台无错误

---

## Day 2: CSS 变量与 Tailwind 配置

### Task 2.1: 创建新的 theme.css ⏱️ 1h

**文件**: `src/styles/theme.css`

```css
@layer base {
  :root {
    /* shadcn 标准变量 - oklch 格式 */
    --background: 97.29% 0.0029 264.54;
    --foreground: 16.35% 0.0136 264.09;
    
    --card: 100% 0 89.88;
    --card-foreground: 16.35% 0.0136 264.09;
    
    --popover: 100% 0 89.88;
    --popover-foreground: 16.35% 0.0136 264.09;
    
    --primary: 66.83% 0.1625 36.6;
    --primary-foreground: 100% 0 89.88;
    
    --secondary: 94.83% 0.0075 260.73;
    --secondary-foreground: 16.35% 0.0136 264.09;
    
    --muted: 94.83% 0.0075 260.73;
    --muted-foreground: 50% 0 0;
    
    --accent: 94.92% 0.0224 45.6;
    --accent-foreground: 60.32% 0.1448 36.02;
    
    --destructive: 62% 0.2 25;
    --destructive-foreground: 100% 0 89.88;
    
    --border: 94.87% 0.0058 264.53;
    --input: 94.87% 0.0058 264.53;
    --ring: 66.83% 0.1625 36.6;
    
    --radius: 16px;
    
    /* 项目扩展变量 */
    --coral: 60.32% 0.1448 36.02;
    --coral-bright: 80.08% 0.0962 39.91;
    --success: 69.46% 0.1551 159.22;
    --dark: 19.25% 0.0189 270.25;
    --on-dark: 75% 0.015 260;
    --bsc: 81.94% 0.1561 84.2;
    --bsc-foreground: 22.21% 0 89.88;
  }
  
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground;
  }
}
```

**验收标准**:
- [ ] 文件创建成功
- [ ] 所有变量使用 oklch 格式
- [ ] 浏览器 DevTools 中可以看到变量

---

### Task 2.2: 更新 Tailwind 配置 ⏱️ 45min

**文件**: `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'oklch(var(--background) / <alpha-value>)',
        foreground: 'oklch(var(--foreground) / <alpha-value>)',
        card: {
          DEFAULT: 'oklch(var(--card) / <alpha-value>)',
          foreground: 'oklch(var(--card-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'oklch(var(--popover) / <alpha-value>)',
          foreground: 'oklch(var(--popover-foreground) / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'oklch(var(--primary) / <alpha-value>)',
          foreground: 'oklch(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'oklch(var(--secondary) / <alpha-value>)',
          foreground: 'oklch(var(--secondary-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'oklch(var(--muted) / <alpha-value>)',
          foreground: 'oklch(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'oklch(var(--accent) / <alpha-value>)',
          foreground: 'oklch(var(--accent-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'oklch(var(--destructive) / <alpha-value>)',
          foreground: 'oklch(var(--destructive-foreground) / <alpha-value>)',
        },
        border: 'oklch(var(--border) / <alpha-value>)',
        input: 'oklch(var(--input) / <alpha-value>)',
        ring: 'oklch(var(--ring) / <alpha-value>)',
        
        // 项目扩展
        coral: 'oklch(var(--coral) / <alpha-value>)',
        success: 'oklch(var(--success) / <alpha-value>)',
        dark: 'oklch(var(--dark) / <alpha-value>)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
} satisfies Config
```

**验收标准**:
- [ ] 配置文件更新
- [ ] TypeScript 类型检查通过
- [ ] 可以在组件中使用新的颜色类（如 `bg-primary`）

---

### Task 2.3: 更新 globals.css ⏱️ 30min

**文件**: `src/styles/globals.css`

```css
@import './theme.css';
@import 'tailwindcss';

/* 保留必要的全局样式 */
@font-face {
  font-family: "Montserrat";
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  src: url("/assets/fonts/montserrat-latin-variable.woff2") format("woff2");
}

html {
  min-width: 320px;
  scroll-padding-top: 86px;
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-width: 320px;
  overflow-x: hidden;
  font-family: Montserrat, Inter, "Noto Sans SC", ui-sans-serif, system-ui, sans-serif;
}
```

**验收标准**:
- [ ] globals.css 更新
- [ ] 字体正确加载
- [ ] 页面样式正常显示

---

## Day 3: 验证与测试

### Task 3.1: 创建测试组件 ⏱️ 1h

**文件**: `src/components/__dev__/DesignSystemTest.tsx`

```typescript
export function DesignSystemTest() {
  return (
    <div className="p-8 space-y-8">
      {/* 颜色测试 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Colors</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="h-20 bg-background border rounded-lg" />
          <div className="h-20 bg-primary rounded-lg" />
          <div className="h-20 bg-secondary rounded-lg" />
          <div className="h-20 bg-accent rounded-lg" />
        </div>
      </section>
      
      {/* 文字颜色测试 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Typography</h2>
        <p className="text-foreground">Foreground</p>
        <p className="text-muted-foreground">Muted Foreground</p>
        <p className="text-primary">Primary</p>
        <p className="text-coral">Coral (Custom)</p>
      </section>
      
      {/* 圆角测试 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Border Radius</h2>
        <div className="flex gap-4">
          <div className="w-20 h-20 bg-primary rounded-sm" />
          <div className="w-20 h-20 bg-primary rounded-md" />
          <div className="w-20 h-20 bg-primary rounded-lg" />
          <div className="w-20 h-20 bg-primary rounded-full" />
        </div>
      </section>
    </div>
  )
}
```

**验收标准**:
- [ ] 测试组件创建
- [ ] 所有颜色正确显示
- [ ] 文字颜色正确
- [ ] 圆角样式正确

---

### Task 3.2: 运行验证测试 ⏱️ 30min

```bash
# 启动开发服务器
pnpm dev

# 在浏览器中访问测试组件
# 添加路由：/design-system-test
```

**检查项**:
- [ ] 页面正常加载
- [ ] 无 TypeScript 错误
- [ ] 无控制台警告
- [ ] CSS 变量在 DevTools 中可见
- [ ] Tailwind 类正常工作

---

### Task 3.3: 构建测试 ⏱️ 15min

```bash
# 执行生产构建
pnpm build

# 检查构建产物
ls -lh dist/assets/*.css
```

**验收标准**:
- [ ] 构建成功无错误
- [ ] CSS 文件生成
- [ ] 文件大小合理（未来会优化）

---

## 阶段完成检查清单

### 功能验证
- [ ] 所有依赖安装成功
- [ ] cn() 工具函数可用
- [ ] i18n 系统初始化成功
- [ ] CSS 变量正确定义
- [ ] Tailwind 配置生效
- [ ] 测试组件正常显示

### 代码质量
- [ ] TypeScript 编译无错误
- [ ] ESLint 无警告
- [ ] 所有文件格式化正确

### 文档
- [ ] 更新 CHANGELOG.md
- [ ] 提交代码到 Git

---

## 下一阶段预告

**阶段 2: shadcn 组件迁移（5 天）**

将创建以下组件：
- Button
- Card
- Input
- Select
- Tabs
- Dialog
- Tooltip

每个组件都会包含完整的 variants 定义和类型安全支持。
