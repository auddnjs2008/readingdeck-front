import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateDeck } from "@/entities/deck/api/updateDeck";
import { RQdeckQueryKey } from "./RQdeckQueryKey";

export const useDeckUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDeck,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: RQdeckQueryKey.all });
      queryClient.invalidateQueries({
        queryKey: RQdeckQueryKey.detail(data.id),
      });
    },
  });
};
