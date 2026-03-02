import { Suspense, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./routes/routes";
import { initGA } from "./lib/analytics";
import logger from "./lib/logger";
import LocalBusinessSchema from "./components/seo/LocalBusinessSchema";
import { ensureIndexable } from "./utils/seoUtils";
// Import SEO debugger for development
if (import.meta.env.MODE === 'development') {
  import("./lib/seoIndexingDebugger");
}

const AppLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function App() {

  function removeInitialLoader() {
    const loader = document.getElementById("initial-loader");
    if (loader) loader.remove();
  }

  useEffect(() => {
    removeInitialLoader();
    // CRITICAL: Ensure page is indexable by removing any accidentally set noindex directives
    // This fixes "Crawled - Currently not indexed" issues in Google Search Console
    ensureIndexable();
  }, []);

  useEffect(() => {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (measurementId) {
      initGA();
      logger.info("Google Analytics initialized");
    } else {
      logger.debug("GA Measurement ID not set - analytics disabled");
    }
  }, []);

  return (
    <>
      <LocalBusinessSchema />
      <Suspense fallback={<AppLoader />}>
        <RouterProvider router={router} />
      </Suspense>
    </>
  );
}