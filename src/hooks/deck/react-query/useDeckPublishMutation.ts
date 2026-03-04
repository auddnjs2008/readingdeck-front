import { useMutation, useQueryClient } from "@tanstack/react-query";

import { publishDeck } from "@/service/deck/publishDeck";
import { RQdeckQueryKey } from "./RQdeckQueryKey";

export const useDeckPublishMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: publishDeck,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: RQdeckQueryKey.all });
      queryClient.invalidateQueries({
        queryKey: RQdeckQueryKey.detail(data.id),
      });
    },
  });
};
