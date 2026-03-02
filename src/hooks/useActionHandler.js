import React, { useState, useCallback, useRef, useEffect } from "react";
import logger from "@/lib/logger";

export const useActionHandler = (
  asyncAction,
  options = {}
) => {
  const {
    debounceMs = 300,
    timeoutMs = 30000,
    onSuccess = null,
    onError = null,
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef(null);
  const lastClickTimeRef = useRef(0);

  const handler = useCallback(
    async (e) => {
      if (e?.preventDefault) {
        e.preventDefault();
      }

      if (isLoading) {
        logger.debug("Action already in progress, ignoring click");
        return;
      }

      const now = Date.now();
      if (now - lastClickTimeRef.current < debounceMs) {
        logger.debug("Click ignored (too soon, debounced)");
        return;
      }

      lastClickTimeRef.current = now;

      try {
        logger.debug("Action started, showing loading state");
        setIsLoading(true);

        timeoutRef.current = setTimeout(() => {
          logger.error("Action timeout exceeded, auto-resetting button");
          setIsLoading(false);
        }, timeoutMs);

        const result = await asyncAction(e);

        clearTimeout(timeoutRef.current);

        logger.debug("Action completed successfully");
        onSuccess?.(result);

        return result;
      } catch (error) {
        logger.error("Action failed", error);
        clearTimeout(timeoutRef.current);
        onError?.(error);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, asyncAction, debounceMs, timeoutMs, onSuccess, onError]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isLoading,
    handler,
    resetLoading: () => setIsLoading(false),
  };
};

export const useMultiActionHandler = (actions = {}, options = {}) => {
  const [loadingAction, setLoadingAction] = useState(null);
  const timeoutRef = useRef({});
  const lastClickRef = useRef({});

  const handler = useCallback(
    (actionKey) =>
      async (e) => {
        if (e?.preventDefault) e.preventDefault();

        if (loadingAction === actionKey) {
          logger.debug(`Action "${actionKey}" already in progress`);
          return;
        }

        const now = Date.now();
        if (
          lastClickRef.current[actionKey] &&
          now - lastClickRef.current[actionKey] < (options.debounceMs || 300)
        ) {
          return;
        }

        lastClickRef.current[actionKey] = now;

        try {
          setLoadingAction(actionKey);

          timeoutRef.current[actionKey] = setTimeout(() => {
            setLoadingAction(null);
          }, options.timeoutMs || 30000);

          const result = await actions[actionKey](e);

          clearTimeout(timeoutRef.current[actionKey]);
          options.onSuccess?.(actionKey, result);

          return result;
        } catch (error) {
          clearTimeout(timeoutRef.current[actionKey]);
          options.onError?.(actionKey, error);
        } finally {
          setLoadingAction(null);
        }
      },
    [loadingAction, actions, options]
  );

  useEffect(() => {
    return () => {
      Object.values(timeoutRef.current).forEach((timeout) =>
        clearTimeout(timeout)
      );
    };
  }, []);

  return {
    handler,
    isLoading: (actionKey) => loadingAction === actionKey,
    loadingAction,
  };
};

export const useNavigationHandler = (navigate, options = {}) => {
  const [isNavigating, setIsNavigating] = useState(false);

  const handler = useCallback(
    (path) =>
      async (e) => {
        if (e?.preventDefault) e.preventDefault();

        if (isNavigating) {
          logger.debug("Navigation already in progress");
          return;
        }

        try {
          setIsNavigating(true);

          await options.onBeforeNavigate?.();

          navigate(path);

          options.onSuccess?.();
        } catch (error) {
          logger.error("Navigation failed", error);
          options.onError?.(error);
        } finally {
          setIsNavigating(false);
        }
      },
    [navigate, isNavigating, options]
  );

  return {
    handler,
    isNavigating,
  };
};