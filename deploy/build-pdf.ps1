# Recompile the TEACH one-pager PDF from the Typst source.
# Output goes straight into site\ so it's ready to deploy.
#
# Requires Typst once:  winget install Typst.Typst   (restart shell after)
#
# Usage:
#   .\deploy\build-pdf.ps1

$srcDir = Join-Path $PSScriptRoot "..\one-pager-source"
$out    = Join-Path $PSScriptRoot "..\site\WCSD-TEACH-One-Pager.pdf"

Push-Location $srcDir
typst compile "teach_onepager_v2.typ" "$out"
Pop-Location

Write-Host "Rebuilt: $out  (ready to deploy)" -ForegroundColor Green
Write-Host "Tip: confirm it is still ONE page before deploying." -ForegroundColor Yellow
