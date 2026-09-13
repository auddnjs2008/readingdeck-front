import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteBook } from "@/entities/book/api/deleteBook";
import { RQmeQueryKey } from "@/entities/me/model/queries/RQmeQueryKey";
import { RQbookQueryKey } from "./RQbookQueryKey";

export const useBookDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBook,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [...RQbookQueryKey.all, "list"] });
      queryClient.invalidateQueries({ queryKey: RQmeQueryKey.homeSummary() });
      queryClient.invalidateQueries({ queryKey: RQmeQueryKey.libraryStats() });
      queryClient.removeQueries({
        queryKey: RQbookQueryKey.detail(variables.path.bookId),
      });
      queryClient.removeQueries({
        queryKey: [...RQbookQueryKey.all, "cards", variables.path.bookId],
      });
    },
  });
};
