import { infiniteQueryOptions } from "@tanstack/react-query";
import { getCommunityPosts, type ReqGetCommunityPosts } from "@/entities/community/api/getCommunityPosts";
import { RQcommunityQueryKey } from "./RQcommunityQueryKey";

export const COMMUNITY_FEED_REQUEST: ReqGetCommunityPosts = {
  query: { take: 18, sort: "latest" },
};

export const communityPostsOptions = (
  req?: ReqGetCommunityPosts,
  fetchPosts: typeof getCommunityPosts = getCommunityPosts,
) => infiniteQueryOptions({
  queryKey: RQcommunityQueryKey.list(req),
  initialPageParam: req?.query?.cursor ?? 0,
  queryFn: ({ pageParam }) => fetchPosts({
    query: { ...req?.query, cursor: pageParam },
  }),
  getNextPageParam: (lastPage) => lastPage.meta.nextCursor,
  staleTime: 60 * 1000,
  gcTime: 5 * 60 * 1000,
});
