import fetcher from "@/shared/api/fetcher";
import type { CommunityComment } from "@/entities/community/model/types";

export type ReqCreateCommunityComment = {
  path: {
    postId: number;
  };
  body: {
    content: string;
    parentId?: number;
  };
};

export const createCommunityComment = async (
  req: ReqCreateCommunityComment,
) => {
  const result = await fetcher.post<CommunityComment>(
    `/community/posts/${req.path.postId}/comments`,
    req.body,
  );
  return result.data;
};
