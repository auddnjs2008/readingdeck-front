import {
  type UseQueryOptions,
  useQuery,
} from "@tanstack/react-query";

import { getMyProfile } from "@/service/me/getMyProfile";
import type { ResGetMyProfile } from "@/service/me/getMyProfile";
import { RQmeQueryKey } from "./RQmeQueryKey";

const staleTime = 5 * 60 * 1000;
const gcTime = 10 * 60 * 1000;

type UseMyProfileQueryOptions = Omit<
  UseQueryOptions<ResGetMyProfile, Error, ResGetMyProfile>,
  "queryKey" | "queryFn"
>;

export const useMyProfileQuery = (options?: UseMyProfileQueryOptions) => {
  return useQuery({
    queryKey: RQmeQueryKey.profile(),
    queryFn: getMyProfile,
    staleTime,
    gcTime,
    ...options,
  });
};
