import type { ReqGetCommunityPosts } from "@/service/community/getCommunityPosts";
import type { ReqGetCommunityComments } from "@/service/community/getCommunityComments";

export const RQcommunityQueryKey = {
  all: ["community"] as const,
  list: (req?: ReqGetCommunityPosts) =>
    [...RQcommunityQueryKey.all, "list", req?.query ?? {}] as const,
  detail: (postId: number) =>
    [...RQcommunityQueryKey.all, "detail", postId] as const,
  comments: (postId: ReqGetCommunityComments["path"]["postId"]) =>
    [...RQcommunityQueryKey.all, "comments", postId] as const,
};
