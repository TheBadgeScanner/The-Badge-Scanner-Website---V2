# deploy-pages.ps1
# Deploys the Vite app to GitHub Pages (docs/ folder on main branch)

$ErrorActionPreference = "Stop"

Write-Host "▶ Building site with Vite..." -ForegroundColor Cyan
npm run build

Write-Host "▶ Refreshing docs/ folder..." -ForegroundColor Cyan
if (Test-Path "docs") {
    Remove-Item -Recurse -Force "docs"
}
New-Item -ItemType Directory -Path "docs" | Out-Null
Copy-Item -Recurse -Force "build\*" "docs\"

Write-Host "▶ Committing changes..." -ForegroundColor Cyan
git add docs vite.config.ts

git commit -m "Deploy to GitHub Pages" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "No changes to commit (working tree clean)." -ForegroundColor Yellow
} else {
    Write-Host "Changes committed." -ForegroundColor Green
}

Write-Host "▶ Pushing to origin/main..." -ForegroundColor Cyan
git push

Write-Host "✅ Deployment complete. Check GitHub Pages in ~30 seconds." -ForegroundColor Green
