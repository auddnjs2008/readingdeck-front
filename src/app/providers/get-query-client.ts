import { QueryClient } from "@tanstack/react-query";

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  const createQueryClient = () => new QueryClient({
    defaultOptions: {
      queries: { retry: 1, refetchOnWindowFocus: false },
      mutations: { retry: 0 },
    },
  });

  if (typeof window === "undefined") return createQueryClient();
  return browserQueryClient ??= createQueryClient();
}
