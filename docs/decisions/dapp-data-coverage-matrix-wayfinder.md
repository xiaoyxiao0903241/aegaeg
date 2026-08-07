# 决策：Dapp 数据覆盖矩阵

> 状态：现行  
> 正文 SSOT：[`docs/dapp-data-coverage-matrix.md`](../dapp-data-coverage-matrix.md)  
> 对照源目录：[`docs/research/dapp-tab-source-index.md`](../research/dapp-tab-source-index.md)

## 现行约定

| 项       | 值                                                                                |
| -------- | --------------------------------------------------------------------------------- |
| 职责     | dapp 动态数据与写路径的**现行**对齐结论（覆盖证明 + 缺口队列）                    |
| 范围     | dapp 全功能；不含 home；Host = `host` + `views/dapp/shared`                       |
| 盘点     | UI+Code 双扫；Num+Copy（Visible+FAQ）                                             |
| 粒度     | 读=字段级；写=动作级（门闸/刷新）                                                 |
| UI 基线  | 已实现 > Figma > HTML 原型                                                        |
| 读源优先 | overview/summary 与同页 API 表聚合 → 采纳 API；无同口径 API 的链余额/仓位才链优先 |
| 判定     | `✅` · `❌` · `部分` · `待核实` · `不适用`                                        |
| 归因     | T1 枚举（见矩阵正文）                                                             |
| 证据     | 金钱路径须 Prod 只读核实才可 `✅`；写路径不真发交易                               |
| 完成     | Complete-known（允许 `待核实`，须写原因与下一步）                                 |
| 更新     | 只改现行行；不保留过程史；重读最新手册 / API / 代码                               |

## 非本文件

- 链上手册正文、OpenAPI 入仓拷贝：只读，不在此改写
- 文案/稿冲突的产品改稿：矩阵可记 `文案/单位与链不匹配（稿如此）`，改 i18n/Figma 另议
