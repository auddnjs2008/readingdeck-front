import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteCommunityPost } from "@/service/community/deleteCommunityPost";
import { RQcommunityQueryKey } from "./RQcommunityQueryKey";

export const useCommunityPostDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCommunityPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RQcommunityQueryKey.all });
    },
  });
};
