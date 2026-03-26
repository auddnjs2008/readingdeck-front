import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteCommunityComment } from "@/service/community/deleteCommunityComment";
import { RQcommunityQueryKey } from "./RQcommunityQueryKey";

export const useCommunityCommentDeleteMutation = (postId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCommunityComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: RQcommunityQueryKey.comments(postId),
      });
    },
  });
};
