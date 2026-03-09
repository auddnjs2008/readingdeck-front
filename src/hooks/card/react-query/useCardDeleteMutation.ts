import { useMutation, useQueryClient } from "@tanstack/react-query";

import { RQbookQueryKey } from "@/hooks/book/react-query/RQbookQueryKey";
import { deleteCard } from "@/service/card/deleteCard";
import { RQcardQueryKey } from "./RQcardQueryKey";

export const useCardDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RQcardQueryKey.all });
      queryClient.invalidateQueries({ queryKey: RQbookQueryKey.all });
    },
  });
};
