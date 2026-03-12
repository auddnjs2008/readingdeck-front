import { useQuery } from "@tanstack/react-query";

import { getMyRevisitCardStack } from "@/service/me/getMyRevisitCardStack";
import { RQmeQueryKey } from "./RQmeQueryKey";

const staleTime = 5 * 60 * 1000;
const gcTime = 10 * 60 * 1000;

export const useMyRevisitCardStackQuery = () => {
  return useQuery({
    queryKey: RQmeQueryKey.revisitCardStack(),
    queryFn: getMyRevisitCardStack,
    staleTime,
    gcTime,
  });
};
