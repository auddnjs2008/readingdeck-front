import { useMutation, useQueryClient } from "@tanstack/react-query";

import { publishDeck } from "@/entities/deck/api/publishDeck";
import { RQdeckQueryKey } from "./RQdeckQueryKey";

export const useDeckPublishMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: publishDeck,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: RQdeckQueryKey.all }),
  });
};
