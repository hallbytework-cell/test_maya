param(
    [string]$InputPath = "./public/images",
    [string]$OutputPath = "./optimized",
    [int]$Quality = 75
)

# Set FFmpeg path
$ffmpegExe = "C:\Users\rider\AppData\Local\CapCut\3.3.8.1212\ffmpeg.exe"
if (-not (Test-Path $ffmpegExe)) {
    Write-Error "FFmpeg not found at $ffmpegExe. Please ensure it's installed."
    exit 1
}

# Ensure output directory exists
if (-not (Test-Path $OutputPath)) {
    New-Item -ItemType Directory -Path $OutputPath | Out-Null
}

# Get all image files
$imageExtensions = @('*.jpg', '*.jpeg', '*.png')
$images = @()

foreach ($ext in $imageExtensions) {
    $images += Get-ChildItem -Path $InputPath -Filter $ext -Recurse -ErrorAction SilentlyContinue
}

if ($images.Count -eq 0) {
    Write-Host "No images found in $InputPath"
    exit 0
}

Write-Host "Found $($images.Count) images to optimize"
Write-Host ""

$totalOriginalSize = 0
$totalOptimizedSize = 0

foreach ($image in $images) {
    $relativePath = $image.FullName.Replace($InputPath, "").TrimStart("\")
    $outputDir = Join-Path $OutputPath ([System.IO.Path]::GetDirectoryName($relativePath))
    
    if (-not (Test-Path $outputDir)) {
        New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
    }
    
    $fileName = $image.BaseName
    $originalSize = $image.Length
    $totalOriginalSize += $originalSize
    
    Write-Host "Processing: $relativePath"
    
    # Create 400w variant
    try {
        & $ffmpegExe -i $image.FullName -vf "scale=400:-1" -c:v libwebp -q:v $Quality "$outputDir\$fileName-400w.webp" -y 2>$null
        & $ffmpegExe -i $image.FullName -vf "scale=400:-1" -q:v $Quality "$outputDir\$fileName-400w.$($image.Extension.TrimStart('.'))" -y 2>$null
    }
    catch {
        Write-Warning "Failed to create 400w variants for $fileName"
    }
    
    # Create 600w variant
    try {
        & $ffmpegExe -i $image.FullName -vf "scale=600:-1" -c:v libwebp -q:v $Quality "$outputDir\$fileName-600w.webp" -y 2>$null
        & $ffmpegExe -i $image.FullName -vf "scale=600:-1" -q:v $Quality "$outputDir\$fileName-600w.$($image.Extension.TrimStart('.'))" -y 2>$null
    }
    catch {
        Write-Warning "Failed to create 600w variants for $fileName"
    }
    
    # Create 1200w variant (WebP only)
    try {
        & $ffmpegExe -i $image.FullName -vf "scale=1200:-1" -c:v libwebp -q:v $Quality "$outputDir\$fileName-1200w.webp" -y 2>$null
    }
    catch {
        Write-Warning "Failed to create 1200w WebP for $fileName"
    }
    
    Write-Host "  + 400w (WebP + $($image.Extension)), 600w (WebP + $($image.Extension)), 1200w (WebP)"
}

# Calculate total size
if (Test-Path $OutputPath) {
    $optimized = Get-ChildItem -Path $OutputPath -Recurse -File
    $totalOptimizedSize = ($optimized | Measure-Object -Property Length -Sum).Sum
}

Write-Host ""
Write-Host "Optimization Complete!"
$origMB = [Math]::Round($totalOriginalSize / 1MB, 2)
$optMB = [Math]::Round($totalOptimizedSize / 1MB, 2)
$savingsKB = [Math]::Round(($totalOriginalSize - $totalOptimizedSize) / 1KB, 0)
$savingsPct = [Math]::Round((1 - ($totalOptimizedSize / $totalOriginalSize)) * 100, 1)
Write-Host "Original size: $origMB MB"
Write-Host "Optimized size: $optMB MB"
Write-Host "Savings: $savingsKB KB ($savingsPct%)"
Write-Host ""
Write-Host "Optimized images saved to: $OutputPath"
