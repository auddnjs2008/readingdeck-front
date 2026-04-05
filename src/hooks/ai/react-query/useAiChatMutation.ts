import { useMutation } from "@tanstack/react-query";

import { chat } from "@/service/ai/chat";

export const useAiChatMutation = () => {
  return useMutation({
    mutationFn: chat,
  });
};
