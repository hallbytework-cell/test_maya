import React, { useEffect } from "react";
import { useRouteError, isRouteErrorResponse, useNavigate, Link } from "react-router-dom";

const GlobalError = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  let errorStatus = 500;
  let title = "Ouch! A Thorn in the System";
  let message = "Something unexpected happened. Our digital gardeners are looking into it.";
  let actionText = "Try Again";

  // useEffect(() => {
  //   const errorMessage = error?.message || error?.toString() || "";
  //   console.error("Global Error Caught:", errorMessage);
  //   const isChunkError = 
  //     errorMessage.includes("Failed to fetch dynamically imported module") ||
  //     errorMessage.includes("Importing a module script failed") ||
  //     errorMessage.includes("error loading dynamically imported module");

  //   if (isChunkError) {
  //     const storageKey = "chunk_load_retry";
  //     const hasRetried = sessionStorage.getItem(storageKey);

  //     if (!hasRetried) {
  //       console.warn("Chunk load failed. Attempting force refresh...");
  //       sessionStorage.setItem(storageKey, "true");
  //       window.location.reload();
  //     } else {
  //       sessionStorage.removeItem(storageKey);
  //     }
  //   }
  // }, [error]);

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    if (error.status === 404) {
      title = "Lost in the Jungle?";
      message = "We couldn't find the page you're looking for. It might have been moved, uprooted, or never existed.";
      actionText = "Back to Safety";
    } else if (error.status === 401) {
      title = "Private Garden";
      message = "You need to log in to view this section of the nursery.";
      actionText = "Log In";
    } else if (error.status === 503) {
      title = "Greenhouse Maintenance";
      message = "We are currently watering the servers. Please check back shortly.";
      actionText = "Refresh";
    }
  } else if (error instanceof Error) {
    message = error.message; 
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute top-10 left-10 w-32 h-32 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-10 right-10 w-32 h-32 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-32 h-32 bg-lime-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="relative w-full max-w-lg bg-white/80 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl overflow-hidden text-center p-8 sm:p-12">
        
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-green-100 rounded-full scale-110 opacity-50"></div>
            
            <svg className="relative w-32 h-32 text-green-600 drop-shadow-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" className="text-green-50 fill-green-50" stroke="none" /> 
              {errorStatus === 404 ? (
                <>
                  <circle cx="12" cy="12" r="10" className="stroke-green-600" strokeWidth="1.5"/>
                  <path d="M16 16l-4-4" strokeWidth="2"/>
                  <circle cx="10" cy="10" r="3" />
                  <path d="M9 16c-3 1-4 4-4 4" className="opacity-50"/>
                  <path d="M15 16c3 1 4 4 4 4" className="opacity-50"/>
                </>
              ) : (
                <>
                  <path d="M12 9v2m0 4h.01" strokeWidth="3" strokeLinecap="round" className="text-emerald-600" />
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                </>
              )}
            </svg>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-green-900 tracking-tight">
            {errorStatus}
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            {title}
          </h2>
          <p className="text-gray-500 text-base sm:text-lg leading-relaxed max-w-sm mx-auto">
            {message}
          </p>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border-2 border-green-100 text-green-700 font-semibold hover:bg-green-50 hover:border-green-200 transition-all duration-300 transform active:scale-95"
          >
            Go Back
          </button>

          <button
            onClick={() => window.location.assign("/")} 
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold shadow-lg shadow-green-200 hover:shadow-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
          >
            Take Me Home
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Need help? Email us at <a href="mailto:care.mayavriksh@gmail.com" className="text-green-600 hover:underline">care.mayavriksh@gmail.com</a>
          </p>
          
          {/* Dev Info (Hidden in Prod) */}
          {/* {process.env.NODE_ENV === 'development' && error.stack && (
            <details className="mt-4 text-left">
              <summary className="text-xs text-red-400 cursor-pointer">View Error Stack</summary>
              <pre className="mt-2 p-2 bg-gray-100 rounded text-[10px] text-gray-600 overflow-auto max-h-32">
                {error.stack}
              </pre>
            </details>
          )} */}
        </div>

      </div>
    </div>
  );
};

export default GlobalError;