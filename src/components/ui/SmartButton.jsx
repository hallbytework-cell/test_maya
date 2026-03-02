/**
 * ✅ SMART BUTTON - Auto Loading State for Async Actions
 * Prevents duplicate clicks on slow networks
 */

import React from "react";
import { Button } from "@/components/ui/button";
import { useActionHandler } from "@/hooks/useActionHandler";

/**
 * ✅ SmartButton Component
 * 
 * Automatically:
 * - Shows loading state immediately
 * - Disables on click (prevents duplicates)
 * - Prevents rapid re-clicks
 * - Auto-resets on timeout
 * 
 * Usage:
 * ```
 * <SmartButton
 *   onClick={async () => await addToCart(productId)}
 *   loadingText="Adding..."
 * >
 *   Add to Cart
 * </SmartButton>
 * ```
 */
export const SmartButton = React.forwardRef((props, ref) => {
  const {
    onClick,
    disabled = false,
    loadingText = "Loading...",
    children,
    debounceMs = 300,
    timeoutMs = 30000,
    onSuccess,
    onError,
    // Button props
    variant = "default",
    size = "default",
    className = "",
    // Spread rest
    ...rest
  } = props;

  // ✅ Use our smart action handler
  const { isLoading, handler } = useActionHandler(onClick, {
    debounceMs,
    timeoutMs,
    onSuccess,
    onError,
  });

  return (
    <Button
      ref={ref}
      onClick={handler}
      disabled={disabled || isLoading}
      variant={variant}
      size={size}
      className={className}
      data-testid={`smart-button-${className || "default"}`}
      {...rest}
    >
      {isLoading ? (
        <>
          <span className="animate-spin inline-block mr-2 w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
});

SmartButton.displayName = "SmartButton";

/**
 * ✅ SmartIconButton - For icon-only buttons
 */
export const SmartIconButton = React.forwardRef((props, ref) => {
  const {
    onClick,
    disabled = false,
    debounceMs = 300,
    timeoutMs = 30000,
    onSuccess,
    onError,
    children,
    ...rest
  } = props;

  const { isLoading, handler } = useActionHandler(onClick, {
    debounceMs,
    timeoutMs,
    onSuccess,
    onError,
  });

  return (
    <Button
      ref={ref}
      size="icon"
      onClick={handler}
      disabled={disabled || isLoading}
      data-testid="smart-icon-button"
      {...rest}
    >
      {isLoading ? (
        <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
      ) : (
        children
      )}
    </Button>
  );
});

SmartIconButton.displayName = "SmartIconButton";
