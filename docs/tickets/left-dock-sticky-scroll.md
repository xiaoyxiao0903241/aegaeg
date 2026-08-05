# 票：左侧操作区 sticky 头 + 整宽横滑

> 状态：in-progress  
> 原则：布局尽量与改前相同，只让左侧顶部不跟着滚；子页文案结构贴稿 leaf。

## 稿 leaf（钻取）

| 场景    | node                | 结构                   |
| ------- | ------------------- | ---------------------- |
| PC Hub  | `4371:222` header   | titleblock \| btn/menu |
| PC 子页 | `4448:592` backRow  | ← 返回xx \| btn/menu   |
| H5 Hub  | `4667:566` header   | 同 PC Hub              |
| H5 子页 | `4667:1125` backRow | 同 PC 子页             |

整页参考：`4287:213` / `4448:221` / `4667:340` / `4667:899`

## 根因备忘

- H5 右侧菜单消失：`IconButton` 默认 `max-dapp:hidden`；DetailToggle 在 H5 须自绘按钮
- 顶渐隐压字：fade 不得包住 chrome；只贴滚动体上沿；H5 不挂 fade

## 验收

- [ ] 子页固定行：← +「返回xx」| menu；下方才是 title
- [ ] Hub：title+desc | menu（+可选第二图标）
- [ ] H5 可见 menu；整窗可滚；顶栏 sticky
- [ ] PC 滚内容时顶栏不动；顶渐隐不压标题
- [ ] `pnpm exec tsc -b`
