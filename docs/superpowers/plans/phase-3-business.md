# 阶段 3：业务组件重构 - 详细任务清单

**预计时间**: 7 天  
**目标**: 将现有业务组件迁移到新的设计系统，使用 Tailwind utilities 替换自定义 CSS

---

## 当前状态分析

### 现有文件结构
```
src/
├── home/
│   ├── HomePage.tsx          # 首页主组件，大量内联 className
│   ├── content.ts            # 首页内容数据
│   └── assets.ts             # 首页资源
├── app/
│   ├── DappShell.tsx         # DApp 外壳
│   ├── DappTopbar.tsx        # 顶部导航栏
│   ├── DappRail.tsx          # 侧边栏
│   ├── tabs/
│   │   ├── SwapTab.tsx
│   │   ├── GenesisTab.tsx
│   │   ├── RewardsTab.tsx
│   │   └── CommunityTab.tsx
│   └── components/
│       ├── DappPillTabs.tsx
│       ├── DappCard.tsx
│       ├── DappActionButton.tsx
│       └── ...
├── styles/
│   ├── home.css              # 首页专用样式 (200+ lines)
│   ├── dapp.css              # DApp 专用样式 (300+ lines)
│   └── shared.css            # 共享样式
```

### CSS 依赖关系
- `home.css` - 包含复杂动画、渐变、mask-image 等高级效果
- `dapp.css` - 包含布局、主题变量、第三方组件样式覆盖
- `shared.css` - 基础工具类和通用样式

### 重构策略
1. **保留复杂动画/效果** - hero-rays、metrics-rays、character-float 等保留在 CSS 中
2. **迁移布局和间距** - 使用 Tailwind utilities 替换
3. **使用 shadcn 组件** - Button、Card、Tabs 等替换自定义组件
4. **渐进式重构** - 每次重构一个模块，确保构建通过

---

## Day 1-2: 首页核心组件 (HomePage)

### Task 3.1: 分析和规划 ⏱️ 1h

- [x] 读取 `HomePage.tsx` 完整代码
- [x] 识别可复用的模式
- [x] 确定哪些 CSS 保留，哪些迁移到 Tailwind
- [ ] 创建组件拆分计划

**分析结果**:
- Hero 区域：复杂动画保留，布局用 Tailwind
- Metrics 面板：可以用 shadcn Card 改造
- Icon Cards: 可以用 shadcn Card + Grid
- Token Cards: 自定义悬停效果保留
- Roadmap Timeline: 复杂布局保留 CSS

---

### Task 3.2: Hero 区域重构 ⏱️ 2h

**文件**: `src/home/components/Hero.tsx` (新建)

- [ ] 提取 Hero 为独立组件
- [ ] 保留 `.hero-rays`, `.art-glow` 动画 CSS
- [ ] 布局改用 Tailwind utilities
- [ ] 使用 shadcn Button 替换自定义按钮
- [ ] 响应式断点改用 Tailwind 标准（sm, md, lg, xl）

**重构前**:
```tsx
<section className="hero relative flex min-h-[696px] items-start overflow-hidden pt-[90px] pb-24 [background:linear-gradient(180deg,var(--aegis-page),oklch(95.6%_0_0))] max-[1100px]:min-h-0...">
```

**重构后**:
```tsx
<section className="relative flex min-h-[696px] items-start overflow-hidden pt-[90px] pb-24 bg-gradient-to-b from-background to-[oklch(95.6%_0_0)] lg:min-h-0...">
```

---

### Task 3.3: Metrics 面板重构 ⏱️ 1.5h

**文件**: `src/home/components/MetricsPanel.tsx` (新建)

- [ ] 使用 shadcn Card 组件
- [ ] 保留 `.metrics-rays` 背景动画
- [ ] Grid 布局改用 Tailwind
- [ ] 数字动画保留
- [ ] 响应式优化

**重构目标**:
```tsx
<Card className="relative isolate min-h-[191px] rounded-[28px] bg-dark text-white lg:min-h-[204px]">
  <div className="metrics-rays" />
  <div className="grid grid-cols-4 lg:grid-cols-2 gap-6 px-10 py-14 lg:px-5 lg:py-7">
    {/* Metric items */}
  </div>
</Card>
```

---

### Task 3.4: Icon Cards 重构 ⏱️ 1.5h

**文件**: `src/home/components/FeatureCards.tsx` (新建)

- [ ] 使用 shadcn Card 组件
- [ ] 移除内联 className，改用组件 variants
- [ ] 使用 Tailwind Grid
- [ ] 简化响应式类名

**重构前**:
```tsx
<div className="feature-card three-col reveal mt-14 grid grid-cols-3 overflow-hidden rounded-[22px] bg-[var(--aegis-surface)] shadow-[var(--aegis-shadow)] max-[820px]:mt-4 max-[820px]:grid-cols-1...">
```

**重构后**:
```tsx
<div className="grid grid-cols-3 gap-0 mt-14 rounded-[22px] overflow-hidden bg-card shadow-sm md:grid-cols-1 md:gap-4 md:mt-4 md:bg-transparent">
  <Card className="min-h-[281px] px-[34px] py-9 md:min-h-0 md:p-[22px]">
```

---

## Day 3-4: DApp 布局组件

### Task 3.5: DappTopbar 重构 ⏱️ 2h

**文件**: `src/app/DappTopbar.tsx`

- [ ] 移除 `.dapp-topbar` CSS class
- [ ] 改用 Tailwind flex utilities
- [ ] 使用 shadcn Button 替换 `.dapp-pill`
- [ ] LanguageMenu 和钱包按钮样式统一
- [ ] 响应式优化

**重构目标**:
```tsx
<header className="min-h-[76px] w-full relative z-2 flex items-center justify-between gap-6 px-[26px] py-[18px]">
  <Brand />
  <div className="flex items-center gap-2.5">
    <Button variant="outline" size="sm">Language</Button>
    <ConnectButton />
  </div>
</header>
```

---

### Task 3.6: DappRail 侧边栏重构 ⏱️ 1.5h

**文件**: `src/app/DappRail.tsx`

- [ ] 移除自定义 CSS classes
- [ ] 使用 Tailwind 定位和布局
- [ ] Tab 切换动画保留或用 shadcn Tabs
- [ ] 响应式抽屉实现

---

### Task 3.7: DappPillTabs 重构 ⏱️ 1h

**文件**: `src/app/components/DappPillTabs.tsx`

- [ ] 完全替换为 shadcn Tabs 组件
- [ ] 使用 tailwind-variants 定义 pill 样式
- [ ] 保持现有 API 兼容性
- [ ] 动画过渡优化

**重构目标**:
```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/components/tabs'

export function DappPillTabs({ tabs, value, onChange }) {
  return (
    <Tabs value={value} onValueChange={onChange}>
      <TabsList className="rounded-full bg-muted">
        {tabs.map(tab => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
```

---

## Day 5-6: DApp Tab 页面重构

### Task 3.8: SwapTab 重构 ⏱️ 2.5h

**文件**: `src/app/tabs/SwapTab.tsx`

- [ ] 使用 shadcn Card 替换自定义卡片
- [ ] 使用 shadcn Input 替换输入框
- [ ] 使用 shadcn Button 替换交换按钮
- [ ] 使用 shadcn Select 替换代币选择器
- [ ] Token 列表用 shadcn Dialog + List
- [ ] 保留交换动画和加载状态

---

### Task 3.9: GenesisTab 重构 ⏱️ 2h

**文件**: `src/app/tabs/GenesisTab.tsx`

- [ ] Card 组件替换
- [ ] Button 组件替换
- [ ] 质押进度条组件
- [ ] 奖励展示优化

---

### Task 3.10: RewardsTab & CommunityTab 重构 ⏱️ 2h

**文件**: 
- `src/app/tabs/RewardsTab.tsx`
- `src/app/tabs/CommunityTab.tsx`

- [ ] 表格用 shadcn Table（如果需要）
- [ ] 卡片用 shadcn Card
- [ ] 按钮统一风格
- [ ] 图表组件保持不变

---

## Day 7: DApp 小组件重构

### Task 3.11: DappCard 组件重构 ⏱️ 1h

**文件**: `src/app/components/DappCard.tsx`

- [ ] 完全替换为 shadcn Card 或基于它扩展
- [ ] 使用 tailwind-variants 定义变体
- [ ] 更新所有使用的地方

---

### Task 3.12: DappActionButton 重构 ⏱️ 1h

**文件**: `src/app/components/DappActionButton.tsx`

- [ ] 基于 shadcn Button 扩展
- [ ] 添加 loading、disabled 状态
- [ ] Icon 位置支持（left, right）
- [ ] 使用 tailwind-variants

---

### Task 3.13: 其他小组件 ⏱️ 1.5h

- [ ] DappWidgetHeader
- [ ] DappMetaList
- [ ] DappActionRow
- [ ] DappSection

---

## 清理和优化

### Task 3.14: CSS 文件清理 ⏱️ 1.5h

- [ ] 删除已迁移的 CSS classes
- [ ] 保留必要的动画和特效
- [ ] 合并重复的样式
- [ ] 优化 CSS 文件大小

**预期结果**:
- `home.css`: 从 200+ lines → ~100 lines（仅保留动画）
- `dapp.css`: 从 300+ lines → ~150 lines（仅保留特殊样式）

---

### Task 3.15: 响应式测试 ⏱️ 1h

- [ ] 测试所有断点（mobile, tablet, desktop）
- [ ] 验证动画在所有设备正常工作
- [ ] 修复布局问题
- [ ] Chrome DevTools 设备模拟测试

---

### Task 3.16: 性能验证 ⏱️ 1h

```bash
pnpm build
```

- [ ] CSS bundle < 100KB（目标从 114KB → 95KB）
- [ ] JS bundle 保持不变或减小
- [ ] Lighthouse 性能 > 90
- [ ] 首页加载时间 < 2s

---

## 阶段 3 完成标准

- [ ] 所有业务组件使用 shadcn 组件
- [ ] 自定义 CSS 减少 50%+
- [ ] 响应式布局使用 Tailwind 标准断点
- [ ] 所有 Tab 页面功能正常
- [ ] 动画和交互效果保持不变
- [ ] 构建成功，CSS < 100KB
- [ ] 无 TypeScript 错误
- [ ] 所有页面通过视觉测试

**下一步**: 进入 Phase 4 - 最终优化与清理
