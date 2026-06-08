import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createDeck } from "@/entities/deck/api/createDeck";
import { RQdeckQueryKey } from "./RQdeckQueryKey";

export const useDeckCreateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDeck,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: RQdeckQueryKey.all });
      queryClient.invalidateQueries({
        queryKey: RQdeckQueryKey.detail(data.id),
      });
    },
  });
};
