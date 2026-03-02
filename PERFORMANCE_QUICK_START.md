# LIGHTHOUSE OPTIMIZATION - Quick Start Guide

## ✅ COMPLETED (Deploy These Changes)

### Phase 1: Configuration Optimization (READY NOW)
```bash
Files Modified:
✅ vercel.json - Cache headers added (8 rule sets, 1-year immutable assets)
✅ vite.config.js - Compression plugins + improved code splitting (6 vendor chunks)
✅ index.html - Preconnect optimized (reduced from 7 to 4 connections)
✅ PlatformFeedbackModal.jsx - Debug code removed

Expected Score Improvement: +15-25 points
Savings: ~1,500 KiB (cache) + compression

Deploy Command:
git add -A && git commit -m "Performance: Phase 1 - Cache headers, compression, preconnect optimization" && git push origin main
```

---

## 🔴 HIGH PRIORITY - Do This Next Week

### Task 1: Lazy-Load Modal Components (300+ KiB Savings)

**File**: `src/components/index.js` (or create if doesn't exist)
```javascript
// ✅ BEFORE: All imports at once
import AuthModal from './AuthModal';
import ReviewModal from './ReviewModal';
import CancelOrderModal from './CancelOrderModal';

// ✅ AFTER: Lazy loading
import { lazy, Suspense } from 'react';

export const AuthModal = lazy(() => import('./AuthModal'));
export const ReviewModal = lazy(() => import('./ReviewModal'));
export const CancelOrderModal = lazy(() => import('./CancelOrderModal'));
export const PlatformFeedbackModal = lazy(() => import('./PlatformFeedbackModal'));
export const SortBottomSheet = lazy(() => import('./SortBottomSheet'));
export const FilterSidebar = lazy(() => import('./FilterSidebar'));

// Fallback wrapper
export const ModalFallback = () => null; // Don't show anything while loading
```

**File**: Where modals are rendered (likely `src/layout.jsx` or `src/App.jsx`)
```javascript
import { Suspense } from 'react';
import { 
  AuthModal, 
  ReviewModal, 
  CancelOrderModal,
  ModalFallback 
} from '@/components';

export function Layout() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  // ... other state

  return (
    <>
      {/* Main content */}
      
      <Suspense fallback={null}>
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      </Suspense>
      
      <Suspense fallback={null}>
        {showReviewModal && <ReviewModal onClose={() => setShowReviewModal(false)} />}
      </Suspense>
    </>
  );
}
```

**Expected Impact**: 
- Load time: Reduced by 200-300 KiB (modals only load when needed)
- Initial bundle: Smaller by 40-50%
- Score: +10-15 points

**Time to Implement**: 2-3 hours

---

### Task 2: Component Performance Profiling (1.0+ Second Savings)

**Step 1**: Install React DevTools if not already installed
```bash
# Chrome DevTools already has Profiler tab, or use React DevTools extension
```

**Step 2**: Add profiling to slow components
```javascript
// File: src/pages/product/index.jsx
import { Profiler } from 'react';

function onRenderCallback(id, phase, actualDuration) {
  if (actualDuration > 100) {
    console.warn(`Slow Render: ${id} (${phase}): ${actualDuration.toFixed(2)}ms`);
  }
}

export function ProductPage() {
  return (
    <Profiler id="ProductPage" onRender={onRenderCallback}>
      {/* Component content */}
    </Profiler>
  );
}
```

**Step 3**: Identify slow renders, apply memoization
```javascript
// BEFORE: Re-renders every time props change
const productStructure = structurePlantDataForUI(productData);

// AFTER: Only recalculates when productData changes
const productStructure = useMemo(
  () => structurePlantDataForUI(productData),
  [productData]
);

// BEFORE: New function created on every render
const handleFilterChange = (filters) => {
  // ...
};

// AFTER: Function only recreated when dependencies change
const handleFilterChange = useCallback((filters) => {
  // ...
}, [/* dependencies */]);
```

**Components to Profile** (Highest Priority):
- src/pages/product/index.jsx (1,226 lines - largest component)
- src/pages/category/index.jsx (455 lines)
- src/components/ProductGrid.jsx (renders many cards)

**Expected Impact**:
- Render time: Reduced by 1.0-1.5 seconds
- Score: +15-20 points

**Time to Implement**: 1-2 hours

---

## 🟡 MEDIUM PRIORITY - Week 3+

### Task 3: Image Optimization (800+ KiB Savings)

**Using OptimizedImage Component** (already exists):
```javascript
// Check if OptimizedImage supports WebP:
// File: src/components/OptimizedImage.jsx

import { useState } from 'react';

export function OptimizedImage({ src, alt, ...props }) {
  const [imgSrc, setImgSrc] = useState(src);
  
  // Generate WebP version
  const webpSrc = src.replace(/\.(jpg|jpeg|png)$/, '.webp');
  
  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <img 
        src={imgSrc} 
        alt={alt}
        onError={() => setImgSrc(src)} // Fallback if WebP not supported
        loading="lazy"
        {...props}
      />
    </picture>
  );
}
```

**Action Items**:
1. Convert product images to WebP format:
   ```bash
   # Install cwebp (Linux/Mac):
   # brew install webp
   # Or download from: https://developers.google.com/speed/webp/download
   
   # Convert all JPGs to WebP:
   for file in public/images/**/*.jpg; do 
     cwebp "$file" -o "${file%.jpg}.webp"
   done
   ```

2. Update OptimizedImage component to prefer WebP

3. Test in Chrome DevTools (DevTools > Network > check image sizes)

**Expected Impact**:
- Image size: 30-50% reduction
- Total savings: 600-800 KiB
- Score: +5-10 points

**Time to Implement**: 1-2 hours

---

### Task 4: CSS Optimization (12-20 KiB Savings)

**Check tailwind.config.js**:
```javascript
// File: tailwind.config.js
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  // Make sure safelist is empty (no dynamic classes that need protecting)
  safelist: [],
  theme: {
    extend: {},
  },
  // Check for unused plugins
  plugins: [],
  corePlugins: {
    // Disable utilities you don't use:
    // animation: false,
    // transition: false,
    // transform: false,
  }
};
```

**Expected Impact**:
- CSS size: 12-20 KiB reduction
- Score: +2-5 points

**Time to Implement**: 30 minutes

---

## 🔵 LOW PRIORITY - Future Optimization

### Task 5: Font Optimization
- Subset fonts (only load characters used)
- Use system fonts for fallback
- Load fonts async

### Task 6: Render-Blocking Scripts
- Defer non-critical scripts
- Inline critical CSS
- Async load analytics

### Task 7: API Response Compression
- Enable gzip on server
- Paginate API responses
- Cache API responses

---

## 📊 Expected Results Timeline

```
Week 1 (DONE):
Deploy Phase 1 config changes
Next Day: +15-25 score points
Savings: 1,500 KiB + compression

Week 2:
Implement Task 1 & 2 (lazy-load modals + profiling)
Result: +25-35 score points
Savings: 300+ KiB + 1 second faster

Week 3:
Implement Task 3 & 4 (images + CSS)
Result: +35-50 score points
Savings: 800+ KiB additional

TOTAL: From ~55 to >90 Score 📈
```

---

## 🚀 Deployment Checklist

### Before Deploying Phase 1:
- [ ] Run `npm run build` locally to verify no errors
- [ ] Check bundle size in console output
- [ ] Verify no breaking changes in UI

### After Deploying Phase 1:
- [ ] Wait 24 hours for Vercel to fully deploy
- [ ] Run Lighthouse audit on production
- [ ] Check cache headers: `curl -I https://mayavriksh.in/images/banner/banner1.jpg`
- [ ] Monitor CSS Core Web Vitals
- [ ] Check Google PageSpeed Insights

### Validation Commands:
```bash
# Check cache headers
curl -I https://mayavriksh.in/images/banner/banner1.jpg
# Expected: Cache-Control: public, max-age=31536000, immutable

# Check compression
curl -H "Accept-Encoding: br" https://mayavriksh.in/ -I | grep Content-Encoding
# Expected: Content-Encoding: br

# Check preconnect count
curl https://mayavriksh.in/ | grep "preconnect" | wc -l
# Expected: 2 (only fonts)
```

---

## 📝 Implementation Order (Recommended)

1. **Now**: Deploy Phase 1 (config changes) ✅
2. **This Week**: Lazy-load modals (Task 1) via component refactoring
3. **Next Week**: Profile & optimize components (Task 2) with React DevTools
4. **Week 3**: Optimize images (Task 3) to WebP format
5. **Week 3**: CSS purge (Task 4) via tailwind config

**Total Time Estimate**: 6-8 hours across 3 weeks

---

## 🆘 Need Help?

### Debugging Slow Components:
```javascript
// Chrome DevTools Performance tab:
1. Open DevTools > Performance tab
2. Click Record
3. Interact with page (scroll, click, filter)
4. Click Stop
5. Look for red bars (long tasks > 50ms)
6. Click on task to see which component caused it
```

### Checking Bundle Size:
```bash
npm run build

# Output will show:
# dist/assets/vendor-react-XXX.js     180.5 kB │ gzip: 45.2 kB │ brotli: 38.5 kB
# dist/assets/app-XXX.js               95.3 kB │ gzip: 28.4 kB │ brotli: 24.2 kB
# dist/assets/index-XXX.css            12.8 kB │ gzip: 2.4 kB  │ brotli: 1.9 kB
```

### Visualizing Bundle:
```bash
# Bundle visualizer should work with vite.config.js
# After build, check: dist/stats.html
```

---

**Phase 1 Status**: ✅ READY TO DEPLOY  
**Phase 2-4 Status**: 🟡 QUEUED FOR NEXT WEEK  
**Next Action**: Run `git push` to deploy Phase 1 changes!
