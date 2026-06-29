# Deploy the WCSD AI Hub to https://wcsdai.vercel.app
# Requires: Node.js installed, and your Vercel token in $env:VERCEL_TOKEN
#
# Usage:
#   $env:VERCEL_TOKEN = "your_token_here"
#   .\deploy\deploy.ps1

if (-not $env:VERCEL_TOKEN) {
    Write-Error "Set your token first:  `$env:VERCEL_TOKEN = 'your_token_here'"
    exit 1
}

$siteDir = Join-Path $PSScriptRoot "..\site"
Write-Host "Deploying $siteDir to production (wcsdai)..." -ForegroundColor Cyan

Push-Location $siteDir
npx --yes vercel@latest deploy --prod --yes --token=$env:VERCEL_TOKEN --scope jtstarknv-8681s-projects
Pop-Location

Write-Host "Done. Verify at https://wcsdai.vercel.app" -ForegroundColor Green
