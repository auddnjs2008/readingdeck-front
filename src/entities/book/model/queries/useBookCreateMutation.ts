import { useMutation, useQueryClient } from "@tanstack/react-query";

import { RQmeQueryKey } from "@/entities/me/model/queries/RQmeQueryKey";
import { createBook } from "@/entities/book/api/createBook";
import { RQbookQueryKey } from "./RQbookQueryKey";

export const useBookCreateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RQbookQueryKey.all });
      queryClient.invalidateQueries({ queryKey: RQmeQueryKey.homeSummary() });
      queryClient.invalidateQueries({ queryKey: RQmeQueryKey.libraryStats() });
    },
  });
};
