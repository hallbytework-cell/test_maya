/**
 * ✅ SMART LINK - Prevents Double Navigation
 * Shows loading state during route transitions
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNavigationHandler } from "@/hooks/useActionHandler";

/**
 * ✅ SmartLink Component
 * 
 * Prevents double navigation clicks by:
 * - Showing loading state
 * - Disabling during navigation
 * - Debouncing rapid clicks
 * 
 * Usage:
 * ```
 * <SmartLink to="/products/123">
 *   View Product
 * </SmartLink>
 * ```
 */
export const SmartLink = React.forwardRef((props, ref) => {
  const {
    to,
    children,
    className = "",
    onNavigate,
    showLoadingIndicator = true,
    loadingClassName = "opacity-60",
    ...rest
  } = props;

  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleClick = async (e) => {
    if (isNavigating) {
      e.preventDefault();
      return;
    }

    try {
      setIsNavigating(true);
      onNavigate?.();
      navigate(to);
    } finally {
      // Auto-reset after navigation completes
      setTimeout(() => setIsNavigating(false), 500);
    }
  };

  return (
    <a
      ref={ref}
      href="#"
      onClick={handleClick}
      className={`cursor-pointer transition-opacity ${
        isNavigating ? loadingClassName : ""
      } ${className}`}
      style={{ pointerEvents: isNavigating ? "none" : "auto" }}
      data-testid="smart-link"
      {...rest}
    >
      {showLoadingIndicator && isNavigating ? (
        <span className="inline-flex items-center gap-2">
          <span className="animate-spin inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full" />
          {children}
        </span>
      ) : (
        children
      )}
    </a>
  );
});

SmartLink.displayName = "SmartLink";

/**
 * ✅ SmartNavLink - For navigation menus
 */
export const SmartNavLink = React.forwardRef((props, ref) => {
  const {
    to,
    children,
    activeClassName = "bg-green-50 text-green-700",
    className = "",
    ...rest
  } = props;

  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();

    if (isNavigating) return;

    setIsNavigating(true);
    navigate(to);

    setTimeout(() => setIsNavigating(false), 500);
  };

  return (
    <button
      ref={ref}
      onClick={handleClick}
      disabled={isNavigating}
      className={`w-full text-left px-4 py-2 rounded transition-all ${
        isNavigating ? "opacity-50 cursor-wait" : ""
      } ${className}`}
      data-testid="smart-nav-link"
      {...rest}
    >
      {isNavigating ? (
        <span className="inline-flex items-center gap-2">
          <span className="animate-spin w-3 h-3 border-2 border-current border-t-transparent rounded-full" />
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
});

SmartNavLink.displayName = "SmartNavLink";
