import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateDeckGraph } from "@/entities/deck/api/updateDeckGraph";
import { RQdeckQueryKey } from "./RQdeckQueryKey";

export const useDeckGraphUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDeckGraph,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RQdeckQueryKey.all });
    },
  });
};
