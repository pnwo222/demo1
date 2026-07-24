[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$RequirementId,

    [Parameter(Mandatory = $true)]
    [string]$TaskId,

    [Parameter(Mandatory = $true)]
    [string]$TaskBranch,

    [switch]$NoMerge,

    [switch]$NoCommit
)

$ErrorActionPreference = "Stop"
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
Set-Location $repoRoot

function Invoke-Git {
    param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Arguments)
    & git @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "Git 命令失败：git $($Arguments -join ' ')"
    }
}

function Get-GitFileContent {
    param(
        [Parameter(Mandatory = $true)][string]$Branch,
        [Parameter(Mandatory = $true)][string]$Path
    )
    $stdoutPath = [System.IO.Path]::GetTempFileName()
    $stderrPath = [System.IO.Path]::GetTempFileName()
    try {
        $gitPath = (Get-Command git -ErrorAction Stop).Source
        $process = Start-Process `
            -FilePath $gitPath `
            -ArgumentList @("show", "${Branch}:$Path") `
            -WorkingDirectory $repoRoot `
            -WindowStyle Hidden `
            -Wait `
            -PassThru `
            -RedirectStandardOutput $stdoutPath `
            -RedirectStandardError $stderrPath
        if ($process.ExitCode -ne 0) {
            $errorText = Get-Content -Raw -Encoding UTF8 -LiteralPath $stderrPath
            throw "git show failed: $errorText"
        }
        return Get-Content -Raw -Encoding UTF8 -LiteralPath $stdoutPath
    }
    finally {
        Remove-Item -LiteralPath $stdoutPath, $stderrPath -Force -ErrorAction SilentlyContinue
    }
}

$relativeTaskPath = "docs/workflow/tasks/$RequirementId/$TaskId.md"
$taskPath = Join-Path $repoRoot $relativeTaskPath
if (-not (Test-Path -LiteralPath $taskPath)) {
    throw "需求集成分支缺少任务登记：$relativeTaskPath"
}

$taskContent = if ($NoMerge) {
    Get-Content -Raw -Encoding UTF8 -LiteralPath $taskPath
} else {
    try {
        $contentFromBranch = Get-GitFileContent `
            -Branch $TaskBranch `
            -Path $relativeTaskPath
    }
    catch {
        throw "任务分支缺少任务状态文件：${TaskBranch}:$relativeTaskPath"
    }
    $contentFromBranch
}
$integrationMatch = [regex]::Match(
    $taskContent,
    '(?m)^\|\s*需求集成分支\s*\|\s*(.*?)\s*\|\s*$'
)
$statusMatch = [regex]::Match(
    $taskContent,
    '(?m)^\|\s*状态\s*\|\s*(.*?)\s*\|\s*$'
)
if (-not $integrationMatch.Success -or -not $statusMatch.Success) {
    throw "任务文件缺少需求集成分支或状态字段"
}

$integrationBranch = $integrationMatch.Groups[1].Value.Trim()
$taskStatus = $statusMatch.Groups[1].Value.Trim()
$taskBranchMatch = [regex]::Match(
    $taskContent,
    '(?m)^\|\s*任务分支\s*\|\s*(.*?)\s*\|\s*$'
)
if (-not $taskBranchMatch.Success -or $taskBranchMatch.Groups[1].Value.Trim() -ne $TaskBranch) {
    throw "参数 TaskBranch 与任务状态文件登记的任务分支不一致"
}
$currentBranch = (& git branch --show-current).Trim()
if ($LASTEXITCODE -ne 0 -or -not $currentBranch) {
    throw "无法读取当前 Git 分支"
}
if ($currentBranch -ne $integrationBranch) {
    throw "当前分支为 $currentBranch，必须切换到 Integration Owner 管理的 $integrationBranch"
}
if ($taskStatus -notin @("ready_for_integration", "in_review", "integrated")) {
    throw "任务状态为 $taskStatus，未达到 ready_for_integration/in_review"
}

$dirty = & git status --porcelain
if ($LASTEXITCODE -ne 0) {
    throw "无法读取工作区状态"
}
if ($dirty) {
    throw "工作区存在未提交修改。请先提交或清理，再执行集成脚本。"
}

if (-not $NoMerge -and $taskStatus -ne "integrated") {
    Invoke-Git merge --no-ff $TaskBranch
}

$integratedCommit = (& git rev-parse HEAD).Trim()
if ($LASTEXITCODE -ne 0) {
    throw "无法读取集成后的提交"
}

& python scripts/workflow_task.py integrate `
    --requirement $RequirementId `
    --task $TaskId `
    --commit $integratedCommit
if ($LASTEXITCODE -ne 0) {
    throw "任务汇总状态更新失败"
}

& python scripts/update_artifact_index.py
if ($LASTEXITCODE -ne 0) {
    throw "产物导航更新失败"
}

& python scripts/update_artifact_index.py --check
if ($LASTEXITCODE -ne 0) {
    throw "产物导航校验失败"
}

& git diff --check
if ($LASTEXITCODE -ne 0) {
    throw "Git diff 校验失败"
}

if (-not $NoCommit) {
    $requirementFiles = @(
        Get-ChildItem -LiteralPath (Join-Path $repoRoot "docs/workflow/requirements") -Filter "*.md" |
            Where-Object {
                $_.Name -ne "TEMPLATE.md" -and
                (Get-Content -Raw -Encoding UTF8 -LiteralPath $_.FullName) -match
                    "(?m)^\|\s*需求ID\s*\|\s*$([regex]::Escape($RequirementId))\s*\|\s*$"
            }
    )
    if ($requirementFiles.Count -ne 1) {
        throw "需求ID $RequirementId 必须匹配一个需求状态文件，实际匹配 $($requirementFiles.Count) 个"
    }
    $relativeRequirementPath = $requirementFiles[0].FullName.Substring(
        $repoRoot.Length
    ).TrimStart("\", "/").Replace("\", "/")
    Invoke-Git add `
        $relativeTaskPath `
        $relativeRequirementPath `
        "docs/workflow/status.md" `
        "PROJECT_ARTIFACTS.html"
    $staged = & git diff --cached --name-only
    if ($LASTEXITCODE -ne 0) {
        throw "无法读取暂存区"
    }
    if ($staged) {
        Invoke-Git commit -m "chore(workflow): integrate $TaskId"
    }
}

Write-Output "任务集成完成"
Write-Output "需求：$RequirementId"
Write-Output "任务：$TaskId"
Write-Output "集成分支：$integrationBranch"
Write-Output "集成提交：$integratedCommit"
Write-Output "下一步：运行需求级完整验证；全部任务集成后确认是否合回开发分支。"
