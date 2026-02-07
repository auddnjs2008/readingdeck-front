import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createBook } from "@/service/book/createBook";
import { RQbookQueryKey } from "./RQbookQueryKey";

export const useBookCreateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RQbookQueryKey.all });
    },
  });
};
