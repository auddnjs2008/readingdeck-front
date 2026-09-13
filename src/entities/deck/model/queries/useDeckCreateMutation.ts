import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createDeck } from "@/entities/deck/api/createDeck";
import { RQdeckQueryKey } from "./RQdeckQueryKey";

export const useDeckCreateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDeck,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RQdeckQueryKey.all });
    },
  });
};
