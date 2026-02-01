import { useQuery } from "@tanstack/react-query";

import { getBooks, type ReqGetBooks } from "@/service/book/getBooks";
import { RQbookQueryKey } from "./RQbookQueryKey";

const staleTime = 5 * 60 * 1000;
const gcTime = 10 * 60 * 1000;

export const useBooksQuery = (req?: ReqGetBooks) => {
  return useQuery({
    queryKey: RQbookQueryKey.list(req),
    queryFn: () => getBooks(req),
    staleTime,
    gcTime,
  });
};
