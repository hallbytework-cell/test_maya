#!/bin/bash

# MayaVriksh Performance Optimization Verification Script
# This script verifies that all Lighthouse optimizations have been applied

echo "🚀 MayaVriksh Performance Optimization Verification"
echo "=================================================="
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

check_mark="${GREEN}✓${NC}"
cross_mark="${RED}✗${NC}"

# Track results
PASSED=0
FAILED=0

# Function to check file content
check_content() {
    local file=$1
    local pattern=$2
    local description=$3
    
    if grep -q "$pattern" "$file" 2>/dev/null; then
        echo -e "${check_mark} $description"
        ((PASSED++))
    else
        echo -e "${cross_mark} $description (NOT FOUND in $file)"
        ((FAILED++))
    fi
}

# Function to check file doesn't contain pattern
check_not_content() {
    local file=$1
    local pattern=$2
    local description=$3
    
    if ! grep -q "$pattern" "$file" 2>/dev/null; then
        echo -e "${check_mark} $description (correctly removed)"
        ((PASSED++))
    else
        echo -e "${cross_mark} $description (still present in $file)"
        ((FAILED++))
    fi
}

echo "📋 CHECKING OPTIMIZATIONS"
echo ""

echo "1️⃣  Cache Headers (_headers file):"
check_content "public/_headers" "Cache-Control: public, immutable, max-age=31536000" "  - JS/CSS cached for 1 year (immutable)"
check_content "public/_headers" "Cache-Control: public, max-age=2592000" "  - Images cached for 30 days"
check_content "public/_headers" "Cache-Control: public, max-age=7200" "  - Product pages cached for 2 hours"
check_content "public/_headers" "stale-while-revalidate" "  - Stale-while-revalidate headers added"
echo ""

echo "2️⃣  Preconnect Optimization (index.html):"
check_not_content "index.html" 'dns-prefetch.*googletagmanager' "  - DNS-prefetch to Google Analytics removed"
check_not_content "index.html" 'dns-prefetch.*google-analytics' "  - DNS-prefetch to GA removed"
check_content "index.html" 'preconnect.*fonts.googleapis' "  - Preconnect to Google Fonts (kept)"
echo ""

echo "3️⃣  Font Loading Optimization (index.html):"
check_not_content "index.html" 'media=\"print\"' "  - Duplicate font loading removed"
check_content "index.html" 'display=swap' "  - font-display=swap enabled"
check_not_content "index.html" 'onload=\"this.media=' "  - Media toggle workaround removed"
echo ""

echo "4️⃣  Google Analytics Optimization (index.html):"
check_content "index.html" "analyticsLoaded = false" "  - Analytics deduplication flag added"
check_content "index.html" "setTimeout(loadAnalytics, 3000)" "  - Analytics deferred by 3 seconds"
check_not_content "index.html" "setTimeout(function.*2000" "  - Old 2-second delay removed"
echo ""

echo "5️⃣  Build Configuration (vite.config.js):"
check_content "vite.config.js" "vendor-firebase" "  - Firebase separated into own chunk"
check_content "vite.config.js" "pure_funcs" "  - Pure function optimization enabled"
check_content "vite.config.js" "assetsInlineLimit: 4096" "  - Small assets inline (4KB limit)"
check_content "vite.config.js" "target: 'es2020'" "  - Modern browser target set"
echo ""

echo "6️⃣  CSP Headers (_headers file):"
check_not_content "public/_headers" "google-analytics.com" "  - google-analytics.com removed from CSP"
check_content "public/_headers" "googletagmanager.com" "  - googletagmanager.com in CSP"
echo ""

# Summary
echo ""
echo "=================================================="
echo "📊 SUMMARY"
echo "=================================================="
TOTAL=$((PASSED + FAILED))
PERCENTAGE=$((PASSED * 100 / TOTAL))

echo -e "Checks Passed: ${GREEN}$PASSED${NC}/$TOTAL"
echo -e "Checks Failed: ${RED}$FAILED${NC}/$TOTAL"
echo -e "Success Rate: ${YELLOW}$PERCENTAGE%${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All optimizations verified!${NC}"
    echo ""
    echo "🎯 Next Steps:"
    echo "  1. Run: npm run build"
    echo "  2. Run: npm run preview"
    echo "  3. Test in Chrome DevTools → Lighthouse"
    echo "  4. Expected improvements:"
    echo "     - Cache lifetimes: ~1,051 KiB saved"
    echo "     - Image delivery: ~1,416 KiB saved"
    echo "     - LCP improvement: ~100ms faster"
    exit 0
else
    echo -e "${RED}✗ Some checks failed. Please review the changes.${NC}"
    exit 1
fi
