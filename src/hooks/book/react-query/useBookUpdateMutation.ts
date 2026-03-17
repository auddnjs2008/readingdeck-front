import { useMutation, useQueryClient } from "@tanstack/react-query";

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
    },
  });
};
