import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateDeck } from "@/service/deck/updateDeck";
import { RQdeckQueryKey } from "./RQdeckQueryKey";

export const useDeckUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDeck,
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
