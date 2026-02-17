import { useQuery } from "@tanstack/react-query";

import { getBookCards, type ReqGetBookCards } from "@/service/book/getBookCards";
import { RQbookQueryKey } from "./RQbookQueryKey";

const staleTime = 5 * 60 * 1000;
const gcTime = 10 * 60 * 1000;

export const useBookCardsQuery = (
  req: ReqGetBookCards,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: RQbookQueryKey.cards(req.path.bookId, req.query),
    queryFn: () => getBookCards(req),
    enabled: options?.enabled ?? true,
    staleTime,
    gcTime,
  });
};
