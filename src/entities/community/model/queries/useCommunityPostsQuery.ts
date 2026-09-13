import { useInfiniteQuery } from "@tanstack/react-query";

import type { ReqGetCommunityPosts } from "@/entities/community/api/getCommunityPosts";
import { communityPostsOptions } from "./community-posts-options";

export const useCommunityPostsQuery = (req?: ReqGetCommunityPosts) => {
  return useInfiniteQuery(communityPostsOptions(req));
};
