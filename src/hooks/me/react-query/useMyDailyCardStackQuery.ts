import { useQuery } from "@tanstack/react-query";

import { getMyDailyCardStack } from "@/service/me/getMyDailyCardStack";
import { RQmeQueryKey } from "./RQmeQueryKey";

const staleTime = 5 * 60 * 1000;
const gcTime = 10 * 60 * 1000;

export const useMyDailyCardStackQuery = () => {
  return useQuery({
    queryKey: RQmeQueryKey.dailyCardStack(),
    queryFn: getMyDailyCardStack,
    staleTime,
    gcTime,
  });
};
