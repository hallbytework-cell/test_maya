import { lazy, Suspense, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from './context/AuthContext';
import store from "./redux/store";
import ErrorBoundary from "./components/ErrorBoundary";
import OfflineBanner from "./components/OfflineBanner";
import HomeSkeleton from "./components/shimmer/HomeSkeleton";

const ReactQueryDevtools = lazy(() => import("@tanstack/react-query-devtools").then(m => ({ default: m.ReactQueryDevtools })));
const Toaster = lazy(() => import("react-hot-toast").then(m => ({ default: m.Toaster })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: 1,
      retryDelay: 1000,
      refetchOnMount: false,
      refetchOnReconnect: true,
    },
  },
});

if (typeof window !== 'undefined') {
  // Defer non-critical initialization until after hydration
  const deferInit = async () => {
    // Dynamically import Sentry after page is interactive
    const { initSentry } = await import('./lib/sentry');
    initSentry();
    
    // Register service worker
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      navigator.serviceWorker.register('/sw.js').catch(() => { });
    }
  };

  // Use requestIdleCallback if available, fallback to setTimeout
  if ('requestIdleCallback' in window) {
    requestIdleCallback(deferInit, { timeout: 2000 });
  } else {
    setTimeout(deferInit, 1000);
  }
}

function LazyToaster() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <Suspense fallback={null}>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: { maxWidth: '400px' },
        }}
        containerStyle={{ top: 60 }}
      />
    </Suspense>
  );
}

function RootApp() {
  return (
    <ErrorBoundary>
      <div id="recaptcha-container" className="hidden" />
      <Provider store={store}>
        <AuthProvider>
          <OfflineBanner />
          <LazyToaster />
          <QueryClientProvider client={queryClient}>
            <Suspense fallback={<HomeSkeleton />}>
              <App />
            </Suspense>
          </QueryClientProvider>
        </AuthProvider>
      </Provider>
    </ErrorBoundary>
  );
}

createRoot(document.getElementById("root")).render(<RootApp />);
