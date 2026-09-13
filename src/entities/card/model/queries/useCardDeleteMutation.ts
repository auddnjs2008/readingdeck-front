import { useMutation, useQueryClient } from "@tanstack/react-query";

import { RQbookQueryKey } from "@/entities/book/model/queries/RQbookQueryKey";
import { deleteCard } from "@/entities/card/api/deleteCard";
import { RQmeQueryKey } from "@/entities/me/model/queries/RQmeQueryKey";
import { RQcardQueryKey } from "./RQcardQueryKey";

export const useCardDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RQcardQueryKey.all });
      queryClient.invalidateQueries({ queryKey: RQbookQueryKey.all });
      queryClient.invalidateQueries({ queryKey: RQmeQueryKey.homeSummary() });
      queryClient.invalidateQueries({ queryKey: RQmeQueryKey.libraryStats() });
    },
  });
};
