import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createDeck } from "@/service/deck/createDeck";
import { RQdeckQueryKey } from "./RQdeckQueryKey";

export const useDeckCreateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDeck,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: RQdeckQueryKey.all });
      queryClient.setQueryData(RQdeckQueryKey.detail(data.id), data);
    },
  });
};

