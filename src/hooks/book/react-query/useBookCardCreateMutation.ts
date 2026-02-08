import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createBookCard,
  type ReqCreateBookCard,
} from "@/service/book/createBookCard";
import { RQbookQueryKey } from "./RQbookQueryKey";

export const useBookCardCreateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBookCard,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: RQbookQueryKey.cards(variables.path.bookId),
      });
    },
  });
};
