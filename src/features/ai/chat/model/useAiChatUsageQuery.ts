import { useQuery } from "@tanstack/react-query";
import { getChatUsage } from "@/features/ai/chat/api/chat";

export const useAiChatUsageQuery = (userId: number | undefined, enabled: boolean) =>
  useQuery({
    queryKey: ["ai-chat-usage", userId],
    queryFn: getChatUsage,
    enabled: enabled && userId !== undefined,
    staleTime: 0,
    retry: false,
    refetchInterval: (query) => {
      if (query.state.status === "error") return 60_000;
      const resetsAt = query.state.data?.resetsAt;
      return resetsAt
        ? Math.min(60_000, Math.max(1000, Date.parse(resetsAt) - Date.now() + 100))
        : 60_000;
    },
  });
