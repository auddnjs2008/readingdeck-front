import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteDeck } from "@/service/deck/deleteDeck";
import { RQdeckQueryKey } from "./RQdeckQueryKey";

export const useDeckDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDeck,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: RQdeckQueryKey.all });
      queryClient.removeQueries({
        queryKey: RQdeckQueryKey.detail(variables.path.deckId),
      });
    },
  });
};
