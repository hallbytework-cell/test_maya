import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      // ✅ Optimized: Use endpoint-specific staleTime instead of Infinity
      // This allows proper cache invalidation for frequently changing data
      staleTime: 1000 * 60 * 5, // 5 minutes default (overridable per-endpoint)
      // ✅ Improved: Retry up to 2 times for resilience on intermittent failures
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client mistakes)
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Retry up to 2 times on network errors or 5xx
        return failureCount < 2;
      },
      // ✅ Network performance: Disable refetch on mount if not stale
      refetchOnMount: false,
      // ✅ Garbage collection: Collect unused queries after 10 minutes
      gcTime: 1000 * 60 * 10,
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // More aggressive retry for mutations (user initiated)
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});
