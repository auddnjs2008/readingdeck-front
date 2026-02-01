import { useMutation } from "@tanstack/react-query";

import { createBook } from "@/service/book/createBook";

export const useBookCreateMutation = () => {
  return useMutation({
    mutationFn: createBook,
  });
};
