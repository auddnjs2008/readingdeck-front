import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteBook } from "@/service/book/deleteBook";
import { RQbookQueryKey } from "./RQbookQueryKey";

export const useBookDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBook,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: RQbookQueryKey.all });
      queryClient.removeQueries({
        queryKey: RQbookQueryKey.detail(variables.path.bookId),
      });
      queryClient.removeQueries({
        queryKey: [...RQbookQueryKey.all, "cards", variables.path.bookId],
      });
    },
  });
};
