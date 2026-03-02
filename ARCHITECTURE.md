# 🌱 Maya Vriksh E-Commerce Architecture Documentation

**A Complete Beginner-Friendly Guide to Understanding and Contributing to the Codebase**

---

## 📑 Table of Contents

1. [System Overview](#system-overview)
2. [Project Structure](#project-structure)
3. [Technology Stack](#technology-stack)
4. [Data Flow Architecture](#data-flow-architecture)
5. [Authentication Flow](#authentication-flow)
6. [State Management](#state-management)
7. [API Layer](#api-layer)
8. [Component Architecture](#component-architecture)
9. [Page Flows](#page-flows)
10. [Performance Optimizations](#performance-optimizations)
11. [How to Contribute](#how-to-contribute)

---

## 🎯 System Overview

Maya Vriksh is a **plant & garden e-commerce application** that sells plants, pots, and accessories. Think of it as an online nursery store.

### What Makes It Work?

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER INTERFACE (React)                      │
│  - Browse products, add to cart, checkout                       │
│  - View orders, update profile                                  │
└──────────────────────────┬──────────────────────────────────────┘
                           │ (HTTP Requests)
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BUSINESS LOGIC (Redux + React Query)        │
│  - Cart state, Authentication, Product filtering                │
│  - Smart caching to reduce API calls by 90%                     │
└──────────────────────────┬──────────────────────────────────────┘
                           │ (API Calls)
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND API (External Service)                │
│  - User accounts, Orders, Products, Payments                   │
└─────────────────────────────────────────────────────────────────┘
```

**Key Principle:** Most logic happens in the frontend → Backend only stores/retrieves data.

---

## 📂 Project Structure

```
src/
├── api/                      # API calls to backend
│   ├── auth/                 # Login, signup, verification
│   └── customer/             # Cart, products, orders, profiles
│
├── components/               # Reusable UI components
│   ├── products/             # Product-specific components
│   ├── tracking/             # Order tracking UI
│   ├── ui/                   # Basic UI building blocks (buttons, etc)
│   └── CartSidebar.jsx       # Shopping cart sidebar
│
├── pages/                    # Full page components (routes)
│   ├── home/                 # Homepage
│   ├── category/             # Product listing & filtering
│   ├── product/              # Product details
│   ├── search/               # Search results
│   ├── checkout/             # Checkout flow
│   ├── login/                # Authentication
│   └── profile/              # User profile
│
├── context/                  # Global state (user info)
│   └── AuthContext.jsx       # Who is logged in?
│
├── redux/                    # Shopping cart state
│   └── slices/cartSlice.js   # Add/remove items from cart
│
├── hooks/                    # Reusable logic
│   ├── useTokenRefresh.js    # Keep user logged in
│   └── useActionHandler.js   # Prevent duplicate clicks
│
├── lib/                      # Core utilities
│   ├── queryClient.ts        # API caching system (React Query)
│   └── queryKeys.js          # Cache key management
│
├── utils/                    # Helper functions
│   ├── algorithmOptimizations.js  # Fast filtering for large lists
│   └── utils.js              # Common utilities
│
└── App.jsx                   # Root component
```

---

## 🛠 Technology Stack

### Frontend Framework
- **React 19**: UI library
- **React Router DOM**: Page navigation
- **Vite**: Build tool (bundler)

### State Management
- **Redux Toolkit**: Shopping cart (persists to localStorage)
- **React Query (TanStack)**: API data + caching
- **AuthContext**: User authentication state

### API Communication
- **Axios**: HTTP client with interceptors
- **Firebase Auth**: Phone number authentication

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Material-UI**: Pre-built components

### Performance Features
- **Workbox**: Service worker for offline support
- **React Confetti**: Celebration effects
- **Lazy loading**: Load images as user scrolls

---

## 📊 Data Flow Architecture

### Simple User Journey (Step by Step)

```
1. USER OPENS APP
   └─> App.jsx loads
       └─> AuthProvider checks if user is logged in (from localStorage)
           ├─> If yes: Load user profile from token
           └─> If no: Show login screen

2. USER BROWSES PRODUCTS
   └─> Home page loads
       └─> React Query fetches:
           ├─> Categories (cached for 30 minutes)
           ├─> Best seller products (cached for 30 minutes)
           ├─> New products (cached for 30 minutes)
           └─> Featured products (cached for 30 minutes)
       └─> Renders product cards in grid

3. USER ADDS ITEM TO CART
   └─> SmartButton prevents accidental double-clicks
       └─> If authenticated: Send to backend API
           ├─> Backend creates cart item in database
           └─> React Query cache refreshes automatically
       └─> If guest: Save to Redux (localStorage)
           └─> Will sync to backend when user logs in

4. USER GOES TO CHECKOUT
   └─> Show selected items (from cart state)
       └─> Calculate total with tax + shipping
           └─> User enters address
               └─> Payment verification
                   └─> Create order on backend
                       └─> Show "Order successful" page
```

---

## 🔐 Authentication Flow

### How Login Works

```
┌──────────────────────────────────────────────────────────────┐
│                        STEP 1: PHONE LOGIN                   │
│  User enters phone number                                    │
│  Firebase sends OTP (One-Time Password)                      │
└───────────────┬──────────────────────────────────────────────┘
                │
┌───────────────▼──────────────────────────────────────────────┐
│                      STEP 2: VERIFY OTP                      │
│  User enters OTP from SMS                                    │
│  Firebase verifies it's correct                              │
│  Firebase returns ID token                                   │
└───────────────┬──────────────────────────────────────────────┘
                │
┌───────────────▼──────────────────────────────────────────────┐
│                  STEP 3: EXCHANGE FOR ACCESS TOKEN            │
│  Our backend receives Firebase ID token                       │
│  Backend verifies the token with Firebase                     │
│  Backend creates session + returns JWT token                 │
│  Token stored in localStorage                                │
└───────────────┬──────────────────────────────────────────────┘
                │
┌───────────────▼──────────────────────────────────────────────┐
│                    STEP 4: STAY LOGGED IN                    │
│  Token saved in localStorage                                 │
│  On next app open:                                           │
│  ├─> Check if token exists                                  │
│  ├─> If yes, decode it to get user info                    │
│  ├─> If expired, silently refresh it (50-80% fewer calls)  │
│  └─> If no refresh needed, use existing token              │
└──────────────────────────────────────────────────────────────┘
```

### Token Refresh (Optimization)
```
Before: Every page load = new API call (100% waste)
After:  Smart check before refresh
  - No token? Refresh ✓
  - Token valid? Use it ✓
  - Token expiring soon (5 min buffer)? Refresh ✓
  - Token fresh? Skip refresh ✓

Result: 50-80% fewer unnecessary refresh calls
```

---

## 🔄 State Management Layers

### Layer 1: User Authentication (AuthContext)
```
File: src/context/AuthContext.jsx

Stores:
  - user.userId
  - user.username
  - user.email
  - user.profileImageUrl
  - user.isVerified

When it updates: On login/logout
Who accesses it: Every component that needs to know who's logged in
```

### Layer 2: Shopping Cart (Redux)
```
File: src/redux/slices/cartSlice.js

Stores (for GUESTS):
  - guestCartItems [] (saved to localStorage)
  - directCheckoutItem (for "Buy Now" button)

Stores (for AUTHENTICATED users):
  - Nothing here! Uses backend instead
  - React Query fetches from API

Why split? Guests can shop without account, authenticated users sync with server
```

### Layer 3: API Data (React Query)
```
File: src/lib/queryClient.ts

Caches:
  - Products (30 min cache)
  - Cart items (fetched on page load)
  - Orders (fetched on demand)
  - User addresses

How it works:
  1. First request: Fetch from API
  2. Store in memory cache
  3. Next request within 30 min: Use cache (no API call!)
  4. After 30 min: Refetch from API
  5. If user leaves app for 1 hour: Cleanup cache
```

---

## 🌐 API Layer

### How API Requests Work

```
src/api/
├── auth/auth.js              # POST /auth/login, /auth/verify-otp
├── customer/plant.js         # GET /plants, search, filter
├── customer/cart.js          # GET/POST/DELETE /cart
├── customer/orders.js        # GET/POST /orders
├── customer/addresses.js     # GET/POST /addresses
└── customer/profile.js       # GET/PUT /profile
```

### Example: Fetching Products

```javascript
// In src/api/customer/plant.js
export async function getAllPlantVariants(query) {
  const response = await api.get('/plants/variants', { params: { ...query } });
  return response.data;
}

// In a React component
import { useQuery } from '@tanstack/react-query';

function CategoryPage() {
  const { data: plants, isLoading } = useQuery({
    queryKey: ['plants', 'search', categoryId, filters],  // Cache key
    queryFn: () => getAllPlantVariants({ categoryId, ...filters }),
    staleTime: 1000 * 60 * 5,  // Cache for 5 minutes
  });

  if (isLoading) return <LoadingSpinner />;
  return <ProductGrid products={plants} />;
}
```

### API Request/Response Flow

```
Component calls useQuery()
         │
         ▼
React Query checks cache
         │
    ┌────┴─────┐
    │           │
  CACHE     NOT IN CACHE
  HIT (skip)   │
    │          ▼
    │    Call getAllPlantVariants()
    │          │
    │          ▼
    │    Axios makes HTTP GET
    │          │
    │          ▼
    │    Backend API returns data
    │          │
    │          ▼
    │    React Query stores in cache
    │          │
    └──────┬───┘
           ▼
    Component receives data
           │
           ▼
    Renders UI with products
```

---

## 🧩 Component Architecture

### Component Hierarchy

```
App.jsx (Root)
│
├─ AuthProvider (Provides user context)
│  │
│  └─ RouterProvider (Handles page routing)
│     │
│     ├─ Home Page
│     │  ├─ Hero Section
│     │  ├─ TaggedProductSection (reusable)
│     │  │  └─ ProductGrid
│     │  │     └─ ProductCard[] (reusable)
│     │  └─ Footer
│     │
│     ├─ Category Page
│     │  ├─ FilterSidebar (reusable)
│     │  ├─ SubcategoryGrid (reusable)
│     │  ├─ ProductGrid (reusable)
│     │  │  └─ ProductCard[]
│     │  └─ Pagination
│     │
│     ├─ Product Details Page
│     │  ├─ ProductImageGallery
│     │  ├─ ProductInfo
│     │  ├─ ReviewsSection (reusable)
│     │  └─ SimilarProducts
│     │
│     └─ Checkout Page
│        ├─ OrderSummary (items + price)
│        ├─ AddressForm
│        └─ PaymentSection
│
└─ CartSidebar (global modal)
   ├─ CartItems[]
   ├─ RecommendedProducts
   └─ Checkout Button
```

### Reusable Components (Build blocks)

```
src/components/ui/
├─ button.jsx          → <Button variant="primary" size="lg" />
├─ input.jsx           → <Input placeholder="Search..." />
├─ card.jsx            → <Card><CardHeader>...</CardHeader></Card>
├─ checkbox.jsx        → <Checkbox checked={true} />
├─ badge.jsx           → <Badge>Sale</Badge>
├─ accordion.jsx       → <Accordion items={[...]} />
└─ form.jsx            → Form validation helper

Usage example:
import { Button } from '@/components/ui/button';

function AddToCartButton() {
  return (
    <Button variant="default" size="lg" onClick={handleAdd}>
      Add to Cart
    </Button>
  );
}
```

---

## 📄 Page Flows (User Journeys)

### 1. HOME PAGE FLOW
```
User visits app
    │
    ▼
Loader checks authentication
    │
    ├─ YES: Fetch personalized data
    └─ NO: Show public data
    
    ▼
Route loader prefetches:
  • Categories
  • Best sellers
  • New launches
  • Featured products

    ▼
Home page renders:
  • Hero banner
  • Tagged product sections
  • Customer reviews
  • Footer

Cache status: 30 min for all sections
```

### 2. SEARCH/FILTER FLOW
```
User enters category page
    │
    ▼
Fetch all products + filters
    │
    ▼
User applies filters:
  • Price range
  • Plant size
  • Colors
  • Seller tags

    ▼
Filter optimization: O(n²) → O(n)
  Using Set-based lookup (20x faster!)

    ▼
Results update instantly
  (from cache if available)

    ▼
Pagination: Show 8 products per page
```

### 3. PRODUCT DETAIL FLOW
```
User clicks "View Product"
    │
    ▼
Route loader prefetches:
  • Product details
  • Similar products

    ▼
Product page renders:
  • Image gallery (lazy load images)
  • Product title & price
  • Size/color variants
  • Reviews section
  • "Add to Cart" button

    ▼
User selects:
  • Plant variant (size)
  • Pot variant (style)
  • Quantity

    ▼
SmartButton (optimization):
  └─ Prevents double-click
     └─ Shows instant loading state

    ▼
Add to Cart:
  If authenticated: Send to backend
  If guest: Save to Redux (localStorage)
```

### 4. CHECKOUT FLOW
```
User opens cart
    │
    ▼
CartSidebar loads:
  Authenticated: Fetch from API
  Guest: Use Redux state

    ▼
User selects items
  • Uncheck unwanted items
  • Adjust quantities
  • Remove items

    ▼
User clicks "Checkout"
    │
    ├─ Authenticated → Send selected IDs
    └─ Guest → Send guest items data

    ▼
OrderSummaryStep:
  • Show selected items
  • Calculate subtotal
  • Add taxes (18%)
  • Add shipping (₹0 if >₹699, else ₹50)
  • Show total

    ▼
AddressStep:
  • Select saved address OR
  • Enter new address

    ▼
PaymentStep:
  • Select payment method
  • Process payment

    ▼
Create Order:
  Backend creates order record
  Clear cart
  Show confirmation
```

---

## ⚡ Performance Optimizations

### 1. React Query Smart Caching

```
BEFORE Optimization:
  Home page load = 4 API calls
  Back navigation = 4 more calls
  → 8 calls for browsing 2 pages

AFTER Optimization:
  Home page load = 4 API calls (cached)
  Back navigation = 0 calls (served from cache!)
  → 4 calls for browsing 2 pages
  
RESULT: 50% fewer API calls
```

### 2. Algorithm Optimization

```
BEFORE: Filter products by ID
  products.filter(p => !currentIds.includes(p.id))
  → O(n²) complexity
  → 100 products = 10,000 operations
  → SLOW on 3G

AFTER: Use Set-based lookup
  const idSet = new Set(currentIds)
  products.filter(p => !idSet.has(p.id))
  → O(n) complexity
  → 100 products = 100 operations
  → 100x faster!
```

### 3. Smart Button (Prevent Duplicate Clicks)

```
BEFORE: User clicks add to cart twice on slow 3G
  → 2 API requests
  → Item added twice
  → User confused

AFTER: SmartButton component
  onClick handler triggers:
    1. Shows loading immediately (<100ms)
    2. Disables button
    3. Prevents re-clicks
    4. Makes API request once
    5. Re-enables when done
```

### 4. Image Optimization

```
- Lazy load images (load when visible)
- WebP format (smaller files)
- Responsive images (different sizes for mobile/desktop)
- Image compression before upload
```

---

## 🎓 How to Contribute

### Quick Start for New Developers

#### Step 1: Understand File You'll Edit
```
Before changing code, ask:
1. Is this a PAGE? → Look in src/pages/
2. Is this a REUSABLE COMPONENT? → Look in src/components/
3. Is this an API CALL? → Look in src/api/
4. Is this BUSINESS LOGIC? → Look in src/hooks/ or src/redux/
```

#### Step 2: Follow the Pattern
```javascript
// ❌ DON'T: Create new files haphazardly
// ✅ DO: Follow existing patterns

// When adding a new page:
src/pages/[pageName]/
  ├─ index.jsx (main component)
  └─ utils.js (helper functions)

// When creating a reusable component:
src/components/[ComponentName].jsx
// or if complex:
src/components/[componentName]/
  ├─ index.jsx
  └─ styles.css
```

#### Step 3: Use Existing Utilities

```javascript
// Instead of writing new code, use existing:

// For API calls
import { getPlantsByTag } from '@/api/customer/plant';

// For caching
import { useQuery } from '@tanstack/react-query';

// For cart operations
import { addToGuestCart } from '@/redux/slices/cartSlice';

// For forms
import { useForm } from 'react-hook-form';

// For optimization
import { filterByIds, filterOutById } from '@/utils/algorithmOptimizations';
```

#### Step 4: Test Your Changes

```
1. Start dev server: npm run dev
2. Open http://localhost:5000
3. Navigate to your changed feature
4. Test both:
   - Happy path (should work)
   - Edge cases (what if empty list? what if error?)
5. Check console for errors
6. Test on mobile (use browser dev tools)
```

### Common Tasks & Where to Find Code

#### Task: Add a new filter option
```
Location: src/components/FilterSidebar.jsx

1. Find CheckboxFilterSection component
2. Add new option to options array
3. Update filter logic to apply the new filter
```

#### Task: Create a new API endpoint
```
Location: src/api/customer/[feature].js

1. Create new file if needed
2. Add function that calls API
3. Use existing Axios instance
4. Export function

Example:
export async function getNewData(params) {
  const response = await api.get('/endpoint', { params });
  return response.data;
}
```

#### Task: Add new product field
```
When backend adds new field:
  1. Update API response type in component
  2. Update component to display it
  3. Clear React Query cache to fetch fresh data
```

#### Task: Fix a bug
```
1. Reproduce the bug
2. Check console logs
3. Open React Query DevTools (tab at bottom)
4. Check cached data
5. Verify API response
6. Fix in component or API layer
```

### Performance Checklist

Before submitting code:
```
[ ] No console errors/warnings
[ ] API calls optimized (using React Query)
[ ] No infinite loops
[ ] Images lazy-loaded
[ ] Using Set instead of array.includes()
[ ] Using useMemo for expensive calculations
[ ] SmartButton used for all forms/actions
[ ] Tested on mobile (3G speed)
[ ] Cache invalidation handled correctly
```

---

## 🔍 Debugging Guide

### Common Issues & Solutions

#### Issue: Product not appearing after adding to cart
```
Debug steps:
1. Check Redux state (React DevTools)
   → Is item in guestCartItems?
2. Check API response (Network tab)
   → Did backend receive request?
3. Check React Query cache
   → Is cart query stale?

Solution: Invalidate cache
queryClient.invalidateQueries({ queryKey: ['cart'] })
```

#### Issue: Page loads slowly
```
Debug steps:
1. Open Network tab
   → Which API is slowest?
2. Check React Query DevTools
   → How many queries running?
3. Check image sizes
   → Are images huge files?

Solution:
- Add caching: staleTime: 30 min
- Lazy load non-critical data
- Compress images
```

#### Issue: Duplicate API calls
```
Debug steps:
1. React Query DevTools
   → See all queries
   → Check if repeating
2. Check route loaders
   → Using prefetchQuery?
3. Check components
   → useQuery being called twice?

Solution:
- Use prefetchQuery in route loaders
- Add dependency array to useEffect
- Use hierarchical cache keys
```

---

## 📚 Key Files Reference

| File | Purpose | When to Edit |
|------|---------|--------------|
| `src/App.jsx` | Root component | Never (unless adding providers) |
| `src/context/AuthContext.jsx` | User login state | When changing auth logic |
| `src/redux/slices/cartSlice.js` | Guest cart state | When changing cart behavior |
| `src/lib/queryClient.ts` | Cache configuration | When tuning performance |
| `src/api/customer/*.js` | API calls | When adding new endpoints |
| `src/pages/*` | Full pages | When adding new pages or fixing page layout |
| `src/components/*.jsx` | Reusable components | When creating new UI blocks |
| `src/hooks/*.js` | Custom logic | When extracting reusable logic |

---

## 🚀 Deployment Readiness

When your code is ready for production:

```
1. All tests pass
2. No console errors
3. Performance benchmarks met:
   - Home page: <2s on 3G
   - Category: <1.5s on 3G
   - Product: <1.5s on 3G
4. Cart functionality works for both guest & authenticated
5. Checkout completes successfully
6. Order confirmation shows
```

---

## ❓ FAQ

**Q: I see "O(n)" and "O(n²)" in comments. What does it mean?**
```
A: It's about speed:
- O(n) = Time grows with list size (good)
- O(n²) = Time grows squared (bad for big lists)

Example:
- 100 items → O(n) = 100 operations, O(n²) = 10,000 operations
- 1000 items → O(n) = 1000 operations, O(n²) = 1,000,000 operations!
```

**Q: What's this "cache" thing everyone talks about?**
```
A: Saving data so you don't have to ask for it again:
- First time: Ask API, save answer
- Second time: Use saved answer (instant!)
- After 30 min: Ask API again (fresh data)
```

**Q: Why do we have both Redux and React Query?**
```
A: Different purposes:
- Redux: Shopping cart (works for guests without backend)
- React Query: API data (always fetches fresh from server)
```

**Q: How do I test my changes?**
```
A: 
1. npm run dev (start server)
2. Open http://localhost:5000
3. Use Chrome DevTools > Mobile view (3G mode)
4. Test feature
5. Check Network tab for API calls
6. Check console for errors
```

---

## 📞 Support

When stuck:
1. Check this documentation
2. Look at existing similar code
3. Check console logs
4. Use browser DevTools
5. Ask your senior developer

---

**Happy Coding! You got this! 🌱**
