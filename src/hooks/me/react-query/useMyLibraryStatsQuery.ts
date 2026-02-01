import { useQuery } from "@tanstack/react-query";

import { getMyLibraryStats } from "@/service/me/getMyLibraryStats";
import { RQmeQueryKey } from "./RQmeQueryKey";

const staleTime = 5 * 60 * 1000;
const gcTime = 10 * 60 * 1000;

export const useMyLibraryStatsQuery = () => {
  return useQuery({
    queryKey: RQmeQueryKey.libraryStats(),
    queryFn: getMyLibraryStats,
    staleTime,
    gcTime,
  });
};
