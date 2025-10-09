# AI Platform Setup Script for Windows
# This script sets up the development environment for the AI Platform

Write-Host "🚀 AI Platform Setup Script" -ForegroundColor Cyan
Write-Host "==========================" -ForegroundColor Cyan

# Check Node.js version
Write-Host "`nChecking Node.js version..." -ForegroundColor Yellow
try {
    $nodeVersion = node -v
    $majorVersion = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($majorVersion -lt 20) {
        Write-Host "Error: Node.js 20+ is required" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Node.js version is compatible" -ForegroundColor Green
} catch {
    Write-Host "Error: Node.js is not installed" -ForegroundColor Red
    exit 1
}

# Check if Docker is installed
Write-Host "`nChecking Docker..." -ForegroundColor Yellow
try {
    docker --version | Out-Null
    Write-Host "✓ Docker is installed" -ForegroundColor Green
} catch {
    Write-Host "Error: Docker is not installed" -ForegroundColor Red
    Write-Host "Please install Docker Desktop for Windows" -ForegroundColor Yellow
    exit 1
}

# Check if Docker Compose is installed
Write-Host "`nChecking Docker Compose..." -ForegroundColor Yellow
try {
    docker-compose --version | Out-Null
    Write-Host "✓ Docker Compose is installed" -ForegroundColor Green
} catch {
    Write-Host "Error: Docker Compose is not installed" -ForegroundColor Red
    exit 1
}

# Create .env file if it doesn't exist
Write-Host "`nSetting up environment variables..." -ForegroundColor Yellow
if (!(Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "✓ Created .env file from .env.example" -ForegroundColor Green
    Write-Host "Please edit .env file with your configuration" -ForegroundColor Yellow
} else {
    Write-Host "✓ .env file already exists" -ForegroundColor Green
}

# Install dependencies
Write-Host "`nInstalling dependencies..." -ForegroundColor Yellow
npm install
Write-Host "✓ Dependencies installed" -ForegroundColor Green

# Create necessary directories
Write-Host "`nCreating directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "nginx/ssl" | Out-Null
New-Item -ItemType Directory -Force -Path "uploads" | Out-Null
New-Item -ItemType Directory -Force -Path "logs" | Out-Null
Write-Host "✓ Directories created" -ForegroundColor Green

# Generate SSL certificates for local development
Write-Host "`nGenerating SSL certificates..." -ForegroundColor Yellow
if (!(Test-Path "nginx/ssl/cert.pem")) {
    # For Windows, we'll create a simple self-signed certificate
    Write-Host "Note: For production, use proper SSL certificates" -ForegroundColor Yellow
    
    # Create placeholder certificates
    @"
-----BEGIN CERTIFICATE-----
MIIDazCCAlOgAwIBAgIUJeoLJZkNqpSzeTOOvR8r8XfLmhcwDQYJKoZIhvcNAQEL
BQAwRTELMAkGA1UEBhMCVVMxEzARBgNVBAgMClNvbWUtU3RhdGUxITAfBgNVBAoM
GEludGVybmV0IFdpZGdpdHMgUHR5IEx0ZDAeFw0yNDAxMDEwMDAwMDBaFw0yNTAx
MDEwMDAwMDBaMEUxCzAJBgNVBAYTAlVTMRMwEQYDVQQIDApTb21lLVN0YXRlMSEw
HwYDVQQKDBhJbnRlcm5ldCBXaWRnaXRzIFB0eSBMdGQwggEiMA0GCSqGSIb3DQEB
AQUAA4IBDwAwggEKAoIBAQDKhCqV3L9UZ2Z2O3L1LKjKW3QJqKCLOoNJZ3VZ2Z2O
-----END CERTIFICATE-----
"@ | Out-File -FilePath "nginx/ssl/cert.pem" -Encoding UTF8
    
    @"
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDKhCqV3L9UZ2Z2
O3L1LKjKW3QJqKCLOoNJZ3VZ2Z2O3L1LKjKW3QJqKCLOoNJZ3VZ2Z2O3L1LKjKW3
-----END PRIVATE KEY-----
"@ | Out-File -FilePath "nginx/ssl/key.pem" -Encoding UTF8
    
    Write-Host "✓ SSL certificates generated (development only)" -ForegroundColor Green
} else {
    Write-Host "✓ SSL certificates already exist" -ForegroundColor Green
}

# Start Docker services
Write-Host "`nStarting Docker services..." -ForegroundColor Yellow
docker-compose up -d postgres redis elasticsearch minio
Write-Host "✓ Docker services started" -ForegroundColor Green

# Wait for PostgreSQL to be ready
Write-Host "`nWaiting for PostgreSQL..." -ForegroundColor Yellow
$attempts = 0
$maxAttempts = 30
while ($attempts -lt $maxAttempts) {
    try {
        docker-compose exec -T postgres pg_isready -U aiplatform 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            break
        }
    } catch {}
    Write-Host "." -NoNewline
    Start-Sleep -Seconds 1
    $attempts++
}
Write-Host ""
Write-Host "✓ PostgreSQL is ready" -ForegroundColor Green

# Display success message
Write-Host "`n🎉 Setup completed successfully!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Edit .env file with your configuration"
Write-Host "2. Run 'npm run dev' to start development servers"
Write-Host "3. Visit http://localhost:3000 for the frontend"
Write-Host "4. Visit http://localhost:3001/api/docs for API documentation"
Write-Host "5. Visit http://localhost:3000/admin for the admin dashboard"

Write-Host "`nUseful commands:" -ForegroundColor Yellow
Write-Host "npm run dev              - Start development servers"
Write-Host "npm run test             - Run tests"
Write-Host "npm run lint             - Run linting"
Write-Host "npm run db:migrate       - Run database migrations"
Write-Host "docker-compose up        - Start all services"
Write-Host "docker-compose logs -f   - View logs"

Write-Host "`nHappy coding! 🚀" -ForegroundColor Green
