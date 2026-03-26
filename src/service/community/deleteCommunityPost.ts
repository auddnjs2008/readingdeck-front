import fetcher from "../fetcher";

export type ReqDeleteCommunityPost = {
  path: {
    postId: number;
  };
};

export const deleteCommunityPost = async (req: ReqDeleteCommunityPost) => {
  await fetcher.delete(`/community/posts/${req.path.postId}`);
};
