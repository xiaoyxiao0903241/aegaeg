# 决策：Dapp 数据覆盖矩阵（wayfinder 锁定）

> 状态：现行 · Destination **已交货**（2026-08-08 · Complete-known）  
> Map：[Map: Dapp data coverage matrix (UI↔chain/API)](https://github.com/xiaoyxiao0903241/aegaeg/issues/3)（已关闭）

## Destination

为 **dapp 全部功能（不含 home）** 落盘全量覆盖矩阵；与现有 A/B/C 双文件共存；本图只交货不修代码。

## 锁定项

| 项       | 决定                                                                                                 |
| -------- | ---------------------------------------------------------------------------------------------------- |
| 产物形态 | **C**：全量矩阵（含 ✅）+ 问题行链 A/B/C                                                             |
| 范围     | dapp 全部功能；**不含 home**；Host 专章 Fold `host`+`views/dapp/shared`                              |
| 粒度     | **M**：读=字段级；写=动作级（门闸/刷新）                                                             |
| UI 基线  | **已实现 > Figma > HTML 原型**                                                                       |
| 盘点     | **UI+Code 双扫**（主表 UI-first，抓住未接线）                                                        |
| 动态位   | **Num+Copy**，范围 **Visible+FAQ**                                                                   |
| 归因     | **T1**（与 A/B/C 可映射）                                                                            |
| 证据杠   | **L**：金钱 Prod 链核实；写路径不真发交易                                                            |
| 继承     | **H**：A/C 可继承；B 读/写/刷新重审                                                                  |
| 切片     | **Tab**；施工顺序 **Risk**                                                                           |
| 完成门闩 | **Complete-known**                                                                                   |
| 终点     | **D**：只交货矩阵                                                                                    |
| 矩阵路径 | **`docs/dapp-data-coverage-matrix.md`**（[#4](https://github.com/xiaoyxiao0903241/aegaeg/issues/4)） |
| 列       | **C2**：含分列「继承自」「证据」                                                                     |
| 行号     | **R1**：`H`/`S`/`W`/`L`/`X`/`A`/`CM`/`GN`/`Z` + 三位                                                 |
| 判定     | **V2**：`✅` · `❌` · `部分` · `待核实` · `不适用`                                                   |
| 骨架     | **S2**：规则 + 空章 + 对照源指针                                                                     |
| 新鲜度   | 填章前重读最新手册 / 审计 / 代码；`docs/research/*` 仅目录                                           |

## 落盘

- 矩阵：[`docs/dapp-data-coverage-matrix.md`](../dapp-data-coverage-matrix.md)
- 问题队列：[`docs/ui-manual-api-alignment-audit.md`](../ui-manual-api-alignment-audit.md)
- 源索引：[`docs/research/dapp-tab-source-index.md`](../research/dapp-tab-source-index.md)
- 继承索引：[`docs/research/abc-inheritance-index-for-coverage-matrix.md`](../research/abc-inheritance-index-for-coverage-matrix.md)
