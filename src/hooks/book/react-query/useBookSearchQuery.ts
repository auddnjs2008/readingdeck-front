import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import {
  getBookSearch,
  type ReqGetBookSearch,
} from "@/service/book/getBookSearch";
import { RQbookQueryKey } from "./RQbookQueryKey";

const staleTime = 5 * 60 * 1000;
const gcTime = 10 * 60 * 1000;

type UseBookSearchQueryOptions = Omit<
  UseQueryOptions<Awaited<ReturnType<typeof getBookSearch>>>,
  "queryKey" | "queryFn"
>;

export const useBookSearchQuery = (
  req: ReqGetBookSearch,
  options?: UseBookSearchQueryOptions
) => {
  return useQuery({
    queryKey: RQbookQueryKey.search(req.query),
    queryFn: () => getBookSearch(req),
    staleTime,
    gcTime,
    ...options,
  });
};
