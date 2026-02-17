import { useMutation, useQueryClient } from "@tanstack/react-query";

import { RQbookQueryKey } from "@/hooks/book/react-query/RQbookQueryKey";
import { updateCard } from "@/service/card/updateCard";
import { RQcardQueryKey } from "./RQcardQueryKey";

export const useCardUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RQcardQueryKey.all });
      queryClient.invalidateQueries({ queryKey: RQbookQueryKey.all });
    },
  });
};
