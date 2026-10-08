# ==============================================================================
# Planet G - Automated Component Sync Script
# Updates header and footer across all 6 pages from 'partials/' folder.
# Run this script whenever you edit 'partials/header.html' or 'partials/footer.html'.
# ==============================================================================

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

$headerPartialPath = Join-Path $scriptDir "partials\header.html"
$footerPartialPath = Join-Path $scriptDir "partials\footer.html"

if (-not (Test-Path $headerPartialPath)) {
    Write-Error "Error: 'partials\header.html' not found!"
    Exit 1
}

if (-not (Test-Path $footerPartialPath)) {
    Write-Error "Error: 'partials\footer.html' not found!"
    Exit 1
}

$headerTemplate = [System.IO.File]::ReadAllText($headerPartialPath, [System.Text.Encoding]::UTF8)
$footerTemplate = [System.IO.File]::ReadAllText($footerPartialPath, [System.Text.Encoding]::UTF8)

# Page map: filename => active route key
$pages = @{
    "index.html"        = "home"
    "services.html"     = "services"
    "about.html"        = "about"
    "projects.html"     = "projects"
    "testimonials.html" = "testimonials"
    "contact.html"      = "contact"
}

Write-Host "==========================================================" -ForegroundColor Green
Write-Host " Syncing Planet G Header & Footer Partials to All Pages..." -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green

foreach ($item in $pages.GetEnumerator()) {
    $fileName = $item.Key
    $activeRoute = $item.Value
    $filePath = Join-Path $scriptDir $fileName

    if (-not (Test-Path $filePath)) {
        Write-Warning "File not found: $fileName (skipping)"
        continue
    }

    $content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

    # 1. Prepare page-specific header with the correct 'active' link
    $pageHeader = $headerTemplate
    $routes = @("home", "services", "about", "projects", "testimonials", "contact")
    foreach ($r in $routes) {
        $placeholder = "{{ACTIVE_" + $r.ToUpper() + "}}"
        if ($r -eq $activeRoute) {
            $pageHeader = $pageHeader.Replace($placeholder, "active")
        } else {
            $pageHeader = $pageHeader.Replace($placeholder, "")
        }
    }
    # Clean any extra spaces in class names
    $pageHeader = [System.Text.RegularExpressions.Regex]::Replace($pageHeader, 'class="nav-link\s+"', 'class="nav-link"')

    # 2. Replace Header between delimiters (or fallback to topbar/menu-modal regex)
    $headerRegex = "(?s)<!-- HEADER_START -->.*?<!-- HEADER_END -->"
    if ([System.Text.RegularExpressions.Regex]::IsMatch($content, $headerRegex)) {
        $content = [System.Text.RegularExpressions.Regex]::Replace($content, $headerRegex, "<!-- HEADER_START -->`r`n" + $pageHeader.Trim() + "`r`n    <!-- HEADER_END -->")
    } else {
        # Fallback if markers don't exist yet
        $fallbackHeaderRegex = "(?s)<!-- 1\. INFOBAR -->.*?</div>\s*</div>\s*</div>"
        if ([System.Text.RegularExpressions.Regex]::IsMatch($content, $fallbackHeaderRegex)) {
            $content = [System.Text.RegularExpressions.Regex]::Replace($content, $fallbackHeaderRegex, "<!-- HEADER_START -->`r`n" + $pageHeader.Trim() + "`r`n    <!-- HEADER_END -->")
        }
    }

    # 3. Replace Footer between delimiters (or fallback to <footer class="footer">...</footer>)
    $footerRegex = "(?s)<!-- FOOTER_START -->.*?<!-- FOOTER_END -->"
    if ([System.Text.RegularExpressions.Regex]::IsMatch($content, $footerRegex)) {
        $content = [System.Text.RegularExpressions.Regex]::Replace($content, $footerRegex, "<!-- FOOTER_START -->`r`n" + $footerTemplate.Trim() + "`r`n    <!-- FOOTER_END -->")
    } else {
        $fallbackFooterRegex = "(?s)(<!-- \d+\. (?:EXACT ORIGINAL )?FOOTER -->\s*)?<footer class=""footer"">.*?</footer>"
        if ([System.Text.RegularExpressions.Regex]::IsMatch($content, $fallbackFooterRegex)) {
            $content = [System.Text.RegularExpressions.Regex]::Replace($content, $fallbackFooterRegex, "<!-- FOOTER_START -->`r`n" + $footerTemplate.Trim() + "`r`n    <!-- FOOTER_END -->")
        }
    }

    [System.IO.File]::WriteAllText($filePath, $content, [System.Text.Encoding]::UTF8)
    Write-Host " [OK] Synced: $fileName (Active: $activeRoute)" -ForegroundColor Cyan
}

Write-Host "==========================================================" -ForegroundColor Green
Write-Host " All 6 pages successfully updated from 'partials/'!" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
