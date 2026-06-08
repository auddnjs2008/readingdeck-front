import type { ReqGetCommunityPosts } from "@/entities/community/api/getCommunityPosts";
import type { ReqGetCommunityComments } from "@/entities/community/api/getCommunityComments";

export const RQcommunityQueryKey = {
  all: ["community"] as const,
  list: (req?: ReqGetCommunityPosts) =>
    [...RQcommunityQueryKey.all, "list", req?.query ?? {}] as const,
  detail: (postId: number) =>
    [...RQcommunityQueryKey.all, "detail", postId] as const,
  comments: (postId: ReqGetCommunityComments["path"]["postId"]) =>
    [...RQcommunityQueryKey.all, "comments", postId] as const,
};
