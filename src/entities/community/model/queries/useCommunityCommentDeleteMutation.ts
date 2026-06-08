import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteCommunityComment } from "@/entities/community/api/deleteCommunityComment";
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
