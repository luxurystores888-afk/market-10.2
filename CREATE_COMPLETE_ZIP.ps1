# PowerShell Script to Create Complete ZIP of All Work

Write-Host "`n==================================================" -ForegroundColor Cyan
Write-Host "    CREATING COMPLETE ZIP OF ALL YOUR WORK" -ForegroundColor Yellow
Write-Host "==================================================" -ForegroundColor Cyan

# Set paths
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$projectName = "Complete-AI-Platform-Project-$timestamp"
$currentPath = Split-Path -Parent $PSScriptRoot
$sourcePath = Join-Path $currentPath "tocontiniue-building-web"
$zipPath = Join-Path $currentPath "$projectName.zip"

Write-Host "`nPreparing to create ZIP file..." -ForegroundColor Yellow
Write-Host "Source: $sourcePath" -ForegroundColor Gray
Write-Host "Output: $zipPath" -ForegroundColor Gray

# Check if source exists
if (Test-Path $sourcePath) {
    Write-Host "`n✓ Found project folder!" -ForegroundColor Green
    
    # Count files
    $fileCount = (Get-ChildItem -Path $sourcePath -Recurse -File).Count
    Write-Host "Total files to compress: $fileCount" -ForegroundColor Cyan
    
    # Create ZIP
    Write-Host "`nCreating ZIP file (this may take a moment)..." -ForegroundColor Yellow
    
    try {
        # Remove existing ZIP if it exists
        if (Test-Path $zipPath) {
            Remove-Item $zipPath -Force
        }
        
        # Create the ZIP file
        Add-Type -Assembly System.IO.Compression.FileSystem
        [System.IO.Compression.ZipFile]::CreateFromDirectory($sourcePath, $zipPath, 'Optimal', $false)
        
        # Get file info
        $zipInfo = Get-Item $zipPath
        $sizeMB = [math]::Round($zipInfo.Length / 1MB, 2)
        
        Write-Host "`n==================================================" -ForegroundColor Green
        Write-Host "✅ ZIP FILE CREATED SUCCESSFULLY!" -ForegroundColor Green
        Write-Host "==================================================" -ForegroundColor Green
        Write-Host "`nFile Details:" -ForegroundColor Yellow
        Write-Host "Name: $($zipInfo.Name)" -ForegroundColor White
        Write-Host "Size: $sizeMB MB" -ForegroundColor White
        Write-Host "Location: $zipPath" -ForegroundColor White
        
        Write-Host "`nThis ZIP contains:" -ForegroundColor Yellow
        Write-Host "• AI Platform (Complete full-stack application)" -ForegroundColor White
        Write-Host "• CYBER MART 2077 (E-commerce platform)" -ForegroundColor White
        Write-Host "• All documentation and guides" -ForegroundColor White
        Write-Host "• Docker and Kubernetes configurations" -ForegroundColor White
        Write-Host "• Setup scripts and utilities" -ForegroundColor White
        
        Write-Host "`nWhat to do next:" -ForegroundColor Yellow
        Write-Host "1. The ZIP file is saved at:" -ForegroundColor White
        Write-Host "   $zipPath" -ForegroundColor Cyan
        Write-Host "2. You can upload it to Google Drive/Dropbox" -ForegroundColor White
        Write-Host "3. Transfer it to another computer" -ForegroundColor White
        Write-Host "4. Extract it anywhere to use the platform" -ForegroundColor White
        
        # Ask if user wants to open the folder
        Write-Host "`nPress 'O' to open the folder, or any other key to exit..." -ForegroundColor Yellow
        $key = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        
        if ($key.Character -eq 'o' -or $key.Character -eq 'O') {
            Start-Process explorer.exe -ArgumentList "/select,`"$zipPath`""
        }
        
    } catch {
        Write-Host "`n❌ ERROR creating ZIP file!" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
} else {
    Write-Host "`n❌ ERROR: Could not find the project folder!" -ForegroundColor Red
    Write-Host "Expected path: $sourcePath" -ForegroundColor Red
}

Write-Host "`n==================================================" -ForegroundColor Cyan
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
