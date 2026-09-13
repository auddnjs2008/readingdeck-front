import { useMutation, useQueryClient } from "@tanstack/react-query";

import { RQbookQueryKey } from "@/entities/book/model/queries/RQbookQueryKey";
import { updateCard } from "@/entities/card/api/updateCard";
import { RQmeQueryKey } from "@/entities/me/model/queries/RQmeQueryKey";
import { RQcardQueryKey } from "./RQcardQueryKey";

export const useCardUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RQcardQueryKey.all });
      queryClient.invalidateQueries({ queryKey: RQbookQueryKey.all });
      queryClient.invalidateQueries({ queryKey: RQmeQueryKey.homeSummary() });
    },
  });
};
