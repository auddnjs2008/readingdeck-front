import fetcher from "@/shared/api/fetcher";

export type ReqDeleteCommunityComment = {
  path: {
    commentId: number;
  };
};

export const deleteCommunityComment = async (
  req: ReqDeleteCommunityComment,
) => {
  await fetcher.delete(`/community/comments/${req.path.commentId}`);
};
