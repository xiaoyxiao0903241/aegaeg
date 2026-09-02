# 后端 API（OpenAPI）

> 现行后端展示读 SSOT。  
> **机器真源**：[`openapi.json`](./openapi.json) · **人读派生**：[`api.md`](./api.md)（由 json 生成；冲突以 **json** 为准）。

|项|值|
|---|---|
|标题|AEGIS API|
|OpenAPI|3.0.3|
|paths|66|
|tags|17|
|源|本目录（以 `openapi.json` 为准）|

接入约定：有字段 → 尽量接线；手册与 API 皆无 → 诚实空，禁止假数。  
本目录 json / api.md **勿手改**；更新从上游 OpenAPI HTML 抽出 `openapi.json` 后跑 `python3 scripts/generate-backend-api-md.py`。
