import "server-only";

import type { ReqGetCommunityPosts, ResGetCommunityPosts } from "./getCommunityPosts";
import { serverFetcher } from "@/shared/api/server-fetcher";

export const getCommunityPostsServer = (req?: ReqGetCommunityPosts) =>
  serverFetcher<ResGetCommunityPosts>("/community/posts", {
    query: req?.query,
  });
