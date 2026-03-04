import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateDeckGraph } from "@/service/deck/updateDeckGraph";
import { RQdeckQueryKey } from "./RQdeckQueryKey";

export const useDeckGraphUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDeckGraph,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: RQdeckQueryKey.all });
      queryClient.invalidateQueries({
        queryKey: RQdeckQueryKey.detail(data.id),
      });
    },
  });
};
