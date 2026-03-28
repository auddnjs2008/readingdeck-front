import { useMutation, useQueryClient } from "@tanstack/react-query";

import { RQmeQueryKey } from "@/hooks/me/react-query/RQmeQueryKey";
import { updateBook } from "@/service/book/updateBook";
import { RQbookQueryKey } from "./RQbookQueryKey";

export const useBookUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBook,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: RQbookQueryKey.all });
      queryClient.invalidateQueries({
        queryKey: RQbookQueryKey.detail(variables.path.bookId),
      });
      queryClient.invalidateQueries({ queryKey: RQmeQueryKey.all });
    },
  });
};
