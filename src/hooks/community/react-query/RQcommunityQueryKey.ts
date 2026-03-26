import type { ReqGetCommunityPosts } from "@/service/community/getCommunityPosts";

export const RQcommunityQueryKey = {
  all: ["community"] as const,
  list: (req?: ReqGetCommunityPosts) =>
    [...RQcommunityQueryKey.all, "list", req?.query ?? {}] as const,
  detail: (postId: number) =>
    [...RQcommunityQueryKey.all, "detail", postId] as const,
};
