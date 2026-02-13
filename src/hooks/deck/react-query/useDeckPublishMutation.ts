import { useMutation, useQueryClient } from "@tanstack/react-query";

import { publishDeck } from "@/service/deck/publishDeck";
import { RQdeckQueryKey } from "./RQdeckQueryKey";

export const useDeckPublishMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: publishDeck,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: RQdeckQueryKey.all });
      queryClient.setQueryData(RQdeckQueryKey.detail(data.id), (prev: unknown) => {
        if (!prev || typeof prev !== "object") {
          return prev;
        }
        return {
          ...(prev as Record<string, unknown>),
          ...data,
        };
      });
    },
  });
};

