import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createCommunityPost } from "@/entities/community/api/createCommunityPost";
import { RQcommunityQueryKey } from "./RQcommunityQueryKey";

export const useCommunityPostCreateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCommunityPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RQcommunityQueryKey.all });
    },
  });
};
