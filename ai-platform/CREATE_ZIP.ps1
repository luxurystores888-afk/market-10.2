# PowerShell Script to Create ZIP of AI Platform

Write-Host "Creating ZIP file of your AI Platform..." -ForegroundColor Cyan

# Get current directory
$currentPath = Get-Location
$platformPath = Join-Path $currentPath ""
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$zipFileName = "AI-Platform-Complete-$timestamp.zip"
$zipPath = Join-Path $currentPath ".." $zipFileName

# Check if platform directory exists
if (Test-Path $platformPath) {
    Write-Host "Found AI Platform files at: $platformPath" -ForegroundColor Green
    
    # Create ZIP file
    Write-Host "Creating ZIP file..." -ForegroundColor Yellow
    
    # Use Windows built-in compression
    Add-Type -Assembly System.IO.Compression.FileSystem
    [System.IO.Compression.ZipFile]::CreateFromDirectory($platformPath, $zipPath)
    
    # Get file size
    $zipSize = (Get-Item $zipPath).Length / 1MB
    $zipSizeFormatted = "{0:N2}" -f $zipSize
    
    Write-Host "`n✅ SUCCESS! ZIP file created:" -ForegroundColor Green
    Write-Host "Location: $zipPath" -ForegroundColor Cyan
    Write-Host "Size: $zipSizeFormatted MB" -ForegroundColor Cyan
    Write-Host "`nYou can now:" -ForegroundColor Yellow
    Write-Host "1. Upload this ZIP to Google Drive/Dropbox" -ForegroundColor White
    Write-Host "2. Send it via email" -ForegroundColor White
    Write-Host "3. Transfer to another computer" -ForegroundColor White
    Write-Host "4. Keep as backup" -ForegroundColor White
} else {
    Write-Host "Error: Could not find platform files!" -ForegroundColor Red
}

Write-Host "`nPress any key to open the folder containing your ZIP file..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Open Explorer at the ZIP location
Start-Process explorer.exe -ArgumentList "/select,`"$zipPath`""
