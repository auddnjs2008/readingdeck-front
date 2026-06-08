import { useMutation } from "@tanstack/react-query";

import { chat } from "@/features/ai/chat/api/chat";

export const useAiChatMutation = () => {
  return useMutation({
    mutationFn: chat,
  });
};
