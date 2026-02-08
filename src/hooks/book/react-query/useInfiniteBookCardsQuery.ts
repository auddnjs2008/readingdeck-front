import { useInfiniteQuery } from "@tanstack/react-query";

import {
  getBookCards,
  type ReqGetBookCards,
  type ResGetBookCards,
} from "@/service/book/getBookCards";
import { RQbookQueryKey } from "./RQbookQueryKey";

const staleTime = 5 * 60 * 1000;
const gcTime = 10 * 60 * 1000;
const defaultTake = 10;

export type UseInfiniteBookCardsQueryReq = Omit<
  ReqGetBookCards,
  "query"
> & {
  query?: Omit<NonNullable<ReqGetBookCards["query"]>, "cursor"> & {
    take?: number;
  };
};

export const useInfiniteBookCardsQuery = (req: UseInfiniteBookCardsQueryReq) => {
  const { path, query } = req;
  const take = query?.take ?? defaultTake;

  return useInfiniteQuery({
    queryKey: RQbookQueryKey.cards(path.bookId, { ...query, cursor: undefined }),
    queryFn: ({ pageParam }) =>
      getBookCards({
        path,
        query: { ...query, take, cursor: pageParam as number | undefined },
      }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage: ResGetBookCards) =>
      lastPage.hasNext && lastPage.nextCursor != null
        ? lastPage.nextCursor
        : undefined,
    staleTime,
    gcTime,
  });
};
