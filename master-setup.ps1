Write-Host "Starting full automation..."

$pgService = Get-Service | Where-Object { $_.Name -like "*postgres*" -or $_.Name -like "*pgsql*" } | Select-Object -First 1 -ExpandProperty Name
if ($pgService) {
  net start $pgService
} else {
  Write-Host "PostgreSQL service not found. Please start it manually."
}

npm install

do {
  npm run db:push
  if ($LASTEXITCODE -ne 0) { Start-Sleep -s 5 }
} while ($LASTEXITCODE -ne 0)

npm run dev:all

docker-compose up -d

Start-Sleep -s 10

npm run automation:start

Write-Host "Kamel - Platform running for real profit!"
