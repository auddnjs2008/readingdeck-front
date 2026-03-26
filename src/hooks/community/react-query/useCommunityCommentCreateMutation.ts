import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createCommunityComment } from "@/service/community/createCommunityComment";
import { RQcommunityQueryKey } from "./RQcommunityQueryKey";

export const useCommunityCommentCreateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCommunityComment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: RQcommunityQueryKey.comments(data.postId),
      });
    },
  });
};
