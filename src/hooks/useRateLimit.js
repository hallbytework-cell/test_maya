import { useState, useCallback, useRef } from 'react';
import logger from '@/lib/logger';
import toast from 'react-hot-toast';

/**
 * ✅ Rate Limiter Hook - Prevents spam API calls
 * Ideal for: Product details, Add to cart, Checkout actions
 * Usage: const { executeWithRateLimit, isLimited } = useRateLimit(3, 5000);
 */
export const useRateLimit = (maxCalls = 3, timeWindowMs = 5000) => {
  const [isLimited, setIsLimited] = useState(false);
  const callTimestampsRef = useRef([]);

  const executeWithRateLimit = useCallback(
    async (asyncFn, options = {}) => {
      const { showToast = true, actionName = 'Action' } = options;

      const now = Date.now();
      const validCalls = callTimestampsRef.current.filter(
        (timestamp) => now - timestamp < timeWindowMs
      );

      if (validCalls.length >= maxCalls) {
        const waitTime = Math.ceil((timeWindowMs - (now - validCalls[0])) / 1000);
        
        logger.warn(`Rate limit exceeded for ${actionName}. Wait ${waitTime}s`);
        setIsLimited(true);

        if (showToast) {
          toast.error(`Too many requests. Try again in ${waitTime}s`);
        }

        setTimeout(() => setIsLimited(false), timeWindowMs);
        return null;
      }

      callTimestampsRef.current = [...validCalls, now];

      try {
        const result = await asyncFn();
        logger.debug(`${actionName} executed (${validCalls.length + 1}/${maxCalls} calls)`);
        return result;
      } catch (error) {
        logger.error(`${actionName} failed`, error);
        throw error;
      }
    },
    [maxCalls, timeWindowMs]
  );

  const reset = useCallback(() => {
    callTimestampsRef.current = [];
    setIsLimited(false);
  }, []);

  return { executeWithRateLimit, isLimited, reset };
};

export default useRateLimit;