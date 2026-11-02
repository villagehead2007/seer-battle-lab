param(
    [int]$MaxRounds = 3
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$logDir = Join-Path $PSScriptRoot "automation-logs"
New-Item -ItemType Directory -Force -Path $logDir | Out-Null

$prompt = @'
你正在持续开发赛尔号本地对战项目。

首先完整阅读 AGENTS.md 和 PROGRESS.md，严格遵守开发规范。

每轮执行：
1. 优先修复当前精灵的未完成机制。
2. 选择下一只尚未完整实现的精灵。
3. 根据真实资料实现魂印、技能及对战效果。
4. 运行相关测试并修复发现的问题。
5. 更新 PROGRESS.md，准确记录进度。
6. 未经验证的效果不得标记为完成。
7. 禁止只抓取数据就宣称精灵已实现。
8. 不要等待用户发送“继续”。

本轮尽可能完成实质性代码开发。
如遇无法验证的资料，记录问题并处理其他任务。
禁止编造效果或为了通过测试而降低测试标准。
'@

for ($round = 1; $round -le $MaxRounds; $round++) {
    $stamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $log = Join-Path $logDir "round-$round-$stamp.log"

    Write-Host "Starting round $round / $MaxRounds"

    & codex exec `
        --sandbox workspace-write `
        --skip-git-repo-check `
        $prompt *> $log

    $exitCode = $LASTEXITCODE

    if ($exitCode -ne 0) {
        Write-Host "Codex failed. Exit code: $exitCode"
        Write-Host "Check log: $log"
        break
    }

    Write-Host "Round $round finished."
    Start-Sleep -Seconds 5
}

Write-Host "Automation stopped."