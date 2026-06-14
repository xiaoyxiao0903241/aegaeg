# 阶段 2：shadcn 组件迁移 - 详细任务清单

**预计时间**: 5 天  
**目标**: 创建完整的 shadcn UI 组件库，替换现有 UI 组件

---

## Day 1-2: 基础组件 ✅ 已完成

### Task 2.1: Button 组件 ⏱️ 1h ✅
- [x] 创建 `src/components/button.tsx`
- [x] 使用 tailwind-variants 定义变体
- [x] 支持 asChild prop（Radix Slot）
- [x] 6个变体：default, destructive, outline, secondary, ghost, link
- [x] 4个尺寸：sm, default, lg, icon
- [x] 完整的 TypeScript 类型
- [x] forwardRef 支持

### Task 2.2: Card 组件 ⏱️ 45min ✅
- [x] 创建 `src/components/card.tsx`
- [x] 导出完整 Card 系统：Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- [x] 使用 oklch 颜色变量
- [x] 响应式阴影和边框

### Task 2.3: Input 组件 ⏱️ 30min ✅
- [x] 创建 `src/components/input.tsx`
- [x] 响应式文字大小（mobile: text-base, desktop: text-sm）
- [x] 完整的 focus/disabled 状态
- [x] 文件上传样式
- [x] Placeholder 样式

---

## Day 3-4: 交互组件 ✅ 已完成

### Task 2.4: Select 组件 ⏱️ 1.5h ✅
- [x] 安装 `@radix-ui/react-select`
- [x] 创建 `src/components/select.tsx`
- [x] 导出：Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectSeparator
- [x] 滚动按钮支持
- [x] 键盘导航
- [x] Portal 渲染
- [x] 动画过渡（fade-in/zoom-in）

### Task 2.5: Tabs 组件 ⏱️ 1h ✅
- [x] 安装 `@radix-ui/react-tabs`
- [x] 创建 `src/components/tabs.tsx`
- [x] 导出：Tabs, TabsList, TabsTrigger, TabsContent
- [x] 支持 Pill 样式（通过 className 自定义）
- [x] 激活状态高亮
- [x] 键盘导航

### Task 2.6: Dialog 组件 ⏱️ 1.5h ✅
- [x] 安装 `@radix-ui/react-dialog`
- [x] 创建 `src/components/dialog.tsx`
- [x] 导出：Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription
- [x] Overlay 遮罩
- [x] 关闭按钮（X 图标）
- [x] 动画过渡
- [x] 响应式布局

### Task 2.7: Tooltip 组件 ⏱️ 45min ✅
- [x] 安装 `@radix-ui/react-tooltip`
- [x] 创建 `src/components/tooltip.tsx`
- [x] 导出：Tooltip, TooltipTrigger, TooltipContent, TooltipProvider
- [x] 4个方向定位（top, right, bottom, left）
- [x] 延迟显示
- [x] 动画过渡

### Task 2.8: 路径别名更新 ⏱️ 30min ✅
- [x] 更新所有组件导入从 `@/` 改为 `~/`
- [x] 配置 `tsconfig.app.json` paths
- [x] 配置 `vite.config.ts` resolve.alias
- [x] 验证所有导入正常工作

---

## Day 5: 集成测试与文档

### Task 2.9: 更新测试页面 ⏱️ 1h

**文件**: `src/components/__dev__/DesignSystemTest.tsx`

- [ ] 添加 Select 组件测试区域
- [ ] 添加 Tabs 组件测试区域
- [ ] 添加 Dialog 组件测试区域（带触发按钮）
- [ ] 添加 Tooltip 组件测试区域
- [ ] 测试所有交互功能
- [ ] 验证响应式布局

**验收标准**:
- [ ] 访问 `http://localhost:5173/?test=design` 可以看到所有组件
- [ ] 所有组件可以正常交互
- [ ] 移动端和桌面端样式正确
- [ ] 无 console 错误

---

### Task 2.10: 组件 Storybook（可选） ⏱️ 2h

如果时间允许，可以设置 Storybook：

```bash
pnpm add -D @storybook/react-vite @storybook/addon-essentials
npx storybook@latest init
```

为每个组件创建 `.stories.tsx` 文件，展示所有变体和状态。

---

### Task 2.11: 视觉回归测试（可选） ⏱️ 1h

使用 Playwright 进行视觉回归测试：

```bash
pnpm add -D @playwright/test
```

创建测试脚本截取组件快照，确保未来改动不会破坏样式。

---

### Task 2.12: 无障碍测试 ⏱️ 1h

- [ ] 使用 axe-core 检查 WCAG 2.1 AA 合规性
- [ ] 键盘导航测试（Tab, Enter, Escape）
- [ ] 屏幕阅读器测试（aria-label, aria-describedby）
- [ ] Focus 可见性测试
- [ ] 色彩对比度测试（使用 oklch 值验证）

**工具**:
```bash
pnpm add -D @axe-core/playwright
```

**验收标准**:
- [ ] 所有组件通过 axe-core 检查
- [ ] 键盘可以完全操作所有交互
- [ ] Focus ring 清晰可见
- [ ] 色彩对比度 ≥ 4.5:1（普通文本）或 ≥ 3:1（大文本）

---

## 构建验证

### Task 2.13: 生产构建测试 ⏱️ 30min

```bash
pnpm build
pnpm preview
```

- [ ] 构建成功，无 TypeScript 错误
- [ ] CSS 文件大小合理（目标 < 120KB，当前 114KB）
- [ ] 所有组件在生产环境正常工作
- [ ] 无 console 警告或错误

---

## 阶段 2 完成标准

- [x] 所有 7 个核心组件创建完成（Button, Card, Input, Select, Tabs, Dialog, Tooltip）
- [x] 组件使用 tailwind-variants 实现变体
- [x] 所有组件支持 TypeScript 类型
- [x] 组件使用 oklch 颜色系统
- [x] 路径别名统一为 `~/`
- [ ] 测试页面展示所有组件
- [ ] 构建成功，CSS 文件 < 120KB
- [ ] 通过无障碍检查

**下一步**: 进入 Phase 3 - Business 组件重构
