import { useQuery } from "@tanstack/react-query";

import { getMyHomeSummary } from "@/service/me/getMyHomeSummary";
import { RQmeQueryKey } from "./RQmeQueryKey";

const staleTime = 5 * 60 * 1000;
const gcTime = 10 * 60 * 1000;

export const useMyHomeSummaryQuery = () => {
  return useQuery({
    queryKey: RQmeQueryKey.homeSummary(),
    queryFn: getMyHomeSummary,
    staleTime,
    gcTime,
  });
};
