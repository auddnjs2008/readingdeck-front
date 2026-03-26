import { useInfiniteQuery } from "@tanstack/react-query";

import {
  getCommunityPosts,
  type ReqGetCommunityPosts,
} from "@/service/community/getCommunityPosts";
import { RQcommunityQueryKey } from "./RQcommunityQueryKey";

const staleTime = 60 * 1000;
const gcTime = 5 * 60 * 1000;

export const useCommunityPostsQuery = (req?: ReqGetCommunityPosts) => {
  return useInfiniteQuery({
    queryKey: RQcommunityQueryKey.list(req),
    initialPageParam: req?.query?.cursor ?? 0,
    queryFn: ({ pageParam }) =>
      getCommunityPosts({
        query: {
          ...req?.query,
          cursor: pageParam ?? 0,
        },
      }),
    getNextPageParam: (lastPage) => lastPage.meta.nextCursor,
    staleTime,
    gcTime,
  });
};
