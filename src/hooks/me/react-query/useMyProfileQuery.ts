import { useQuery } from "@tanstack/react-query";

import { getMyProfile } from "@/service/me/getMyProfile";
import { RQmeQueryKey } from "./RQmeQueryKey";

const staleTime = 5 * 60 * 1000;
const gcTime = 10 * 60 * 1000;

export const useMyProfileQuery = () => {
  return useQuery({
    queryKey: RQmeQueryKey.profile(),
    queryFn: getMyProfile,
    staleTime,
    gcTime,
  });
};
