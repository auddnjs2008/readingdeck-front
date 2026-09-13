import { useMutation, useQueryClient } from "@tanstack/react-query";

import { RQmeQueryKey } from "@/entities/me/model/queries/RQmeQueryKey";
import { updateBook } from "@/entities/book/api/updateBook";
import { RQbookQueryKey } from "./RQbookQueryKey";

export const useBookUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RQbookQueryKey.all });
      queryClient.invalidateQueries({ queryKey: RQmeQueryKey.all });
    },
  });
};
