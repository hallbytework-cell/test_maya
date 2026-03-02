# 🌱 Maya Vriksh - COMPLETE FLOW GUIDE FOR BEGINNERS

**Every possible flow, diagram, and explanation a kid needs to understand the entire system**

---

## 📑 Table of Contents

1. [How the App Starts](#how-the-app-starts)
2. [Redux State Flow](#redux-state-flow)
3. [React Query Cache Flow](#react-query-cache-flow)
4. [Form Handling & Validation](#form-handling--validation)
5. [Error Handling](#error-handling)
6. [Loading States](#loading-states)
7. [API Request/Response Cycle](#api-requestresponse-cycle)
8. [User Authentication Complete Flow](#user-authentication-complete-flow)
9. [Shopping Cart Flow](#shopping-cart-flow)
10. [Checkout Step-by-Step](#checkout-step-by-step)
11. [Component Props Flow](#component-props-flow)
12. [CSS & Styling System](#css--styling-system)
13. [Mobile Responsiveness](#mobile-responsiveness)
14. [Environment Variables](#environment-variables)
15. [Build & Deployment](#build--deployment)
16. [Common Patterns](#common-patterns)
17. [Code Naming Conventions](#code-naming-conventions)

---

## 🚀 How the App Starts

### When You Type `npm run dev`

```
npm run dev
   ↓
Vite starts (bundler)
   ├─ Reads vite.config.js
   ├─ Starts dev server on :5000
   ├─ Hot Module Replacement (HMR) enabled
   └─ Ready!
   
Opening browser http://localhost:5000
   ↓
Browser requests index.html
   ↓
Vite serves index.html + injected script
   ├─ Script loads main.jsx
   ├─ main.jsx imports App component
   └─ React starts rendering
   
App.jsx loads
   ↓
<Suspense fallback={<AppLoader />}>
   ├─ Shows loading spinner while React initializes
   └─ Once ready, shows actual app
   
<AuthProvider>
   ├─ Creates AuthContext
   ├─ Loads user from localStorage (if logged in)
   ├─ Checks if token valid/expired
   └─ Sets user state
   
<RouterProvider router={routes}>
   ├─ Checks current URL
   ├─ Matches to a route (home, product, checkout, etc)
   └─ Renders that page
   
Route Loader runs (BEFORE page renders!)
   ├─ Prefetches data: categories, products, etc
   ├─ Stores in React Query cache
   └─ Page renders instantly with cached data!
   
Page Component renders
   ├─ Uses data from cache (no loading spinner!)
   ├─ Displays products, filters, etc
   └─ Ready for user interaction!
```

### File That Starts Everything

```javascript
// src/main.jsx - The entry point
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// This line renders App component into index.html <div id="root">
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

---

## 🔴 Redux State Flow

### What is Redux?

Think of Redux like a **Global TV Broadcasting System**:
- **Store** = TV Station
- **State** = Current show playing
- **Action** = Command to change channel
- **Reducer** = Rules for what happens (IF change to sports channel THEN show sports)
- **Dispatch** = Remote control button pressed
- **Selector** = Viewer sees the show

### Redux Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    REDUX STORE (Centralized State)           │
│                                                              │
│  {                                                           │
│    guestCartItems: [                                         │
│      { id: 1, name: "Rose Plant", quantity: 2 },           │
│      { id: 2, name: "Pot", quantity: 1 }                   │
│    ],                                                        │
│    directCheckoutItem: null                                │
│  }                                                           │
└─────────────────────────────────────────────────────────────┘
         │                                    ▲
         │                                    │
         │                           (Get data from store)
         │                                    │
┌────────▼────────┐                   ┌──────┴──────────┐
│  Component A    │                   │  Component B    │
│  (ProductCard)  │                   │  (CartSidebar)  │
│                 │                   │                 │
│  const item = {  │                   │  const items =  │
│   id: 1,        │                   │   useSelector   │
│   name: "Rose"  │                   │   (state =>     │
│  }              │                   │   state.cart    │
│                 │                   │   .guestCart)   │
│ onClick(() =>   │                   │                 │
│   dispatch(     │                   │  Returns: [Rose │
│     addToCart   │                   │   Plant, Pot]   │
│     (item)      │───────────┐       │                 │
│   )             │           │       └─────────────────┘
│ )               │   DISPATCH ACTION
└─────────────────┘           │
                               ▼
                    ┌──────────────────────┐
                    │ Action (Plain Object)│
                    │ {                    │
                    │   type:              │
                    │   "cart/addItem",    │
                    │   payload: {         │
                    │     id: 1,           │
                    │     name: "Rose"     │
                    │   }                  │
                    │ }                    │
                    └──────────────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ REDUCER (Function)   │
                    │                      │
                    │ if action.type ===   │
                    │ "cart/addItem"       │
                    │ then:                │
                    │ - Check if item      │
                    │   already in cart    │
                    │ - If yes: increase   │
                    │   quantity           │
                    │ - If no: add new     │
                    │   item               │
                    │ - Return new state   │
                    └──────────────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ UPDATED STORE        │
                    │ {                    │
                    │   guestCartItems: [  │
                    │     {id:1,qty:3},   │
                    │     {id:2,qty:1}    │
                    │   ]                  │
                    │ }                    │
                    └──────────────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ All components       │
                    │ subscribed to store  │
                    │ get notified!        │
                    │                      │
                    │ CartSidebar re-      │
                    │ renders with new     │
                    │ items!               │
                    └──────────────────────┘
```

### Redux Code Example

```javascript
// src/redux/slices/cartSlice.js

import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    guestCartItems: [],
  },
  reducers: {
    // ACTION: Add item to cart
    addToGuestCart: (state, action) => {
      const newItem = action.payload;
      // Find existing item
      const existing = state.guestCartItems.find(
        item => item.id === newItem.id
      );
      
      if (existing) {
        // Already in cart: increase quantity
        existing.quantity += newItem.quantity;
      } else {
        // New item: add it
        state.guestCartItems.push(newItem);
      }
    },
    
    // ACTION: Remove item from cart
    removeFromGuestCart: (state, action) => {
      state.guestCartItems = state.guestCartItems.filter(
        item => item.id !== action.payload.id
      );
    },
  },
});

export const { addToGuestCart, removeFromGuestCart } = cartSlice.actions;
export default cartSlice.reducer;
```

### Using Redux in a Component

```javascript
// src/components/ProductCard.jsx

import { useDispatch } from 'react-redux';
import { addToGuestCart } from '@/redux/slices/cartSlice';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  
  const handleAddToCart = () => {
    // Dispatch action to Redux
    dispatch(addToGuestCart({
      id: product.id,
      name: product.name,
      quantity: 1,
    }));
    console.log('✅ Added to cart!');
  };
  
  return (
    <div>
      <h2>{product.name}</h2>
      <button onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  );
}
```

### Redux Persistence (Save to localStorage)

```javascript
// Redux automatically saves to localStorage!
// File: src/redux/store.js

import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage
import cartReducer from './slices/cartSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart'], // Save ONLY cart state
};

const persistedReducer = persistReducer(persistConfig, cartReducer);

export const store = configureStore({
  reducer: {
    cart: persistedReducer,
  },
});

export const persistor = persistStore(store);
```

---

## 🟦 React Query Cache Flow

### What is React Query?

Think of React Query like a **Smart Refrigerator**:
- **First request** = Go to market, buy fresh groceries
- **Store in cache** = Put groceries in fridge
- **Next request** = Use fridge groceries (instant!)
- **Cache expires** = Food gets old after 5 days, go to market again
- **Automatic refresh** = Fridge automatically goes to market

### React Query Full Flow

```
Component mounts
   │
   ▼
useQuery({ 
  queryKey: ['plants', categoryId],
  queryFn: () => fetchPlants(),
  staleTime: 30 * 60 * 1000, // 30 minutes
})
   │
   ▼
React Query checks cache
   ├─ Is ['plants', categoryId] in cache?
   │  ├─ YES → Check if stale
   │  │  ├─ Fresh (< 30 min) → Return cached data immediately ✓
   │  │  └─ Stale (> 30 min) → Return cached data BUT refetch in background
   │  │
   │  └─ NO → Fetch from API
   │
   └─ Return data + status to component
   
Component receives:
  {
    data: [plant1, plant2, ...],
    isLoading: false,        // First load
    isError: false,
    error: null,
    isFetching: false,       // Background refetch
    refetch: () => {}        // Manual refresh button
  }
   │
   ▼
Component renders with data
   └─ "isLoading" spinner shown? NO (data from cache)
   └─ Products displayed instantly!
   
User navigates away
   │
   ▼
Component unmounts
   │
   ▼
React Query keeps cache for 10 minutes (gcTime)
   ├─ User navigates back within 10 min?
   │  └─ Data instantly available!
   │
   └─ After 10 min? Cache deleted to save memory
```

### React Query Cache Key Strategy

```javascript
// Good cache keys (hierarchical):
queryKey: ['plants']              // All plants
queryKey: ['plants', 'featured']  // Featured plants
queryKey: ['plants', 'search', categoryId, filters]
queryKey: ['plant', 'details', variantId]
queryKey: ['cart', userId]        // User-specific

// Bad cache keys (too generic):
queryKey: ['data']                // Too vague
queryKey: [`/api/plants/${id}`]  // String concatenation (breaks invalidation)
```

### Code Example

```javascript
// src/hooks/useOptimizedQueries.js

import { useQuery } from '@tanstack/react-query';
import { getAllPlantVariants } from '@/api/customer/plant';

export function useGetProducts(categoryId, filters) {
  return useQuery({
    queryKey: ['plants', 'search', categoryId, filters],
    queryFn: async () => {
      console.log('📡 Fetching products...');
      return await getAllPlantVariants({ categoryId, ...filters });
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 10,   // Keep in memory for 10 minutes
    retry: 2,                  // Retry twice on failure
  });
}

// Use in component:
export function CategoryPage() {
  const { data: products, isLoading, error } = useGetProducts(
    categoryId,
    { priceMin: 100, priceMax: 500 }
  );
  
  if (isLoading) return <Spinner />;
  if (error) return <Error message={error} />;
  
  return <ProductGrid products={products} />;
}
```

---

## 📝 Form Handling & Validation

### Form Flow

```
User opens form
   │
   ▼
Form component initializes
   ├─ useForm() creates form instance
   ├─ Register input fields
   ├─ Add validation rules (Zod schema)
   └─ Set default values
   │
   ▼
User types in input
   │
   ├─ onChange event triggered
   ├─ Input value updates
   └─ Validation runs silently
   │
   ▼
User clicks Submit button
   │
   ├─ Prevent default form submission
   ├─ Validate ALL fields (Zod schema)
   │  ├─ Email: valid format?
   │  ├─ Password: 8+ characters?
   │  ├─ Phone: 10 digits?
   │  └─ If any fail: Show error ❌
   │
   └─ All pass? → Submit!
   
Send data to backend
   │
   ├─ Show loading state
   ├─ Make API request
   └─ Disable submit button
   
Response from backend
   ├─ Success? Show success toast + redirect
   └─ Error? Show error message
```

### Form Code Example

```javascript
// src/pages/login/LoginForm.jsx

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define validation schema
const loginSchema = z.object({
  phone: z.string()
    .min(10, 'Phone must be 10 digits')
    .max(10, 'Phone must be 10 digits')
    .regex(/^\d+$/, 'Phone must be numbers only'),
  
  password: z.string()
    .min(8, 'Password must be 8+ characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  // Initialize form with validation
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: '',
      password: '',
    },
  });
  
  const onSubmit = async (data: LoginFormData) => {
    console.log('✅ Form data valid:', data);
    // Send to backend
    const response = await api.post('/auth/login', data);
    console.log('✅ Logged in!');
  };
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Phone Input */}
      <input
        {...form.register('phone')}
        placeholder="Enter phone number"
      />
      {form.formState.errors.phone && (
        <span className="error">
          {form.formState.errors.phone.message}
        </span>
      )}
      
      {/* Password Input */}
      <input
        {...form.register('password')}
        type="password"
        placeholder="Enter password"
      />
      {form.formState.errors.password && (
        <span className="error">
          {form.formState.errors.password.message}
        </span>
      )}
      
      {/* Submit */}
      <button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

---

## ⚠️ Error Handling

### Error Handling Flow

```
API Request made
   │
   ▼
Network error?
├─ YES → Show: "Check internet connection"
│        Try again? → Retry API call
│
└─ NO → Check response status
   │
   ├─ 200-299 (Success) → Return data ✓
   │
   ├─ 400 (Bad Request) → Show: "Invalid input"
   │  Example: "Email already registered"
   │
   ├─ 401 (Unauthorized) → User logged out?
   │  → Redirect to login
   │
   ├─ 404 (Not Found) → Show: "Product not found"
   │
   ├─ 500 (Server Error) → Show: "Server error, try later"
   │  Auto-retry in 2 seconds
   │
   └─ Unknown error → Show: "Something went wrong"
```

### Error Code Example

```javascript
// src/config/axiosConfig.js

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      switch (error.response.status) {
        case 401:
          // Unauthorized - redirect to login
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        
        case 404:
          console.error('❌ Not found:', error.response.data.message);
          break;
        
        case 500:
          console.error('❌ Server error');
          break;
        
        default:
          console.error('❌ Error:', error.response.data);
      }
    } else if (error.request) {
      // Request made but no response
      console.error('❌ Network error - No response from server');
    } else {
      // Something else happened
      console.error('❌ Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

---

## 💫 Loading States

### Loading States Pattern

```
Initial Load (isLoading)
├─ Show skeleton/shimmer
├─ Don't show error message
└─ Don't show data

Loaded (!isLoading)
├─ Hide skeleton
├─ Show data
└─ Show error if exists

Background Refetch (isFetching)
├─ Show data (from cache)
├─ Disable buttons
└─ Maybe show "Updating..." label

Error (error)
├─ Show error message
├─ Hide skeleton
└─ Show "Retry" button
```

### Code Example

```javascript
export function ProductList() {
  const { data, isLoading, isFetching, error, refetch } = 
    useQuery({
      queryKey: ['products'],
      queryFn: fetchProducts,
    });
  
  // Initial load
  if (isLoading) {
    return (
      <div>
        <Skeleton count={3} />
      </div>
    );
  }
  
  // Error
  if (error) {
    return (
      <div>
        <p>❌ Error: {error.message}</p>
        <button onClick={() => refetch()}>
          Retry
        </button>
      </div>
    );
  }
  
  // Success
  return (
    <div>
      {isFetching && <p>Updating...</p>}
      {data.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

---

## 🔄 API Request/Response Cycle

### Complete Network Flow

```
Step 1: Component calls useQuery
   │
   ▼
Step 2: React Query prepares request
   ├─ Build URL: /api/products?category=plants&sort=price
   ├─ Add headers: Authorization: "Bearer TOKEN"
   ├─ Content-Type: application/json
   └─ Credentials: include (send cookies)
   
Step 3: Axios Interceptor (Request)
   ├─ Check token validity
   ├─ Add token if valid
   ├─ If token expired: Refresh it first
   ├─ Add token to headers
   └─ Send request
   
Step 4: Network Request
   ├─ HTTP GET /api/products?category=plants
   ├─ Send headers + body (if POST)
   └─ Show loading state (isLoading: true)
   
Step 5: Backend Processes
   ├─ Validate request
   ├─ Check authentication
   ├─ Query database
   ├─ Build response
   └─ Send back to frontend
   
Step 6: Axios Interceptor (Response)
   ├─ Check status code
   ├─ If 200: Parse JSON
   ├─ If 401: Token expired, refresh and retry
   ├─ If 5xx: Auto-retry (up to 2 times)
   └─ Return data or error
   
Step 7: React Query processes
   ├─ Save data to cache
   ├─ Mark query as fresh (staleTime)
   ├─ Set loading state to false
   └─ Update isFetching
   
Step 8: Component re-renders
   ├─ Receives: { data, isLoading: false, error: null }
   ├─ Calls render function with data
   └─ UI displays products!
```

---

## 👤 User Authentication Complete Flow

### Step-by-Step Authentication

```
STEP 1: User on Login Page
   ├─ Enters phone number: 9876543210
   └─ Clicks "Send OTP"
   
STEP 2: Firebase Sends OTP
   ├─ Firebase Auth receives phone number
   ├─ Validates format (10 digits)
   ├─ Sends SMS with 6-digit code: 123456
   └─ Waits 5 minutes for OTP input
   
STEP 3: User Receives OTP
   ├─ Checks SMS inbox
   ├─ Gets code: 123456
   ├─ Enters code in app
   └─ Clicks "Verify OTP"
   
STEP 4: Firebase Verifies OTP
   ├─ Checks if code matches what was sent
   ├─ Code correct? Generate idToken
   └─ Code wrong? Show error "Invalid OTP"
   
STEP 5: Exchange Firebase Token for Backend Token
   ├─ Frontend sends idToken to backend
   ├─ Backend API receives token
   ├─ Verifies token with Firebase servers
   ├─ Token valid? Create user account + JWT
   ├─ Return: { accessToken, refreshToken, user }
   └─ Frontend saves tokens in localStorage
   
STEP 6: User Logged In!
   ├─ AuthContext updates with user info
   ├─ All pages show user as authenticated
   ├─ API calls include token in headers
   └─ Show personalized content
   
STEP 7: Keep User Logged In
   ├─ App refreshes: Check localStorage for token
   ├─ Token found? Decode it
   ├─ Check expiry time (exp: 1700000000)
   ├─ Expiring soon (< 5 min)? Refresh silently
   └─ User stays logged in!
   
STEP 8: Token Refresh Flow
   ├─ Background: useTokenRefresh hook detects expiry
   ├─ Automatically calls refresh endpoint
   ├─ Backend returns new token
   ├─ Update localStorage
   └─ Seamless refresh (user doesn't notice!)
   
STEP 9: User Logout
   ├─ User clicks "Logout"
   ├─ Clear localStorage (remove token)
   ├─ Clear AuthContext (user = null)
   ├─ Redirect to home page
   └─ All authenticated routes show login instead
```

---

## 🛒 Shopping Cart Flow

### Guest Cart (No Login) vs Authenticated Cart

```
GUEST USER FLOW:
User browses products
   │
   ▼
Clicks "Add to Cart"
   │
   ├─ SmartButton prevents double-click
   ├─ Redux action: addToGuestCart()
   ├─ Item added to Redux state
   ├─ Redux persists to localStorage
   └─ CartSidebar updates (from Redux)
   
Items stored in:
   localStorage['persist:root']
   = {
       cart: {
         guestCartItems: [
           { id: 1, quantity: 2, ... },
           { id: 2, quantity: 1, ... }
         ]
       }
     }
   
Guest continues shopping
   ├─ Page refreshes? Data still there!
   ├─ Browser closed? Data still there!
   └─ Never sync with backend (no login)

Guest checks out
   ├─ Clicks "Checkout"
   ├─ Sent to login page first (need account)
   ├─ User logs in
   ├─ localStorage items sync to backend API
   └─ Checkout continues with backend items
   
   
AUTHENTICATED USER FLOW:
User logs in
   ├─ Backend creates empty cart
   ├─ React Query fetches cart from API
   ├─ Cache key: ['cart-data']
   └─ Local Redux ignored!

User adds to cart
   ├─ SmartButton prevents double-click
   ├─ API call: POST /cart/add
   │  { productVariantId, potVariantId, quantity }
   ├─ Backend creates cart item record
   ├─ Returns updated cart
   ├─ React Query cache invalidated
   ├─ New data fetched from API
   └─ CartSidebar updates (from API data)

Cart synced with backend
   ├─ Server holds truth (database)
   ├─ Multiple devices sync
   ├─ Checkout pulls from backend
   └─ No data loss
```

### Cart State Diagram

```
BEFORE LOGIN:
┌──────────────────────────┐
│   Redux (localStorage)   │
│ guestCartItems: [...]   │
└──────────────────────────┘
         ↑
         │ (CartSidebar reads from)
         │
    CartSidebar Component


AFTER LOGIN:
┌──────────────────────────┐         ┌──────────────┐
│   Backend Database       │◄────────┤ React Query  │
│  (cart_items table)      │         │ (cache)      │
└──────────────────────────┘         └──────────────┘
         ▲                                   ↑
         │                                   │
         └───────────────────────────────────┘
                  (API calls)
                      ▲
                      │
                  CartSidebar Component
                  (reads React Query data)
```

---

## 🛍️ Checkout Step-by-Step

### Complete Checkout Journey

```
STEP 1: Cart Sidebar Review
User opens cart
├─ See all items
├─ Can adjust quantities
├─ Can remove items
├─ See total price
└─ Click "Proceed to Checkout"

STEP 2: Select Items
OrderSummaryStep component
├─ Show filtered cart items
├─ User can toggle selection (checkbox)
├─ Only selected items for checkout
├─ Calculate subtotal from selection
└─ Click "Continue"

STEP 3: Delivery Address
AddressStep component
├─ Show saved addresses
├─ User selects one OR adds new
├─ Form fields:
│  - Full name
│  - Phone number
│  - Address line 1
│  - Address line 2
│  - City
│  - State
│  - Pincode
└─ Validate and save
└─ Click "Continue"

STEP 4: Review Order
ReviewStep component
├─ Show:
│  - Selected items with prices
│  - Delivery address
│  - Subtotal
│  - Taxes (18%)
│  - Shipping (₹0 if >₹500, else ₹50)
│  - TOTAL
├─ Allow edit (back to previous steps)
└─ Click "Place Order"

STEP 5: Payment
PaymentStep component
├─ Payment method:
│  - Card
│  - UPI
│  - Wallet
│  - Cash on Delivery
├─ Process payment
├─ Wait for confirmation
└─ If success → Continue

STEP 6: Order Created
Backend creates order record
├─ Insert into orders table
│  - order_id: "ORD-123456"
│  - user_id: logged in user
│  - items: [item1, item2]
│  - total_amount: 2500
│  - status: "pending"
│  - delivery_address: address data
├─ Clear cart items
├─ Return order confirmation
└─ Sync React Query cache

STEP 7: Success Page
ConfirmationPage component
├─ Show:
│  - "Order Successful!" message
│  - Order ID: ORD-123456
│  - Estimated delivery: 3-5 days
│  - Order details summary
│  - "Track Order" button
│  - "Shop More" button
└─ Option to share on social media
```

### Checkout Code Flow

```javascript
// src/pages/checkout/CheckoutPage.jsx

export function CheckoutPage() {
  const [step, setStep] = useState('orderSummary');
  // step: 'orderSummary' → 'address' → 'review' → 'payment' → 'confirmation'
  
  const handleStepComplete = (nextStep) => {
    setStep(nextStep);
  };
  
  const renderStep = () => {
    switch(step) {
      case 'orderSummary':
        return <OrderSummaryStep onComplete={() => handleStepComplete('address')} />;
      case 'address':
        return <AddressStep onComplete={() => handleStepComplete('review')} />;
      case 'review':
        return <ReviewStep onComplete={() => handleStepComplete('payment')} />;
      case 'payment':
        return <PaymentStep onComplete={() => handleStepComplete('confirmation')} />;
      case 'confirmation':
        return <ConfirmationPage />;
      default:
        return null;
    }
  };
  
  return (
    <div>
      {renderStep()}
    </div>
  );
}
```

---

## 🔗 Component Props Flow

### How Data Flows Through Components

```
PAGE COMPONENT (has all data)
  │
  ├─ data = [product1, product2, ...]
  │
  ▼
<ProductGrid products={data} />    (receives data as prop)
  │
  ├─ products prop = [product1, product2, ...]
  │
  ▼
products.map(p => 
  <ProductCard key={p.id} product={p} />
)
  │
  ├─ product prop = { id, name, price, ... }
  │
  ▼
<ProductCard product={product} />   (receives single product)
  │
  ├─ product = { id, name, price, image }
  │
  ▼
<div>
  <img src={product.image} />
  <h2>{product.name}</h2>
  <p>₹{product.price}</p>
  <button onClick={() => handleAddToCart(product)}>
    Add to Cart
  </button>
</div>

Interaction: User clicks "Add to Cart"
  ├─ handleAddToCart(product) called
  ├─ dispatch Redux action with product
  └─ Store updates
  
Store updates
  ├─ Parent re-renders (ProductGrid)
  ├─ All children re-render (ProductCard)
  └─ CartSidebar component also re-renders
       (because it reads same Redux store)
```

---

## 🎨 CSS & Styling System

### Tailwind CSS

```
Instead of writing CSS files:
  /* old way */
  .btn {
    padding: 12px 24px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

Use Tailwind utility classes:
  <button className="px-6 py-3 bg-green-500 text-white rounded cursor-pointer">
    Click me
  </button>

Tailwind class breakdown:
  px-6        → padding-left: 1.5rem, padding-right: 1.5rem
  py-3        → padding-top: 0.75rem, padding-bottom: 0.75rem
  bg-green-500 → background-color: #22c55e
  text-white  → color: white
  rounded     → border-radius: 0.25rem
  cursor-pointer → cursor: pointer

Responsive design:
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    /* Mobile: 1 column */
    /* Tablet: 2 columns */
    /* Desktop: 3 columns */
  </div>

Dark mode:
  <div className="bg-white dark:bg-black text-black dark:text-white">
    /* Light mode: white bg, black text */
    /* Dark mode: black bg, white text */
  </div>
```

---

## 📱 Mobile Responsiveness

### Responsive Design Flow

```
Desktop (1200px+)
├─ 3-column grid
├─ Full sidebar visible
├─ Large images
└─ Horizontal menu

Tablet (768px - 1199px)
├─ 2-column grid
├─ Collapsible sidebar
├─ Medium images
└─ Hamburger menu

Mobile (< 768px)
├─ 1-column grid (stacked)
├─ Hidden sidebar (drawer)
├─ Small images (optimized)
├─ Bottom navigation
└─ Touch-friendly buttons (large tap targets)
```

### Code Example

```javascript
// Mobile-first approach (start with mobile, enhance for larger screens)

<div className="
  flex flex-col
  gap-4
  p-4
  md:flex-row md:gap-8 md:p-8
  lg:gap-12 lg:p-12
">
  {/* Mobile: flex-col (vertical), sm padding */}
  {/* Tablet+: flex-row (horizontal), md padding */}
  {/* Desktop+: lg padding */}
</div>

<img 
  className="
    w-full h-48
    md:h-64
    lg:h-96
  "
  src={product.image}
/>
{/* Mobile: 48px height */}
{/* Tablet: 64px height */}
{/* Desktop: 96px height */}
```

---

## ⚙️ Environment Variables

### What are Env Variables?

Secret/configuration data that changes based on environment.

```
DEVELOPMENT ENVIRONMENT:
VITE_API_URL=http://localhost:3000
VITE_FIREBASE_API_KEY=dev-firebase-key

PRODUCTION ENVIRONMENT:
VITE_API_URL=https://api.mayavriksh.com
VITE_FIREBASE_API_KEY=prod-firebase-key
```

### File: `.env`

```
# Backend API
VITE_API_URL=http://localhost:3000

# Firebase Authentication
VITE_FIREBASE_API_KEY=AIzaSyD...
VITE_FIREBASE_AUTH_DOMAIN=mayavriksh.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mayavriksh-123
VITE_FIREBASE_STORAGE_BUCKET=mayavriksh-123.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc...

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_DEBUG_MODE=false
```

### Using Environment Variables

```javascript
// In React components (MUST prefix with VITE_)
const apiUrl = import.meta.env.VITE_API_URL;
console.log(apiUrl); // http://localhost:3000

// In Vite config
const apiUrl = process.env.VITE_API_URL;
```

---

## 🏗️ Build & Deployment

### Development to Production Flow

```
DEVELOPMENT (npm run dev)
├─ Unminified code (readable, big files)
├─ Fast startup (modules loaded as needed)
├─ Source maps (easy debugging)
├─ Hot Module Replacement (instant refreshes)
└─ Only on your computer

npm run build
├─ Minify code (remove unnecessary characters)
├─ Optimize images
├─ Bundle code (combine into fewer files)
├─ Create dist/ folder
└─ Output: dist/index.html + bundled JS/CSS

dist/ folder
├─ index.html (main entry point)
├─ assets/
│  ├─ js/
│  │  └─ bundle-abc123.js (minified code)
│  ├─ css/
│  │  └─ styles-def456.css (minified styles)
│  └─ images/
│     └─ product-123.webp (optimized images)
└─ manifest.json (for PWA)

Deploy to server
├─ Upload dist/ folder to server
├─ Server points to index.html
├─ Users get optimized, fast-loading site
└─ Site live for everyone!
```

---

## 🔁 Common Patterns

### Pattern 1: Fetch & Display

```javascript
export function ProductList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });
  
  if (isLoading) return <Skeleton />;
  if (error) return <Error />;
  
  return (
    <div>
      {data.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Pattern 2: Form Submit

```javascript
const { mutate, isPending } = useMutation({
  mutationFn: (formData) => api.post('/submit', formData),
  onSuccess: () => {
    toast.success('✅ Saved!');
    queryClient.invalidateQueries({ queryKey: ['data'] });
  },
  onError: () => toast.error('❌ Error!'),
});

<form onSubmit={form.handleSubmit((data) => mutate(data))}>
  <input {...form.register('name')} />
  <button disabled={isPending}>
    {isPending ? 'Saving...' : 'Save'}
  </button>
</form>
```

### Pattern 3: Optimistic Update

```javascript
const updateMutation = useMutation({
  mutationFn: (newData) => api.patch('/item', newData),
  
  onMutate: async (newData) => {
    // Cancel any ongoing requests
    await queryClient.cancelQueries({ queryKey: ['items'] });
    
    // Save old data
    const oldData = queryClient.getQueryData(['items']);
    
    // Update UI immediately (optimistic)
    queryClient.setQueryData(['items'], (old) => ({
      ...old,
      ...newData,
    }));
    
    return oldData; // Return for rollback if needed
  },
  
  onError: (err, newData, oldData) => {
    // Rollback if error
    queryClient.setQueryData(['items'], oldData);
  },
  
  onSettled: () => {
    // Refetch to sync with server
    queryClient.invalidateQueries({ queryKey: ['items'] });
  },
});
```

---

## 📝 Code Naming Conventions

### File Naming

```
Components (PascalCase):
├─ ProductCard.jsx
├─ CartSidebar.jsx
├─ CheckoutPage.jsx
└─ UserProfile.jsx

Utilities/Hooks (camelCase):
├─ useProductQuery.js
├─ useTokenRefresh.js
├─ algorithmOptimizations.js
└─ axiosConfig.js

Pages (lowercase with folders):
├─ pages/home/index.jsx
├─ pages/product/index.jsx
├─ pages/checkout/
│  ├─ OrderSummaryStep.jsx
│  ├─ AddressStep.jsx
│  └─ PaymentStep.jsx
```

### Variable Naming

```
// Booleans: prefix with "is", "has", "can"
const isLoading = false;
const hasError = true;
const canCheckout = user && items.length > 0;

// Functions: verb + noun
const fetchProducts = () => {};
const handleAddToCart = () => {};
const validateEmail = (email) => {};

// Arrays: plural
const products = [];
const cartItems = [];
const addresses = [];

// Objects: singular or descriptive
const product = { id: 1, name: '...' };
const user = { id: 1, name: '...' };
const config = { apiUrl: '...', timeout: 5000 };

// Callbacks: "on" + action
const onClick = () => {};
const onSubmit = (data) => {};
const onSuccess = (response) => {};
const onError = (error) => {};
```

---

## 🎯 Summary: Everything a Beginner Needs to Know

### The Mental Model

```
         ┌─────────────────────────────────────┐
         │  REACT COMPONENT (User Interface)   │
         │                                     │
         │  Renders HTML + handles clicks      │
         └─────────────────┬───────────────────┘
                           │
             ┌─────────────┴─────────────┐
             │                           │
             ▼                           ▼
    ┌──────────────────┐       ┌──────────────────┐
    │ REDUX (Cart)     │       │ REACT QUERY      │
    │ - Guest cart     │       │ (API Data Cache) │
    │ - LocalStorage   │       │ - Products       │
    │ - Offline        │       │ - Orders         │
    │                  │       │ - Auto refresh   │
    └──────────────────┘       └──────────────────┘
             │                           │
             └─────────────┬─────────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │ BACKEND API      │
                  │ - User accounts  │
                  │ - Cart (auth)    │
                  │ - Orders         │
                  │ - Products       │
                  └──────────────────┘
```

### Quick Reference Flowchart

```
Someone asks: "How does [feature] work?"

Is it about LOGIN?
└─ See: User Authentication Complete Flow

Is it about CART?
└─ See: Shopping Cart Flow + Redux State Flow

Is it about SHOWING PRODUCTS?
└─ See: React Query Cache Flow + API Request Cycle

Is it about FORMS?
└─ See: Form Handling & Validation

Is it about STYLING?
└─ See: CSS & Styling System

Is it about MOBILE?
└─ See: Mobile Responsiveness

Is it about CODE STRUCTURE?
└─ See: Code Naming Conventions
```

---

**You now understand EVERYTHING! 🚀 Start coding with confidence!**
