import { lazy } from "react";

export const lazyLoad = (importFunc) => {
  return lazy(async () => {
    const storageKey = `retry-${window.location.pathname}`;

    try {
      const component = await importFunc();
      sessionStorage.removeItem(storageKey);

      return component;

    } catch (error) {
      console.error("Lazy load error:", error);
      
      const errorMessage = error?.message || "";
      const isChunkError = 
        errorMessage.includes("Failed to fetch dynamically imported module") ||
        errorMessage.includes("Importing a module script failed") ||
        errorMessage.includes("error loading dynamically imported module");

      if (isChunkError) {
        const hasRetried = sessionStorage.getItem(storageKey);

        if (!hasRetried) {
          sessionStorage.setItem(storageKey, "true");
          window.location.reload();
          return new Promise(() => {}); 
        }
      }
      throw error;
    }
  });
};