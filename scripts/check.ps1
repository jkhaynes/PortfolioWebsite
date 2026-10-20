<#
.SYNOPSIS
  One definition of green: format check, lint, tests, build, in that order.
.DESCRIPTION
  CLAUDE.md, CI and the merge-gate hook all run this (or scripts/check.sh).
  Fill in the commands below for this project's stack. A value still in
  [brackets] is a placeholder: it is skipped with a warning instead of failing.
  Keep scripts/check.sh in sync.
.EXAMPLE
  ./scripts/check.ps1
#>
$FormatCmd = "npm run format:check"
$LintCmd   = "npm run lint"
$TestCmd   = "npm run test:e2e"
$BuildCmd  = "npm run build"

$ErrorActionPreference = "Stop"
Set-Location (Split-Path -Parent $PSScriptRoot)

function Invoke-Step([string]$Name, [string]$Cmd) {
    if ([string]::IsNullOrWhiteSpace($Cmd) -or $Cmd.StartsWith("[")) {
        Write-Warning "check: $Name command is a placeholder, skipping. Fill it in at the top of scripts/check.ps1."
        return
    }
    Write-Host "check: ${Name}: $Cmd"
    $global:LASTEXITCODE = 0
    $ok = $true
    try { Invoke-Expression $Cmd; $ok = $? } catch { Write-Host $_; $ok = $false }
    if ((-not $ok) -or ($LASTEXITCODE -ne 0)) {
        Write-Host "check: FAILED at $Name. Fix it and run ./scripts/check.ps1 again." -ForegroundColor Red
        exit 1
    }
}

Invoke-Step "format" $FormatCmd
Invoke-Step "lint"   $LintCmd
Invoke-Step "test"   $TestCmd
Invoke-Step "build"  $BuildCmd
Write-Host "check: all steps passed (or were skipped)."
