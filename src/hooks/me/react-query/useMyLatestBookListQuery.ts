import { useQuery } from "@tanstack/react-query";

import { getMyLatestBookList } from "@/service/me/getMyLatestBookList";
import { RQmeQueryKey } from "./RQmeQueryKey";

const staleTime = 5 * 60 * 1000;
const gcTime = 10 * 60 * 1000;

export const useMyLatestBookListQuery = () => {
  return useQuery({
    queryKey: RQmeQueryKey.latestBookList(),
    queryFn: getMyLatestBookList,
    staleTime,
    gcTime,
  });
};
