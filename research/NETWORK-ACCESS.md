# 数据访问排查

2026-10-11 排查结果：

- `api.seerapi.com` DNS 正常，解析到 `61.170.82.52`，但本机到 80/443 端口均被网络层拒绝；不是 HTTP 429、403 或脚本鉴权失败。
- `raw.githubusercontent.com`、GitHub 和 CNB 直连也被当前运行环境的出站网络策略拒绝，因此 GitHub 静态镜像无法直接作为自动回退。
- SeerAPI 客户端请求本身使用只读 GET、合法 User-Agent 和 `Accept: application/json`，没有发现请求参数错误。

已增加 `SEER_PROXY` 环境变量支持：

```powershell
$env:SEER_PROXY = "http://127.0.0.1:7890"
node research/fetch-selected.cjs 3592 3613
```

该变量同时作用于 SeerAPI 和 GitHub 静态镜像请求。没有代理时，脚本仍会使用原有串行重试和本地缓存。

可行的稳定途径按优先级为：使用本机可访问的 HTTP 代理；在用户电脑上下载 SeerAPI `api-data` 仓库后放入项目并改用 `--static`；或者由用户提供对应编号的 JSON 快照后离线部署。BWIKI 页面可以通过浏览器人工查阅，但当前环境不能把 BWIKI API 当作本地批量导入通道。
